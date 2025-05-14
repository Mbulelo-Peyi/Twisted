import React, { useState, useContext } from 'react';
import { useAxios, AuthContext } from '.';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { KeyboardAvoidingView, TextInput, TouchableOpacity, Text } from 'react-native';

const CommentReplyForm = ({ comment }) => {
    const { user } = useContext(AuthContext);
    const [commentReplyText, setCommentReplyText] = useState("");
    const api = useAxios();
    const queryClient = useQueryClient();
    const commentReplyMutation = useMutation({
        mutationFn: (variables)=> postCommentReply(variables),
        onSuccess : ()=> {
            setCommentReplyText("");
            queryClient.invalidateQueries(['comments', comment?.post?.id, 'infinite']);
        },
    });

    // Add a comment-reply to the comment
    const handleCommentReplySubmit = () => {
        if (commentReplyText.trim() === "") return;
        const formData = new FormData();
        formData.append("comment", comment?.id);
        formData.append("user", user?.id);
        formData.append("content", commentReplyText);
        commentReplyMutation.mutate(formData);
    };

    const postCommentReply = async (formData) =>{
        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        };
        try {
            const response = await api.post(
                `/content/api/comment-reply/`,
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
        <KeyboardAvoidingView className="mt-2">
            <TextInput
            inputMode="text"
            placeholder="Write a comment..."
            value={commentReplyText}
            onChangeText={(e) => setCommentReplyText(e)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <TouchableOpacity
            disabled={commentReplyMutation.isPending}
            onPress={handleCommentReplySubmit} 
            className="bg-blue-500 px-4 py-2 rounded-lg"
            >
                <Text className="text-white">Comment Reply</Text>
            </TouchableOpacity>
        </KeyboardAvoidingView>
    )
}

export default CommentReplyForm