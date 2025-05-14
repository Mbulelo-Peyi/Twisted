import React from 'react';
import { useAxios } from '.';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { Text, TouchableOpacity, View } from 'react-native';

const CommentReplyButtons = ({ commentReply }) => {
    const api = useAxios();
    const queryClient = useQueryClient();
    const fetchInterval = 1000*60*10;
    const commentReplyLikesQuery = useQuery({
        queryKey: ['comment-reply-likes', commentReply?.id],
        queryFn: ()=> getcommentReplyLikes(),
        refetchInterval: fetchInterval,
    });
    const commentReplyDislikesQuery = useQuery({
        queryKey: ['comment-reply-dislikes', commentReply?.id],
        queryFn: ()=> getcommentReplyDisikes(),
        refetchInterval: fetchInterval,
    });

    const likeCommentReplyMutation = useMutation({
        mutationFn: ()=> likeCommentReply(),
        onSuccess : ()=> {
            queryClient.invalidateQueries(['comment-reply-likes', commentReply?.id]);
        },
    });

    const dislikeCommentReplyMutation = useMutation({
        mutationFn: ()=> dislikeCommentReply(),
        onSuccess : ()=> {
            queryClient.invalidateQueries(['comment-reply-dislikes', commentReply?.id]);
        },
    });


    const getcommentReplyLikes = async () =>{
        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        };
        try {
            const response = await api.get(
                `/content/api/comment-replys/${commentReply?.id}/like_count/`,
                config
            )
            return response.data;
        } catch (error) {
            return error;
        }
    };

    const getcommentReplyDisikes = async () =>{
        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        };
        try {
            const response = await api.get(
                `/content/api/comment-replys/${commentReply?.id}/dislike_count/`,
                config
            )
            return response.data;
        } catch (error) {
            return error;
        }
    };

    const likeCommentReply = async () =>{
        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        };
        try {
            const response = await api.post(
                `/content/api/comment-replys/${commentReply?.id}/like/`,
                config
            )
            return response.data;
        } catch (error) {
            return error;
        }
    };

    const dislikeCommentReply = async () =>{
        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        };
        try {
            const response = await api.post(
                `/content/api/comment-replys/${commentReply?.id}/dislike/`,
                config
            )
            return response.data;
        } catch (error) {
            return error;
        }
    };


    return (
        <View className="mt-2 flex items-center space-x-4 text-sm text-gray-600">
            <TouchableOpacity
            disabled={likeCommentReplyMutation.isPending||dislikeCommentReplyMutation.isPending}
            onPress={() =>likeCommentReplyMutation.mutate()}
            className="flex items-center space-x-1 hover:text-blue-500"
            >
                <Text>👍</Text>
                <Text>{commentReplyLikesQuery.data?.like_count}</Text>
            </TouchableOpacity>
            <TouchableOpacity
            disabled={likeCommentReplyMutation.isPending||dislikeCommentReplyMutation.isPending}
            onPress={() =>dislikeCommentReplyMutation.mutate()}
            className="flex items-center space-x-1 hover:text-red-500"
            >
                <Text>👎</Text>
                <Text>{commentReplyDislikesQuery.data?.dislike_count}</Text>
            </TouchableOpacity>
        </View>
    )
}

export default CommentReplyButtons