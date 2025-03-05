import React, { useState } from 'react';
import { TouchableOpacity, Image, ImageBackground, StyleSheet, Text, StatusBar, Dimensions } from 'react-native';
import { Formik } from 'formik';
import { auth, Colors } from '../config';
import { Button, View, TextInput, FormErrorMessage} from '../components';

import { useTogglePasswordVisibility } from '../hooks';
import { changePasswordSchema } from '../utils';
import { signInWithEmailAndPassword, updatePassword } from 'firebase/auth';

const { width, height } = Dimensions.get('window');

export const ChangePasswordScreen = ({ navigation }) => {
    const user = auth.currentUser;
    const email = user.email;
    const [errorState, setErrorState] = useState('');

    const {
        passwordVisibility,
        handlePasswordVisibility,
        rightIcon,
        handleConfirmPasswordVisibility,
        confirmPasswordIcon,
        confirmPasswordVisibility
    } = useTogglePasswordVisibility();
    const profileImage = user.photoURL;

    // still needs checking for password validation
    const handleUpdate = async values => {
        signInWithEmailAndPassword(auth, email, values.currentPassword)
        .then((userCredential) => {
            // Signed in
            const user = userCredential.user;
            updatePassword(user, values.newPassword);
            navigation.navigate('Home');
            alert('Password successfully changed!');
            // ...
        })
        .catch((error) => {
            setErrorState('Incorrect password!');
        });
    };
    
  return (
    <ImageBackground source={require('../assets/menu.jpg')} style={styles.bg}>
          <Text style={styles.screenTitle}>CHANGE PASSWORD</Text>
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <View style={styles.logoContainer}>
            {profileImage && <Image source={{ uri: profileImage }} style={styles.profileImage} />}
          
        </View>
        {/* Formik Wrapper */}
        <Formik
            initialValues={{
                currentPassword: '',
                newPassword: '',
                confirmNewPassword: ''
            }}
            validationSchema={changePasswordSchema}
            onSubmit={values => handleUpdate(values)}
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
                    name='currentPassword'
                    leftIconName='key-variant'
                    placeholder='Current Password'
                    autoCapitalize='none'
                    autoCorrect={false}
                    secureTextEntry={passwordVisibility}
                    textContentType='password'
                    rightIcon={rightIcon}
                    handlePasswordVisibility={handlePasswordVisibility}
                    value={values.currentPassword}
                    onChangeText={handleChange('currentPassword')}
                    onBlur={handleBlur('currentPassword')}
                />
                <FormErrorMessage
                    error={errors.currentPassword}
                    visible={touched.currentPassword}
                />
                <TextInput
                    name='newPassword'
                    leftIconName='key-variant'
                    placeholder='New Password'
                    autoCapitalize='none'
                    autoCorrect={false}
                    secureTextEntry={confirmPasswordVisibility}
                    textContentType='password'
                    rightIcon={confirmPasswordIcon}
                    handlePasswordVisibility={handleConfirmPasswordVisibility}
                    value={values.newPassword}
                    onChangeText={handleChange('newPassword')}
                    onBlur={handleBlur('newPassword')}
                />
                <FormErrorMessage
                    error={errors.newPassword}
                    visible={touched.newPassword}
                />
                <TextInput
                    name='confirmNewPassword'
                    leftIconName='key-variant'
                    placeholder='Confirm New Password'
                    autoCapitalize='none'
                    autoCorrect={false}
                    secureTextEntry={confirmPasswordVisibility}
                    textContentType='password'
                    rightIcon={confirmPasswordIcon}
                    handlePasswordVisibility={handleConfirmPasswordVisibility}
                    value={values.confirmNewPassword}
                    onChangeText={handleChange('confirmNewPassword')}
                    onBlur={handleBlur('confirmNewPassword')}
                />
                <FormErrorMessage
                    error={errors.confirmNewPassword}
                    visible={touched.confirmNewPassword}
                />
                {/* Display Screen Error Mesages */}
                {errorState !== '' ? (
                    <FormErrorMessage error={errorState} visible={true} />
                ) : null}
                
                <View style={styles.buttonsContainer}>
                    <TouchableOpacity style={styles.button} onPress={ handleSubmit }>
                        <Text style={styles.buttonText}>
                            Update Password
                        </Text>
                    </TouchableOpacity>
                </View>
                </>
            )}
        </Formik>
        <View style={styles.buttonsContainer}>
            <TouchableOpacity style={styles.buttonhome} onPress={  () => navigation.navigate('Home')  }>
                <Text style={styles.buttonText}>
                Home
                </Text>
            </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0
  },
  logoContainer: {
    alignItems: 'center'
  },
  bg: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    resizeMode: 'contain',
  },
  screenTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.white,
    paddingTop: 20,
    paddingBottom: 20,
    textShadowColor: 'black',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 1
  },
    profileContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: width * 0.05,
    },
    profileText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.white,
        marginTop: 20,
    },
    update: {
        backgroundColor: Colors.secondary,
        borderRadius: 10,
        paddingHorizontal: 20,
        paddingVertical: 10,
        marginTop: 20,
    },
    updateText: {
        color: Colors.white,
        fontWeight: 'bold',
        fontSize: 16,
    },
    profileImageContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    profileImage: {
        width: 150,
        height: 150,
        borderRadius: 75,
        borderWidth: 2,
        marginBottom: 30,
        borderColor: Colors.white,
    },
    buttonsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        flexWrap: 'wrap',
        marginHorizontal: width * 0.05,
        overflow: 'hidden',
    },
    button: {
        backgroundColor: Colors.blue,
        width: '60%',
        textAlign: 'center',
        borderRadius: 10,
        margin: 10,
        justifyContent: 'space-evenly'
    },
    buttonhome: {
        backgroundColor: '#1616FF',
        width: '60%',
        textAlign: 'center',
        borderRadius: 10,
        margin: 10,
        justifyContent: 'space-evenly'
    },
    buttonText: {
        color: Colors.white,
        fontWeight: 'bold',
        textAlign: 'center',
        fontsize: 20,
        margin: 5
    },
    success: {
        color: Colors.orange,
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 10,
        marginBottom: 20,
    },
});