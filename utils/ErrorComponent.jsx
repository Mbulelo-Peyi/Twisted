import React from 'react';
import { View,Text, SafeAreaView } from 'react-native';


const ErrorComponent = ({error}) =>{
    console.log(error)
    return (
        <SafeAreaView>
            <Text>{error.message}</Text>
        </SafeAreaView>
    )
};

export default ErrorComponent;