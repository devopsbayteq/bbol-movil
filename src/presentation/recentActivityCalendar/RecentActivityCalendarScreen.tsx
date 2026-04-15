import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { HomeStackParamList } from '../../navigation/HomeStackNavigator';
import { useTheme, type ThemeColors } from '../../providers/theme';
import { Lexend } from '../../theme/lexend';
import { HomeStackDetailHeader } from '../components';
import { CalendarActivityGlyph } from './CalendarCellIcons';
import type { CalendarCell, CalendarMode } from './recentActivityCalendarTypes';
import {
  dateKeyLocal,
  useRecentActivityCalendarViewModel,
} from './useRecentActivityCalendarViewModel';
import { RecentActivityDaySheetModal } from './RecentActivityDaySheetModal';

type Nav = NativeStackNavigationProp<
  HomeStackParamList,
  'RecentActivityCalendar'
>;

function calendarRowKey(row: CalendarCell[], rowIndex: number): string {
  const firstDay = row.find((c): c is Extract<CalendarCell, { kind: 'day' }> => c.kind === 'day');
  return firstDay ? `row-${dateKeyLocal(firstDay.date)}` : `row-fallback-${rowIndex}`;
}

function calendarCellKey(
  cell: CalendarCell,
  rowIndex: number,
  colIndex: number,
): string {
  if (cell.kind === 'day') {
    return dateKeyLocal(cell.date);
  }
  return `pad-${rowIndex}-${colIndex}`;
}

const CELL_MIN_HEIGHT = 84;
const ICON_BOX = 16;
const BADGE_SIZE = 21;

export function RecentActivityCalendarScreen() {
  const { colors } = useTheme();
  const styles = useStyles(colors);
  const navigation = useNavigation<Nav>();
  const {
    mode,
    setMode,
    gridRows,
    weekdayLabels,
    selectDay,
    selectedDate,
  } = useRecentActivityCalendarViewModel();

  const [daySheetVisible, setDaySheetVisible] = useState(false);

  const goBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleDayPress = useCallback(
    (date: Date) => {
      selectDay(date);
      setDaySheetVisible(true);
    },
    [selectDay],
  );

  const closeDaySheet = useCallback(() => {
    setDaySheetVisible(false);
  }, []);

  const onSegment = useCallback(
    (next: CalendarMode) => {
      setMode(next);
    },
    [setMode],
  );

  return (
    <SafeAreaView
      style={styles.safe}
      edges={['top', 'bottom']}
      testID="recent-activity-calendar-screen">


      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.screenTitle} accessibilityRole="header">
          ACTIVIDADES RECIENTES
        </Text>

        <View style={styles.segmentWrap}>
          <View style={styles.segmentTrack}>
            <View
              style={[
                styles.segmentThumb,
                mode === 'week' && styles.segmentThumbRight,
              ]}
              pointerEvents="none"
            />
            <View style={styles.segmentTouchRow}>
              <TouchableOpacity
                style={styles.segmentHalf}
                onPress={() => onSegment('month')}
                accessibilityRole="button"
                accessibilityState={{ selected: mode === 'month' }}
                accessibilityLabel="Vista por mes">
                <Text
                  style={[
                    styles.segmentLabel,
                    mode === 'month'
                      ? styles.segmentLabelActive
                      : styles.segmentLabelIdle,
                  ]}>
                  Mes
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.segmentHalf}
                onPress={() => onSegment('week')}
                accessibilityRole="button"
                accessibilityState={{ selected: mode === 'week' }}
                accessibilityLabel="Vista por semana">
                <Text
                  style={[
                    styles.segmentLabel,
                    mode === 'week'
                      ? styles.segmentLabelActive
                      : styles.segmentLabelIdle,
                  ]}>
                  Semana
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.calendarCard}>
          <View style={styles.weekdayRow}>
            {weekdayLabels.map(label => (
              <View key={label} style={styles.weekdayCell}>
                <Text style={styles.weekdayText}>{label}</Text>
              </View>
            ))}
          </View>

          {gridRows.map((row, rowIndex) => (
            <View key={calendarRowKey(row, rowIndex)} style={styles.gridRow}>
              {row.map((cell, colIndex) => (
                <CalendarCellView
                  key={calendarCellKey(cell, rowIndex, colIndex)}
                  cell={cell}
                  colors={colors}
                  styles={styles}
                  onSelectDay={handleDayPress}
                />
              ))}
            </View>
          ))}
        </View>

        <View style={styles.legendCard}>
          <Text style={styles.legendTitle}>Leyenda</Text>
          <View style={styles.legendRow}>
            <View
              style={[
                styles.legendDot,
                { backgroundColor: colors.calendarCreditIndicator },
              ]}
            />
            <Text style={styles.legendText}>Créditos</Text>
          </View>
          <View style={styles.legendRow}>
            <View
              style={[
                styles.legendDot,
                { backgroundColor: colors.calendarDebitIndicator },
              ]}
            />
            <Text style={styles.legendText}>Débitos</Text>
          </View>
        </View>
      </ScrollView>

      <RecentActivityDaySheetModal
        visible={daySheetVisible}
        onClose={closeDaySheet}
        date={selectedDate}
      />
      <HomeStackDetailHeader useDefaultColor onPressBack={goBack} />
    </SafeAreaView>
  );
}

