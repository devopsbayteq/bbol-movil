import React, {useMemo} from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Pressable,
  TouchableOpacity,
  ScrollView,
  Platform,
  Dimensions,
} from 'react-native';
import Svg, {Path} from 'react-native-svg';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {TransferIconClose} from '../../features/transfer/presentation/components/transferIcons.tsx';
import {useTheme, type ThemeColors} from '../../providers/theme';
import {Lexend} from '../../theme/lexend';
import {getDemoDaySheetItems} from './recentActivityDaySheetMock';
import type {DaySheetLineIcon} from './recentActivityDaySheetTypes';
import {formatDaySheetTitleEs} from './recentActivityDaySheetTitle';
import {CalendarActivityGlyph} from './CalendarCellIcons';

export type RecentActivityDaySheetModalProps = {
  visible: boolean;
  onClose: () => void;
  date: Date;
};

function MusicNoteIcon({color, size}: Readonly<{color: string; size: number}>) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        fill={color}
        d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"
      />
    </Svg>
  );
}

function SheetLineIcon({
  kind,
  color,
  size,
}: Readonly<{kind: DaySheetLineIcon; color: string; size: number}>) {
  if (kind === 'tv') {
    return <CalendarActivityGlyph icon="tv" color={color} size={size} />;
  }
  return <MusicNoteIcon color={color} size={size} />;
}

export function RecentActivityDaySheetModal({
  visible,
  onClose,
  date,
}: Readonly<RecentActivityDaySheetModalProps>) {
  const {colors} = useTheme();
  const styles = useStyles(colors);
  const insets = useSafeAreaInsets();

  const title = useMemo(() => formatDaySheetTitleEs(date), [date]);
  const items = useMemo(() => getDemoDaySheetItems(date), [date]);

  return (
    <Modal
      testID="recent-activity-day-sheet"
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent={Platform.OS === 'android'}>
      <View
        style={[
          styles.root,
          {paddingTop: insets.top, paddingBottom: insets.bottom},
        ]}>
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={onClose}
          accessibilityLabel="Cerrar panel"
        />
        <View style={styles.sheet} accessibilityViewIsModal>
          <View style={styles.sheetInner}>
            <View style={styles.header}>
              <View style={styles.headerSide} />
              <Text style={styles.headerTitle} numberOfLines={1}>
                {title}
              </Text>
              <TouchableOpacity
                style={styles.headerSide}
                onPress={onClose}
                hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}
                accessibilityRole="button"
                accessibilityLabel="Cerrar">
                <TransferIconClose color={colors.iconPrimary} size={20} />
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.scroll}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
              bounces={false}>
              <Text style={styles.sectionLabel}>Pagos y recordatorios</Text>

              <View style={styles.list}>
                {items.map(item => (
                  <View
                    key={item.id}
                    style={styles.card}
                    accessibilityLabel={`${item.title}, ${item.amountLabel}`}>
                    <View style={styles.cardLeft}>
                      <SheetLineIcon
                        kind={item.icon}
                        color={colors.primary}
                        size={24}
                      />
                      <View style={styles.cardText}>
                        <Text style={styles.cardTitle} numberOfLines={1}>
                          {item.title}
                        </Text>
                        <Text style={styles.cardSubtitle} numberOfLines={1}>
                          {item.subtitle}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.cardAmount}>{item.amountLabel}</Text>
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>
        </View>
      </View>
    </Modal>
  );
}

function useStyles(colors: ThemeColors) {
  return useMemo(() => {
    const maxSheetH = Dimensions.get('window').height * 0.85;
    return StyleSheet.create({
        root: {
          flex: 1,
          justifyContent: 'flex-end',
          backgroundColor: 'rgba(0,0,0,0.45)',
        },
        sheet: {
          backgroundColor: colors.background,
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
          maxHeight: maxSheetH,
          overflow: 'hidden',
        },
        sheetInner: {
          paddingBottom: 12,
        },
        header: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          minHeight: 64,
          paddingHorizontal: 16,
          backgroundColor: colors.surface,
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
        },
        headerSide: {
          width: 40,
          alignItems: 'center',
          justifyContent: 'center',
        },
        headerTitle: {
          flex: 1,
          fontFamily: Lexend.regular,
          fontSize: 14,
          color: colors.textPrimary,
          textAlign: 'center',
          textTransform: 'uppercase',
        },
        scroll: {
          maxHeight: maxSheetH - 64,
        },
        scrollContent: {
          paddingHorizontal: 16,
          paddingTop: 12,
          gap: 12,
        },
        sectionLabel: {
          fontFamily: Lexend.regular,
          fontSize: 14,
          lineHeight: 20,
          color: colors.textSecondary,
        },
        list: {
          gap: 12,
        },
        card: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: colors.surface,
          borderRadius: 8,
          padding: 12,
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: colors.borderSubtle,
        },
        cardLeft: {
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
          marginRight: 8,
        },
        cardText: {
          flex: 1,
          minWidth: 0,
        },
        cardTitle: {
          fontFamily: Lexend.semiBold,
          fontSize: 12,
          lineHeight: 20,
          color: colors.textPrimary,
        },
        cardSubtitle: {
          fontFamily: Lexend.regular,
          fontSize: 12,
          lineHeight: 20,
          color: colors.textTertiary,
        },
        cardAmount: {
          fontFamily: Lexend.regular,
          fontSize: 12,
          lineHeight: 20,
          color: colors.textSecondary,
          textAlign: 'right',
        },
      });
  }, [colors]);
}
