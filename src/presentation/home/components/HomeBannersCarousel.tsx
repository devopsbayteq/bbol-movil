import React, {useEffect, useMemo, useRef} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  Platform,
  Linking,
  useWindowDimensions,
  type TextStyle,
  type ImageStyle,
  type ViewStyle,
  type NativeSyntheticEvent,
  type NativeScrollEvent,
} from 'react-native';
import {useTheme, type ThemeColors} from '../../../providers/theme';
import {Lexend} from '../../../theme/lexend';
import type {HomeBanner} from '../../../domain/entities/ContractBalance';
import {ChevronRightIcon} from './HomeIcons';
import {resolveBannerLandscape} from './homeBannerLandscapeMap';

type Props = {
  banners: HomeBanner[];
};

/** Mismo valor que `MAIN_COLUMN_PADDING` en HomeScreen (padding del contenedor). */
const SCREEN_PADDING_X = 24;

const DEFAULT_AUTO_ADVANCE_MS = 5000;

function BannerLine({
  line,
  baseStyle,
  boldStyle,
}: {
  line: string;
  baseStyle: TextStyle;
  boldStyle: TextStyle;
}) {
  const parts = line.split(/(\*\*[^*]+\*\*)/g);
  return (
    <Text style={baseStyle}>
      {parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <Text key={i} style={boldStyle}>
              {part.slice(2, -2)}
            </Text>
          );
        }
        return (
          <Text key={i} style={baseStyle}>
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
}: {
  landscape: string;
  styles: BannerLandscapeStyles;
}) {
  const resolved = resolveBannerLandscape(landscape);
  return (
    <View style={styles.visual}>
      {resolved.kind === 'remote' ? (
        <Image
          source={{uri: resolved.uri}}
          style={styles.landscapeImage}
          resizeMode="contain"
          accessibilityIgnoresInvertColors
        />
      ) : resolved.kind === 'local' ? (
        <Image
          source={resolved.source}
          style={styles.landscapeImage}
          resizeMode="contain"
          accessibilityIgnoresInvertColors
        />
      ) : (
        <View style={styles.landscapePlaceholder} />
      )}
    </View>
  );
}

export function HomeBannersCarousel({banners}: Props) {
  const {colors} = useTheme();
  const {width: windowWidth} = useWindowDimensions();
  const slideWidth = windowWidth - SCREEN_PADDING_X * 2;
  const styles = useStyles(colors);
  const scrollRef = useRef<ScrollView>(null);
  const indexRef = useRef(0);

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

  if (banners.length === 0) {
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
        <TouchableOpacity
          key={`${banner.buttonLink}-${index}`}
          style={[styles.card, {width: slideWidth}]}
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
                key={lineIdx}
                line={line}
                baseStyle={styles.bodyText}
                boldStyle={styles.boldText}
              />
            ))}
          
          </View>
          <ChevronRightIcon color={colors.textTertiary} size={16} />
        </TouchableOpacity>
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
        card: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 10,
          backgroundColor: colors.surface,
          borderRadius: 16,
          paddingHorizontal: 16,
          paddingVertical: 20,
          minHeight: 72,        
        },
        visual: {
          width: 56,
          height: 48,
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
          marginRight: 42,
          marginLeft: 6,
        },
        bodyText: {
          fontFamily: Lexend.regular,
          fontSize: 14,
          lineHeight: 20,
          color: colors.textPrimary,
        },
        boldText: {
          fontFamily: Lexend.bold,
          fontSize: 14,
          lineHeight: 20,
          color: colors.textPrimary,
        },
        buttonHint: {
          fontFamily: Lexend.regular,
          fontSize: 12,
          lineHeight: 16,
          color: colors.textTertiary,
        },
      }),
    [colors],
  );
}
