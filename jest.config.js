module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  roots: ['<rootDir>/features'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json',
    },
  },
};
