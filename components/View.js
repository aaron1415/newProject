import React from 'react';
import { ImageBackground, View as RNView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const View = ({ isSafe, style, children }) => {
  const insets = useSafeAreaInsets();

  if (isSafe) {
    return (
    <ImageBackground source={require('../assets/mobile-bg.png')} style={styles.bg}>
      <RNView style={{ paddingTop: insets.top, ...style }}>{children}</RNView>
    </ImageBackground>
    );
  }

  return <RNView style={StyleSheet.flatten(style)}>{children}</RNView>;
};

const styles =  StyleSheet.create({
  bg: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    resizeMode: 'contain',
  },
})