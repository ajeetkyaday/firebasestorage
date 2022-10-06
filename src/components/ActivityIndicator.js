import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Modal, ActivityIndicator, Dimensions, Image, StyleSheet, Linking,Alert } from 'react-native';


import { appBackgroundColor,appPurpleColor,  } from './colors';
import { calcWidth, calcHeight, appRegularFont,appSemiBoldFont } from './responsive';
const { width, height } = Dimensions.get('window')

export const Loader2 = () => {
    return (
        <View style={{
            position: 'relative'
        }}>
            <Modal
                animationType='fade'
                transparent={true}
                visible={true}>
                <View style={{
                    alignItems: 'center', justifyContent: 'center', alignSelf: 'center', marginVertical: calcHeight(100) / 2.2,
                    width: 72, height: 72,
                    backgroundColor: 'white',
                    borderRadius: 5,
                    shadowColor: "#000",
                    shadowOffset: {
                        width: 0,
                        height: 10,
                    },
                    shadowOpacity: 0.46,
                    shadowRadius: 11.14,
                    elevation: 17,
                }}>
                    <ActivityIndicator size='large' color={appPurpleColor}
                        style={{ alignSelf: 'center', }} />
                </View>
            </Modal>

        </View>
    );
};