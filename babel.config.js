module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],  // Use Expo's preset
    plugins: ['react-native-reanimated/plugin'],  // Enable react-native-reanimated plugin
  };
};
