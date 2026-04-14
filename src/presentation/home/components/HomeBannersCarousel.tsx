import React, {useCallback, useEffect, useMemo, useRef} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  Linking,
  useWindowDimensions,
  LayoutAnimation,
  Platform,
  UIManager,
  type TextStyle,
  type ImageStyle,
  type ViewStyle,
  type NativeSyntheticEvent,
  type NativeScrollEvent,
} from 'react-native';
import {useTheme, type ThemeColors} from '../../../providers/theme';
import {useHomeSessionUiStore} from '../../../providers/homeSessionUiStore';
import {Lexend} from '../../../theme/lexend';
import type {HomeBanner} from '../../../domain/entities/ContractBalance';
import {BannerCloseIcon} from './HomeIcons';
import {resolveBannerLandscape} from './homeBannerLandscapeMap';

type Props = {
  banners: HomeBanner[];
};

/** Mismo valor que `MAIN_COLUMN_PADDING` en HomeScreen (padding del contenedor). */
const SCREEN_PADDING_X = 24;

const DEFAULT_AUTO_ADVANCE_MS = 15000;

/** Colapso al cerrar banners: más largo y suave que el preset por defecto (~300ms). */
const BANNER_DISMISS_LAYOUT_DURATION_MS = 720;

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

function configureBannerDismissLayoutAnimation(): void {
  LayoutAnimation.configureNext({
    duration: BANNER_DISMISS_LAYOUT_DURATION_MS,
    update: {
      type: LayoutAnimation.Types.easeInEaseOut,
    },
    delete: {
      type: LayoutAnimation.Types.easeInEaseOut,
      property: LayoutAnimation.Properties.opacity,
    },
    create: {
      type: LayoutAnimation.Types.easeInEaseOut,
      property: LayoutAnimation.Properties.opacity,
    },
  });
}

function BannerLine({
  line,
  baseStyle,
  boldStyle,
}: Readonly<{
  line: string;
  baseStyle: TextStyle;
  boldStyle: TextStyle;
}>) {
  const parts = line.split(/(\*\*[^*]+\*\*)/g);
  return (
    <Text style={baseStyle}>
      {parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <Text key={`bold-${i}-${part}`} style={boldStyle}>
              {part.slice(2, -2)}
            </Text>
          );
        }
        return (
          <Text key={`text-${i}-${part}`} style={baseStyle}>
            {part}
          </Text>
        );
      })}
    </Text>
  );
}

type BannerLandscapeStyles = {
  visual: ViewStyle;
  landscapeImage: ImageStyle;
  landscapePlaceholder: ViewStyle;
};

function BannerLandscapeVisual({
  landscape,
  styles,
}: Readonly<{
  landscape: string;
  styles: BannerLandscapeStyles;
}>) {
  const resolved = resolveBannerLandscape(landscape);
  let content;

  if (resolved.kind === 'remote') {
    content = (
      <Image
        source={{uri: resolved.uri}}
        style={styles.landscapeImage}
        resizeMode="contain"
        accessibilityIgnoresInvertColors
      />
    );
  } else if (resolved.kind === 'local') {
    content = (
      <Image
        source={resolved.source}
        style={styles.landscapeImage}
        resizeMode="contain"
        accessibilityIgnoresInvertColors
      />
    );
  } else {
    content = <View style={styles.landscapePlaceholder} />;
  }
  return <View style={styles.visual}>{content}</View>;
}

