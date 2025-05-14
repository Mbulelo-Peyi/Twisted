import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAxios } from "./";
import { Text, TouchableOpacity, View } from 'react-native';
import { Entypo } from '@expo/vector-icons';

const ShareButton = ({ postQuery }) => {
    const api = useAxios();
    const queryClient = useQueryClient();
    const fetchInterval = 1000*60*10;

    const shareCountQuery = useQuery({
        queryKey: ['share-count', postQuery?.id],
        queryFn: ()=> getShareCount(),
        refetchInterval: fetchInterval,
    });

    const shareMutation = useMutation({
        mutationFn: (variables)=> handleShare(variables),
        onSuccess : ()=> {
            queryClient.invalidateQueries(['share-count', postQuery?.id]);
        },
    })

    // check to see for theres a share count
    const getShareCount = async () =>{
        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        };
        try {
            const response =  await api.get(
                `/content/api/posts/${postQuery?.id}/share_count/`,
                config
            )
            return response.data;
        } catch (error) {
            return error;
        }
    };

    // Handle shares
    const handleShare = async() => {
        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        };
        try {
            const response = await api.post(
                `/content/api/posts/${postQuery?.id}/share_post/`,
                config
            )
            return response.data;
        } catch (error) {
            
        }
    };

    return (
        <View className="mt-4 flex flex-row items-center space-x-2">
            {!shareCountQuery.isLoading ? (
                <React.Fragment>
                    <TouchableOpacity
                    disabled={shareMutation.isPending}
                    className="bg-gray-200 p-2 rounded-lg hover:bg-inherit transition"
                    onPress={() => shareMutation.mutate()}
                    >
                        <Entypo size={20} name="share" />
                    </TouchableOpacity>
                    <View className="flex space-x-2 justify-center">
                        <Text
                        className="bg-gray-100 px-2 rounded-full text-sm"
                        >
                            {shareCountQuery.data?.share_count}
                        </Text>
                    </View>
                </React.Fragment>
            ):(
                <></>
            )}
        </View>
    )
}

export default ShareButton