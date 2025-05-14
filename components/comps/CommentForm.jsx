import React, { useState } from 'react';
import { useAxios } from '.';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { TextInput, TouchableOpacity, KeyboardAvoidingView, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';

const CommentForm = ({ post }) => {
    const [commentText, setCommentText] = useState("");
    const api = useAxios();
    const queryClient = useQueryClient();
    const commentMutation = useMutation({
        mutationFn: (variables)=> postComment(variables),
        onSuccess : ()=> {
            setCommentText("");
            queryClient.invalidateQueries(['comments', post?.id, 'infinite']);
        },
    });

    // Add a comment to the post
    const handleCommentSubmit = () => {
        if (commentText.trim() === "") return;
        const formData = new FormData();
        formData.append("post_id", post?.id);
        formData.append("content", commentText);
        commentMutation.mutate(formData);
    };

    const postComment = async (formData) =>{
        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        };
        try {
            const response = await api.post(
                `/content/api/comment/`,
                formData,
                config
            )
            return response.data;
        } catch (error) {
            console.error(error)
            return error;
        }
    };

    return (
        <KeyboardAvoidingView className="mt-4">
            <TextInput
            placeholder="Write a comment..."
            value={commentText}
            inputMode="text"
            onChangeText={(e) => setCommentText(e)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            ></TextInput>
            <TouchableOpacity
            disabled={commentMutation.isPending}
            onPress={handleCommentSubmit} 
            className="flex flex-row justify-center space-x-2 bg-blue-500 px-4 py-2 rounded-lg"
            >
                <Text className="text-white">Add Comment</Text>
                <Feather name="send" color={"#fff"} size={24} />
            </TouchableOpacity>
        </KeyboardAvoidingView>
    )
}

export default CommentForm