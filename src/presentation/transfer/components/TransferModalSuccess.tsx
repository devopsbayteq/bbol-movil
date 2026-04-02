import {Modal, Text, StyleSheet, View, Image} from "react-native";
import {ThemeColors, useTheme} from "../../../providers";
import React, {useMemo} from "react";
import {Button, TertiaryLinkButton} from "../../components";
import {CardAccountItem} from "./CardAccountItem.tsx";
import {TransferIconUser} from "../transferIcons.tsx";
import {BeneficiaryOption} from "../transferTypes.ts";


interface TransferModalSuccessProps {
    visible: boolean,
    onClose: () => void,
    navigateToHome: () => void,
    navigateToTransfer: () => void,
    transactionData:TransferDataResume
}

export  interface  TransferDataResume{
    amountCents:string,
    displayAmount:string,
    beneficiary:BeneficiaryOption,
    fromHolderName:string,
    fromAccountLine:string,
    accountId:string,
    concept:string,
    transactionIdentifier:string
}

export const TransferModalSuccess = ({
                                         visible,
                                         onClose,
                                         navigateToTransfer,
                                         navigateToHome,
                                         transactionData
                                     }: TransferModalSuccessProps) => {
    const {colors} = useTheme();
    //const insets = useSafeAreaInsets();

    const styles = useStyles(colors);
    return (
        <Modal
            animationType="slide"
            visible={visible}
            onRequestClose={() => {
                onClose()
            }}>
            <View style={styles.rootScreen}>
                <View style={styles.cardInfoContainer}>
                    <View style={styles.containerInfo}>

                        <Image
                            source={require("../../../../assets/images/circle-check.png")}
                            style={styles.logo}
                            resizeMode="cover"
                            accessibilityLabel="Banco Bolivariano"
                        />

                        <Text>¡Transferencia exitosa!</Text>
                        <Text>{transactionData.displayAmount}</Text>
                        <Text>Comprobante:{transactionData.transactionIdentifier}</Text>
                    </View>
                    <CardAccountItem origin={"Desde"} accountType={transactionData.fromAccountLine} name={transactionData.fromHolderName}/>
                    <View style={styles.separator}/>
                    <CardAccountItem origin={"Para"} accountType={transactionData.beneficiary.accountHint} name={transactionData.beneficiary.name}/>
                </View>
                <View style={styles.buttonContainer}>
                    <Button title="Nueva Transferencia" onPress={() => {
                        navigateToTransfer()
                    }}/>

                    <TertiaryLinkButton title="Ir al Inicio" onPress={() => {
                        navigateToHome()
                    }}/>

                </View>

            </View>
        </Modal>

    )
}

function useStyles(colors: ThemeColors) {
    return useMemo(
        () =>
            StyleSheet.create({
                logo:{
                    height:50,
                    width:50
                },
                rootScreen: {
                    backgroundColor: colors.background
                },
                root: {
                    flex: 1,
                    backgroundColor: colors.background,
                },
                cardItem: {
                    flexDirection: 'row'
                },
                separator: {
                    height: 2,
                    width: '70%',
                    backgroundColor: colors.primary,
                    marginHorizontal: 10

                },
                containerInfo: {
                    alignItems: 'center'
                },
                cardInfoContainer: {
                    backgroundColor: colors.surface,
                    marginVertical: 24,
                    marginHorizontal: 24,
                    paddingVertical: 12
                },
                buttonContainer:{
                    marginHorizontal:24
                }
            }), [colors])
}
