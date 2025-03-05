import React, { useState, useEffect } from 'react';
import { TouchableOpacity, ImageBackground, StyleSheet, Text, StatusBar, Dimensions } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { auth, db, storage, Colors } from '../config';
import { useRoute } from '@react-navigation/native';
import DropDownPicker from 'react-native-dropdown-picker';
import { View, TextInput } from '../components';
import { getDoc, deleteDoc, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { deleteObject, listAll, ref } from 'firebase/storage';
import 'react-native-get-random-values';
import { set } from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

export const ViewComplaintScreen = ({ navigation }) => {
    const route = useRoute();
    const id = route.params.complaints.id;
    const user = auth.currentUser;
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [complaint, setComplaint] = useState([
        {label: 'Technical Request', value: 'Technical Request'},
        {label: 'Power Outage', value: 'Power Outage'},
        {label: 'Billing Concerns', value: 'Billing Concerns'},
        {label: 'Service Issues', value: 'Service Issues'},
        {label: 'Other Concerns', value: 'Other Concerns'},
    ]);

    const [title, setTitle] = useState('');
    const [location, setLocation] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [accountNumber, setAccountNumber] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState(''); // ['Pending', 'In Progress', 'Completed'
    const [timestamp, setTimestamp] = useState('');
    const [urls, setUrls] = useState([]);
    const [remarks, setRemarks] = useState('');

    useEffect(() => {
        getData();
    }, []);
    const getData = async () => {
        const docRef = doc(db, `users/${user.uid}`, `complaints/${id}`);
        const docSnap = await getDoc(docRef);
        if(docSnap.exists()) {
            setTitle(docSnap.data().title);
            setValue(docSnap.data().complaint);
            setLocation(docSnap.data().location);
            setContactNumber(docSnap.data().contactNumber);
            setAccountNumber(docSnap.data().accountNumber);
            setDescription(docSnap.data().description);
            setStatus(docSnap.data().progress);
            setTimestamp(docSnap.data().timestamp);
            setRemarks(docSnap.data().remarks);
            setUrls(docSnap.data().urls);
        }
    }
    const handleUpdate = async () => {
        try {
            await updateDoc(doc(db, `users/${user.uid}`, `complaints/${id}`), {
                complaint: value,
                title: title,
                location: location,
                contactNumber: contactNumber,
                accountNumber: accountNumber,
                description: description,
                timestamp: serverTimestamp(),
            });
            handleBack();
        } catch (error) {
            console.log(error);
        }
    };
    const handleDelete  = async () => {
        try {
            // Note Uploaded Images can't be deleted.
            await deleteDoc(doc(db, `users/${user.uid}`, `complaints/${id}`));
            alert('Complaint Deleted');
            handleBack();
        } catch (error) {
            alert('Complaint Not Deleted');
        }
    };
    const handleBack = () => {
        navigation.navigate('Home');
    };
  return (
    <ImageBackground source={require('../assets/menu.jpg')} style={styles.bg}>
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
            <View style={styles.logoContainer}>
                <Text style={styles.screenTitle}>View Complaint</Text>
            </View>
            <KeyboardAwareScrollView enableOnAndroid={true}>
           
            <Text style={styles.Label}>Complaint Type</Text>
            <View style={styles.dropdownComplaints}>
                <DropDownPicker
                    style = {styles.dropdown}
                    open={open}
                    value={value}
                    items={complaint}
                    setOpen={setOpen}
                    setValue={setValue}
                    setItems={setComplaint}
                    placeholder="Select Complaint"
                    placeholderStyle={styles.placeholderStyles}
                />
            </View>
                <View style={styles.fieldContainer}>
                    <Text style={styles.Label}>Title</Text>
                    <TextInput
                        placeholder="Title"
                        placeholderTextColor={Colors.mediumGray}
                        onChangeText={setTitle}
                        value={title}
                    />
                    <Text style={styles.Label}>Location</Text>
                    <TextInput
                        placeholder="Location"
                        placeholderTextColor={Colors.mediumGray}
                        onChangeText={setLocation}
                        value={location}
                    />
                    <Text style={styles.Label}>Contact Number</Text>
                    <TextInput
                        placeholder="Contact Number"
                        placeholderTextColor={Colors.mediumGray}
                        onChangeText={setContactNumber}
                        value={contactNumber}
                    />
                    <Text style={styles.Label}>Account Number</Text>
                    <TextInput
                        placeholder="Account Number"
                        placeholderTextColor={Colors.mediumGray}
                        onChangeText={setAccountNumber}
                        value={accountNumber}
                    />
                    <Text style={styles.Label}>Description</Text>
                    <TextInput
                        placeholder="Description"
                        placeholderTextColor={Colors.mediumGray}
                        onChangeText={setDescription}
                        numberOfLines={3}
                        value={description}
                    />
                    <Text style={styles.Label}>Remarks</Text>
                    <TextInput
                        multiline={true}
                        placeholder="Remarks"
                        placeholderTextColor={Colors.mediumGray}
                        onChangeText={setDescription}
                        numberOfLines={3}
                        editable={false}
                        value={remarks}
                    />
                     <Text style={[styles.Label, {fontSize: 20, color: status === "Verifying" ? '#00FFFF' : status === "Completed" ? Colors.green : Colors.red}]}>{status}</Text>
                </View>
                <View style={styles.buttonsContainer}>
                    <TouchableOpacity style={styles.buttondelete} onPress={  handleDelete }>
                        <Text style={styles.buttonText}>
                        Delete Complaint
                        </Text>
                    </TouchableOpacity>
                    {status==="Verifying" ? 
                        <TouchableOpacity style={styles.button} onPress={  handleUpdate  }>
                            <Text style={styles.buttonText}>
                            Update Complaint
                            </Text>
                        </TouchableOpacity>
                    : null}
                    <TouchableOpacity style={styles.buttonhome} onPress={  handleBack  }>
                        <Text style={styles.buttonText}>
                        Go Back
                        </Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAwareScrollView>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
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
    paddingBottom: 20
  },
    Label: {
        fontSize: 12,
        fontWeight: 'bold',
        color: Colors.white,
        textAlign: 'center',
    },
    dropdownComplaints: {
        width: '75%',
        zIndex: 3000,
        alignSelf: 'center',
        marginVertical: 8,
    },
    dropdown: {
        bordercolor: "#B7B7B7",
        height: 50,
        borderRadius: 20,
        backgroundColor: '#87CEEB',
    },
    placeholderStyles: {
        color: Colors.mediumGray,
    },
    fieldContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
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
        backgroundColor: Colors.orange,
        width: '40%',
        textAlign: 'center',
        borderRadius: 10,
        margin: 10,
        justifyContent: 'space-evenly'
    },
    buttondelete: {
        backgroundColor: Colors.red,
        width: '40%',
        textAlign: 'center',
        borderRadius: 10,
        margin: 10,
        justifyContent: 'space-evenly'
    },
    buttonhome: {
        backgroundColor: '#1616FF',
        width: '40%',
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
});