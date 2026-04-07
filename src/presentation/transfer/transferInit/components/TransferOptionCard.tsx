import React, {useMemo, type ReactNode} from 'react';
import {Platform, Pressable, StyleSheet, Text, View} from 'react-native';
import {useTheme, type ThemeColors} from '../../../../providers';
import {Lexend} from '../../../../theme/lexend.ts';
import {TransferIconArrowRight} from '../../components/transferIcons.tsx';

export interface TransferOptionCardProps {
    title: string;
    description: string;
    enabled: boolean;
    onPress: () => void;
    leadingIcon: ReactNode;
    testID?: string;
}

export function TransferOptionCard({
                                       title,
                                       description,
                                       enabled,
                                       onPress,
                                       leadingIcon,
                                       testID,
                                   }: TransferOptionCardProps) {
    const {colors} = useTheme();
    const styles = useStyles(colors);

    return (
        <Pressable
            disabled={!enabled}
            onPress={enabled ? onPress : undefined}
            testID={testID}
            style={({pressed}) => [
                styles.pressable,
                !enabled && styles.pressableDisabled,
                enabled && pressed && styles.pressablePressed,
            ]}>
            <View style={[
                enabled && styles.card,
                !enabled && styles.cardDisable
            ]}>
                <View style={styles.iconWrap}>{leadingIcon}</View>
                <View style={styles.textColumn}>
                    <Text style={styles.title} numberOfLines={2}>
                        {title}
                    </Text>
                    <Text style={styles.description} numberOfLines={3}>
                        {description}
                    </Text>
                </View>
                <TransferIconArrowRight
                    color={enabled ? colors.iconPrimary : colors.textTertiary}
                    size={16}
                />
            </View>
        </Pressable>
    );
}

function useStyles(colors: ThemeColors) {
    return useMemo(
        () =>
            StyleSheet.create({
                pressable: {
                    borderRadius: 12,
                },
                pressableDisabled: {
                    opacity: 0.2,
                },
                pressablePressed: {
                    opacity: 0.92,
                },
                card: {
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 16,
                    padding: 16,
                    borderRadius: 12,
                    backgroundColor: colors.surface,
                    ...Platform.select({
                        ios: {
                            shadowColor: '#000',
                            shadowOffset: {width: 0, height: 4},
                            shadowOpacity: 0.08,
                            shadowRadius: 4,
                        },
                        android: {
                            elevation: 3,
                        },
                        default: {},
                    }),
                },
                cardDisable: {
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 16,
                    padding: 16,
                    borderRadius: 12,
                    backgroundColor: colors.surface,
                },
                iconWrap: {
                    width: 48,
                    height: 48,
                    borderRadius: 8,
                    backgroundColor: colors.primaryIconContainerBg,
                    alignItems: 'center',
                    justifyContent: 'center',
                },
                textColumn: {
                    flex: 1,
                    gap: 4,
                    minWidth: 0,
                },
                title: {
                    fontFamily: Lexend.semiBold,
                    fontSize: 16,
                    lineHeight: 24,
                    color: colors.textPrimary,
                },
                description: {
                    fontFamily: Lexend.regular,
                    fontSize: 14,
                    lineHeight: 20,
                    color: colors.textSecondary,
                },
            }),
        [colors],
    );
}
