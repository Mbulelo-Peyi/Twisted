import React, { useState, useContext } from 'react';
import { useAxios, AuthContext } from '.';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { KeyboardAvoidingView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const CommentReplyOptions = ({ commentReply }) => {
    const { user } = useContext(AuthContext);
    const [commentReplyText, setCommentReplyText] = useState(commentReply?.content);
    const [edit, setEdit] = useState(false);
    const api = useAxios();
    const queryClient = useQueryClient();

    const commentUpdateReplyMutation = useMutation({
        mutationFn: (variables)=> updateCommentReply(variables),
        onSuccess : ()=> {
            setEdit(prev=>!prev)
            queryClient.invalidateQueries(['comments', commentReply?.comment?.post?.id, 'infinite']);
        },
    });

    const commentReplyDeleteMutation = useMutation({
        mutationFn: ()=> deleteCommentReply(),
        onSuccess : ()=> {
            setEdit(prev=>!prev)
            queryClient.removeQueries(['comment-reply-likes', commentReply?.id]);
            queryClient.removeQueries(['comment-reply-dislikes', commentReply?.id]);
            queryClient.removeQueries(['comments', commentReply?.comment?.post?.id, 'infinite']);
        },
    });


    // Add a comment-reply to the comment
    const handleCommentReplyUpdate = () => {
        if (commentReplyText.trim() === "") return;
        const formData = new FormData();
        formData.append("comment", commentReply?.comment?.id);
        formData.append("user", user?.id);
        formData.append("content", commentReplyText);
        commentUpdateReplyMutation.mutate(formData);
    };

    const updateCommentReply = async (formData) =>{
        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        };
        try {
            const response = await api.put(
                `/content/api/comment-reply/${commentReply?.id}/`,
                formData,
                config
            )
            return response.data;
        } catch (error) {
            console.error(error)
            return error;
        }
    };
    
    const deleteCommentReply = async () =>{
        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        };
        try {
            const response = await api.delete(
                `/content/api/comment-reply/${commentReply?.id}/`,
                config
            )
            return response.data;
        } catch (error) {
            console.error(error)
            return error;
        }
    };

    return (
        <React.Fragment>
            {user?.id === commentReply?.user?.id ? (
                <View className="flex flex-row justify-between items-center">
                    {edit ? (
                        <KeyboardAvoidingView className="mt-2">
                            <TextInput
                            inputMode="text"
                            placeholder="Write a comment..."
                            value={commentReplyText}
                            onChangeText={(e) => setCommentReplyText(e)}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <View className="flex flex-row justify-between items-center">
                                <TouchableOpacity
                                disabled={commentUpdateReplyMutation.isPending}
                                onPress={handleCommentReplyUpdate} 
                                className="bg-blue-500 px-4 py-2 rounded-lg"
                                >
                                    <Text className="text-white">Reply Update</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                disabled={commentReplyDeleteMutation.isPending}
                                type="button"
                                onPress={()=>commentReplyDeleteMutation.mutate()}
                                className="bg-red-400 px-4 py-2 rounded-lg"
                                >
                                    <Text className="text-white">Delete Reply</Text>
                                </TouchableOpacity>
                            </View>
                        </KeyboardAvoidingView>
                    ):(
                        <Text>{commentReply?.content}</Text>
                    )}
                    <TouchableOpacity  onPress={()=>setEdit(prev=>!prev)}>
                        <FontAwesome name="clipboard" size={16} />
                    </TouchableOpacity>
                </View>
            ):(
                <Text>{commentReply?.content}</Text>
            )}
        </React.Fragment>
    )
}

export default CommentReplyOptions