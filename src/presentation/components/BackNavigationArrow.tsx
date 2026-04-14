import React from 'react';
import type {SvgProps} from 'react-native-svg';
import ArrowBackLeftSvg from '../../../assets/images/svg/arrow-back-left.svg';
import {useTheme} from '../../providers/theme';

export function BackNavigationArrow({color, ...rest}: Readonly<SvgProps>) {
  const {colors} = useTheme();
  return (
    <ArrowBackLeftSvg color={color ?? colors.backNavigationArrow} {...rest} />
  );
}
