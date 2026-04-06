import React, {useMemo} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {useTheme, type ThemeColors} from '../../../providers/theme';
import {Lexend} from '../../../theme/lexend';
import {HOME_HEADER_AVATAR_BG} from '../homeConstants';

type Props = {
  filters: readonly string[];
  selectedFilter: string;
  onFilterChange: (filter: string) => void;
};

export function ProductFilterTabs({
  filters,
  selectedFilter,
  onFilterChange,
}: Props) {
  const {colors} = useTheme();
  const styles = useStyles(colors);

  return (
    <View style={styles.container}>
      {filters.map(label => {
        const isSelected = label === selectedFilter;
        return (
          <TouchableOpacity
            key={label}
            style={[styles.tab, isSelected && styles.tabSelected]}
            onPress={() => onFilterChange(label)}
            activeOpacity={0.75}
            accessibilityRole="button"
            accessibilityState={{selected: isSelected}}>
            <Text style={[styles.tabText, isSelected && styles.tabTextSelected]}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

function useStyles(colors: ThemeColors) {
  return useMemo(
    () =>
      StyleSheet.create({
        container: {
          flexDirection: 'row',
          borderWidth: 1,
          borderColor: colors.white,
          borderRadius: 12,
          height: 24,
          marginHorizontal: 24,
          overflow: 'hidden',
        },
        tab: {
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 12,
        },
        tabSelected: {
          backgroundColor: colors.primary,
          borderWidth: 1,
          borderColor: HOME_HEADER_AVATAR_BG,
        },
        tabText: {
          fontFamily: Lexend.regular,
          fontSize: 12,
          lineHeight: 20,
          color: colors.white,
          textAlign: 'center',
        },
        tabTextSelected: {
          fontFamily: Lexend.semiBold,
          color: colors.white,
        },
      }),
    [colors],
  );
}
