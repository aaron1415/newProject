import React from 'react';
import { StyleSheet, Text } from 'react-native';

import { Colors } from '../config';

export const FormErrorMessage = ({ error, visible }) => {
  if (!error || !visible) {
    return null;
  }

  return <Text style={styles.errorText}>{error}</Text>;
};

const styles = StyleSheet.create({
  errorText: {
    marginLeft: 0,
    color: Colors.white,
    fontSize: 10,
    marginVertical: 8,
    fontWeight: 'bold',
    marginTop: -5,
    marginBottom: -5,
    marginRight: 0
  }
});
