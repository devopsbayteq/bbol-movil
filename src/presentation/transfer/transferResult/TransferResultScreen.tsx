import {Text, View, StyleSheet, ScrollView,Platform, TouchableOpacity} from "react-native";
import {useTransferResultViewModel} from "./useTransferResultViewModel.tsx";
import {ThemeColors, useTheme} from "../../../providers";
import React, {useMemo} from "react";
import {ToolbarApp} from "../../components/ToolbarApp.tsx";
import {useSafeAreaInsets} from "react-native-safe-area-context";


import {Lexend} from "../../../theme/lexend.ts";

export const TransferResultScreen = () => {

    const {colors} = useTheme();
    const styles = useStyles(colors);
    const insets = useSafeAreaInsets();

    const viewModel = useTransferResultViewModel()

    return (
        <View style={styles.root}>
            <ToolbarApp title={"COMPROBANTE"}
                        backPress={() => {

                        }
                        }/>
            <ScrollView
                style={styles.scroll}
                contentContainerStyle={[
                    styles.scrollContent,
                    {paddingBottom: Math.max(insets.bottom, 24) + 16},
                ]}
                showsVerticalScrollIndicator={false}>
                <View style={styles.card}>
                    <Text>BB</Text>
                    <Text>{viewModel.idTransfer}</Text>
                </View>
                <View>
                    <TouchableOpacity
                        style={
                            styles.primaryCta
                        }
                        onPress={() => {
                        }}
                        activeOpacity={0.9}
                        accessibilityRole="button"
                        accessibilityLabel="Confirmar transferencia">
                        <Text style={styles.primaryCtaText}>Confirmar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.secondaryCta}
                        onPress={()=>{
                        }}
                        activeOpacity={0.88}
                        accessibilityRole="button"
                        accessibilityLabel="Modificar transferencia">
                        <Text style={styles.secondaryCtaText}>Modificar</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>
        </View>
    )
}

function useStyles(colors: ThemeColors) {
    return useMemo(
        () =>
            StyleSheet.create({
                root: {
                    flex: 1,
                    backgroundColor: colors.background,
                },
                scroll: {
                    flex: 1,
                },
                scrollContent: {
                    paddingHorizontal: 24,
                    paddingTop: 32,
                    alignItems: 'center',
                    gap: 24,
                },
                card: {
                    width: '100%',
                    maxWidth: 672,
                    backgroundColor: colors.white,
                    borderRadius: 12,
                    padding: 12,
                    gap: 12,
                },
                secondaryCta: {
                    paddingVertical: 8,
                    paddingHorizontal: 4,
                    minWidth: 164,
                    alignItems: 'center',
                },
                secondaryCtaText: {
                    fontFamily: Lexend.semiBold,
                    fontSize: 14,
                    lineHeight: 22,
                    color: colors.primary,
                },
                primaryCta: {
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 12,
                    backgroundColor: colors.primary,
                    borderRadius: 8,
                    paddingVertical: 16,
                    width: '100%',
                    ...Platform.select({
                        ios: {
                            shadowColor: '#000',
                            shadowOffset: {width: 0, height: 2},
                            shadowOpacity: 0.08,
                            shadowRadius: 4,
                        },
                        android: {elevation: 2},
                        default: {},
                    }),
                },
                primaryCtaText: {
                    fontFamily: Lexend.semiBold,
                    fontSize: 14,
                    lineHeight: 22,
                    color: colors.white,
                },
            }), [colors]);
}
