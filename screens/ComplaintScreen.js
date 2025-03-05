import React, { useState, useEffect } from 'react';
import { TouchableOpacity, ImageBackground, StyleSheet, Text, StatusBar, Dimensions, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { auth, db, storage, Colors } from '../config';
import DropDownPicker from 'react-native-dropdown-picker';
import { View, TextInput } from '../components';
import { setDoc, doc, serverTimestamp } from 'firebase/firestore';
import { uploadBytes, ref, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';

const { width } = Dimensions.get('window');

export const ComplaintScreen = ({ navigation }) => {
    const user = auth.currentUser;
    const [uuid, setUUID] = useState(uuidv4());

    // Complaint Categories
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);

    // Sub-Categories
    const [subOpen, setSubOpen] = useState(false);
    const [subValue, setSubValue] = useState(null);
    const [subCategories, setSubCategories] = useState([]);

    // Complaint Form Fields
    const [title, setTitle] = useState('');
    const [location, setLocation] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [accountNumber, setAccountNumber] = useState('');
    const [description, setDescription] = useState('');
    const [imageUrls, setImageUrls] = useState([]);
    const [message, setMessage] = useState('');

    // Complaint List with Sub-Categories
    const complaints = [
        { label: 'Technical Request', value: 'Technical Request', sub: [
            { label: 'Meter Leak', value: 'Meter Leak' },
            { label: 'Pipe Leak', value: 'Pipe Leak' }
        ]},
        { label: 'Water Concerns', value: 'Water Concerns', sub: [
            { label: 'No Water', value: 'No Water' },
            { label: 'Low Pressure', value: 'Low Pressure' },
            { label: 'Bad Water Quality', value: 'Bad Water Quality' },
        ]},
        { label: 'Billing Concerns', value: 'Billing Concerns', sub: [
            { label: 'Overbilling', value: 'Overbilling' },
            { label: 'Incorrect Reading', value: 'Incorrect Reading' }
        ]},
        { label: 'Stolen Meter', value: 'Stolen Meter', sub: [
            { label: 'Reported Stolen', value: 'Reported Stolen' },
            { label: 'Suspected Theft', value: 'Suspected Theft' }
        ]},
        { label: 'Other Concerns', value: 'Other Concerns', sub: [
            { label: 'General Inquiry', value: 'General Inquiry' },
            { label: 'Other Issues', value: 'Other Issues' }
        ]}
    ];

    useEffect(() => {
        if (value) {
            const selectedComplaint = complaints.find(c => c.value === value);
            setSubCategories(selectedComplaint ? selectedComplaint.sub : []);
            setSubValue(null);
        }
    }, [value]);

    const handleComplaint = async () => {
        if (!value || !title || !location || !description) {
            Alert.alert("Error", "Please fill all required fields.");
            return;
        }

        await setDoc(doc(db, `users/${user.uid}`, `complaints/${uuid}`), {
            name: user.displayName,
            complaint: value,
            subComplaint: subValue || 'N/A',
            title,
            location,
            contactNumber,
            accountNumber,
            description,
            images: imageUrls,
            progress: 'Verifying',
            timestamp: serverTimestamp(),
        });

        Alert.alert("Success", "Complaint submitted successfully.");
        navigation.navigate('Home');
    };

    const selectPhotos = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission Required', 'Camera roll access is needed to upload images.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,
            allowsMultipleSelection: true,
            quality: 1,
        });

        if (!result.canceled) {
            const images = result.assets || [result];
            for (const image of images) {
                await uploadImage(image.uri);
            }
        }
    };

    const uploadImage = async (uri) => {
        const filename = `complaint-${uuid}-${Date.now()}`;
        const storageRef = ref(storage, `complaints/${user.uid}/${uuid}/${filename}`);
        
        const response = await fetch(uri);
        const blob = await response.blob();

        await uploadBytes(storageRef, blob);
        const downloadURL = await getDownloadURL(storageRef);
        setImageUrls((prevUrls) => [...prevUrls, downloadURL]);

        setMessage('Image uploaded successfully');
    };

    return (
        <ImageBackground source={require('../assets/menu.jpg')} style={styles.bg}>
            <View style={styles.container}>
                <StatusBar barStyle="light-content" />
                <Text style={styles.screenTitle}>REPORT COMPLAINTS</Text>

                <View style={styles.dropdownWrapper}>
    {/* Complaint Dropdown */}
    <View style={[styles.dropdownContainer, { zIndex: 3000 }]}>
        <DropDownPicker
            open={open}
            value={value}
            items={complaints}
            setOpen={setOpen}
            setValue={setValue}
            placeholder="Select Complaint"
            style={styles.dropdown}
            dropDownContainerStyle={{ zIndex: 3000, elevation: 3 }}
        />
    </View>

    {/* Sub-Category Dropdown */}
    {subCategories.length > 0 && (
        <View style={[styles.dropdownContainer, { zIndex: 2000 }]}>
            <DropDownPicker
                open={subOpen}
                value={subValue}
                items={subCategories}
                setOpen={setSubOpen}
                setValue={setSubValue}
                placeholder="Select Sub-Category"
                style={styles.dropdown}
                dropDownContainerStyle={{ zIndex: 2000, elevation: 2 }}
            />
        </View>
    )}
</View>
                <KeyboardAwareScrollView>
                    <TextInput placeholder="Name" onChangeText={setTitle} />
                    <TextInput placeholder="Location" onChangeText={setLocation} />
                    <TextInput placeholder="Contact Number" onChangeText={setContactNumber} keyboardType="numeric" />
                    <TextInput placeholder="Account Number" onChangeText={setAccountNumber} keyboardType="numeric" />
                    <TextInput placeholder="Description" onChangeText={setDescription} numberOfLines={3} />

                    <Text style={styles.statusText}>{message}</Text>

                    <View style={styles.buttonsContainer}>
                        <TouchableOpacity style={styles.button} onPress={selectPhotos}>
                            <Text style={styles.buttonText}>Upload Photos</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={handleComplaint}>
                            <Text style={styles.buttonText}>Submit</Text>
                        </TouchableOpacity>
                        
                    </View>
                </KeyboardAwareScrollView>
            </View>
            
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: { paddingTop: StatusBar.currentHeight },
    bg: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    screenTitle: { fontSize: 22, fontWeight: 'bold', color: 'white', textAlign: 'center', marginVertical: 20 },
    dropdownContainer: { width: '80%', marginBottom: 10 },
    dropdownWrapper: {
        width: '50%',
        marginBottom: 10,
    },
    dropdownContainer: {
        marginBottom: 10,
    },
    dropdown: { backgroundColor: '#87CEEB', borderRadius: 10 },
    buttonsContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
    button: { backgroundColor: '#CC3168', padding: 10, borderRadius: 10, margin: 10 },
    buttonText: { color: 'white', fontWeight: 'bold', textAlign: 'center' },
    statusText: { color: 'yellow', textAlign: 'center', marginTop: 10 },
    
});
