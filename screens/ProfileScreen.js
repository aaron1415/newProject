import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Image, ImageBackground, StyleSheet, Text, StatusBar, Dimensions } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

import { doc, setDoc, getDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { updateProfile, deleteUser, signOut } from 'firebase/auth';
import { auth, db, storage, Colors } from '../config';

import { View, TextInput } from '../components';

const { width, height } = Dimensions.get('window');

export const ProfileScreen = ({ navigation }) => {
    const user = auth.currentUser;
    const [fullname, setFullName] = useState(user.displayName);
    const [accountnumber, setAccountNumber] = useState('');
    const [phonenumber, setPhoneNumber] = useState('');

    const [profileImage, setProfileImage] = useState(user.photoURL);
    const [success, setSuccess] = useState(false);

    const handleUpdate = async () => {
        try {
            // Ensure user object is available
            if (!user) {
                alert("User not found. Please log in again.");
                return;
            }
    
            // Only update fields that are not empty
            const updatedData = {};
            if (fullname) updatedData.fullname = fullname;
            if (accountnumber) updatedData.accountnumber = accountnumber;
            if (phonenumber) updatedData.phonenumber = phonenumber;
    
            // Update display name in Firebase Auth
            await updateProfile(user, {
                displayName: fullname,
            });
    
            // Update Firestore document
            await updateDoc(doc(db, 'users', user.uid), updatedData);
    
            setSuccess(true);
            alert("Profile Updated Successfully!");
        } catch (error) {
            console.error("Error updating profile:", error.message);
            alert("Failed to update profile. Please try again.");
        }
    };

    const handleChoosePhoto = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if(status !== 'granted') {
            alert('Sorry, we need camera roll permissions to make this work!');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,
            aspect: [4, 3],
            quality: 1
        });

        if(!result.cancelled) {
            const imageRef = ref(storage, `profile/${user.uid}/profile.jpg`);
            const image = await fetch(result.uri);
            const bytes = await image.blob();

            await uploadBytes(imageRef, bytes);

            const url = await getDownloadURL(imageRef);

            setProfileImage(url);

            
            await updateProfile(user, {
                photoURL: url,
                fullname: fullname,
                accountnumber: accountnumber || "", 
                phonenumber: phonenumber || "",
            });
            await updateDoc(doc(db, 'users', user.uid), {
                photoURL: url,
               
            });
        }
    }
    
    const checkUserData = async () => {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);

        if(docSnap.exists()) {
            const { fullname, accountnumber, phonenumber } = docSnap.data();
            setFullName(fullname);
            setAccountNumber(accountnumber);
            setPhoneNumber(phonenumber);
        }
    }

    useEffect(() => {
        checkUserData();
    }, []);

    const handleDelete = async () => {
        try {
            if (!user) {
                alert("User not found. Please log in again.");
                return;
            }
    
            const usersRef = doc(db, 'users', user.uid);
            const imageRef = ref(storage, `profile/${user.uid}/profile.jpg`); // Ensure correct path
    
            // Delete profile picture if it exists
            try {
                await deleteObject(imageRef);
            } catch (error) {
                console.log("No profile image found or already deleted:", error.message);
            }
    
            // Delete user document in Firestore
            await deleteDoc(usersRef);
    
            // Delete user from Firebase Authentication
            await deleteUser(user);
    
            // Sign out user after deletion
            await signOut(auth);
    
            alert("Account Deleted Successfully!");
            navigation.replace("Login"); // Redirect user to login screen
        } catch (error) {
            console.error("Error deleting account:", error.message);
            alert("Failed to delete account. Please try again.");
        }
    };
    
    
  return (
    <ImageBackground source={require('../assets/menu.jpg')} style={styles.bg}>
        <Text style={styles.screenTitle}>UPDATE PROfILE</Text>
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <View style={styles.logoContainer}>
            {profileImage && <Image source={{ uri: profileImage }} style={styles.profileImage} />}
            <TouchableOpacity style={styles.upload} onPress={handleChoosePhoto}>
                <Text style={styles.uploadText}>
                    {profileImage ? 'Change Profile Picture' : 'Upload Profile Picture'}
                </Text>
            </TouchableOpacity>
        </View>
        <View style={styles.profileContainer}>
            <Text style={styles.profileText}>Full Name</Text>
            <TextInput value={fullname} onChangeText={setFullName} />
            <Text style={styles.profileText}>Account No.</Text>
            <TextInput value={accountnumber} placeholderTextColor={Colors.mediumGray} onChangeText={setAccountNumber} maxLength={14}  />

            <Text style={styles.profileText}>Phone No.</Text>
            <TextInput value={phonenumber} onChangeText={setPhoneNumber} maxLength={11}/>
        </View>
        <View style={styles.buttonsContainer}>
            {success && <Text style={styles.success}>{'\n'}</Text>}
            <TouchableOpacity style={styles.button} onPress={ handleUpdate }>
                <Text style={styles.buttonText}>
                    Update Information
                </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttondelete} onPress={ handleDelete }>
                <Text style={styles.buttonText}>
                    Delete Account
                </Text>
            </TouchableOpacity>
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
    paddingBottom: 30,
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
        fontSize: 15,
        fontWeight: 'bold',
        color: Colors.white,
        marginTop: 10,
        marginRight: '50%',
        textShadowColor: 'black',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 2

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
    uploadText: {
        fontSize: 20,
        color: 'white',
        fontWeight: 'bold',
        textDecorationLine: 'underline',
        textShadowColor: 'black',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 0.5,
        paddingTop: 12,

    },
    profileImageContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    profileImage: {
        width: 150,
        height: 150,
        borderRadius: 75,
        borderWidth: 4,
        borderColor: Colors.blue,
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
        width: '50%',
        textAlign: 'center',
        borderRadius: 10,
        margin: 5,
        justifyContent: 'space-evenly'
    },
    buttondelete: {
        backgroundColor: Colors.red,
        width: '50%',
        textAlign: 'center',
        borderRadius: 10,
        margin: 5,
        justifyContent: 'space-evenly'
    },
    buttonhome: {
        backgroundColor: '#1616FF',
        width: '50%',
        textAlign: 'center',
        borderRadius: 10,
        margin: 5,
        justifyContent: 'space-evenly'
    },
    buttonText: {
        color: Colors.gray,
        fontWeight: 'bold',
        textAlign: 'center',
        fontsize: 20,
        margin: 8
    },
    success: {
        color: Colors.blue,
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 10,
        marginBottom: 20,
    },
});