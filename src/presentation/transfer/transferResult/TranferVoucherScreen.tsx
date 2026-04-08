import {BackHandler, Platform, ScrollView, StyleSheet, View} from 'react-native';
import {ThemeColors, useTheme} from '../../../providers';
import React, {useCallback, useMemo} from 'react';
import {ToolbarApp} from '../components/ToolbarApp.tsx';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Button, SecondaryIconButton, TertiaryLinkButton} from '../../components';
import {
  useRoute,
  RouteProp,
  useNavigation,
  useFocusEffect,
} from '@react-navigation/native';
import type {TransferStackParamList} from '../../../navigation/TransferStackNavigator.tsx';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import ViewShot from 'react-native-view-shot';
import {TransferVoucherShareableCard} from '../components/TransferVoucherShareableCard';
import {useTransferVoucherCaptureShare} from '../useTransferVoucherCaptureShare';

const shareIcon = require('../../../../assets/images/share-nodes.png');

type TransferVoucherRouteProp = RouteProp<TransferStackParamList, 'TransferVoucher'>;
type NativeNav = NativeStackNavigationProp<
  TransferStackParamList,
  'TransferVoucher'
>;

export const TransferVoucherScreen = () => {
  const {colors} = useTheme();
  const styles = useStyles(colors);
  const insets = useSafeAreaInsets();
  const {params} = useRoute<TransferVoucherRouteProp>();

  const navigation = useNavigation<NativeNav>();
  const transactionData = params.routeSuccessTransactionData;

  const {viewShotRef, shareVoucher} = useTransferVoucherCaptureShare();

  useFocusEffect(
    useCallback(() => {
      if (Platform.OS !== 'android') {
        return;
      }
      const onBackPress = () => {
        navigation.reset({
          index: 0,
          routes: [{name: 'TransferMain'}],
        });
        return true;
      };
      const sub = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => sub.remove();
    }, [navigation]),
  );

  return (
    <View style={styles.root} testID="transfer-voucher-screen">
      <ToolbarApp title="COMPROBANTE" />
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
            <ViewShot ref={viewShotRef} options={{format: 'png', quality: 1}}>
              <TransferVoucherShareableCard transferResume={transactionData} />
            </ViewShot>
            <View style={styles.actionsGroup}>
              <Button
                iconSourceRight={shareIcon}
                title="Compartir"
                onPress={() => {
                  shareVoucher().catch(() => {});
                }}
              />
              <SecondaryIconButton
                title="Nueva transferencia"
                onPress={() => {
                  navigation.reset({
                    index: 0,
                    routes: [{name: 'TransferMain'}],
                  });
                }}
                disabled={false}
                loading={false}
              />
              <TertiaryLinkButton
                title="Ir al Inicio"
                onPress={() => {
                  navigation.getParent()?.navigate('Home');
                }}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

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
      }),
    [colors],
  );
}
