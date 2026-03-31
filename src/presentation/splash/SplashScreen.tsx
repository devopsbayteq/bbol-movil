import React, {useEffect, useRef} from 'react';
import {
  Animated,
  Easing,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

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
          styles.centerOuterCircle,
          {
            opacity,
            transform: [{scale}],
          },
        ]}>
        <View style={styles.centerInnerCard}>
          <Text style={styles.icon}>@</Text>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0F8E9E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundLayer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#0E8A9A',
  },
  glow: {
    position: 'absolute',
    borderRadius: 999,
    backgroundColor: '#63D6DD',
    opacity: 0.24,
  },
  glowTopRight: {
    width: 300,
    height: 300,
    top: 40,
    right: -80,
  },
  glowBottomLeft: {
    width: 280,
    height: 280,
    bottom: 20,
    left: -90,
  },
  centerOuterCircle: {
    width: 170,
    height: 170,
    borderRadius: 85,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.75)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerInnerCard: {
    width: 96,
    height: 96,
    borderRadius: 20,
    backgroundColor: '#1DB5B8',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#063D46',
    shadowOffset: {width: 0, height: 5},
    shadowOpacity: 0.28,
    shadowRadius: 12,
    elevation: 8,
  },
  icon: {
    fontSize: 42,
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
