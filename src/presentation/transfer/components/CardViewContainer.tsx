import {StyleSheet, View} from "react-native";
import {ThemeColors, useTheme} from "../../../providers";
import React, {useMemo} from "react";


type CardViewContainerProps = {
    children: React.ReactNode;
};
export const CardViewContainer = ({children}:CardViewContainerProps) => {

    const {colors} = useTheme()
    const style = useStyles(colors)


    return (
        <View style={style.cardInfoContainer}>
            {children}
        </View>
    )
}

function useStyles(colors: ThemeColors) {
    return useMemo(
        () =>
            StyleSheet.create({
                cardInfoContainer: {
                    backgroundColor: colors.surface,
                    borderRadius: 12,
                    padding: 12,
                    alignSelf: 'center',
                    width: '100%',
                    maxWidth: 312,
                    gap: 24,
                },
            }), [colors])
}
