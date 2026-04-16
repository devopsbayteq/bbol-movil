import React, {useCallback, useLayoutEffect, useMemo, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Pressable,
  ActivityIndicator,
  ImageBackground,
  useWindowDimensions,
  type ListRenderItem,
  type NativeSyntheticEvent,
  type NativeScrollEvent,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Svg, {Path} from 'react-native-svg';
import {
  useNavigation,
  useRoute,
  type RouteProp,
} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {HomeStackParamList} from '../../navigation/HomeStackNavigator';
import {useTheme, type ThemeColors} from '../../providers/theme';
import {Lexend} from '../../theme/lexend';
import {formatCurrency} from '../transactions/TransactionItem';
import {DevelopmentNoticeModal} from '../components';
import {
  useCardDetailViewModel,
  type CardDetailResolved,
} from './useCardDetailViewModel';

/** Alto fijo del carrusel de datos por tarjeta (debajo del título fijo). */
const HERO_CAROUSEL_SLIDE_HEIGHT = 188;

/**
 * Bitmap extraído del SVG de diseño `assets/images/svg/account-overview-background-mask.svg`
 * (patrón + imagen embebida de Figma no es fiable como `<Svg>` en RN).
 */
const CARD_DETAIL_HERO_BG = require('../../../assets/images/card_detail_hero_background.png');

/** Red de tarjeta (mock alineado con diseño Figma). */
const CARD_NETWORK_LABEL = 'Bankard';

type Nav = NativeStackNavigationProp<HomeStackParamList, 'CardDetail'>;

/** Misma familia de iconos que `TransactionsScreen` (movimientos). */
function BackIcon({color}: Readonly<{color: string}>) {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24">
      <Path
        fill={color}
        d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"
      />
    </Svg>
  );
}

function ChevronRightIcon({color}: Readonly<{color: string}>) {
  return (
    <Svg width={16} height={16} viewBox="0 0 24 24">
      <Path
        fill={color}
        d="M11.7487 5.74915L7.4628 10.0351C7.29672 10.2038 7.07706 10.2869 6.85741 10.2869C6.63776 10.2869 6.41864 10.2031 6.25149 10.0357C5.91665 9.70089 5.91665 9.15845 6.25149 8.82361L9.07537 6.00094H0.857139C0.383814 6.00094 0 5.61789 0 5.14376C0 4.66963 0.383814 4.28658 0.857139 4.28658H9.07537L6.25203 1.46324C5.91719 1.1284 5.91719 0.585964 6.25203 0.251127C6.58686 -0.0837092 7.1293 -0.0837092 7.46414 0.251127L11.75 4.53704C12.0835 4.87321 12.0835 5.41431 11.7487 5.74915Z"
      />
    </Svg>
  );
}

/** Control decorativo tipo switch (Figma — selector de tarjeta). */
function FauxCardSwitch({
  onPress,
  styleOuter,
  styleCircleBright,
  styleCircleDim,
}: Readonly<{
  onPress: () => void;
  styleOuter: StyleProp<ViewStyle>;
  styleCircleBright: StyleProp<ViewStyle>;
  styleCircleDim: StyleProp<ViewStyle>;
}>) {
  return (
    <TouchableOpacity
      onPress={onPress}
      hitSlop={8}
      accessibilityRole="button"
      accessibilityLabel="Selector de tarjeta"
      style={styleOuter}>
      <View style={styleCircleBright} />
      <View style={styleCircleDim} />
    </TouchableOpacity>
  );
}

function formatShortDueDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) {
    return '—';
  }
  return `hasta ${d.toLocaleDateString('es-MX', {
    day: 'numeric',
    month: 'short',
  })}`;
}

function CreditCardPayIcon({
  color,
  size = 20,
}: Readonly<{color: string; size?: number}>) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        fill={color}
        d="M4 9a2 2 0 012-2h12a2 2 0 012 2v1H4V9zm0 3h16v7a2 2 0 01-2 2H6a2 2 0 01-2-2v-7zm3 3.25h4v1.5H7v-1.5z"
      />
    </Svg>
  );
}

