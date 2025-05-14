import React, { useContext, useState } from 'react';
import { useAxios, AuthContext } from '.';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { KeyboardAvoidingView, TextInput, TouchableOpacity, View, Text } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

const CommentOptions = ({ comment }) => {
    const { user } = useContext(AuthContext);
    const [edit, setEdit] = useState(false);
    const [commentText, setCommentText] = useState(comment?.content);
    const api = useAxios();
    const queryClient = useQueryClient();

    const commentUpdateMutation = useMutation({
        mutationFn: (variables)=> updateComment(variables),
        onSuccess : ()=> {
            setEdit(prev=>!prev)
            queryClient.invalidateQueries(['comments', comment?.post?.id, 'infinite']);
        },
    });

    const commentDeleteMutation = useMutation({
        mutationFn: ()=> deleteComment(),
        onSuccess : ()=> {
            setEdit(prev=>!prev)
            queryClient.removeQueries(['comment-likes', comment?.id]);
            queryClient.removeQueries(['comment-dislikes', comment?.id]);
            queryClient.removeQueries(['comment-replys', comment?.id, 'infinite']);
            queryClient.removeQueries(['comments', comment?.post?.id, 'infinite']);
        },
    });

    // update a comment to the post
    const handleCommentUpdate = () => {
        if (commentText.trim() === "") return;
        const formData = new FormData();
        formData.append("post", comment?.post?.id);
        formData.append("user", user?.id);
        formData.append("content", commentText);
        commentUpdateMutation.mutate(formData);
    };

    const updateComment = async (formData) =>{
        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        };
        try {
            const response = await api.put(
                `/content/api/comment/${comment?.id}/`,
                formData,
                config
            )
            return response.data;
        } catch (error) {
            console.error(error)
            return error;
        }
    };

    const deleteComment = async () =>{
        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        };
        try {
            const response = await api.delete(
                `/content/api/comment/${comment?.id}/`,
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
            {user?.id === comment?.user?.id ? (
                <View className="flex justify-between items-center z-10">
                    {edit ? (
                        <KeyboardAvoidingView className="mt-2">
                            <TextInput
                            inputMode="text"
                            placeholder="Write a comment..."
                            value={commentText}
                            onChangeText={(e) => setCommentText(e)}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <View>
                                <TouchableOpacity
                                disabled={commentUpdateMutation.isPending}
                                onPress={handleCommentUpdate} 
                                className="bg-blue-500 px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                                >
                                    <Text className="text-white">Comment Update</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                disabled={commentDeleteMutation.isPending}
                                type="button"
                                onPress={()=>commentDeleteMutation.mutate()}
                                className="bg-red-400 px-4 py-2 rounded-lg hover:bg-red-600 transition"
                                >
                                    <Text className="text-white">Delete Comment</Text>
                                </TouchableOpacity>
                            </View>
                        </KeyboardAvoidingView>
                    ):(
                        <Text>{comment?.content}</Text>
                    )}
                    <AntDesign name="edit" size={16} onPress={()=>setEdit(prev=>!prev)} />
                </View>
            ):(
                <Text>{comment?.content}</Text>
            )}
        </React.Fragment>
    )
}

export default CommentOptions