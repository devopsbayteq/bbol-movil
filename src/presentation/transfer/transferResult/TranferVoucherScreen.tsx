import {BackHandler, Platform, ScrollView, StyleSheet, Text, View} from "react-native";
import {ThemeColors, useTheme} from "../../../providers";
import React, {useCallback, useMemo, useRef} from "react";
import {ToolbarApp} from "../components/ToolbarApp.tsx";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {CardViewContainer} from "../components/CardViewContainer.tsx";
import {TransactionHeaderInformation} from "../components/TransactionHeaderInformation.tsx";
import {Button, SecondaryIconButton, TertiaryLinkButton} from "../../components";
import {CardAccountItem} from "../components/CardAccountItem.tsx";
import {useRoute, RouteProp, useNavigation} from "@react-navigation/native";
import type {TransferStackParamList} from "../../../navigation/TransferStackNavigator.tsx";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import QRCode from "react-native-qrcode-svg";
import ViewShot from 'react-native-view-shot';
import Share from 'react-native-share';
import {Lexend} from "../../../theme/lexend.ts";
import {SpacerView} from "../../components/SpacerView.tsx";
import {useFocusEffect} from "@react-navigation/native";
const shareIcon = require('../../../../assets/images/share-nodes.png');

type TransferVoucherRouteProp = RouteProp<TransferStackParamList, "TransferVoucher">;
type nativeNavigation = NativeStackNavigationProp<TransferStackParamList, "TransferVoucher">;

export const TransferVoucherScreen = () => {
    const {colors} = useTheme()
    const styles = useStyles(colors)
    const insets = useSafeAreaInsets();
    const {params} = useRoute<TransferVoucherRouteProp>();

    const navigation = useNavigation<nativeNavigation>()
    const transactionData = params.routeSuccessTransactionData;


    const viewShotRef = useRef<ViewShot | null>(null);
    const takeShot = async () => {
        if (!viewShotRef.current) return;
        const uri = await (viewShotRef.current as any).capture();

        const shareOptions = {
            title: 'BBO',
            message: 'Compartir comprobante',
            url: uri,
        };

        try {
            const ShareResponse = await Share.open(shareOptions);
            console.log('Result =>', ShareResponse);
        } catch (error) {
            console.log('Error =>', error);

        }

        console.log(uri);
    };


    useFocusEffect(
        useCallback(() => {
            if (Platform.OS !== 'android') return;
            const onBackPress = () => {
                navigation.reset({
                    index:0,
                    routes:[{name:'TransferMain'}]
                })
                return true;
            };
            const sub = BackHandler.addEventListener(
                'hardwareBackPress',
                onBackPress
            );
            return () => sub.remove();
        }, [navigation])
    );


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
                        <ViewShot ref={viewShotRef} options={{ format: 'png', quality: 1 }}>

                        <CardViewContainer children={(<>
                            <View>
                                <TransactionHeaderInformation transferResume={transactionData}/>
                                {(transactionData.concept != null && transactionData.concept !=="") && ( <View style={styles.contentConcept}>
                                    <Text style={styles.title}>Concepto</Text>
                                    <Text>{transactionData.concept}</Text>
                                </View>)}

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
                                    showBottomBorder
                                />
                                <SpacerView/>
                                <View style={styles.containerQR}>
                                    <QRCode
                                    value={transactionData.transactionIdentifier}
                                    size={100}
                                    />
                                    <SpacerView/>
                                    <Text style={styles.qrDescription}>QR de verificación{"\n"}de transacción</Text>
                                </View>
                            </View>
                        </>)}/>
                        </ViewShot>
                        <View style={styles.actionsGroup}>
                            <Button
                                iconSourceRight={shareIcon}
                                title="Compartir" onPress={() => {
                                takeShot().catch(_ => {
                                })
                            }}/>
                            <SecondaryIconButton
                                title="Nueva transferencia"
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
                containerQR:{
                    flexDirection:'row',
                    alignItems:'center'
                },
                qrDescription:{
                    fontSize:14,
                    fontWeight:400,
                    color:colors.primary,
                    fontFamily:Lexend.bold
                },
                title: {
                    fontFamily: Lexend.regular,
                    fontSize: 12,
                    lineHeight: 20,
                    color: colors.primary,
                    textAlign: 'center',
                },
                contentConcept:{
                    alignItems:'flex-start',
                }
            }), [colors])
}
