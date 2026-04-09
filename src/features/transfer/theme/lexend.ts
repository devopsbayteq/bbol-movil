import {Platform} from 'react-native';

/**
 * Lexend after native linking (`assets/fonts` + `react-native.config.js`).
 * Android: font name matches the `.ttf` filename without extension.
 * iOS: use PostScript/family name from the font; often matches the filename for these assets.
 */
export const Lexend = {
  regular: Platform.select({
    ios: 'Lexend-Regular',
    android: 'Lexend_400Regular',
    default: 'Lexend-Regular',
  }) as string,
  semiBold: Platform.select({
    ios: 'Lexend-SemiBold',
    android: 'Lexend_600SemiBold',
    default: 'Lexend-SemiBold',
  }) as string,
  bold: Platform.select({
    ios: 'Lexend-Bold',
    android: 'Lexend_700Bold',
    default: 'Lexend-Bold',
  }) as string,
};

