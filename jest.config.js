module.exports = {
  preset: 'react-native',
  transformIgnorePatterns: [
    'node_modules/(?!((@react-navigation|react-native|@react-native|react-native-screens|react-native-safe-area-context)/))',
  ],
};
