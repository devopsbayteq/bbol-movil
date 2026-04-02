import {Text, View, StyleSheet} from 'react-native';
import {ThemeColors, useTheme} from '../../../providers';
import React, {useMemo} from 'react';
import {TransferIconWallet} from '../transferIcons.tsx';
import {Lexend} from '../../../theme/lexend';

const HERO_ICON = '#0B515C';
const ICON_CHIP_BG = '#D0F0F6';

interface CardAccountItemProps {
  origin: string;
  accountType?: string;
  name: string;
  showBottomBorder?: boolean;
}

export const CardAccountItem = ({
  origin,
  accountType = '',
  name,
  showBottomBorder = false,
}: CardAccountItemProps) => {
  const {colors} = useTheme();
  const styles = useStyles(colors);

  return (
    <View
      style={[
        styles.cardItem,
        showBottomBorder && styles.cardItemWithBottomBorder,
      ]}>
      <View style={styles.iconChip}>
        <TransferIconWallet color={HERO_ICON} size={16} />
      </View>
      <View style={styles.textColumn}>
        <Text style={styles.label}>{origin}</Text>
        <Text style={styles.accountType}>{accountType}</Text>
        <Text style={styles.maskOrName}>{name}</Text>
      </View>
    </View>
  );
};

function useStyles(colors: ThemeColors) {
  return useMemo(
    () =>
      StyleSheet.create({
        cardItem: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 16,
          paddingHorizontal: 12,
          paddingVertical: 16,
        },
        cardItemWithBottomBorder: {
          borderBottomWidth: 1,
          borderBottomColor: colors.buttonSecondaryBg,
        },
        textColumn: {
          flex: 1,
          minWidth: 0,
        },
        label: {
          fontFamily: Lexend.regular,
          fontSize: 12,
          lineHeight: 20,
          color: colors.textPrimary,
        },
        accountType: {
          fontFamily: Lexend.semiBold,
          fontSize: 14,
          lineHeight: 22,
          color: colors.textPrimary,
        },
        maskOrName: {
          fontFamily: Lexend.regular,
          fontSize: 12,
          lineHeight: 20,
          color: colors.textTertiary,
        },
        iconChip: {
          width: 32,
          height: 32,
          borderRadius: 8,
          backgroundColor: ICON_CHIP_BG,
          alignItems: 'center',
          justifyContent: 'center',
        },
      }),
    [colors],
  );
}
