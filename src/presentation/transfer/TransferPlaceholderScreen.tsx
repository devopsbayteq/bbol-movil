import React, {useEffect, useMemo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  FlatList,
  Pressable,
  ActivityIndicator,
  Keyboard,
  Platform,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  useNavigation,
  useRoute,
  type RouteProp,
} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {useTheme, type ThemeColors} from '../../providers/theme';
import {Lexend} from '../../theme/lexend';
import type {TransferStackParamList} from '../../navigation/TransferStackNavigator';
import type {MainTabParamList} from '../../navigation/MainTabNavigator';
import {TransferWatermark} from './TransferWatermark';
import {
  TransferIconArrowLeft,
  TransferIconArrowRight,
  TransferIconArrowUp,
  TransferIconUser,
  TransferIconWallet,
  TransferIconArrowRightWhite,
} from './transferIcons';
import {useTransferViewModel} from './useTransferViewModel';
import {formatAccountKindLine} from '../../utils/accountDisplay';
import {formatMoneyEc} from '../../utils/formatMoneyEc';

const ZERO_DISPLAY = formatMoneyEc(0);

const HERO_BG = '#0B515C';
const ICON_CHIP_BG = '#D0F0F6';
const CONCEPT_INPUT_BG = '#EFF0F4';

export function TransferPlaceholderScreen() {
  const {colors} = useTheme();
  const insets = useSafeAreaInsets();
  const navigation =
    useNavigation<NativeStackNavigationProp<TransferStackParamList, 'TransferMain'>>();
  const route = useRoute<RouteProp<TransferStackParamList, 'TransferMain'>>();
  const styles = useStyles(colors);

  const vm = useTransferViewModel();

  const {selectBeneficiary} = vm;

  useEffect(() => {
    const selected = route.params?.selectedBeneficiary;
    if (selected) {
      selectBeneficiary(selected);
      navigation.setParams({selectedBeneficiary: undefined});
    }
  }, [navigation, route.params?.selectedBeneficiary, selectBeneficiary]);

  const holderName = vm.user?.name?.trim() || 'Titular';

  const beneficiaryTitle = vm.beneficiary
    ? vm.beneficiary.name
    : 'Selecciona el beneficiario';

  const onBack = () => {
    const tabNav =
      navigation.getParent<BottomTabNavigationProp<MainTabParamList>>();
    tabNav?.navigate('Home');
  };

  return (
    <View style={styles.root}>
      <View style={[styles.header, {paddingTop: insets.top}]}>
        <TouchableOpacity
          onPress={onBack}
          style={styles.backBtn}
          accessibilityRole="button"
          accessibilityLabel="Volver al inicio">
          <TransferIconArrowLeft color={colors.iconPrimary} size={20} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>TRANSFERIR</Text>
        <View style={styles.headerRightSpacer} />
      </View>

      {vm.error ? (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>{vm.error}</Text>
          <TouchableOpacity
            onPress={() => {
              vm.retry();
            }}>
            <Text style={styles.retryText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      {vm.isLoading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[
            styles.scrollContent,
            {paddingBottom: Math.max(insets.bottom, 24) + 16},
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <View style={styles.hero}>
            <TransferWatermark />
            <Text style={styles.heroHint}>Ingresa el monto a transferir</Text>

            <View style={styles.amountWrap}>
              <TextInput
                style={styles.amountInput}
                value={vm.displayAmount}
                onChangeText={vm.onAmountChange}
                keyboardType="number-pad"
                returnKeyType="done"
                onSubmitEditing={() => Keyboard.dismiss()}
                placeholderTextColor="rgba(255,255,255,0.45)"
                placeholder={ZERO_DISPLAY}
                selectionColor={colors.white}
                underlineColorAndroid="transparent"
              />
            </View>

            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate('BeneficiarySelect')}
              activeOpacity={0.9}>
              <View style={styles.iconChip}>
                <TransferIconUser color={HERO_BG} size={16} />
              </View>
              <View style={styles.cardBody}>
                <Text style={styles.cardLabel}>Para</Text>
                <Text style={styles.cardTitle} numberOfLines={2}>
                  {beneficiaryTitle}
                </Text>
              </View>
              <TransferIconArrowRight color={colors.iconPrimary} size={16} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.card}
              onPress={
                vm.accounts.length > 1 ? vm.openAccountPicker : undefined
              }
              activeOpacity={vm.accounts.length > 1 ? 0.9 : 1}
              disabled={vm.accounts.length <= 1}>
              <View style={styles.iconChip}>
                <TransferIconWallet color={HERO_BG} size={16} />
              </View>
              <View style={styles.cardBody}>
                <Text style={styles.cardLabel}>Desde</Text>
                <Text style={styles.cardTitle} numberOfLines={1}>
                  {holderName}
                </Text>
                {vm.selectedAccount ? (
                  <Text style={styles.cardSub} numberOfLines={1}>
                    {vm.fromAccountDescription}
                  </Text>
                ) : (
                  <Text style={styles.cardSub}>Sin cuenta disponible</Text>
                )}
              </View>
              {vm.accounts.length > 1 ? (
                <TransferIconArrowUp color={colors.iconPrimary} size={16} />
              ) : (
                <View style={styles.cardChevronSpacer} />
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.bottomSection}>
            <View style={styles.conceptBlock}>
              <Text style={styles.conceptLabel}>
                <Text style={styles.conceptLabelStrong}>Concepto </Text>
                <Text style={styles.conceptLabelMuted}>(Opcional)</Text>
              </Text>
              <TextInput
                style={styles.conceptInput}
                value={vm.concept}
                onChangeText={vm.setConcept}
                placeholder="Ej. Pago zapatos"
                placeholderTextColor={colors.placeholder}
                maxLength={120}
              />
            </View>

            {vm.validationMessage ? (
              <Text style={styles.validationText}>{vm.validationMessage}</Text>
            ) : null}

            <TouchableOpacity
              style={styles.primaryCta}
              onPress={vm.onContinue}
              activeOpacity={0.9}>
              <TransferIconArrowRightWhite
                color={colors.white}
                size={20}
              />
              <Text style={styles.primaryCtaText}>Continuar</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}

      <Modal
        visible={vm.accountModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => vm.setAccountModalVisible(false)}>
        <Pressable
          style={styles.modalBackdrop}
          onPress={() => vm.setAccountModalVisible(false)}>
          <Pressable style={styles.modalSheet} onPress={e => e.stopPropagation()}>
            <Text style={styles.modalTitle}>Cuenta de origen</Text>
            <FlatList
              data={vm.accounts}
              keyExtractor={item => item.accountGuid}
              renderItem={({item, index}) => (
                <TouchableOpacity
                  style={styles.modalRow}
                  onPress={() => vm.selectAccount(index)}>
                  <Text style={styles.modalRowText}>
                    {formatAccountKindLine(item)}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </Pressable>
        </Pressable>
      </Modal>

    </View>
  );
}

function useStyles(colors: ThemeColors) {
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          flex: 1,
          backgroundColor: colors.background,
        },
        header: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          minHeight: 64,
          paddingHorizontal: 16,
          backgroundColor: colors.white,
        },
        backBtn: {
          width: 44,
          height: 44,
          alignItems: 'flex-start',
          justifyContent: 'center',
        },
        headerTitle: {
          flex: 1,
          textAlign: 'center',
          fontFamily: Lexend.semiBold,
          fontSize: 14,
          lineHeight: 22,
          color: colors.textPrimary,
        },
        headerRightSpacer: {
          width: 44,
        },
        errorBanner: {
          paddingHorizontal: 24,
          paddingVertical: 12,
          gap: 8,
          backgroundColor: colors.errorBg,
        },
        errorText: {
          color: colors.error,
          fontSize: 13,
        },
        retryText: {
          color: colors.primary,
          fontSize: 14,
          fontFamily: Lexend.semiBold,
        },
        loadingWrap: {
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        },
        scroll: {
          flex: 1,
        },
        scrollContent: {
          flexGrow: 1,
        },
        hero: {
          backgroundColor: HERO_BG,
          paddingHorizontal: 24,
          paddingTop: 24,
          paddingBottom: 32,
          minHeight: 320,
        },
        heroHint: {
          fontFamily: Lexend.regular,
          fontSize: 16,
          lineHeight: 24,
          color: colors.white,
          textAlign: 'center',
          marginBottom: 8,
        },
        amountWrap: {
          alignSelf: 'center',
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: colors.white,
          marginBottom: 24,
          paddingHorizontal: 12,
          paddingVertical: 8,
          minWidth: 200,
        },
        amountInput: {
          fontFamily: Lexend.bold,
          fontSize: 50,
          lineHeight: 60,
          color: colors.white,
          textAlign: 'center',
          paddingVertical: 0,
          minHeight: 70,
          ...(Platform.OS === 'android' ? {textAlignVertical: 'center'} : null),
        },
        card: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 16,
          backgroundColor: colors.white,
          borderRadius: 12,
          paddingHorizontal: 12,
          paddingVertical: 16,
          marginBottom: 16,
        },
        iconChip: {
          width: 32,
          height: 32,
          borderRadius: 8,
          backgroundColor: ICON_CHIP_BG,
          alignItems: 'center',
          justifyContent: 'center',
        },
        cardBody: {
          flex: 1,
          minWidth: 0,
        },
        cardLabel: {
          fontFamily: Lexend.regular,
          fontSize: 12,
          lineHeight: 20,
          color: colors.textTertiary,
        },
        cardTitle: {
          fontFamily: Lexend.semiBold,
          fontSize: 14,
          lineHeight: 22,
          color: colors.textPrimary,
        },
        cardSub: {
          fontFamily: Lexend.regular,
          fontSize: 12,
          lineHeight: 20,
          color: '#3E494B',
          marginTop: 2,
        },
        cardChevronSpacer: {
          width: 16,
          height: 16,
        },
        bottomSection: {
          paddingHorizontal: 24,
          paddingTop: 24,
          gap: 16,
          backgroundColor: colors.background,
        },
        conceptBlock: {
          gap: 8,
        },
        conceptLabel: {
          fontSize: 12,
          lineHeight: 20,
        },
        conceptLabelStrong: {
          fontFamily: Lexend.semiBold,
          color: '#3E494B',
        },
        conceptLabelMuted: {
          fontFamily: Lexend.regular,
          color: colors.textTertiary,
        },
        conceptInput: {
          fontFamily: Lexend.regular,
          fontSize: 14,
          color: colors.textPrimary,
          backgroundColor: CONCEPT_INPUT_BG,
          borderWidth: 1,
          borderColor: colors.white,
          borderRadius: 8,
          paddingHorizontal: 16,
          paddingVertical: 17,
          overflow: 'visible',
          ...Platform.select({
            ios: {
              shadowColor: '#000',
              shadowOffset: {width: 0, height: 4},
              shadowOpacity: 0.08,
              shadowRadius: 4,
            },
            android: {
              elevation: 3,
            },
            default: {},
          }),
        },
        validationText: {
          fontFamily: Lexend.regular,
          fontSize: 13,
          color: colors.error,
        },
        primaryCta: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 12,
          backgroundColor: colors.primary,
          borderRadius: 8,
          paddingVertical: 16,
        },
        primaryCtaText: {
          fontFamily: Lexend.semiBold,
          fontSize: 14,
          lineHeight: 22,
          color: colors.white,
        },
        modalBackdrop: {
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.45)',
          justifyContent: 'flex-end',
        },
        modalSheet: {
          backgroundColor: colors.white,
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          paddingHorizontal: 20,
          paddingTop: 16,
          paddingBottom: 24,
          maxHeight: '55%',
        },
        modalTitle: {
          fontFamily: Lexend.semiBold,
          fontSize: 16,
          color: colors.textPrimary,
          marginBottom: 12,
        },
        modalRow: {
          paddingVertical: 14,
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: colors.borderLight,
        },
        modalRowText: {
          fontFamily: Lexend.regular,
          fontSize: 15,
          color: colors.textPrimary,
        },
      }),
    [colors],
  );
}