export function HomeBannersCarousel({banners}: Readonly<Props>) {
  const {colors} = useTheme();
  const bannersDismissed = useHomeSessionUiStore(
    s => s.homeBannersDismissedForSession,
  );
  const dismissHomeBannersForSession = useHomeSessionUiStore(
    s => s.dismissHomeBannersForSession,
  );

  const {width: windowWidth} = useWindowDimensions();
  const slideWidth = windowWidth - SCREEN_PADDING_X * 2;
  const styles = useStyles(colors);
  const scrollRef = useRef<ScrollView>(null);
  const indexRef = useRef(0);

  const onDismissPress = useCallback(() => {
    configureBannerDismissLayoutAnimation();
    dismissHomeBannersForSession();
  }, [dismissHomeBannersForSession]);

  useEffect(() => {
    indexRef.current = 0;
    scrollRef.current?.scrollTo({x: 0, animated: false});
  }, [banners]);

  useEffect(() => {
    if (banners.length <= 1) {
      return undefined;
    }
    const autoAdvanceMs =
      banners[0]?.durationMilliseconds ?? DEFAULT_AUTO_ADVANCE_MS;
    const id = setInterval(() => {
      const next = (indexRef.current + 1) % banners.length;
      indexRef.current = next;
      scrollRef.current?.scrollTo({
        x: next * slideWidth,
        animated: true,
      });
    }, autoAdvanceMs);
    return () => clearInterval(id);
  }, [banners, slideWidth]);

  const onMomentumScrollEnd = (
    e: NativeSyntheticEvent<NativeScrollEvent>,
  ) => {
    const x = e.nativeEvent.contentOffset.x;
    const i = Math.round(x / slideWidth);
    if (i >= 0 && i < banners.length) {
      indexRef.current = i;
    }
  };

  if (bannersDismissed || banners.length === 0) {
    return null;
  }

  return (
    <ScrollView
      ref={scrollRef}
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      nestedScrollEnabled
      decelerationRate="fast"
      onMomentumScrollEnd={onMomentumScrollEnd}
      contentContainerStyle={styles.scrollContent}>
      {banners.map((banner, index) => (
        <View
          key={`${banner.buttonLink}-${index}`}
          style={[styles.slide, {width: slideWidth}]}>
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.85}
            onPress={() => {
              const link = banner.buttonLink?.trim() ?? '';
              if (link && /^https?:\/\//i.test(link)) {
                Linking.openURL(link).catch(() => {});
              }
            }}
            accessibilityRole="button"
            accessibilityLabel={banner.text}>
            <BannerLandscapeVisual landscape={banner.landscape} styles={styles} />
            <View style={styles.textBlock}>
              {banner.text.split('\n').map((line, lineIdx) => (
                <BannerLine
                  key={`line-${lineIdx}-${line}`}
                  line={line}
                  baseStyle={styles.bodyText}
                  boldStyle={styles.boldText}
                />
              ))}
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.dismissButton}
            onPress={onDismissPress}
            accessibilityRole="button"
            accessibilityLabel="Cerrar avisos"
            testID="home-banners-dismiss"
            hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
            <BannerCloseIcon color={colors.iconPrimary} size={16} />
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
}

function useStyles(colors: ThemeColors) {
  return useMemo(
    () =>
      StyleSheet.create({
        scrollContent: {
          paddingVertical: 2,
        },
        slide: {
          position: 'relative',
        },
        card: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 12,
          backgroundColor: colors.surface,
          borderRadius: 12,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: colors.borderLight,
          paddingHorizontal: 13,
          paddingVertical: 9,
          paddingRight: 40,
          minHeight: 58,
        },
        dismissButton: {
          position: 'absolute',
          top: 12,
          right: 12,
          zIndex: 2,
          justifyContent: 'center',
          alignItems: 'center',
        },
        visual: {
          width: 51,
          height: 40,
          borderRadius: 8,
          overflow: 'hidden',
        },
        landscapeImage: {
          width: '100%',
          height: '100%',
        },
        landscapePlaceholder: {
          flex: 1,
        },
        textBlock: {
          flex: 1,
          gap: 2,
          justifyContent: 'center',
          minWidth: 0,
        },
        bodyText: {
          fontFamily: Lexend.regular,
          fontSize: 12,
          lineHeight: 20,
          color: colors.textSecondary,
        },
        boldText: {
          fontFamily: Lexend.semiBold,
          fontSize: 12,
          lineHeight: 20,
          color: colors.textPrimary,
        },
      }),
    [colors],
  );
}
