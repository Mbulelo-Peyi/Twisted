import React from 'react';
import { useAxios } from "./";
import { useQuery } from '@tanstack/react-query';
import { Image, Text, View } from 'react-native';

const CommunityHeader = ({ community_id }) => {
    const api = useAxios();
    const fetchInterval = 1000*60*10;

    const communityQuery = useQuery({
        queryKey: ['community', community_id],
        queryFn: ()=> getCommunity(),
        refetchInterval: fetchInterval,
    });

    const getCommunity = async () =>{
        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        };
        try {
            const response = await api.get(
                `/user/api/community/${community_id}/`,
                config
            )
            return response.data;
        } catch (error) {
            return error;
        }
    };
    return (
        <View className="relative">
            <Image
                src={communityQuery.data?.cover_image}
                alt="Community Cover"
                className="w-full h-64 object-cover"
            />
            <View className="absolute bottom-4 left-4 text-white">
                <Text className="text-3xl font-bold">{communityQuery.data?.name}</Text>
                <Text>{communityQuery.data?.description}</Text>
                <Text className="mt-2">Members: {communityQuery.data?.members_count}</Text>
            </View>
        </View>
    )
}

export default CommunityHeader