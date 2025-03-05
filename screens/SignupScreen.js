import React, { useState } from 'react';
import { Text, StatusBar, StyleSheet } from 'react-native';
import { Formik } from 'formik';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { View, TextInput, Logo, Button, FormErrorMessage } from '../components';
import { Images, Colors, auth, db } from '../config';
import { useTogglePasswordVisibility } from '../hooks';
import { signupValidationSchema } from '../utils';

export const SignupScreen = ({ navigation }) => {
  const [errorState, setErrorState] = useState('');

  const {
    passwordVisibility,
    handlePasswordVisibility,
    rightIcon,
    handleConfirmPasswordVisibility,
    confirmPasswordIcon,
    confirmPasswordVisibility
  } = useTogglePasswordVisibility();

  const handleSignup = async values => {
    const { fullname, email, phonenumber, password } = values;

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      await updateProfile(user, {
        displayName: fullname
      });

      await setDoc(doc(db, "users", user.uid), {
        fullname: fullname,
        phonenumber: phonenumber,
        email: user.email
      });

      console.log("Registration successful!");
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        setErrorState("Email already exists. Please use a different email.");
      } else {
        setErrorState("An Email already exists. Please use a different email.");
      }
    }
  };

  return (
    <>
      <View isSafe style={styles.container}>
        <StatusBar barStyle="light-content" />
        <KeyboardAwareScrollView enableOnAndroid={true}>
          <View style={styles.logoContainer}>
            <Logo uri={Images.logo} />
            <Text style={styles.screenTitle}>Create Account</Text>
          </View>
          <Formik
            initialValues={{
              fullname: '',
              phonenumber: '',
              email: '',
              password: '',
              confirmPassword: ''
            }}
            validationSchema={signupValidationSchema}
            onSubmit={values => handleSignup(values)}
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
                <TextInput
                  name='fullname'
                  leftIconName='account'
                  placeholder='Enter Full Name'
                  autoCapitalize='none'
                  keyboardType='default'
                  textContentType='fullname'
                  value={values.fullname}
                  onChangeText={handleChange('fullname')}
                  onBlur={handleBlur('fullname')}
                />
                <View style={styles.containertext}>
                  <Text style={styles.noteTitle}>Note: The Full Name can't be unchanged.</Text>
                </View>
                <FormErrorMessage error={errors.fullname} visible={touched.fullname} />
                <TextInput
                  name='email'
                  leftIconName='email'
                  placeholder='Enter Email'
                  autoCapitalize='none'
                  keyboardType='email-address'
                  textContentType='emailAddress'
                  value={values.email}
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                />
                <FormErrorMessage error={errors.email} visible={touched.email} />
                <TextInput
                  name='phonenumber'
                  leftIconName='cellphone'
                  placeholder='Enter Phone Number'
                  autoCapitalize='none'
                  keyboardType='numeric'
                  textContentType='telephoneNumber'
                  value={values.phonenumber}
                  onChangeText={handleChange('phonenumber')}
                  onBlur={handleBlur('phonenumber')}
                  maxLength={11}
                />
                <FormErrorMessage error={errors.phonenumber} visible={touched.phonenumber} />
                <TextInput
                  name='password'
                  leftIconName='key-variant'
                  placeholder='Enter password'
                  autoCapitalize='none'
                  autoCorrect={false}
                  secureTextEntry={passwordVisibility}
                  textContentType='newPassword'
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
                <TextInput
                  name='confirmPassword'
                  leftIconName='key-variant'
                  placeholder='Confirm password'
                  autoCapitalize='none'
                  autoCorrect={false}
                  secureTextEntry={confirmPasswordVisibility}
                  textContentType='password'
                  rightIcon={confirmPasswordIcon}
                  handlePasswordVisibility={handleConfirmPasswordVisibility}
                  value={values.confirmPassword}
                  onChangeText={handleChange('confirmPassword')}
                  onBlur={handleBlur('confirmPassword')}
                />
                <FormErrorMessage
                  error={errors.confirmPassword}
                  visible={touched.confirmPassword}
                />
                {errorState !== '' && (
                  <FormErrorMessage error={errorState} visible={true} />
                )}
                <Button style={styles.button} onPress={handleSubmit}>
                  <Text style={styles.buttonText}>Signup</Text>
                </Button>
              </>
            )}
          </Formik>
          <Button
            style={styles.borderlessButtonContainer}
            borderless
            title={'Already have an account?'}
            onPress={() => navigation.navigate('Login')}
          />
        </KeyboardAwareScrollView>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    flex: 1
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
  containertext: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noteTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.white,
    paddingTop: 5,
    paddingBottom: 5,
    textAlign: 'center'
  },
  button: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    backgroundColor: Colors.blue,
    padding: 10,
    borderRadius: 8
  },
  buttonText: {
    fontSize: 20,
    color: Colors.white,
    fontWeight: '700'
  },
  borderlessButtonContainer: {
    marginTop: 16,
    alignItems: 'center',
    justifyContent: 'center',
  }
});
