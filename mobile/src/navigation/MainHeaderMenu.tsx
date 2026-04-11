import React, { useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
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

export function MainHeaderMenu() {
  const [open, setOpen] = useState(false);
  const navigation = useNavigation<MainNav>();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const menuTop = insets.top + headerHeight + spacing.xs;

  function go(name: keyof MainStackParamList) {
    setOpen(false);
    navigation.navigate(name);
  }

  return (
    <>
      <Pressable
        onPress={() => setOpen(true)}
        style={({ pressed }) => [styles.trigger, pressed && styles.triggerPressed]}
        accessibilityRole="button"
        accessibilityLabel="Open navigation menu"
        android_ripple={{ color: "rgba(45, 212, 191, 0.22)", borderless: true }}
      >
        <View style={styles.triggerElevation}>
          <LinearGradient
            colors={["rgba(255, 255, 255, 0.1)", colors.card, "#0f172a"]}
            locations={[0, 0.35, 1]}
            start={{ x: 0.15, y: 0 }}
            end={{ x: 0.85, y: 1 }}
            style={styles.triggerDisc}
          >
            <Ionicons name="menu-outline" size={23} color={colors.accent} />
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
          <View style={[styles.menuAnchor, { top: menuTop, right: spacing.md }]} pointerEvents="box-none">
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
    transform: [{ scale: 0.91 }],
    opacity: 0.88,
  },
  triggerDisc: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
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
    width: 288,
    maxWidth: "88%",
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
