import {Platform} from 'react-native';

/**
 * Lexend after native linking (`assets/fonts` + `react-native.config.js`).
 * Android: font name matches the `.ttf` filename without extension.
 * iOS: use PostScript/family name from the font; often matches the filename for these assets.
 */
export const Lexend = {
  regular: Platform.select({
    ios: 'Lexend_400Regular',
    android: 'Lexend_400Regular',
    default: 'Lexend_400Regular',
  }) as string,
  semiBold: Platform.select({
    ios: 'Lexend_600SemiBold',
    android: 'Lexend_600SemiBold',
    default: 'Lexend_600SemiBold',
  }) as string,
  bold: Platform.select({
    ios: 'Lexend_700Bold',
    android: 'Lexend_700Bold',
    default: 'Lexend_700Bold',
  }) as string,
};
