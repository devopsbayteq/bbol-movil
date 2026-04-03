import {ScrollView, StyleSheet, View} from "react-native";
import {ThemeColors, useTheme} from "../../providers";
import React, {useMemo} from "react";
import {ToolbarApp} from "./components/ToolbarApp.tsx";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {CardViewContainer} from "./components/CardViewContainer.tsx";
import {TransactionHeaderInformation} from "./components/TransactionHeaderInformation.tsx";
import {Button, SecondaryIconButton, TertiaryLinkButton} from "../components";
import {CardAccountItem} from "./components/CardAccountItem.tsx";
import {useRoute, RouteProp, useNavigation} from "@react-navigation/native";
import type {TransferStackParamList} from "../../navigation/TransferStackNavigator";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";

const shareIcon = require('../../../assets/images/share-nodes.png');

type TransferVoucherRouteProp = RouteProp<TransferStackParamList, "TransferVoucher">;
type nativeNavigation = NativeStackNavigationProp<TransferStackParamList, "TransferVoucher">;

export const TransferVoucherScreen = () => {
    const {colors} = useTheme()
    const styles = useStyles(colors)
    const insets = useSafeAreaInsets();
    const {params} = useRoute<TransferVoucherRouteProp>();

    const navigation = useNavigation<nativeNavigation>()
    const transactionData = params.routeSuccessTransactionData;
    return (
        <View style={styles.root} testID="transfer-main-screen">
            <ToolbarApp
                title={"COMPROBANTE"}
                />
            <ScrollView
                style={styles.scroll}
                contentContainerStyle={[
                    styles.scrollContent,
                    {paddingBottom: Math.max(insets.bottom, 24) + 16},
                ]}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}>
                <View style={styles.containerForm}>
                    <View style={styles.contentColumn}>
                        <CardViewContainer children={(<>
                            <View>
                                <TransactionHeaderInformation transferResume={transactionData}/>

                                <CardAccountItem
                                    origin="Desde"
                                    accountType={transactionData.fromAccountLine}
                                    name={transactionData.fromHolderName}
                                    showBottomBorder
                                />
                                <CardAccountItem
                                    origin="Para"
                                    accountType={transactionData.beneficiary.accountHint}
                                    name={transactionData.beneficiary.name}
                                />
                            </View>
                        </>)}/>
                        <View style={styles.actionsGroup}>
                            <Button title="Compartir" onPress={() => {
                            }}/>
                            <SecondaryIconButton
                                title="Nueva transferencia"
                                iconSource={shareIcon}
                                onPress={() => {
                                    navigation.reset({
                                        index:0,
                                        routes:[{name:'TransferMain'}]
                                    })
                                }}
                                disabled={false}
                                loading={false}
                            />
                            <TertiaryLinkButton title="Ir al Inicio" onPress={() => {
                                      navigation.getParent()?.navigate('Home')
                            }}/>
                        </View>
                    </View>
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
                    flexGrow: 1,
                    paddingTop: 24,
                },
                containerForm: {
                    paddingHorizontal: 24,
                },
                contentColumn: {
                    gap: 24,
                    width: '100%',
                },
                actionsGroup: {
                    gap: 12,
                    width: '100%',
                },
            }), [colors])
}
