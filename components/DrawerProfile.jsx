import { SafeAreaView, View, Text, Image, TouchableOpacity } from 'react-native';
import React, { useContext } from 'react';
import { DrawerItemList } from '@react-navigation/drawer';
import UserHeader from './UserHeader';
import AuthContext from '../context/AuthContext';


const DrawerProfile = ({props}) => {
    const { user } = useContext(AuthContext);

    return (
        <SafeAreaView>
            {user?.id ? (
                <UserHeader user={user} />
            ):(
                <View className="w-full h-48 justify-center items-center bg-[#1ebefe] pt-7">
                    <TouchableOpacity className="justify-center items-center">
                        <Text className="text-lg font-bold text-blue-50 mb-2">
                        </Text>
                    </TouchableOpacity>
                </View>
            )}
            <DrawerItemList {...props} />
        </SafeAreaView>
    )
}

export default DrawerProfile;