import React, { useMemo, useState } from "react";
import { Modal, PixelRatio, Pressable, StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useHeaderHeight } from "@react-navigation/elements";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, radii, spacing, typography } from "../theme";

export type MainStackParamList = {
  Dashboard: undefined;
  Business: undefined;
  Reviews: undefined;
};

type MainNav = NativeStackNavigationProp<MainStackParamList>;

const ITEMS: {
  name: keyof MainStackParamList;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
}[] = [
  { name: "Dashboard", label: "Insights", icon: "stats-chart" },
  { name: "Business", label: "Business profile", icon: "storefront-outline" },
  { name: "Reviews", label: "Reviews", icon: "chatbubbles-outline" },
];

/** Scales menu trigger + panel width with shortest window edge and font scale (accessibility). */
function useMenuLayoutMetrics() {
  const { width, height, fontScale } = useWindowDimensions();
  return useMemo(() => {
    const shortest = Math.min(width, height);
    const baseRef = 390;
    const sizeScale = Math.min(Math.max(shortest / baseRef, 0.9), 1.18);
    const a11y = fontScale > 1 ? Math.min(fontScale, 1.35) : 1;
    let side = 44 * sizeScale * (1 + (a11y - 1) * 0.35);
    side = Math.min(Math.max(PixelRatio.roundToNearestPixel(side), 44), 58);
    const bezel = Math.max(2, PixelRatio.roundToNearestPixel(side * 0.043));
    const outerRadius = PixelRatio.roundToNearestPixel(side * 0.304);
    const innerRadius = Math.max(8, outerRadius - bezel);
    const barW = PixelRatio.roundToNearestPixel(side * 0.435);
    const barWMid = PixelRatio.roundToNearestPixel(side * 0.304);
    const barH = Math.max(2, PixelRatio.roundToNearestPixel(side * 0.054));
    const barGap = PixelRatio.roundToNearestPixel(side * 0.087);
    const horizontalPad = spacing.md * 2;
    const menuPanelW = Math.min(PixelRatio.roundToNearestPixel(288 * sizeScale), width - horizontalPad);
    const hitSlop =
      side < 48
        ? {
            top: Math.ceil((48 - side) / 2),
            bottom: Math.ceil((48 - side) / 2),
            left: Math.ceil((48 - side) / 2),
            right: Math.ceil((48 - side) / 2),
          }
        : undefined;
    return {
      side,
      bezel,
      outerRadius,
      innerRadius,
      barW,
      barWMid,
      barH,
      barGap,
      menuPanelW,
      hitSlop,
    };
  }, [width, height, fontScale]);
}

