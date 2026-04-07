import React, {useEffect, useRef, useState} from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  StyleSheet,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

import {useTheme} from '../../providers';
import FondoSvg from '../../../assets/images/svg/fondo.svg';
import LogoInitSvg from '../../../assets/images/svg/logo-init.svg';

const LOGO_SIZE = 96;

function getWindowSize() {
  const {width, height} = Dimensions.get('window');
  return {width, height};
}

export function SplashScreen() {
  const {colors} = useTheme();
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.9)).current;
  const [{width, height}, setWindowSize] = useState(getWindowSize);

  useEffect(() => {
    const sub = Dimensions.addEventListener('change', ({window}) => {
      setWindowSize({width: window.width, height: window.height});
    });
    return () => sub.remove();
  }, []);

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
    <View style={[styles.root, {backgroundColor: colors.primary}]} testID="splash-screen">
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <FondoSvg
          width={width}
          height={height}
          preserveAspectRatio="xMidYMid slice"
        />
      </View>
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <Animated.View
          style={[
            styles.centerWrapper,
            {
              opacity,
              transform: [{scale}],
            },
          ]}>
          <LogoInitSvg width={LOGO_SIZE} height={LOGO_SIZE} />
        </Animated.View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  safe: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
