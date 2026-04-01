/* eslint-env jest */
const {Buffer} = require('buffer');
global.Buffer = Buffer;

jest.mock('react-native-base64', () => {
  const BufferImpl = require('buffer').Buffer;
  return {
    __esModule: true,
    default: {
      encodeFromByteArray: (arr) =>
        BufferImpl.from(
          arr instanceof Uint8Array ? arr : Uint8Array.from(arr),
        ).toString('base64'),
      encode: (s) => BufferImpl.from(s, 'latin1').toString('base64'),
      decode: (b64) => BufferImpl.from(b64, 'base64').toString('latin1'),
    },
  };
});

jest.mock('react-native-encrypted-storage', () => ({
  setItem: jest.fn(() => Promise.resolve()),
  getItem: jest.fn(() => Promise.resolve(null)),
  removeItem: jest.fn(() => Promise.resolve()),
  clear: jest.fn(() => Promise.resolve()),
}));

jest.mock('react-native-device-info', () => ({
  getVersion: jest.fn(() => Promise.resolve('0.0.1')),
  getModel: jest.fn(() => Promise.resolve('TestModel')),
  getBrand: jest.fn(() => Promise.resolve('TestBrand')),
  getSystemVersion: jest.fn(() => Promise.resolve('17.0')),
  isEmulator: jest.fn(() => Promise.resolve(false)),
}));
