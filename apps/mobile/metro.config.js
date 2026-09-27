const { getDefaultConfig } = require("expo/metro-config");
const { withUniwindConfig } = require("uniwind/metro");

const config = getDefaultConfig(__dirname);

// Uniwind 1.12 redirects react-native-web's InputAccessoryView to a web component it
// doesn't ship, which breaks web bundling. Fall back to react-native-web's own version
// (an iOS-only keyboard toolbar; nothing to style on web).
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (platform === "web" && moduleName === "uniwind/components/InputAccessoryView") {
    return context.resolveRequest(context, "react-native-web/dist/exports/InputAccessoryView", platform);
  }
  return context.resolveRequest(context, moduleName, platform);
};

// withUniwindConfig must stay the outermost wrapper.
module.exports = withUniwindConfig(config, {
  cssEntryFile: "./src/global.css",
  dtsFile: "./src/uniwind-types.d.ts",
});