function CalendarCellView({
  cell,
  colors,
  styles,
  onSelectDay,
}: Readonly<{
  cell: CalendarCell;
  colors: ThemeColors;
  styles: ReturnType<typeof useStyles>;
  onSelectDay: (d: Date) => void;
}>) {
  if (cell.kind === 'empty') {
    return <View style={[styles.cell, styles.cellEmpty]} />;
  }

  const { activity, isSelected, date, dayOfMonth } = cell;
  const primaryColor = isSelected ? colors.primary : colors.textPrimary;
  const iconColor = primaryColor;

  let middleContent: React.ReactNode = null;
  if (activity.extraCount !== null && activity.extraCount > 0) {
    middleContent = (
      <View style={[styles.badge, { backgroundColor: colors.primary }]}>
        <Text style={styles.badgeText}>+{activity.extraCount}</Text>
      </View>
    );
  } else if (activity.icon) {
    middleContent = (
      <CalendarActivityGlyph icon={activity.icon} color={iconColor} size={ICON_BOX} />
    );
  }

  const showBarPlaceholder = !activity.hasCredit && !activity.hasDebit;

  return (
    <TouchableOpacity
      style={[
        styles.cell,
        isSelected ? styles.cellSelected : styles.cellDefault,
      ]}
      onPress={() => onSelectDay(date)}
      accessibilityRole="button"
      accessibilityLabel={`Día ${dayOfMonth}`}>
      <Text style={[styles.dayNum, { color: primaryColor }]}>{dayOfMonth}</Text>

      <View style={styles.cellMiddle}>{middleContent}</View>

      <View style={styles.barRow}>
        {activity.hasCredit ? (
          <View
            style={[
              styles.barSegment,
              { backgroundColor: colors.calendarCreditIndicator },
            ]}
          />
        ) : null}
        {activity.hasDebit ? (
          <View
            style={[
              styles.barSegment,
              { backgroundColor: colors.calendarDebitIndicator },
            ]}
          />
        ) : null}
        {showBarPlaceholder ? <View style={styles.barPlaceholder} /> : null}
      </View>
    </TouchableOpacity>
  );
}

