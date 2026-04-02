import {ScrollView, StyleSheet, View} from "react-native";
import {ThemeColors, useTheme} from "../../providers";
import React, {useMemo} from "react";
import {ToolbarApp} from "./components/ToolbarApp.tsx";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {CardViewContainer} from "./components/CardViewContainer.tsx";
import {TransactionHeaderInformation} from "./components/TransactionHeaderInformation.tsx";
import {Button, SecondaryIconButton, TertiaryLinkButton} from "../components";

const shareIcon = require('../../../assets/images/share-nodes.png');
export const TransferVoucherScreen = () => {
    const {colors} = useTheme()
    const styles = useStyles(colors)
    const insets = useSafeAreaInsets();
    return (
        <View style={styles.root} testID="transfer-main-screen">
            <ToolbarApp
                title={"COMPROBANTE"}
                onBackPress={() => {

                }}/>
            <ScrollView
                style={styles.scroll}
                contentContainerStyle={[
                    styles.scrollContent,
                    {paddingBottom: Math.max(insets.bottom, 24) + 16},
                ]}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}>
                <View style={styles.containerForm}>
                    <CardViewContainer children={(<>
                        <TransactionHeaderInformation transferResume={{
                            accountId: "",
                            fromHolderName: "holder",
                            fromAccountLine: "Credito",
                            transactionIdentifier: "12344556",
                            displayAmount: "$10.00",
                            concept: "Pago pendiente",
                            amountCents: "10.00",
                            beneficiary: {
                                name: "Beneficiary",
                                kind: 'contact',
                                accountHint: "8****J",
                                bankName: "Procredit",
                                id: "dhhdeueu3737373336"
                            }
                        }}/>
                    </>)}/>


                    <Button title="Compartir" onPress={() => {
                    }}/>
                    <SecondaryIconButton
                        title="Nueva transferencia"
                        iconSource={shareIcon}
                        onPress={() => {
                        }}
                        disabled={false}
                        loading={false}
                    />
                    <TertiaryLinkButton title="Ir al Inicio" onPress={() => {
                    }}/>

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
                },
                containerForm:{


                    paddingHorizontal:30
                }
            }), [colors])
}
