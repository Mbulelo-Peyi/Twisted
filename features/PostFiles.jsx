import { FontAwesome } from '@expo/vector-icons';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import Video from 'react-native-video';

const PostFiles = ({ file, index, handlePopFile }) => {
    return (
        <React.Fragment>
            <TouchableOpacity 
                onPress={() => handlePopFile(index)} 
                className="relative -top-2 h-fit w-auto left-8 rounded-full bg-teal-100"
            >
                <FontAwesome name="circle-o" />
            </TouchableOpacity>

            {file?.type.startsWith("image/") ? (
                <Image
                    source={{ uri: file.uri }}
                    className="w-20 h-20 object-cover rounded-md mx-4"
                />
            ) : file?.type.startsWith("video/") ? (
                <Video
                    source={{ uri: file.uri }}
                    className="w-20 h-20 object-cover rounded-md mx-4"
                    resizeMode="cover"
                    controls
                    paused={true}
                />
            ) : (
                <Text className="text-gray-700 text-sm truncate">
                    {file?.name}
                </Text>
            )}
        </React.Fragment>
    );
};

export default PostFiles;
