import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAxios } from '.';
import { TouchableOpacity, View } from 'react-native';

const FriendShipButton = ({ type, id }) => {
    const queryClient = useQueryClient();
    const api = useAxios();
    const acceptMutation = useMutation({
        mutationFn: (variables)=> acceptRequest(variables),
        onSuccess : ()=> {
            queryClient.invalidateQueries(['friends', 'infinite']);
        },
    });
    const rejectMutation = useMutation({
        mutationFn: (variables)=> rejectRequest(variables),
        onSuccess : ()=> {
            queryClient.invalidateQueries(['friends', 'infinite']);
        },
    });
    const cancelMutation = useMutation({
        mutationFn: (variables)=> cancelRequest(variables),
        onSuccess : ()=> {
            queryClient.invalidateQueries(['friends', 'infinite']);
        },
    });
    const acceptRequest = async (id) =>{
        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        };
        try {
            const response = await api.post(
                `/user/api/profile/${id}/accept_friend_request/`,
                config
            )
            return response.data;
        } catch (error) {
            return error;
        }
    };

    const rejectRequest = async (id) =>{
        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        };
        try {
            const response = await api.post(
                `/user/api/profile/${id}/reject_friend_request/`,
                config
            )
            return response.data;
        } catch (error) {
            return error;
        }
    };

    const cancelRequest = async (id) =>{
        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        };
        try {
            const response = await api.post(
                `/user/api/profile/${id}/send_friend_request/`,
                config
            )
            return response.data;
        } catch (error) {
            return error;
        }
    };

    return (
        <React.Fragment>
            {type==="pending" ? (
                <TouchableOpacity
                disabled={cancelMutation.isPending}
                onPress={()=>cancelMutation.mutate(id)} 
                className={`px-4 py-2 bg-blue-500 rounded-lg hover:bg-blue-400 ${cancelMutation.isPending?"animate-bounce":"animate-none"}`}
                >
                    <Text className="text-white">Pending</Text>
                </TouchableOpacity>
            ):type==="requests" ?(
                <View className="flex flex-row justify-center items-center space-x-1">
                    <TouchableOpacity
                    disabled={acceptMutation.isPending}
                    onPress={()=>acceptMutation.mutate(id)} 
                    className={`px-4 py-2 bg-blue-500 rounded-lg hover:bg-blue-400 ${acceptMutation.isPending?"animate-bounce":"animate-none"}`}
                    >
                        <Text className="text-white">Accept</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                    disabled={rejectMutation.isPending}
                    onPress={()=>rejectMutation.mutate(id)} 
                    className={`px-4 py-2 bg-blue-500 rounded-lg hover:bg-blue-400 ${rejectMutation.isPending?"animate-bounce":"animate-none"}`}
                    >
                        <Text className="text-white">Reject</Text>
                    </TouchableOpacity>
                </View>
            ):(
                <></>
            )}
        </React.Fragment>
    ) 
}

export default FriendShipButton