function useStyles(colors: ThemeColors) {
  return useMemo(
    () =>
      StyleSheet.create({
        safe: {
          flex: 1,
          backgroundColor: colors.background,
        },
        scroll: {
          flex: 1,
        },
        scrollContent: {
          paddingHorizontal: 24,
          paddingTop: 60,
          paddingBottom: 32,
          gap: 12,
        },
        screenTitle: {
          fontFamily: Lexend.regular,
          fontSize: 18,
          lineHeight: 28,
          color: colors.textPrimary,
          textTransform: 'uppercase',
        },
        segmentWrap: {
          alignItems: 'stretch',
        },
        segmentTrack: {
          position: 'relative',
          width: '100%',
          maxWidth: 360,
          alignSelf: 'center',
          height: 24,
          backgroundColor: colors.primaryIconContainerBg,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: colors.white,
          overflow: 'hidden',
        },
        /** Píldora primaria que se superpone al track (bordes redondos en el centro). */
        segmentThumb: {
          position: 'absolute',
          left: 0,
          top: 0,
          width: '50%',
          height: 24,
          borderRadius: 12,
          backgroundColor: colors.primary,
          zIndex: 1,
        },
        segmentThumbRight: {
          left: '50%',
        },
        segmentTouchRow: {
          flexDirection: 'row',
          height: 24,
          zIndex: 2,
        },
        segmentHalf: {
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',

        },
        segmentLabel: {
          fontSize: 12,
          lineHeight: 20,
        },
        segmentLabelActive: {
          fontFamily: Lexend.semiBold,
          color: colors.white,
        },
        segmentLabelIdle: {
          fontFamily: Lexend.regular,
          color: colors.textTertiary,
        },
        calendarCard: {
          backgroundColor: colors.surface,
          borderRadius: 14,
          padding: 14,
          gap: 0,
        },
        weekdayRow: {
          flexDirection: 'row',
          marginBottom: 8,
        },
        weekdayCell: {
          flex: 1,
          alignItems: 'center',
        },
        weekdayText: {
          fontFamily: Lexend.regular,
          fontSize: 8,
          lineHeight: 20,
          color: colors.textTertiary,
        },
        gridRow: {
          flexDirection: 'row',
          marginBottom: 6,
        },
        cell: {
          flex: 1,
          minHeight: CELL_MIN_HEIGHT,
          marginHorizontal: 2,
          borderRadius: 9,
          borderWidth: 0.7,
          paddingVertical: 6,
          paddingHorizontal: 2,
          alignItems: 'center',
        },
        cellEmpty: {
          borderColor: 'transparent',
          backgroundColor: 'transparent',
        },
        cellDefault: {
          borderColor: colors.buttonSecondaryBg,
          backgroundColor: colors.surface,
        },
        cellSelected: {
          borderColor: colors.primary,
          backgroundColor: colors.primaryIconContainerBg,
        },
        dayNum: {
          fontFamily: Lexend.regular,
          fontSize: 12,
          lineHeight: 20,
        },
        cellMiddle: {
          flex: 1,
          minHeight: 28,
          justifyContent: 'center',
          alignItems: 'center',
        },
        badge: {
          width: BADGE_SIZE,
          height: BADGE_SIZE,
          borderRadius: BADGE_SIZE / 2,
          alignItems: 'center',
          justifyContent: 'center',
        },
        badgeText: {
          fontFamily: Lexend.semiBold,
          fontSize: 10.5,
          color: colors.white,
          lineHeight: 14,
        },
        barRow: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 4,
          width: '100%',
          paddingHorizontal: 4,
          minHeight: 6,
        },
        barSegment: {
          flex: 1,
          height: 5,
          maxWidth: 22,
          borderRadius: 999,
        },
        barPlaceholder: {
          height: 0,
        },
        legendCard: {
          backgroundColor: colors.surface,
          borderRadius: 14,
          paddingHorizontal: 14,
          paddingTop: 14,
          paddingBottom: 12,
          gap: 7,
          ...Platform.select({
            ios: {
              shadowColor: colors.shadowSoft,
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.12,
              shadowRadius: 2.5,
            },
            android: {
              elevation: 2,
            },
          }),
        },
        legendTitle: {
          fontFamily: Lexend.regular,
          fontSize: 14,
          color: colors.textPrimary,
        },
        legendRow: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 7,
        },
        legendDot: {
          width: 10,
          height: 10,
          borderRadius: 5,
        },
        legendText: {
          fontFamily: Lexend.regular,
          fontSize: 12,
          lineHeight: 20,
          color: colors.textSecondary,
        },
      }),
    [colors],
  );
}