export function MainHeaderMenu() {
  const [open, setOpen] = useState(false);
  const navigation = useNavigation<MainNav>();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const menuTop = insets.top + headerHeight + spacing.xs;
  const m = useMenuLayoutMetrics();

  function go(name: keyof MainStackParamList) {
    setOpen(false);
    navigation.navigate(name);
  }

  return (
    <>
      <Pressable
        onPress={() => setOpen(true)}
        hitSlop={m.hitSlop}
        style={({ pressed }) => [styles.trigger, pressed && styles.triggerPressed]}
        accessibilityRole="button"
        accessibilityLabel="Open navigation menu"
      >
        <View
          style={[
            styles.triggerGlow,
            { width: m.side, height: m.side, borderRadius: m.outerRadius },
          ]}
        >
          <LinearGradient
            colors={["rgba(94, 234, 212, 0.75)", colors.accent, "rgba(13, 148, 136, 0.9)"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              width: m.side,
              height: m.side,
              borderRadius: m.outerRadius,
              padding: m.bezel,
            }}
          >
            <LinearGradient
              colors={["#334155", colors.card, "#0b1220"]}
              locations={[0, 0.45, 1]}
              start={{ x: 0.2, y: 0 }}
              end={{ x: 0.85, y: 1 }}
              style={[styles.triggerFace, { borderRadius: m.innerRadius }]}
            >
              <LinearGradient
                colors={["rgba(255, 255, 255, 0.16)", "rgba(255, 255, 255, 0)", "transparent"]}
                style={[
                  styles.triggerSheen,
                  {
                    borderTopLeftRadius: m.innerRadius,
                    borderTopRightRadius: m.innerRadius,
                  },
                ]}
                pointerEvents="none"
              />
              <View style={[styles.hamburger, { gap: m.barGap }]} pointerEvents="none">
                <View style={[styles.hBar, { width: m.barW, height: m.barH, borderRadius: m.barH / 2 }]} />
                <View
                  style={[
                    styles.hBar,
                    styles.hBarMid,
                    { width: m.barWMid, height: m.barH, borderRadius: m.barH / 2 },
                  ]}
                />
                <View style={[styles.hBar, { width: m.barW, height: m.barH, borderRadius: m.barH / 2 }]} />
              </View>
            </LinearGradient>
          </LinearGradient>
        </View>
      </Pressable>

      <Modal
        visible={open}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={() => setOpen(false)}
      >
        <View style={styles.modalRoot}>
          <Pressable style={styles.backdrop} onPress={() => setOpen(false)} accessibilityLabel="Close menu" />
          <View
            style={[styles.menuAnchor, { top: menuTop, right: spacing.md, width: m.menuPanelW }]}
            pointerEvents="box-none"
          >
            <LinearGradient
              colors={["#1e293b", colors.card, colors.bgElevated]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.menuCard}
            >
              <View style={styles.menuAccentLine} />
              <Text style={styles.menuHeading}>Menu</Text>
              {ITEMS.map((item, index) => {
                const active = route.name === item.name;
                return (
                  <Pressable
                    key={item.name}
                    onPress={() => go(item.name)}
                    style={({ pressed }) => [
                      styles.item,
                      index > 0 && styles.itemBorder,
                      active && styles.itemActive,
                      pressed && styles.itemPressed,
                    ]}
                    accessibilityRole="button"
                    accessibilityState={{ selected: active }}
                  >
                    <View style={[styles.itemIcon, active && styles.itemIconActive]}>
                      <Ionicons
                        name={item.icon}
                        size={20}
                        color={active ? colors.accent : colors.textMuted}
                      />
                    </View>
                    <Text style={[styles.itemLabel, active && styles.itemLabelActive]} numberOfLines={1}>
                      {item.label}
                    </Text>
                    <Ionicons
                      name="chevron-forward"
                      size={18}
                      color={active ? colors.accent : colors.textMuted}
                      style={styles.chevron}
                    />
                  </Pressable>
                );
              })}
            </LinearGradient>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  trigger: {
    marginRight: spacing.sm,
  },
  triggerPressed: {
    transform: [{ scale: 0.94 }],
    opacity: 0.9,
  },
  triggerGlow: {
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  triggerFace: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  triggerSheen: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "48%",
  },
  hamburger: {
    justifyContent: "center",
    alignItems: "center",
  },
  hBar: {
    backgroundColor: colors.accent,
  },
  hBarMid: {
    opacity: 0.95,
  },
  modalRoot: {
    flex: 1,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(2, 6, 23, 0.72)",
  },
  menuAnchor: {
    position: "absolute",
    maxWidth: "92%",
  },
  menuCard: {
    borderRadius: radii.lg,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xs,
    borderWidth: 1,
    borderColor: "rgba(45, 212, 191, 0.25)",
    overflow: "hidden",
    elevation: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.45,
    shadowRadius: 20,
  },
  menuAccentLine: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
    backgroundColor: colors.accent,
    opacity: 0.85,
  },
  menuHeading: {
    ...typography.caption,
    fontSize: 11,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    color: colors.textMuted,
    marginLeft: spacing.md + 2,
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    marginHorizontal: spacing.xs,
    borderRadius: radii.md,
  },
  itemBorder: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.cardBorder,
  },
  itemActive: {
    backgroundColor: colors.accentGlow,
  },
  itemPressed: {
    opacity: 0.92,
  },
  itemIcon: {
    width: 40,
    height: 40,
    borderRadius: radii.sm,
    backgroundColor: colors.bgElevated,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  itemIconActive: {
    borderColor: "rgba(45, 212, 191, 0.4)",
    backgroundColor: "rgba(45, 212, 191, 0.12)",
  },
  itemLabel: {
    flex: 1,
    ...typography.body,
    fontSize: 16,
    fontWeight: "600",
    color: colors.textMuted,
  },
  itemLabelActive: {
    color: colors.text,
  },
  chevron: { opacity: 0.9 },
});
