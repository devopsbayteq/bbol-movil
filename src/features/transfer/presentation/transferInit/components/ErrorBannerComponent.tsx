import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import React, {useMemo} from "react";
import {ThemeColors, useTheme} from '../../../../../providers';
import {Lexend} from '../../../theme/lexend';
interface ErrorBannerComponentProps{
    textRetry:string;
    errorText:string;
    onRetry:()=>void;

}
export const ErrorBannerComponent = ({textRetry,errorText,onRetry}:ErrorBannerComponentProps) => {
    const {colors} = useTheme();

    const styles = useStyles(colors)
    return (
        <View style={styles.errorBanner}>
            <Text style={styles.errorText}>{errorText}</Text>
            <TouchableOpacity
                onPress={onRetry}>
                <Text style={styles.retryText}>{textRetry}</Text>
            </TouchableOpacity>
        </View>

    )


    function useStyles(themeColors: ThemeColors) {
        return useMemo(
            () =>
                StyleSheet.create({
                    errorBanner: {
                        paddingHorizontal: 24,
                        paddingVertical: 12,
                        gap: 8,
                        backgroundColor: themeColors.errorBg,
                    },
                    errorText: {
                        color: themeColors.error,
                        fontSize: 13,
                    },
                    retryText: {
                        color: themeColors.primary,
                        fontSize: 14,
                        fontFamily: Lexend.semiBold,
                    },
                }),
            [themeColors],
        );
    }

}
