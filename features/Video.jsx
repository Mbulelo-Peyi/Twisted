import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import Video from 'react-native-video';

const VideoPlayer = ({ src, blurred, alt, fullScreen, blurEffect }) => {
    return (
        <View className={`relative ${fullScreen ? "w-full h-full" : "w-full h-full"} rounded-lg`}>
            <Video
                source={{ uri: src }}
                className="w-full h-full object-contain rounded-lg"
                resizeMode="contain"
                controls
                paused={true}
            />

            {blurred && (
                <View className="absolute inset-0 bg-black/10 items-center justify-center flex-row">
                    <Text className="text-white font-semibold text-lg">Video is blurred</Text>
                    <TouchableOpacity onPress={blurEffect} className="mx-2">
                        <AntDesign name="eye" />
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

export default VideoPlayer;
