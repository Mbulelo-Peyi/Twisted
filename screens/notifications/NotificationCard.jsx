import React from 'react';
import { Text, View } from 'react-native';

const NotificationCard = ({ notification }) => {
    return (
        <View className="bg-white border p-4 border-slate-200">
            <View className="flex flex-row">
                <View className={`flex flex-col flex-1 pr-2 ${notification?.unread?"bg-green-400":"bg-blue-100"}`}>
                    <Text className={`${notification?.unread?"text-slate-950":"text-gray-400 "}`}>{notification?.verb}</Text>
                </View>
            </View>
        </View>
    )
}

export default NotificationCard;