function CalendarDeferIcon({
  color,
  size = 20,
}: Readonly<{color: string; size?: number}>) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        fill={color}
        d="M7 2a1 1 0 011 1v1h8V3a1 1 0 112 0v1h1a2 2 0 012 2v2H4V6a2 2 0 012-2h1V3a1 1 0 011-1zm12 8H5v9a1 1 0 001 1h12a1 1 0 001-1v-9zm-6 2h2v2h-2v-2z"
      />
    </Svg>
  );
}

function StatementIcon({
  color,
  size = 20,
}: Readonly<{color: string; size?: number}>) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        fill={color}
        d="M6 2a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8.828a2 2 0 00-.586-1.414l-4.828-4.828A2 2 0 0013.172 2H6zm8 1.5L18.5 8H14a1 1 0 01-1-1V3.5zM8 12h8v1.5H8V12zm0 3h8V17H8v-2z"
      />
    </Svg>
  );
}

function CashAdvanceIcon({
  color,
  size = 20,
}: Readonly<{color: string; size?: number}>) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        fill={color}
        d="M4 4h16v4H4V4zm0 6h16v10H4V10zm3 2v6h10v-6H7zm2 2h6v2H9v-2z"
      />
    </Svg>
  );
}

function EyeIcon({color}: Readonly<{color: string}>) {
  return (
    <Svg width={16} height={16} viewBox="0 0 24 24">
      <Path
        fill={color}
        d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"
      />
    </Svg>
  );
}

function EyeSlashIcon({color}: Readonly<{color: string}>) {
  return (
    <Svg width={16} height={16} viewBox="0 0 24 24">
      <Path
        fill={color}
        d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-2.76-2.24-5-5-5l-.17.01z"
      />
    </Svg>
  );
}

