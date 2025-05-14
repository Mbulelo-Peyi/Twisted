import React from 'react';
import { useAxios } from '.';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { Text, TouchableOpacity, View } from 'react-native';

const CommentButtons = ({ comment }) => {
    const api = useAxios();
    const queryClient = useQueryClient ();
    const fetchInterval = 1000*60*10;
    const commentLikesQuery = useQuery({
        queryKey: ['comment-likes', comment?.id],
        queryFn: ()=> getLikes(),
        refetchInterval: fetchInterval,
    });
    const commentDislikesQuery = useQuery({
        queryKey: ['comment-dislikes', comment?.id],
        queryFn: ()=> getDisikes(),
        refetchInterval: fetchInterval,
    });

    const likeMutation = useMutation({
        mutationFn: ()=> likeComment(),
        onSuccess : ()=> {
            queryClient.invalidateQueries(['comment-likes', comment?.id]);
        },
    });

    const dislikeMutation = useMutation({
        mutationFn: ()=> dislikeComment(),
        onSuccess : ()=> {
            queryClient.invalidateQueries(['comment-dislikes', comment?.id]);
        },
    });


    const getLikes = async () =>{
        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        };
        try {
            const response = await api.get(
                `/content/api/comments/${comment?.id}/like_count/`,
                config
            )
            return response.data;
        } catch (error) {
            return error;
        }
    };

    const getDisikes = async () =>{
        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        };
        try {
            const response = await api.get(
                `/content/api/comments/${comment?.id}/dislike_count/`,
                config
            )
            return response.data;
        } catch (error) {
            return error;
        }
    };

    const likeComment = async () =>{
        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        };
        try {
            const response = await api.post(
                `/content/api/comments/${comment?.id}/like/`,
                config
            )
            return response.data;
        } catch (error) {
            return error;
        }
    };

    const dislikeComment = async () =>{
        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        };
        try {
            const response = await api.post(
                `/content/api/comments/${comment?.id}/dislike/`,
                config
            )
            return response.data;
        } catch (error) {
            return error;
        }
    };

    return (
        <View className="mt-2 flex flex-row items-center space-x-4 text-sm text-gray-600">
            <TouchableOpacity
            disabled={likeMutation.isPending||dislikeMutation.isPending}
            onPress={() =>likeMutation.mutate()}
            className="flex items-center space-x-1 hover:text-blue-500"
            >
                <Text>👍</Text>
                <Text>{commentLikesQuery.data?.like_count}</Text>
            </TouchableOpacity>
            <TouchableOpacity
            disabled={likeMutation.isPending||dislikeMutation.isPending}
            onPress={() =>dislikeMutation.mutate()}
            className="flex items-center space-x-1 hover:text-red-500"
            >
                <Text>👎</Text>
                <Text>{commentDislikesQuery.data?.dislike_count}</Text>
            </TouchableOpacity>
        </View>
    )
}

export default CommentButtons