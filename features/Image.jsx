import React from 'react';
import { TouchableOpacity, View, Image as Img, Text } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
const Image = ({ src, blurred, alt, fullScreen, blurEffect }) => {
    return (
        <React.Fragment>
            <Img
            loading="lazy"
            className={`
            ${fullScreen?"w-full h-full object-contain rounded-lg":"w-full h-full object-contain rounded-lg"}${blurred ? "blur-md" : ""}`}
            source={{uri:src}}
            alt={`cover${alt}`}
            />
            {blurred &&(
                <View className="absolute cursor-pointer inset-0 bg-transparent/5 flex items-center justify-center">
                    <Text className="text-white font-semibold text-lg">Image is blurred</Text>
                    <TouchableOpacity onPress={blurEffect} className="mx-2">
                        <AntDesign name="eye" />
                    </TouchableOpacity>
                </View>
            )}
        </React.Fragment>
    );
};

export default Image;
