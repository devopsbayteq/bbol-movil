import {Text} from "react-native";
import {StyleSheet, TouchableOpacity, View} from "react-native";
import {TransferIconArrowLeft} from "../transfer/transferIcons.tsx";
import React, {useMemo} from "react";
import {ThemeColors, useTheme} from "../../providers";
import {Lexend} from "../../theme/lexend.ts";
import {useSafeAreaInsets} from "react-native-safe-area-context";

interface ToolbarAppProps{
    title?:string,
    backPress:()=>void
}

export const ToolbarApp=({title ="",backPress}:ToolbarAppProps)=>{
    const {colors} = useTheme();
    const styles = useStyles(colors);
    const insets = useSafeAreaInsets();
    return(
        <View style={[styles.header, {paddingTop: insets.top}]}>
            <TouchableOpacity
                onPress={()=>{backPress()}}
                style={styles.backBtn}
                accessibilityRole="button"
                accessibilityLabel="Volver">
                <TransferIconArrowLeft color={colors.iconPrimary} size={20} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{title}</Text>
            <View style={styles.headerRightSpacer} />
        </View>
    )
}

function useStyles(colors: ThemeColors) {
    return useMemo(
        () =>
            StyleSheet.create({
                header: {
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    minHeight: 64,
                    paddingHorizontal: 16,
                    backgroundColor: colors.white,
                },
                backBtn: {
                    width: 44,
                    height: 44,
                    alignItems: 'flex-start',
                    justifyContent: 'center',
                },
                headerTitle: {
                    flex: 1,
                    textAlign: 'center',
                    fontFamily: Lexend.semiBold,
                    fontSize: 14,
                    lineHeight: 22,
                    color: colors.textPrimary,
                },
                headerRightSpacer: {
                    width: 44,
                },
            }),[colors]);
}
