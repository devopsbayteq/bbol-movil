module.exports = {
  preset: 'react-native',
  setupFiles: [
    require.resolve('react-native/jest/setup.js'),
    '<rootDir>/jest.setup.js',
  ],
  moduleNameMapper: {
    '^react-native-quick-crypto$': '<rootDir>/jest/crypto-shim.js',
  },
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?|@react-navigation/.*|react-native-quick-crypto|react-native-nitro-modules|react-native-quick-base64|uuid)/)',
  ],
};
