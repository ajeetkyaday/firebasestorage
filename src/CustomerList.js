
import React, { useState, useEffect, Fragment } from 'react';
import { StyleSheet, View, FlatList,Button, ScrollView, Text, StatusBar, Image, Dimensions, TouchableOpacity, Modal, SafeAreaView, Alert, KeyboardAvoidingView } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { appBackgroundColor } from './components/colors';
import { Loader2 } from './components/ActivityIndicator';
// var customerData = [
//     {
//         'name': 'ajeet',
//         'phone': '9716915371',
//         'type': 'home',
//         'isWhatsapp': false,
//         'profilePicture:': ''
//     },
//     {
//         'name': 'ajeet',
//         'phone': '9716915371',
//         'type': 'home',
//         'isWhatsapp': false,
//         'profilePicture:': ''
//     }
// ]

export default function CustomerList({ navigation, route }) {
    const [emailId, setEmailId] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [customerData, setCustomerData] = useState([]);



    useEffect(() => {
        console.log('useEffect 1')
        navigation.setOptions({
            headerRight: () => (
                <Button
                onPress={() => navigation.navigate('AddCustomer')}
                title="Add New"
                color="#000"
              />
            ),
          });
        const unsubscribe = navigation.addListener('focus', () => {
            // The screen is focused
            // Call any action
            
            setIsLoading(true)
   
        getData();
    });
    return unsubscribe
        
    }, [])

    const getData = async () => {
        var userlist = []
        try {
            firestore()
                .collection('posts')

                .get()
                .then(documentSnapshot => {
                    console.log('User exists: ', documentSnapshot.size);
                    setIsLoading(false)

                    documentSnapshot.forEach(doc => {
                        console.log('User data: ', doc.id);
                        console.log(doc.data().profilePicture)
                        console.log(doc.data().name)
                        userlist.push(
                            {
                                'id': doc.id,
                                'name': doc.data().name,
                                'phone': doc.data().phone,
                                'type': doc.data().type,
                                'isWhatsapp': doc.data().isWhatsapp,
                                'profilePicture': doc.data().profilePicture,
                            }
                        )
                    })
                    setCustomerData(userlist)
                    if (documentSnapshot.exists) {
                        console.log('User data: ', documentSnapshot.data());
                    }
                });
        } catch (e) {
            setIsLoading(false)

            console.log('Error in getting login data to asyncStorage on request screen => ' + e)
        }
    }

    const showAlert = (postId) =>
        Alert.alert(
            "",
            "Are you sure? You want to delete this user",
            [
                {
                    text: "Cancel",
                    onPress: () => console.log('dd'),
                    style: "cancel",
                },

                {
                    text: "OK",
                    onPress: () => deletedata(postId),
                    style: "cancel",
                },
            ],
            {
                cancelable: true,
                onDismiss: () =>
                    console.log("This alert was dismissed by tapping outside of the alert dialog."
                    )
            }
        );



    const deletedata = (postId) => {
        setIsLoading(true)
        firestore()
            .collection('posts')
            .doc(postId)
            .delete()
            .then(() => {
                setIsLoading(false)
                Alert.alert(
                    "",
                    "User deleted successfully",
                    [
        
                        {
                            text: "OK",
                            onPress: () => getData(),
                            style: "cancel",
                        },
                    ],
                    {
                        cancelable: true,
                        onDismiss: () =>
                            console.log("This alert was dismissed by tapping outside of the alert dialog."
                            )
                    }
                );
            });
    }
    const _renderList = (item, index) => {

        return (
            <View style={{ flex: 1, marginVertical: 10, padding: 5, margin: 2, borderRadius: 5, borderColor:appBackgroundColor,borderWidth:1 }}>
                <View style={{ flexDirection: 'row', margin: 2 }}>
                    <Image style={{ flex: 1, width: '100%', height: 200, borderRadius: 5 }}
                        source={{uri:item.profilePicture} }

                    ></Image>
                    <View style={{ flex: 1, padding: 5, justifyContent: 'space-evenly' }}>
                        <Text style={styles.title}>Name - {item.name}</Text>
                        <Text  style={styles.title}>Phone - {item.phone}</Text>
                        <Text  style={styles.title}>Type - {item.type ==0?'Personal':'Office'}</Text>
                        <Text  style={styles.title}>IsWhatsapp - {item.isWhatsapp == true ? 'Yes' : 'No'}</Text>
                    </View>

                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', }}>
                    <TouchableOpacity style={styles.button} onPress={() => showAlert(item.id)}>
                        <Text allowFontScaling={false} style={{ textAlign: "center", fontSize: 24, }}>Delete</Text>

                    </TouchableOpacity>

                    <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('EditCustomer',item)}>
                        <Text allowFontScaling={false} style={{ textAlign: "center", fontSize: 24, }}>Edit</Text>

                    </TouchableOpacity>
                </View>
            </View>

        )
    }


    return (
        <Fragment>
            <SafeAreaView style={{ flex: 0, }} />
            <SafeAreaView style={{ flex: 1, }}>
            {isLoading ? <Loader2 /> : null}

                <KeyboardAvoidingView behavior="height" enabled style={styles.container} keyboardVerticalOffset={20}>

                    <ScrollView style={{ flex: 1, }}>
                        <StatusBar barStyle="dark-content" />


                        {customerData.length != 0 ?
                            <FlatList
                                style={{ marginTop: 10 }}
                                data={customerData}
                                extraData={customerData}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={({ item, index }) => _renderList(item, index)}
                            />
                            :
                            <View style={{ alignSelf: 'center', justifyContent: 'center', flex: 1, }}>
                                <Text allowFontScaling={false} style={{ textAlign: "center", fontSize: 24, }}>No Data Found</Text>
                                <TouchableOpacity onPress={() => navigation.navigate('AddCustomer')}>
                                    <Text allowFontScaling={false} style={{ textAlign: "center", fontSize: 24, }}>Add New Customer</Text>

                                </TouchableOpacity>
                            </View>}
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
    title: {
        fontSize: 20,
       
        
    },
    button: {
        backgroundColor: appBackgroundColor,
        color: '#fff',
        width: '45%',
        padding: 5,
        borderRadius: 50,
    },
    buttonText: {
        color: '#fff',
    },


});
