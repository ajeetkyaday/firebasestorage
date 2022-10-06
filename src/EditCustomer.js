
import React, { useState, useEffect, Fragment } from 'react';
import { StyleSheet, View, ScrollView, Text, TextInput, StatusBar, Image, Dimensions, TouchableOpacity, Modal, SafeAreaView, Alert, KeyboardAvoidingView } from 'react-native';

import firebase from '@react-native-firebase/app'
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { ImagePickerModal } from './components/imagePickerModel';
import CustomTextInput from "./components/CustomTextInput"
import RadioForm, { RadioButton, RadioButtonInput, RadioButtonLabel } from 'react-native-simple-radio-button';
import { appBackgroundColor } from './components/colors';
import { Loader2 } from './components/ActivityIndicator';

export default function EditCustomer({ navigation, route }) {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [isWhatsapp, setIsWhatsapp] = useState(0);

    const [phoneType, setPhoneType] = useState(0);

    const [isLoading, setIsLoading] = useState(false);
    const [visible, setVisible] = useState(false);
    const [resourcePath, setResourcePath] = useState('')
    const [firebaseImageUrl, setFirebaseImageUrl] = useState('')

    const [profileLogo, setProfileLogo] = useState('')

    const [postId, setPostId] = useState('')

    var type_radio = [
        { label: 'Personal', value: 0 },
        { label: 'Office', value: 1 }
    ];
    var isWhatsapp_radio = [
        { label: 'No', value: 0 },
        { label: 'Yes', value: 1 }
    ];

    useEffect(() => {
        console.log('useEffect 1', JSON.stringify(route))

      

        const getData = () => {
            try {

                var item = route.params

                setProfileLogo(item.profilePicture)
                setName(item.name)
                setPhone(item.phone)
                setPhoneType(item.type)
                setIsWhatsapp(item.isWhatsapp)
                setPostId(item.id)
        
                console.log(item.type)
                console.log(phoneType)

            } catch (e) {
                console.log('Error in getting login data to asyncStorage on request screen => ' + e)
            }
        }
        getData();
    }, [navigation])


    const updateData = (postIds) => {

        // alert(postIds)
        firestore()
            .collection('posts')
            .doc(postIds)
            .update({
                'name': name,
                 'phone': phone,
                 'type': phoneType,
                 'isWhatsapp': isWhatsapp,


            })
            .then(() => {
                setIsLoading(false)
                console.log('User updates!');
                alert('User updated succeefully');
            })
            .catch((e) => {
                setIsLoading(false)

                console.log('User eeeeeee!', e);
            })
    }



    const uploadImage = async () => {
        const uri = resourcePath;
        const filename = uri.substring(uri.lastIndexOf('/') + 1);
        const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
        const imageName = uploadUri + '.png'
        firebase
            .storage()
            .ref(imageName)
            .putFile(uploadUri)
            .then((snapshot) => {
                console.log(JSON.stringify(snapshot))
                //You can check the image is now uploaded in the storage bucket
                console.log(`${imageName} has been successfully uploaded.`);


                let imageRef = firebase.storage().ref('/' + imageName);
                imageRef
                    .getDownloadURL()
                    .then((url) => {
                        //from url you can fetched the uploaded image easily
                        setFirebaseImageUrl(url)
                       
                        firestore()
                        .collection('posts')
                        .doc(postId)
                        .update({
                            'name': name,
                             'phone': phone,
                             'type': phoneType,
                             'isWhatsapp': isWhatsapp,
                             'profilePicture': url
            
                        })
                        .then(() => {
                            setIsLoading(false)
                            console.log('User updates!');
                            alert('User updated succeefully');

                        })
                        .catch((e) => {
                            setIsLoading(false)
            
                            console.log('User eeeeeee!', e);
                        })
                    })
                    .catch((e) => console.log('getting downloadURL of image error => ', e));


            })
            .catch((e) => console.log('uploading image error => ', e));
    };
    const callsubmitMethod = () => {



        if (name == '') {
            alert('Please inter your name');
            return;
        }
        if (phone == '') {
            alert('Please inter your phone number');
            return;
        }
        setIsLoading(true)
        if (resourcePath != '') {
            uploadImage()
        }
        else {
            updateData(postId)
        }
        // setIsLoading(true)
        // addData()

    }

 
    const requestCameraPermission = async () => {
        if (Platform.OS === 'android') {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.CAMERA,
                    {
                        title: 'Camera Permission',
                        message: 'App needs camera permission',
                    },
                );
                // If CAMERA Permission is granted
                return granted === PermissionsAndroid.RESULTS.GRANTED;
            } catch (err) {
                console.warn(err);
                return false;
            }
        } else return true;
    };

    const requestExternalWritePermission = async () => {
        if (Platform.OS === 'android') {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                    {
                        title: 'External Storage Write Permission',
                        message: 'App needs write permission',
                    },
                );
                // If WRITE_EXTERNAL_STORAGE Permission is granted
                return granted === PermissionsAndroid.RESULTS.GRANTED;
            } catch (err) {
                console.warn(err);
                alert('Write permission err', err);
            }
            return false;
        } else return true;
    };

    const captureImage = async (type) => {
        let options = {

            maxWidth: 300,
            maxHeight: 550,
            quality: 1,
            videoQuality: 'low',

            saveToPhotos: true,
        };
        let isCameraPermitted = await requestCameraPermission();
        let isStoragePermitted = await requestExternalWritePermission();
        if (isCameraPermitted && isStoragePermitted) {
            launchCamera(options, (response) => {
                console.log('Response = ', response);

                if (response.didCancel) {
                    alert('User cancelled camera picker');
                    return;
                } else if (response.errorCode == 'camera_unavailable') {
                    alert('Camera not available on device');
                    return;
                } else if (response.errorCode == 'permission') {
                    alert('Permission not satisfied');
                    return;
                } else if (response.errorCode == 'others') {
                    alert(response.errorMessage);
                    return;
                }
                console.log('base64 -> ', response.base64);
                console.log('uri -> ', response.uri);
                console.log('width -> ', response.width);
                console.log('height -> ', response.height);
                console.log('fileSize -> ', response.fileSize);
                console.log('type -> ', response.type);
                console.log('fileName -> ', response.fileName);
                setResourcePath(response.assets[0].uri);
            });
        }
    };

    const chooseFile = (type) => {
        let options = {

            maxWidth: 300,
            maxHeight: 550,
            quality: 1,
        };
        launchImageLibrary(options, (response) => {
            console.log('Response = ', response);

            if (response.didCancel) {
                alert('User cancelled camera picker');
                return;
            } else if (response.errorCode == 'camera_unavailable') {
                alert('Camera not available on device');
                return;
            } else if (response.errorCode == 'permission') {
                alert('Permission not satisfied');
                return;
            } else if (response.errorCode == 'others') {
                alert(response.errorMessage);
                return;
            }
            console.log('base64 -> ', response.base64);
            console.log('uri -> ', response.assets[0].uri);
            console.log('width -> ', response.width);
            console.log('height -> ', response.height);
            console.log('fileSize -> ', response.fileSize);
            console.log('type -> ', response.type);
            console.log('fileName -> ', response.fileName);
            setResourcePath(response.assets[0].uri);
        });
    };
    return (
        <Fragment>
            <SafeAreaView style={{ flex: 0, }} />
            <SafeAreaView style={{ flex: 1, }}>
                {isLoading ? <Loader2 /> : null}

                <ImagePickerModal
                    isVisible={visible}
                    onClose={() => setVisible(false)}
                    onImageLibraryPress={chooseFile}
                    onCameraPress={captureImage}
                />
                <KeyboardAvoidingView behavior="height" enabled style={styles.container} keyboardVerticalOffset={20}>

                    <ScrollView style={{ flex: 1, }}>
                        <View style={styles.logoContainerView}>
                            <TouchableOpacity onPress={() => setVisible(true)}>
                                {resourcePath != '' ?
                                    <Image source={{ uri: resourcePath }} style={styles.logoImage} />
                                    :
                                    <Image source={{ uri: profileLogo }} style={styles.logoImage} />
                                }
                            </TouchableOpacity>
                        </View>
                        <View style={styles.viewContainer}>
                            <Text style={styles.textLabel}>Name</Text>
                            <CustomTextInput style={{
                                textAlign: 'left',
                                textAlignVertical: 'center',
                            }}
                                placeholder='Name'
                                icon={require('./icons/user-icon.png')}
                                onChangeText={(value) => setName(value)}
                                value={name}
                            />
                            <Text style={styles.textLabel}>Phone Number</Text>

                            <CustomTextInput style={{
                                textAlign: 'left',
                                textAlignVertical: 'center',
                            }}
                                placeholder='Phone'
                                keyboardType="numeric"
                                icon={require('./icons/phone-icon.png')}
                                onChangeText={(value) => setPhone(value)}
                                value={phone}
                            />
                            <Text style={styles.textLabel}>Phone Type</Text>

                            <RadioForm
                                radio_props={type_radio}
                                initial={phoneType}
                                formHorizontal={true}
                                labelHorizontal={true}
                                buttonColor={appBackgroundColor}
                                selectedButtonColor={appBackgroundColor}

                                animation={true}
                                labelStyle={{ fontSize: 20, color: appBackgroundColor, paddingRight: 10 }}

                                onPress={(value) => { setPhoneType(value) }}
                            />
                            <Text style={styles.textLabel}>Is Whatsapp Number</Text>

                            <RadioForm
                                radio_props={isWhatsapp_radio}
                                initial={isWhatsapp}
                                formHorizontal={true}
                                labelHorizontal={true}
                                buttonColor={appBackgroundColor}
                                selectedButtonColor={appBackgroundColor}
                                
                                animation={true}
                                borderWidth={1}

                                labelStyle={{ fontSize: 20, color: appBackgroundColor, paddingRight: 10 }}

                                buttonStyle={{}}
                                buttonWrapStyle={{ marginLeft: 10 }}
                                onPress={(value) => { setIsWhatsapp(value) }}
                            />


                            <TouchableOpacity style={styles.submitButton} onPress={() => callsubmitMethod()}>
                                <Text allowFontScaling={false} style={{ textAlign: "center", fontSize: 24, color: '#fff' }}>Submit</Text>

                            </TouchableOpacity>
                        </View>

                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </Fragment>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    logoContainerView: {
        height: 100,
        width: 100,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        marginTop: 20,
        marginBottom: 20
    },
    viewContainer: {
        padding: 20
    },
    logoImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        resizeMode: 'cover'
    },
    textLabel: {
        fontSize: 20,
        paddingTop: 10,
        paddingBottom: 10

    },
    submitButton: {
        backgroundColor: appBackgroundColor,
        color: '#000',
        marginTop: 20,
        padding: 5,
        borderRadius: 50,
    }
});
