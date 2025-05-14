import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Video from 'react-native-video';
import { AntDesign } from '@expo/vector-icons';

const VideoTag = ({
  src,
  blurred,
  last,
  altText = "Video not available",
  className = "",
  ...props
}) => {
  const [blur, setBlur] = useState(blurred);

    return (
        <View className={`relative ${blur ? "overflow-hidden" : ""}`}>
            <Video
                source={{ uri: src }}
                className={`w-full h-52 rounded-lg ${blur ? "blur-md" : ""} ${className}`}
                resizeMode="contain"
                controls={!blur}
                paused={true}
                {...props}
            />

            {blur && !last && (
                <View className="absolute inset-0 bg-black/50 flex-row items-center justify-center">
                    <Text className="text-white font-semibold text-lg">Video is blurred</Text>
                    <TouchableOpacity onPress={() => setBlur(prev => !prev)} className="mx-2">
                        <AntDesign name="eye" onPress={()=>setBlur(prev=>!prev)} className="mx-2" />
                    </TouchableOpacity>
                </View>
            )}

            {last && (
                <View className="absolute inset-0 bg-black/50 flex-row items-center justify-center">
                    <Text className="text-white font-semibold text-lg">View all ...</Text>
                    <AntDesign name="arrowright" className="mx-2" />
                </View>
            )}
        </View>
    );
};

export default VideoTag;
