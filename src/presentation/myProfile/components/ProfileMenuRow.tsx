import {Pressable, StyleSheet, Text, View} from "react-native";
import {ChevronRightIcon} from "../../home/components/HomeIcons.tsx";
import {ReactNode, useMemo} from "react";
import {ThemeColors} from "../../../providers";
import {Lexend} from "../../../theme/lexend.ts";

const ICON_SIZE = 22;

type ProfileMenuRowProps = {
    icon: ReactNode;
    label: string;
    colors: ThemeColors;
    isFirst?: boolean;
    isLast?: boolean;
    onPress: () => void;
};


export const ProfileMenuRow = ({
                                   icon,
                                   label,
                                   colors,
                                   isFirst,
                                   isLast,
                                   onPress
                               }: ProfileMenuRowProps) => {

    const styles = useRowStyles(colors, isFirst, isLast);
    return (
        <Pressable onPress={onPress}>
        <View
            style={styles.row}
            accessibilityRole="text"
            accessibilityLabel={label}>
            <View style={styles.iconWrap}>{icon}</View>
            <Text style={styles.rowLabel} numberOfLines={2}>
                {label}
            </Text>
            <ChevronRightIcon color={colors.textTertiary} size={16}/>
        </View>
        </Pressable>
    );
}


function useRowStyles(
    colors: ThemeColors,
    isFirst?: boolean,
    isLast?: boolean,
) {
    return useMemo(
        () =>
            StyleSheet.create({
                row: {
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 12,
                    paddingHorizontal: 16,
                    paddingVertical: 14,
                    backgroundColor: colors.surface,
                    borderTopLeftRadius: isFirst ? 10 : 0,
                    borderTopRightRadius: isFirst ? 10 : 0,
                    borderBottomLeftRadius: isLast ? 10 : 0,
                    borderBottomRightRadius: isLast ? 10 : 0,
                },
                iconWrap: {
                    width: ICON_SIZE,
                    height: ICON_SIZE,
                    alignItems: 'center',
                    justifyContent: 'center',
                },
                rowLabel: {
                    flex: 1,
                    fontFamily: Lexend.regular,
                    fontSize: 15,
                    lineHeight: 22,
                    color: colors.textSecondary,
                },
            }),
        [colors, isFirst, isLast],
    );
}
