import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

const CommunityCard = ({ community }) => {
    const navigation = useNavigation();
    return (
        <View className="bg-white border p-4 border-slate-200">
            <View className="flex flex-row space-x-4">
                <TouchableOpacity onPress={()=>navigation.navigate("community", {community_id:community?.id})}>
                    <View>
                        <Image
                        style={{borderWidth:1,backgroundColor:'#F3F3F4'}}
                        src={community?.logo}
                        alt={community?.name}
                        className="h-28 w-28 bg-gray-300"
                        />
                    </View>
                </TouchableOpacity>
                <View className="flex flex-col flex-1 pr-2">
                    <Text className="text-lg font-semibold mb-1">{community?.name}</Text>
                    <Text className="text-gray-700">{community?.members_count>1?"Members":"Member"}: {community?.members_count}</Text>
                    {!community?.is_private &&(
                        <Text className="text-gray-700 mt-2">
                            Join
                        </Text>
                    )}
                </View>
                
            </View>
        </View>
    )
}

export default CommunityCard