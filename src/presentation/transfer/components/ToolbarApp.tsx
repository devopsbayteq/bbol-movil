import {Platform, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {TransferIconArrowLeft} from "./transferIcons.tsx";
import React, {useMemo} from "react";
import {ThemeColors, useTheme} from "../../../providers";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {Lexend} from "../../../theme/lexend.ts";
import BackNavigationArrow  from '../../../../assets/images/svg/arrow-back-left.svg'
interface ToolbarAppProps {
    title?: string;
    onBackPress?: () => void;
    titleFont?: 'regular' | 'semibold';
    showBottomDivider?: boolean;
}

export const ToolbarApp = ({
    title = '',
    onBackPress,
    titleFont = 'semibold',
    showBottomDivider = false,
}: ToolbarAppProps) => {
    const {colors} = useTheme();
    const insets = useSafeAreaInsets();

    const styles = useStyles(colors);
    return (
        <View
            style={[
                styles.header,
                {paddingTop: insets.top},
                showBottomDivider && styles.headerWithDivider,
            ]}>
            {onBackPress != null && (
                <TouchableOpacity
                    onPress={() => {
                        onBackPress();
                    }}
                    style={styles.backBtn}>
                    <BackNavigationArrow color={colors.iconPrimary} size={20} />
                </TouchableOpacity>
            )}
            <Text
                style={[
                    styles.headerTitle,
                    titleFont === 'regular' && styles.headerTitleRegular,
                ]}>
                {title}
            </Text>
            <View style={styles.headerRightSpacer} />
        </View>
    );
};

function useStyles(colors: ThemeColors) {
    return useMemo(
        () =>
            StyleSheet.create({
                root: {
                    flex: 1,
                    backgroundColor: colors.background,
                },
                header: {
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    minHeight: 72,
                    paddingHorizontal: 16,
                    backgroundColor: colors.white,
                },
                headerWithDivider: {
                    borderBottomWidth: StyleSheet.hairlineWidth,
                    borderBottomColor: colors.borderLight,
                },
                backBtn: {
                    width: 44,
                    height: 44,
                    alignItems: 'flex-start',
                    justifyContent: 'center',
                },
                headerTitle: {
                    flex: 1,
                    textAlign: 'center',
                    fontFamily: Lexend.semiBold,
                    fontSize: 14,
                    lineHeight: 22,
                    color: colors.textPrimary,
                },
                headerTitleRegular: {
                    fontFamily: Lexend.regular,
                    fontWeight: '400',
                },
                headerRightSpacer: {
                    width: 44,
                },
                list: {
                    flex: 1,
                },
                listContent: {
                    paddingHorizontal: 24,
                    paddingTop: 8,
                },
                searchWrap: {
                    marginBottom: 16,
                },
                searchInner: {
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 12,
                    backgroundColor: colors.white,
                    borderRadius: 8,
                    paddingHorizontal: 12,
                    paddingVertical: 14,
                    ...Platform.select({
                        ios: {
                            shadowColor: '#000',
                            shadowOffset: {width: 0, height: 2},
                            shadowOpacity: 0.06,
                            shadowRadius: 4,
                        },
                        android: {elevation: 2},
                        default: {},
                    }),
                },
                searchInput: {
                    flex: 1,
                    fontFamily: Lexend.regular,
                    fontSize: 14,
                    color: colors.textPrimary,
                    paddingVertical: 0,
                },
                sectionBlock: {
                    gap: 8,
                    marginBottom: 8,
                },
                sectionHeading: {
                    fontFamily: Lexend.semiBold,
                    fontSize: 16,
                    lineHeight: 24,
                    color: colors.textPrimary,
                },
                contactosHeading: {
                    marginTop: 8,
                    marginBottom: 4,
                },
                contactsErrorBanner: {
                    marginBottom: 8,
                    gap: 6,
                },
                contactsListEmpty: {
                    paddingVertical: 24,
                    alignItems: 'center',
                },
                accountCard: {
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 16,
                    backgroundColor: colors.white,
                    borderTopRightRadius: 8,
                    borderBottomRightRadius: 8,
                    paddingHorizontal: 12,
                    paddingVertical: 16,
                    marginBottom: 0,
                },
                accountBody: {
                    flex: 1,
                    minWidth: 0,
                },
                accountTitle: {
                    fontFamily: Lexend.semiBold,
                    fontSize: 14,
                    lineHeight: 22,
                    color: colors.textPrimary,
                },
                accountMeta: {
                    fontFamily: Lexend.regular,
                    fontSize: 12,
                    lineHeight: 20,
                    color: '#3E494B',
                },
                letterHeader: {
                    fontFamily: Lexend.regular,
                    fontSize: 12,
                    lineHeight: 20,
                    color: colors.textTertiary,
                    marginTop: 8,
                    marginBottom: 4,
                },
                contactRow: {
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: colors.white,
                    paddingLeft: 12,
                    paddingRight: 12,
                    paddingTop: 12,
                    paddingBottom: 13,
                    borderBottomWidth: StyleSheet.hairlineWidth,
                    borderBottomColor: '#D6D6D6',
                    ...Platform.select({
                        ios: {
                            shadowColor: '#000',
                            shadowOffset: {width: 0, height: 8},
                            shadowOpacity: 0.02,
                            shadowRadius: 16,
                        },
                        android: {elevation: 1},
                        default: {},
                    }),
                },
                contactRowMain: {
                    flex: 1,
                    minWidth: 0,
                },
                contactRowFirst: {
                    borderTopLeftRadius: 8,
                    borderTopRightRadius: 8,
                },
                contactRowLast: {
                    borderBottomLeftRadius: 8,
                    borderBottomRightRadius: 8,
                    borderBottomWidth: 0,
                },
                contactTextCol: {
                    flex: 1,
                    marginRight: 8,
                    maxWidth: '82%',
                },
                contactName: {
                    fontFamily: Lexend.semiBold,
                    fontSize: 14,
                    lineHeight: 22,
                    color: colors.textPrimary,
                },
                contactBank: {
                    fontFamily: Lexend.regular,
                    fontSize: 12,
                    lineHeight: 20,
                    color: colors.textSecondary,
                },
                contactHint: {
                    fontFamily: Lexend.regular,
                    fontSize: 12,
                    lineHeight: 20,
                    color: colors.textTertiary,
                },
                emptyHint: {
                    fontFamily: Lexend.regular,
                    fontSize: 14,
                    color: colors.textSecondary,
                    paddingVertical: 12,
                },
                loadingWrap: {
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                },
                errorBanner: {
                    padding: 24,
                    gap: 8,
                },
                errorText: {
                    color: colors.error,
                    fontSize: 13,
                },
                retryText: {
                    color: colors.primary,
                    fontFamily: Lexend.semiBold,
                    fontSize: 14,
                },
                fab: {
                    position: 'absolute',
                    right: 24,
                    width: 56,
                    height: 56,
                    borderRadius: 28,
                    backgroundColor: colors.primary,
                    alignItems: 'center',
                    justifyContent: 'center',
                    ...Platform.select({
                        ios: {
                            shadowColor: '#000',
                            shadowOffset: {width: 0, height: 4},
                            shadowOpacity: 0.2,
                            shadowRadius: 8,
                        },
                        android: {elevation: 6},
                        default: {},
                    }),
                },
            }),
        [colors],
    );
}
