import React, { useCallback } from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';

import { Colors } from '../config';

export const Button = ({
  children,
  onPress,
  activeOpacity = 0.3,
  borderless = false,
  title,
  style
}) => {
  const _style = useCallback(({ pressed }) => [
    style,
    { opacity: pressed ? activeOpacity : 1 }
  ]);

  if (borderless) {
    return (
      <Pressable onPress={onPress} style={_style}>
        <Text style={styles.borderlessButtonText}>{title}</Text>
      </Pressable>
    );
  }

  return (
    <Pressable onPress={onPress} style={_style}>
      {children}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  borderlessButtonText: {
    fontSize: 15,
    color: '#FFC700',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
    textShadowColor: 'gray',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0.5,
  }
});
