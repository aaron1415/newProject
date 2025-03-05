import React, { useState } from 'react';
import { StatusBar, StyleSheet, Text } from 'react-native';
import { Formik } from 'formik';
import { sendPasswordResetEmail } from 'firebase/auth';

import { passwordResetSchema } from '../utils';
import { Images, Colors, auth } from '../config';
import { Logo, View, TextInput, Button, FormErrorMessage } from '../components';
import { color } from 'react-native-reanimated';

export const ForgotPasswordScreen = ({ navigation }) => {
  const [errorState, setErrorState] = useState('');

  const handleSendPasswordResetEmail = values => {
    const { email } = values;

    sendPasswordResetEmail(auth, email)
      .then(() => {
        console.log('Success: Password Reset Email sent.');
        navigation.navigate('Login');
      })
      .catch(error => setErrorState(error.message));
  };

  return (
    <View isSafe style={styles.container}>
      <StatusBar/>
      <View style={styles.logoContainer}>
          <Logo uri={Images.logo} />
          <Text style={styles.screenTitle}>Reset Password</Text>
      </View>
      <Formik
        initialValues={{ email: '' }}
        validationSchema={passwordResetSchema}
        onSubmit={values => handleSendPasswordResetEmail(values)}
      >
        {({
          values,
          touched,
          errors,
          handleChange,
          handleSubmit,
          handleBlur
        }) => (
          <>
            {/* Email input field */}
            <TextInput
              name='email'
              leftIconName='email'
              placeholder='Enter email'
              autoCapitalize='none'
              keyboardType='email-address'
              textContentType='emailAddress'
              value={values.email}
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
            />
            <FormErrorMessage error={errors.email} visible={touched.email} />
            {/* Display Screen Error Mesages */}
            {errorState !== '' ? (
              <FormErrorMessage error={errorState} visible={true} />
            ) : null}
            {/* Password Reset Send Email  button */}
            <Button style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Send Reset Email</Text>
            </Button>
          </>
        )}
      </Formik>
      {/* Button to navigate to Login screen */}
      <Button
        style={styles.borderlessButtonContainer}
        borderless
        title={'Go back to Login'}
        onPress={() => navigation.navigate('Login')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0
  },
  logoContainer: {
    alignItems: 'center'
  },
  screenTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.white,
    paddingTop: 20,
    paddingBottom: 20
  },
  button: {
    width: '85%',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    textalign: 'center',
    marginTop: 8,
    backgroundColor: Colors.blue,
    padding: 10,
    borderRadius: 8,
    flexDirection: 'row'
    
  },
  buttonText: {
    fontSize: 15,
    color: Colors.white,
    fontWeight: '700',
    width: '70%'
    

  },
  borderlessButtonContainer: {
    marginTop: 16,
    alignItems: 'center',
    justifyContent: 'center'

  }
});
