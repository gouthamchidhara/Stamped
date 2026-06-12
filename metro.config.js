// Learn more https://docs.expo.dev/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Ignore Android-only maven repo dirs that crash the Windows file watcher
config.resolver.blockList = [
  /node_modules[\\/].*[\\/]local-maven-repo[\\/].*/,
];

module.exports = config;
