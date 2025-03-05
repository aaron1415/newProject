import React, { useState } from 'react';
import { Text, StatusBar, StyleSheet } from 'react-native';
import { Formik } from 'formik';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { View, TextInput, Logo, Button, FormErrorMessage } from '../components';
import { Images, Colors, auth } from '../config';
import { useTogglePasswordVisibility } from '../hooks';
import { loginValidationSchema } from '../utils';

export const LoginScreen = ({ navigation }) => {
  const [errorState, setErrorState] = useState('');
  const { passwordVisibility, handlePasswordVisibility, rightIcon } =
    useTogglePasswordVisibility();

  const handleLogin = values => {
    const { email, password } = values;
    signInWithEmailAndPassword(auth, email, password).catch(error =>
      setErrorState(error.message)
    );
  };
  return (
    <>
      <View isSafe style={styles.container}>   
        <StatusBar barStyle="light-content" />
        <KeyboardAwareScrollView enableOnAndroid={true}>
          {/* LogoContainer: consits app logo and screen title */}
          <View style={styles.logoContainer}>
            <Logo uri={Images.logo} />
            <Text style={styles.screenTitle}>CONSUMER COMPLAINTS</Text>
          </View>
          <Formik
            initialValues={{
              email: '',
              password: ''
            }}
            validationSchema={loginValidationSchema}
            onSubmit={values => handleLogin(values)}
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
                {/* Input fields */}
                <TextInput
                  name='email'
                  leftIconName='email'
                  placeholder='Enter email'
                  autoCapitalize='none'
                  keyboardType='email-address'
                  textContentType='emailAddress'
                  autoFocus={false}
                  value={values.email}
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                />
                <FormErrorMessage
                  error={errors.email}
                  visible={touched.email}
                />
                <TextInput
                  name='password'
                  leftIconName='key-variant'
                  placeholder='Enter password'
                  autoCapitalize='none'
                  autoCorrect={false}
                  secureTextEntry={passwordVisibility}
                  textContentType='password'
                  rightIcon={rightIcon}
                  handlePasswordVisibility={handlePasswordVisibility}
                  value={values.password}
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                />
                <FormErrorMessage
                  error={errors.password}
                  visible={touched.password}
                />
                {/* Display Screen Error Mesages */}
                {errorState !== '' ? (
                  <FormErrorMessage error={errorState} visible={true} />
                ) : null}
                {/* Login button */}
                <Button style={styles.button} onPress={handleSubmit}>
                  <Text style={styles.buttonText}>Login</Text>
                </Button>
              </>
            )}
          </Formik>
          {/* Button to navigate to SignupScreen to create a new account */}
          <Button
            style={styles.borderlessButtonPorgot}
            borderless
            title={'Forgot Password?'}
            onPress={() => navigation.navigate('ForgotPassword')}
          />
           <Text><Text style={styles.createtext}>Don't Have an Account?  <Button
            style={styles.borderlessButtonNew}
            borderless
            title={'Create a new account'}
            onPress={() => navigation.navigate('Signup')}
          /></Text></Text>
        </KeyboardAwareScrollView>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
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
  createtext: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.white,
    marginTop: 20,
    marginTop: 20,
    
  },
  createtext1: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.white,
    marginTop: 12,
    paddingTop: 10,
    
  },
  button: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    backgroundColor: Colors.blue,
    padding: 10,
    borderRadius: 25
    
  },
  buttonText: {
    fontSize: 20,
    color: Colors.white,
    fontWeight: '700'
  },
  borderlessButtonPorgot: {
    marginTop: 16,
    alignItems: 'center',
    justifyContent: 'center'
  },
  borderlessButtonNew: {
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 10
  }
});
