import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAxios } from '.';
import { Text, TouchableOpacity } from 'react-native';

const CommunityButton = ({ id, community_id }) => {
    const queryClient = useQueryClient();
    const api = useAxios();
    const removeMutation = useMutation({
        mutationFn: (variables)=> removeMember(variables),
        onSuccess : ()=> {
            queryClient.invalidateQueries(['community-members', community_id, 'infinite']);
        },
    });
    const removeMember = async (id) =>{
        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        };
        try {
            const response = await api.post(
                `/user/api/community/${id}/remove_member/`,
                config
            )
            return response.data;
        } catch (error) {
            return error;
        }
    };
    return (
        <TouchableOpacity
        disabled={removeMutation.isPending}
        onPress={()=>removeMutation.mutate(id)}
        className={`px-4 py-2 bg-blue-500 rounded-lg ${removeMutation.isPending?"animate-bounce":"animate-none"}`}
        >
            <Text className="text-white">remove</Text>
        </TouchableOpacity>
    )
}

export default CommunityButton