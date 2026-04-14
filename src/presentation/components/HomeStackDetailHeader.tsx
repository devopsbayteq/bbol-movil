import React, {useMemo} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {useTheme, type ThemeColors} from '../../providers';
import {Lexend} from '../../theme/lexend';
import {BackNavigationArrow} from './BackNavigationArrow';

interface HomeStackDetailHeaderProps {
    title: string;
    onPressBack: () => void;
}

export function HomeStackDetailHeader({
                                          title,
                                          onPressBack,
                                      }: Readonly<HomeStackDetailHeaderProps>) {
    const {colors} = useTheme();
    const styles = useStyles(colors);

    return (
        <View style={styles.headerContainer}>
            <View style={styles.headerBar}>
                <TouchableOpacity
                    onPress={onPressBack}
                    accessibilityRole="button"
                    accessibilityLabel="Volver">
                    <BackNavigationArrow color={colors.white} />
                </TouchableOpacity>
                <View style={styles.headerSpacer}/>
            </View>

            <Text style={styles.headerTitle} >
                {title}
            </Text>
        </View>
    );
}

function useStyles(colors: ThemeColors) {
    return useMemo(
        () =>
            StyleSheet.create({
                headerContainer:{
                    height:75,
                    position:'absolute',
                    top:10
                },
                headerBar: {
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingHorizontal: 24,
                    paddingVertical: 12,
                },
                backIcon: {
                    color:colors.white,
                    width: 20,
                    height: 22,
                },
                headerTitle: {
                    paddingHorizontal: 24,
                    fontFamily: Lexend.regular,
                    fontSize: 18,
                    textAlign: 'left',
                    fontWeight:'400',
                    textTransform: 'uppercase',
                    color:colors.white
                },
                headerSpacer: {
                    width: 22,
                    height: 12,
                },
            }),
        [colors],
    );
}
