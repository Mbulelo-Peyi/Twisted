import { View, Text, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { useAxios, } from './comps';
import { useQuery } from '@tanstack/react-query';
import { useNavigation } from '@react-navigation/native';

const UserHeader = ({user}) => {
    const navigation = useNavigation();
    const api = useAxios();
    const fetchInterval = 1000*60*15
    const userQuery = useQuery({
        queryKey: ['user'],
        queryFn: ()=> getUser(),
        refetchInterval: fetchInterval,
    });
    const profilePictureQuery = useQuery({
        queryKey: ['user_profile_picture', user?.id],
        queryFn: () => getProfilePicture(),
        refetchInterval: fetchInterval,
    });
    const getUser = async () => {
        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
        };
        try {
            const response = await api.get(`/user/api/profile/${user?.id}`, config);
            return response.data;
        } catch (error) {
            console.log('Error getting profile:', error);
        }
    };

    const getProfilePicture = async () => {
        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
        };
        try {
            const response = await api.get(
                `user/api/profile/${user?.id}/current_profile_picture/`,
                config
            );
            return response.data;
        } catch (error) {
            console.log('Error getting profile:', error);
        }
    };

    return (
        <View className="w-full h-48 justify-center items-center bg-[#1ebefe] pt-7">
            <TouchableOpacity className="justify-center items-center" onPress={()=>navigation.navigate("AuthPath",{screen:"profile", params:{user_id:user?.id}})}>
                <Image
                className="rounded-full relative h-24 w-24 mb-3"
                source={{
                    uri: profilePictureQuery.data?.picture_url || userQuery.data?.image,
                  }}
                alt={userQuery.data?.username}
                />
            
                <Text className="text-lg font-bold text-blue-50 mb-2">
                    {userQuery.data?.username}
                </Text>
            </TouchableOpacity>
        </View>
    )
}

export default UserHeader;