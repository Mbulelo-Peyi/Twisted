import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';

const SettingsOption = ({ icon, title, info, link, user_id }) => {
    const navigation = useNavigation();
    const screen = ()=> user_id?navigation.navigate(link, { user_id: user_id }):navigation.navigate(link);
    return (
        <TouchableOpacity className="group relative flex flex-row gap-x-6 rounded-lg p-4 hover:bg-gray-50" onPress={screen}>
            <View className="mt-1 flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
                {icon}
            </View>
            <View>
                <View>
                    <Text  className="font-semibold text-gray-900">{title}</Text>
                    <View className="relative inset-0"></View>
                </View>
                <Text className="mt-1 text-gray-600">{info}</Text>
            </View>
        </TouchableOpacity>
    )
}

export default SettingsOption;