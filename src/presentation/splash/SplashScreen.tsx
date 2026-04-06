import React, {useEffect, useRef} from 'react';
import {
  Animated,
  Easing,
  Image,
  StyleSheet,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {SafeAreaView} from 'react-native-safe-area-context';

const FIGMA_LOGO_URI =
  'https://www.figma.com/api/mcp/asset/d202396e-2cbe-4dff-b7eb-77b2627080b8';

const SPLASH_GRADIENT = ['#005E6B', '#008292', '#4EC4D2'] as const;

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
    <LinearGradient
      colors={[...SPLASH_GRADIENT]}
      locations={[0, 0.42, 1]}
      start={{x: 0.5, y: 0}}
      end={{x: 0.5, y: 1}}
      style={styles.gradient}>
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
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
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  safe: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
