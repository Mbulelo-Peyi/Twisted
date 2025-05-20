import React, { useState } from 'react';
import { Image, Text, View } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
const ImageTag = ({ src, blurred, last, single, alt = "Image not available", className = "", ...props }) => {
    const [blur, setBlur] = useState(blurred);
    return (
        <View className={`relative ${blur ? "overflow-hidden" : ""}`}>
            <Image
            className={`w-full h-auto rounded-lg ${blur ? "blur-md" : ""} ${className}`}
            source={{uri:src}}
            alt={alt}
            {...props}
            />
            {!single &&(
                <React.Fragment>
                    {blur && !last && (
                        <View className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <Text className="text-white font-semibold text-lg">Image is blurred</Text>
                            <AntDesign name="eye" onPress={()=>setBlur(prev=>!prev)} className="mx-2" />
                        </View>
                    )}
                    {last && (
                        <View className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <Text className="text-white font-semibold text-lg">more</Text>
                            <AntDesign name="arrowright" className="mx-2" />
                        </View>
                    )}
                </React.Fragment>
            )}
        </View>
    );
};

export default ImageTag;
