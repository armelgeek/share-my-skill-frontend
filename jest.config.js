module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  roots: ['<rootDir>/features'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^@/shared/components/atoms/ui/badge$': '<rootDir>/__mocks__/badgeMock.js',
    '^@/shared/components/atoms/ui/icons$': '<rootDir>/__mocks__/iconsMock.js',
  },
  transformIgnorePatterns: [
    '/node_modules/',
    '<rootDir>/shared/components/atoms/ui/.*',
  ],
};
