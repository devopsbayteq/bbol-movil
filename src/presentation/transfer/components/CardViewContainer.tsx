import {Image, Platform, StyleSheet, View} from 'react-native';
import {ThemeColors, useTheme} from '../../../providers';
import React, {useMemo} from 'react';

const BANK_LOGO = require('../../../../assets/images/BBIcon.png');

type WatermarkSpec = {
    top: number;
    left: number;
    width: number;
    height: number;
};

const WATERMARK_SPECS: WatermarkSpec[] = [
    {top: -16, left: -24, width: 50, height: 50},
    {top: 48, left: 20, width: 96, height: 20},
    {top: 120, left: -16, width: 50, height: 50},
    {top: 200, left: 88, width: 20, height: 20},
];

type CardViewContainerProps = {
    children: React.ReactNode;
};

export function CardViewContainer({children}: CardViewContainerProps) {
    const {colors} = useTheme();
    const styles = useStyles(colors);

    return (
        <View style={styles.cardInfoContainer}>
            <View style={styles.watermarkLayer} pointerEvents="none">
               <Image
               source={require("./../../../../assets/images/voucher_background.png")}
               />
            </View>
            <View style={styles.foreground}>{children}</View>
        </View>
    );
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
                    overflow: 'hidden',
                    ...Platform.select({
                        ios: {
                            shadowColor: '#000',
                            shadowOffset: {width: 0, height: 8},
                            shadowOpacity: 0.02,
                            shadowRadius: 32,
                        },
                        android: {
                            elevation: 3,
                        },
                        default: {},
                    }),
                },
                watermarkLayer: {
                    ...StyleSheet.absoluteFillObject,
                },
                watermarkImg: {
                    position: 'absolute',
                    opacity: 0.35,
                    transform: [{rotate: '-30deg'}],
                },
                foreground: {
                    gap: 24,
                    width: '100%',
                    zIndex: 1,
                },
            }),
        [colors],
    );
}
