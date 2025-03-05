import React from 'react';
import { View, TouchableOpacity, Image, ImageBackground, StyleSheet, Text, StatusBar, Dimensions } from 'react-native';
import { signOut } from 'firebase/auth';

import { auth, Images, Colors } from '../config';
import { Logo } from '../components';

const { width, height } = Dimensions.get('window');

export const HomeScreen = ({ navigation }) => {
  const handleLogout = () => {
    signOut(auth).catch(error => console.log('Error logging out: ', error));
  };

  
  return (
    <ImageBackground source={require('../assets/menu.jpg')} style={styles.bg}>
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <View style={styles.logoContainer}>
            <Logo uri={Images.dashboard} />
            <Text style={styles.screenTitle}>CONSUMER COMPLAINTS</Text>
        </View>
        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.report} onPress={ () => navigation.navigate('Complaint') }>
            <Image source={require('../assets/writeComplaint.png')} style={styles.imgbutton1} />

            <Text style={styles.reportText}>
              Report Complaint
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.report} onPress={  () => navigation.navigate('History')  }>
            <Image source={require('../assets/complaint_history.png')} style={styles.imgbutton1} />

            <Text style={styles.reportText}>
              Complaint History
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.report} onPress={  () => navigation.navigate('Profile')  }>
            <Image source={require('../assets/my_profile.png')} style={styles.imgbutton1} />

            <Text style={styles.reportText}>
              My profile
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.report} onPress={  () => navigation.navigate('ChangePassword')  }>
            <Image source={require('../assets/changePass.png')} style={styles.imgbutton1} />

            <Text style={styles.reportText}>
              Change Password
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.logout} onPress={ handleLogout }>
            <Text style={styles.logoutText}>
              Logout
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
    textShadowColor: 'black',
    textShadowOffset: { width: 4, height: 2.5 },
    textShadowRadius: 5,
    textAlign: 'center',
    paddingTop: 20,
    paddingBottom: 20,
    
    
  },
  buttonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginHorizontal: width * 0.05,
    height: height * 0.6,
    overflow: 'hidden',
  },
  report: {
  backgroundColor: 'rgba(173, 216, 230, 0.2)',
    width: '40%',
    textAlign: 'center',
    borderRadius: 10,
    margin: 10,
    height: height * 0.2,
    justifyContent: 'space-evenly',
    borderWidth: 2,
    borderColor: 'blue'
    
  },
  imgbutton1: {
    height: '60%',
    width: '60%',
    alignSelf: 'center'
  },
  reportText: {
    color: 'white',
    textShadowColor: 'black',
    textShadowOffset: { width: 2, height: 1.5 },
    textShadowRadius: 1,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  logout: {
    backgroundColor: '#1616FF',
    width: '30%',
    textAlign: 'center',
    borderRadius: 10,
    margin: 30,
    justifyContent: 'space-evenly'
  },
  logoutText: {
    color: Colors.white,
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 10
  },
});