export function CardDetailScreen() {
  const {colors} = useTheme();
  const insets = useSafeAreaInsets();
  const {width: windowWidth} = useWindowDimensions();
  const styles = useStyles(colors);
  const navigation = useNavigation<Nav>();
  const route = useRoute<RouteProp<HomeStackParamList, 'CardDetail'>>();
  const {maskedCardNumber} = route.params;

  const {cardsForCarousel, resolved, isLoading, errorMessage, consumptions} =
    useCardDetailViewModel(maskedCardNumber);

  /** Un solo control para todas las tarjetas del carrusel (mostrar/ocultar saldo). */
  const [balanceMasked, setBalanceMasked] = useState(true);
  const [carouselPage, setCarouselPage] = useState(0);
  const [devModalVisible, setDevModalVisible] = useState(false);
  const heroListRef = useRef<FlatList<CardDetailResolved>>(null);

  const openDev = useCallback(() => setDevModalVisible(true), []);

  const initialCarouselIndex = useMemo(() => {
    const i = cardsForCarousel.findIndex(
      c => c.card.maskedCardNumber === maskedCardNumber,
    );
    return i >= 0 ? i : 0;
  }, [cardsForCarousel, maskedCardNumber]);

  useLayoutEffect(() => {
    if (cardsForCarousel.length === 0) {
      return;
    }
    setCarouselPage(initialCarouselIndex);
  }, [cardsForCarousel, initialCarouselIndex]);

  const toggleBalanceMask = useCallback(() => {
    setBalanceMasked(prev => !prev);
  }, []);

  const onHeroScrollEnd = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const x = e.nativeEvent.contentOffset.x;
      const idx = Math.round(x / windowWidth);
      const last = cardsForCarousel.length - 1;
      const clamped = Math.min(Math.max(0, idx), Math.max(0, last));
      setCarouselPage(clamped);
    },
    [cardsForCarousel.length, windowWidth],
  );

  const getHeroItemLayout = useCallback(
    (_data: ArrayLike<CardDetailResolved> | null | undefined, index: number) => ({
      length: windowWidth,
      offset: windowWidth * index,
      index,
    }),
    [windowWidth],
  );

  const renderHeroSlide: ListRenderItem<CardDetailResolved> = useCallback(
    ({item}) => {
      const masked = balanceMasked;
      return (
        <View style={[styles.heroSlide, {width: windowWidth}]}>
          <View style={styles.heroSlideInner}>
            <View style={styles.heroAccountRow}>
              <View style={styles.heroTitleBlock}>
                <Text style={styles.heroLabel}>{CARD_NETWORK_LABEL}</Text>
                <Text style={styles.heroMasked}>{item.card.maskedCardNumber}</Text>
              </View>
              <View style={styles.heroBrandRow}>
                <FauxCardSwitch
                  onPress={openDev}
                  styleOuter={styles.fauxSwitchOuter}
                  styleCircleBright={styles.fauxSwitchCircleBright}
                  styleCircleDim={styles.fauxSwitchCircleDim}
                />
                <TouchableOpacity
                  style={styles.eyeWrap}
                  onPress={toggleBalanceMask}
                  accessibilityRole="button"
                  accessibilityLabel={masked ? 'Mostrar saldo' : 'Ocultar saldo'}>
                  {masked ? (
                    <EyeSlashIcon color={colors.white} />
                  ) : (
                    <EyeIcon color={colors.white} />
                  )}
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.heroBalanceBlock}>
              <View style={styles.amountAndPill}>
                <Text style={styles.heroAmount} numberOfLines={1}>
                  {masked ? '$**.**' : formatCurrency(item.card.totalDue)}
                </Text>
                <View style={styles.duePill}>
                  <Text style={styles.duePillText}>
                    {formatShortDueDate(item.card.maxPaymentDate)}
                  </Text>
                </View>
              </View>
              <Text style={styles.totalDueCaption}>Total a pagar</Text>
            </View>
          </View>
        </View>
      );
    },
    [balanceMasked, colors.white, openDev, styles, toggleBalanceMask, windowWidth],
  );

  const activeSlideForMetrics = useMemo(() => {
    if (cardsForCarousel.length === 0) {
      return null;
    }
    const idx = Math.min(
      Math.max(0, carouselPage),
      cardsForCarousel.length - 1,
    );
    return cardsForCarousel[idx];
  }, [cardsForCarousel, carouselPage]);

  const darkChromeBar = useMemo(
    () => (
      <View style={[styles.darkChromeBar, {paddingTop: insets.top}]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="Volver">
          <BackIcon color={colors.white} />
        </TouchableOpacity>
        <Text style={styles.darkChromeTitle}>TARJETA</Text>
        <View style={styles.chromeSpacer} />
      </View>
    ),
    [
      colors.white,
      insets.top,
      navigation,
      styles.chromeSpacer,
      styles.darkChromeBar,
      styles.darkChromeTitle,
    ],
  );

  if (isLoading && !resolved) {
    return (
      <View style={styles.root} testID="card-detail-screen">
        {darkChromeBar}
        <View style={styles.centered}>
          <ActivityIndicator size="small" color={colors.primary} />
        </View>
      </View>
    );
  }

  if (errorMessage || !resolved) {
    return (
      <View style={styles.root} testID="card-detail-screen">
        {darkChromeBar}
        <View style={styles.centered}>
          <Text style={styles.errorInline}>
            {errorMessage || 'No se encontró la información de esta tarjeta.'}
          </Text>
          <TouchableOpacity onPress={() => navigation.goBack()} accessibilityRole="button">
            <Text style={styles.retryLink}>Volver</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (!activeSlideForMetrics) {
    return (
      <View style={styles.root} testID="card-detail-screen">
        {darkChromeBar}
        <View style={styles.centered}>
          <Text style={styles.errorInline}>No hay tarjetas para mostrar.</Text>
          <TouchableOpacity onPress={() => navigation.goBack()} accessibilityRole="button">
            <Text style={styles.retryLink}>Volver</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const {approvedLimit, utilized, available, utilizationRatio} =
    activeSlideForMetrics;
  const totalConsumptions = consumptions.length;

  return (
    <View style={styles.root} testID="card-detail-screen">
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled
        contentInsetAdjustmentBehavior="never">
        <ImageBackground
          source={CARD_DETAIL_HERO_BG}
          style={styles.heroGradient}
          resizeMode="cover"
          imageStyle={styles.heroBackgroundImage}>
          <View style={[styles.heroHeaderFixed, {paddingTop: insets.top + 20}]}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              hitSlop={12}
              accessibilityRole="button"
              accessibilityLabel="Volver">
              <BackIcon color={colors.white} />
            </TouchableOpacity>
            <Text style={styles.heroScreenTitle}>TARJETA</Text>
          </View>

          <FlatList
            key={maskedCardNumber}
            ref={heroListRef}
            data={cardsForCarousel}
            renderItem={renderHeroSlide}
            keyExtractor={item => item.card.maskedCardNumber}
            horizontal
            pagingEnabled
            nestedScrollEnabled
            showsHorizontalScrollIndicator={false}
            decelerationRate="fast"
            getItemLayout={getHeroItemLayout}
            initialScrollIndex={
              cardsForCarousel.length > 0 ? initialCarouselIndex : undefined
            }
            initialNumToRender={Math.min(
              cardsForCarousel.length,
              Math.max(4, initialCarouselIndex + 1),
            )}
            onMomentumScrollEnd={onHeroScrollEnd}
            onScrollToIndexFailed={({index}) => {
              setTimeout(() => {
                heroListRef.current?.scrollToIndex({index, animated: false});
              }, 100);
            }}
            style={styles.heroCarousel}
            extraData={balanceMasked}
          />

          <View style={styles.paginationRow}>
            {cardsForCarousel.map((_, i) => (
              <View
                key={String(i)}
                style={[
                  styles.paginationDot,
                  i === carouselPage
                    ? styles.paginationDotActive
                    : styles.paginationDotInactive,
                ]}
              />
            ))}
          </View>
        </ImageBackground>

        <View style={styles.creditCardWrap}>
          <Text style={styles.creditApproved}>
            Cupo aprobado: {formatCurrency(approvedLimit)}
          </Text>
          <View style={styles.creditRow}>
            <Text style={styles.creditMuted}>
              Utilizado:{' '}
              <Text style={styles.creditStrong}>{formatCurrency(utilized)}</Text>
            </Text>
            <Text style={styles.creditMuted}>
              Disponible:{' '}
              <Text style={styles.creditStrong}>{formatCurrency(available)}</Text>
            </Text>
          </View>
          <View style={styles.progressTrack}>
            <View
              style={[styles.progressFill, {width: `${utilizationRatio * 100}%`}]}
            />
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.quickScroll}
          contentContainerStyle={styles.quickScrollContent}>
          <TouchableOpacity
            style={styles.quickCard}
            onPress={openDev}
            accessibilityRole="button"
            accessibilityLabel="Pagar tarjeta">
            <CreditCardPayIcon color={colors.primary} />
            <Text style={styles.quickLabel}>Pagar tarjeta</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quickCard}
            onPress={openDev}
            accessibilityRole="button"
            accessibilityLabel="Diferir consumos">
            <CalendarDeferIcon color={colors.primary} />
            <Text style={styles.quickLabel}>Diferir consumos</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quickCard}
            onPress={openDev}
            accessibilityRole="button"
            accessibilityLabel="Estado de cuenta">
            <StatementIcon color={colors.primary} />
            <Text style={styles.quickLabel}>Estado de cuenta</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quickCard}
            onPress={openDev}
            accessibilityRole="button"
            accessibilityLabel="Avances">
            <CashAdvanceIcon color={colors.primary} />
            <Text style={styles.quickLabel}>Avances</Text>
          </TouchableOpacity>
        </ScrollView>

        <Text style={styles.sectionHeading}>Detalle de consumos</Text>

        {consumptions.map((row, index) => {
          const isFirst = index === 0;
          const isLast = index === totalConsumptions - 1;
          const isAbono = row.amount < 0;
          const amountColor = isAbono ? colors.success : colors.textSecondary;
          const displayAbs = formatCurrency(Math.abs(row.amount));
          const amountText = isAbono ? `+${displayAbs}` : formatCurrency(row.amount);

          return (
            <Pressable
              key={`${row.merchant}-${row.day}-${index}`}
              style={({pressed}) => [
                styles.movRow,
                isFirst && styles.movRowFirst,
                isLast && styles.movRowLast,
                !isLast && styles.movRowDivider,
                pressed && styles.movRowPressed,
              ]}
              onPress={openDev}
              accessibilityRole="button"
              accessibilityLabel={`Consumo ${row.merchant}`}>
              <View style={styles.movDateCol}>
                <Text style={styles.movDay}>{row.day}</Text>
                <Text style={styles.movMonth}>{row.monthLabel}</Text>
              </View>
              <View style={styles.movCenter}>
                <Text style={styles.movName} numberOfLines={1}>
                  {row.merchant}
                </Text>
              </View>
              <View style={styles.movAmountWrap}>
                <Text style={[styles.movAmount, {color: amountColor}]}>{amountText}</Text>
                <ChevronRightIcon color={colors.iconPrimary} />
              </View>
            </Pressable>
          );
        })}
      </ScrollView>

      <DevelopmentNoticeModal
        visible={devModalVisible}
        onClose={() => setDevModalVisible(false)}
      />
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
        scroll: {
          flex: 1,
        },
        scrollContent: {
          paddingBottom: 32,
        },
        darkChromeBar: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: colors.homeCreditCardSurface,
          paddingHorizontal: 24,
          paddingBottom: 14,
        },
        darkChromeTitle: {
          fontFamily: Lexend.regular,
          fontSize: 18,
          lineHeight: 28,
          color: colors.white,
        },
        chromeSpacer: {
          width: 22,
        },
        centered: {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: 24,
        },
        errorInline: {
          fontFamily: Lexend.regular,
          fontSize: 14,
          color: colors.textSecondary,
          textAlign: 'center',
          marginBottom: 12,
        },
        retryLink: {
          fontFamily: Lexend.semiBold,
          fontSize: 14,
          color: colors.linkPrimary,
        },
        heroGradient: {
          width: '100%',
          alignSelf: 'stretch',
          paddingBottom: 12,
          overflow: 'hidden',
          backgroundColor: colors.homeCreditCardSurface,
        },
        heroBackgroundImage: {
          alignSelf: 'stretch',
          width: '100%',
        },
        heroHeaderFixed: {
          paddingHorizontal: 24,
          paddingBottom: 4,
        },
        heroCarousel: {
          width: '100%',
          height: HERO_CAROUSEL_SLIDE_HEIGHT,
        },
        heroSlide: {
          height: HERO_CAROUSEL_SLIDE_HEIGHT,
        },
        heroSlideInner: {
          flex: 1,
          paddingHorizontal: 24,
          justifyContent: 'flex-start',
        },
        heroScreenTitle: {
          marginTop: 12,
          fontFamily: Lexend.regular,
          fontSize: 18,
          lineHeight: 28,
          color: colors.white,
        },
        heroAccountRow: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginTop: 20,
        },
        heroTitleBlock: {
          flex: 1,
          minWidth: 0,
          paddingRight: 12,
        },
        heroLabel: {
          fontFamily: Lexend.regular,
          fontSize: 14,
          color: colors.white,
          opacity: 0.7,
        },
        heroMasked: {
          fontFamily: Lexend.regular,
          fontSize: 14,
          color: colors.white,
          marginTop: 2,
        },
        heroBrandRow: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 10,
        },
        heroBalanceBlock: {
          marginTop: 16,
        },
        amountAndPill: {
          flexDirection: 'row',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 12,
        },
        heroAmount: {
          fontFamily: Lexend.bold,
          fontSize: 30,
          lineHeight: 40,
          color: colors.white,
        },
        duePill: {
          borderWidth: 0.8,
          borderColor: colors.textTertiary,
          borderRadius: 4,
          paddingHorizontal: 6,
          paddingVertical: 2,
        },
        duePillText: {
          fontFamily: Lexend.regular,
          fontSize: 12,
          lineHeight: 20,
          color: colors.white,
        },
        totalDueCaption: {
          fontFamily: Lexend.regular,
          fontSize: 12,
          lineHeight: 20,
          color: colors.white,
          opacity: 0.7,
          marginTop: 4,
        },
        paginationRow: {
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 0,
          marginBottom: 4,
          gap: 6,
        },
        paginationDot: {
          width: 6,
          height: 6,
          borderRadius: 3,
        },
        paginationDotActive: {
          backgroundColor: colors.white,
        },
        paginationDotInactive: {
          backgroundColor: colors.white,
          opacity: 0.35,
        },
        fauxSwitchOuter: {
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: 2,
          paddingLeft: 5,
          paddingRight: 5,
          borderRadius: 4,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: 'rgba(255, 255, 255, 0.05)',
          backgroundColor: 'rgba(255, 255, 255, 0.10)',
          overflow: 'hidden',
        },
        fauxSwitchCircleBright: {
          width: 18,
          height: 18,
          borderRadius: 10,
          marginRight: -12,
          backgroundColor: colors.white,
          opacity: 0.35,
        },
        fauxSwitchCircleDim: {
          width: 18,
          height: 18,
          borderRadius: 10,
          backgroundColor: colors.white,
          opacity: 0.18,
        },
        eyeWrap: {
          backgroundColor: colors.textTertiary,
          borderRadius: 4,
          padding: 4,
        },
        creditCardWrap: {
          backgroundColor: colors.white,
          marginHorizontal: 24,
          marginTop: 12,
          borderRadius: 12,
          paddingHorizontal: 12,
          paddingVertical: 12,
        },
        creditApproved: {
          fontFamily: Lexend.regular,
          fontSize: 12,
          lineHeight: 20,
          color: colors.textTertiary,
        },
        creditRow: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: 4,
        },
        creditMuted: {
          fontFamily: Lexend.regular,
          fontSize: 10,
          lineHeight: 20,
          color: colors.textTertiary,
        },
        creditStrong: {
          fontFamily: Lexend.semiBold,
          fontSize: 10,
          color: colors.textPrimary,
        },
        progressTrack: {
          height: 6,
          borderRadius: 4,
          backgroundColor: colors.borderSubtle,
          marginTop: 8,
          overflow: 'hidden',
        },
        progressFill: {
          height: '100%',
          borderRadius: 4,
          backgroundColor: colors.primary,
        },
        quickScroll: {
          flexGrow: 0,
          marginTop: 4,
        },
        quickScrollContent: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
          paddingVertical: 12,
          paddingHorizontal: 24,
        },
        quickCard: {
          height: 54,
          backgroundColor: colors.white,
          borderRadius: 8,
          paddingTop: 8,
          paddingBottom: 4,
          paddingHorizontal: 7,
          alignItems: 'center',
          justifyContent: 'flex-start',
          gap: 4,
        },
        quickLabel: {
          fontFamily: Lexend.regular,
          fontSize: 10,
          lineHeight: 20,
          color: colors.textPrimary,
          textAlign: 'center',
        },
        sectionHeading: {
          fontFamily: Lexend.regular,
          fontSize: 16,
          lineHeight: 24,
          color: colors.textPrimary,
          paddingHorizontal: 24,
          paddingTop: 12,
          paddingBottom: 12,
        },
        movRow: {
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: colors.white,
          marginHorizontal: 24,
          paddingHorizontal: 16,
          paddingVertical: 12,
          gap: 16,
          minHeight: 56,
        },
        movRowFirst: {
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
        },
        movRowLast: {
          borderBottomLeftRadius: 8,
          borderBottomRightRadius: 8,
          marginBottom: 8,
        },
        movRowDivider: {
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: colors.borderSubtle,
        },
        movRowPressed: {
          opacity: 0.88,
        },
        movDateCol: {
          width: 28,
          alignItems: 'center',
          justifyContent: 'center',
          paddingBottom: 4,
        },
        movDay: {
          fontFamily: Lexend.semiBold,
          fontSize: 16,
          lineHeight: 24,
          color: colors.primary,
          textAlign: 'right',
        },
        movMonth: {
          fontFamily: Lexend.regular,
          fontSize: 12,
          lineHeight: 20,
          color: colors.textTertiary,
          textAlign: 'center',
        },
        movCenter: {
          flex: 1,
          minWidth: 0,
          justifyContent: 'center',
        },
        movName: {
          fontFamily: Lexend.regular,
          fontSize: 12,
          lineHeight: 20,
          color: colors.textTertiary,
        },
        movAmountWrap: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 16,
        },
        movAmount: {
          fontFamily: Lexend.regular,
          fontSize: 12,
          lineHeight: 20,
          textAlign: 'right',
        },
      }),
    [colors],
  );
}
