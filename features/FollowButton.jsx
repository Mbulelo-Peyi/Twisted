import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAxios } from '.';
import { Text, TouchableOpacity } from 'react-native';

const FollowButton = ({ type, id }) => {
    const queryClient = useQueryClient();
    const api = useAxios();
    const unfollowMutation = useMutation({
        mutationFn: (variables)=> unfollow(variables),
        onSuccess : ()=> {
            queryClient.invalidateQueries(['followers', 'infinite']);
        },
    });
    const unfollow = async (id) =>{
        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        };
        try {
            const response = await api.post(
                `/user/api/profile/${id}/follow/`,
                config
            )
            return response.data;
        } catch (error) {
            return error;
        }
    };

    return (
        <React.Fragment>
            {type==="followers" ? (
                <Text className="px-4 py-2 bg-blue-300 text-white rounded-lg">
                    Following
                </Text>
            ):(
                <TouchableOpacity
                disabled={unfollowMutation.isPending}
                onPress={()=>unfollowMutation.mutate(id)}
                className={`px-4 py-2 bg-blue-500 rounded-lg ${unfollowMutation.isPending?"animate-bounce":"animate-none"}`}
                >
                    <Text className="text-white">Unfollow</Text>
                </TouchableOpacity>
            )}
        </React.Fragment>
    )
}

export default FollowButton