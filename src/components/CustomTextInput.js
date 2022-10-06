import React, { Component } from 'react';
import { TextInput, Image, View, Dimensions, Keyboard } from "react-native";
import PropTypes from 'prop-types';
import { calcWidth, calcHeight, } from '../components/responsive'
import { appBackgroundColor, textInputColor } from "../components/colors";

const { width, height } = Dimensions.get('window')

export default class CustomeTextInput extends Component {




    static propTypes = {
        title: PropTypes.string,
        subTitle: PropTypes.string,

    }
    static defaultProps = {
        title: '',
        subTitle: ''
    }


    render() {
        return (
            <View style={{ paddingBottom: 15, }}>
                <View style={{ height: 50, width: '100%', backgroundColor: textInputColor, borderRadius: 25, alignSelf: 'center', flexDirection: 'row', }}>

                    <View style={{ width: 50, height: 50, borderRadius: 25, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center' }}>
                        <Image style={{ width: 25, height: 25, resizeMode: 'contain', backgroundColor: 'white', alignSelf: 'center', justifyContent: 'center' }} source={this.props.icon} ></Image>
                    </View>
                    <TextInput   {...this.props}

                        style={{

                            width: calcWidth(90) - 110,
                            padding: 5,
                            color: 'white',

                            fontSize: 17,

                            textAlign: 'center',
                            textAlignVertical: 'center',
                            ...this.props.style,
                        }}
                        onSubmitEditing={Keyboard.dismiss}
                        autoCorrect={false}
                        returnKeyLabel="Done"
                        returnKeyType="done"
                        allowFontScaling={false}

                        placeholderTextColor={'white'}
                        autoCapitalize={'none'}



                        underlineColorAndroid="transparent"
                        underlineColor="#000000"
                        selectionColor={'#000000'}
                        fontWeight={'400'}


                        maxLength={200}

                    />
                    {this.props.arrow ?
                        <Image style={{ marginLeft: 10, width: 15, height: 15, resizeMode: 'contain', alignSelf: 'center', justifyContent: 'center' }} source={arrowIcon} ></Image>
                        : null}
                </View>
            </View>
        );
    }
}