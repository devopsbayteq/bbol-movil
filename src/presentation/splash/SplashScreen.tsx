import React, {useEffect, useRef} from 'react';
import {
  Animated,
  Easing,
  Image,
  StyleSheet,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

const FIGMA_LOGO_URI =
  'https://www.figma.com/api/mcp/asset/d202396e-2cbe-4dff-b7eb-77b2627080b8';

export function SplashScreen() {
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 650,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: 650,
        easing: Easing.out(Easing.back(1)),
        useNativeDriver: true,
      }),
    ]).start();
  }, [opacity, scale]);

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.backgroundLayer}>
        <View style={[styles.glow, styles.glowTopRight]} />
        <View style={[styles.glow, styles.glowBottomLeft]} />
      </View>

      <Animated.View
        style={[
          styles.centerWrapper,
          {
            opacity,
            transform: [{scale}],
          },
        ]}>
        <View style={styles.decorativeRing}>
          <Image source={{uri: FIGMA_LOGO_URI}} style={styles.logo} />
        </View>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#008292',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundLayer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#008292',
  },
  glow: {
    position: 'absolute',
    borderRadius: 999,
    opacity: 0.2,
  },
  glowTopRight: {
    width: 234,
    height: 353.59,
    top: -88.39,
    right: -39,
    backgroundColor: '#EEEEEE',
  },
  glowBottomLeft: {
    width: 195,
    height: 265.19,
    bottom: -44.19,
    left: -19.5,
    backgroundColor: '#E2E2E2',
  },
  centerWrapper: {
    width: 172.8,
    height: 172.8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  decorativeRing: {
    width: 172.8,
    height: 172.8,
    borderRadius: 86.4,
    borderWidth: 1,
    borderColor: '#EFF6F7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 96,
    height: 96,
    borderRadius: 11,
  },
});
