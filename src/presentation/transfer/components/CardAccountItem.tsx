import {Text, View, StyleSheet} from "react-native";
import {ThemeColors, useTheme} from "../../../providers";
import React, {useMemo} from "react";
import {TransferIconUser} from "../transferIcons.tsx";

const HERO_ICON = '#0B515C';
const ICON_CHIP_BG = '#D0F0F6';

interface CardAccountItem {
    origin:string,
    accountType?:string,
    name:string
}

export const CardAccountItem = ({origin,accountType ="",name}:CardAccountItem) => {
    const {colors} = useTheme();
    const styles = useStyles(colors);

    return (<View style={styles.cardItem}>
        <View>
            <View style={styles.iconChip}>
                <TransferIconUser color={HERO_ICON} size={16}/>
            </View>
        </View>
        <View>
            <Text>{origin}</Text>
            <Text>{accountType}</Text>
            <Text>{name}</Text>
        </View>


    </View>)
}

function useStyles(colors: ThemeColors) {
    return useMemo(
        () =>
            StyleSheet.create({
                cardItem: {
                    flexDirection: 'row',
                    alignItems:'center',
                    paddingHorizontal:12
                },
                iconChip: {
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    backgroundColor: ICON_CHIP_BG,
                    alignItems: 'center',
                    justifyContent: 'center',
                },

            }), [colors])
}
