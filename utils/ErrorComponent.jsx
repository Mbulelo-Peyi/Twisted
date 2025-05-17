import React from 'react';
import { View,Text, SafeAreaView } from 'react-native';


const ErrorComponent = ({error}) =>{
    return (
        <SafeAreaView style={{justifyContent:"center",alignItems:"center"}}>
            <Text>{error.message}</Text>
        </SafeAreaView>
    )
};

export default ErrorComponent;