import { View, Text, Image } from 'react-native';
import React from 'react';

const MessageCard = ({ message, user }) => {
    return (
        <View className={`flex space-x-4 ${user?.id === message?.sender?.id ? "flex-row-reverse content-center justify-start":"items-end"}`}>
            {/* User Avatar */}
            <Image
                source={{
                    uri:message?.sender?.profile_pic?.length>0?
                    message?.sender?.profile_pic?.filter((pic)=>pic.is_active)[0]?.picture:
                    message?.sender?.image
                    }}
                alt={`${message?.sender?.username}'s avatar`}
                className="w-10 h-10 rounded-full"
            />
            <View className="flex flex-col bg-gray-100 p-3 rounded-lg shadow-sm space-y-2">
                {/* Message Text */}
                {message?.content && <Text className="text-gray-800">{message?.content}</Text>}



                {/* Timestamp */}
                <Text className="text-sm text-gray-500">
                    Sent at: {message?.timesince}
                </Text>

            </View>
        </View>
    )
}

export default MessageCard