// // jest.config.js
// module.exports = {
//     transform: {
//       '^.+\\.(js|jsx)$': 'babel-jest',
//     },
//     transformIgnorePatterns: [
//       '/node_modules/(?!(axios)/)',
//     ],
//     moduleNameMapper: {
//       '^axios$': require.resolve('axios'),
//     },
//   };
// jest.config.js
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
  transformIgnorePatterns: [
    '/node_modules/(?!axios|react-dnd|react-dnd-html5-backend|dnd-core|@react-dnd)/',
  ],
};


