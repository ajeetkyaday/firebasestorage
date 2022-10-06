import * as React from 'react';
import {Button, Text} from 'react-native'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import CustomerList from '../CustomerList'
import AddCustomer from '../AddCustomer'
import EditCustomer from '../EditCustomer'


const Stack = createStackNavigator();



export const AppContainer = () => {
    return (

        <NavigationContainer>
            <Stack.Navigator
                initialRouteName='CustomerList'
                
               
                headerShown = {true}
                screenOptions={{
                    headerShown: true
                  }}

            >

                {/* <Stack.Screen name="StartScreen" component={StartScreen} /> */}
                <Stack.Screen name="CustomerList" component={CustomerList} options={{
       
        }} />

                <Stack.Screen name="AddCustomer" component={AddCustomer} />
                <Stack.Screen name="EditCustomer" component={EditCustomer} />

        
               
                
                
        </Stack.Navigator>
        </NavigationContainer>

    );
}
