import {StyleSheet, Text, View} from 'react-native';
import React, {useMemo} from 'react';
import {ThemeColors, useTheme} from '../../../../providers';
import {Lexend} from '../../theme/lexend';

type VoucherConceptRowProps = {
    concept: string;
};

export function VoucherConceptRow({concept}: VoucherConceptRowProps) {
    const {colors} = useTheme();
    const styles = useStyles(colors);

    return (
        <View style={styles.row}>
            <Text style={styles.label}>Concepto</Text>
            <Text style={styles.value} numberOfLines={3}>
                {concept}
            </Text>
        </View>
    );
}

export function VoucherTaxRow({concept}: VoucherConceptRowProps) {
    const {colors} = useTheme();
    const styles = useStyles(colors);

    return (
        <View style={styles.row}>
            <Text style={styles.label}>Comisión</Text>
            <Text style={styles.value} numberOfLines={3}>
                {concept}
            </Text>
        </View>
    );
}


function useStyles(colors: ThemeColors) {
    return useMemo(
        () =>
            StyleSheet.create({
                row: {
                    flexDirection: 'row',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    paddingHorizontal: 12,
                    borderTopColor: colors.buttonSecondaryBg,
                },
                label: {
                    fontFamily: Lexend.regular,
                    fontSize: 14,
                    lineHeight: 20,
                    color: colors.textSecondary,
                    flexShrink: 0,
                },
                value: {
                    flex: 1,
                    fontFamily: Lexend.regular,
                    fontSize: 12,
                    lineHeight: 20,
                    color: colors.primary,
                    textAlign: 'right',
                },
                dividerItems: {
                    backgroundColor:colors.primary,
                    height: 1
                }
            }),
        [colors],
    );
}
