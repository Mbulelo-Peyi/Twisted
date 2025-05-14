import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAxios } from "./";
import { KeyboardAvoidingView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons';

const PostComment = ({ post }) => {
    const [commentText, setCommentText] = useState("");
    const api = useAxios();
    const navigation = useNavigation();
    const queryClient = useQueryClient();
    const fetchInterval = 1000*60*10;

    const commentCountQuery = useQuery({
        queryKey: ['comment-count', post?.id],
        queryFn: ()=> getCommentCount(),
        refetchInterval: fetchInterval,
    });

    const commentMutation = useMutation({
        mutationFn: (variables)=> postComment(variables),
        onSuccess : ()=> {
            queryClient.invalidateQueries(['comment', post?.id]);
            queryClient.invalidateQueries(['comment-count', post?.id]);
            navigation.navigate("post",{post_id:post?.id});
        },
    })

    // check to see for theres a comment count
    const getCommentCount = async () =>{
        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        };
        try {
            const response =  await api.get(
                `/content/api/posts/${post?.id}/comment_count/`,
                config
            )
            return response.data;
        } catch (error) {
            return error;
        }
    };

    // Handle comments
    const handleCommentSubmit = async() => {
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
            
        }
    };

    return (
        <View className="flex flex-row items-baseline mr-5">
            {!commentCountQuery.isLoading && (
                <KeyboardAvoidingView className="mt-4 flex flex-row justify-center space-x-1 items-center">
                    <TextInput
                    placeholder="Write a comment..."
                    value={commentText}
                    onChangeText={(e) => setCommentText(e)}
                    className="border border-gray-300 rounded-lg px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    ></TextInput>
                    <TouchableOpacity
                    disabled={commentMutation.isPending}
                    onPress={handleCommentSubmit} 
                    className="bg-blue-500 px-2 py-2 rounded-lg"
                    >
                        <Text className="text-white"><Ionicons name="chatbox" size={16}/></Text>
                    </TouchableOpacity>
                </KeyboardAvoidingView>
            )}
        </View>
    )
}

export default PostComment;