import React, { useState } from "react";
import { SafeAreaView, TouchableOpacity, View, Text } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import { CommentSection, Reactions, ShareButton, Slide, PostEdit } from "../../components/comps";
import { useAxios } from "../../features/index";
import { useQuery } from "@tanstack/react-query";
import { Modal } from "../../features";





const PostDetail = () => {
    const { params:{post_id} } = useRoute();
    const api = useAxios();
    const fetchInterval = 1000*60*10;
    const [editing, setEditing] = useState(false);
    const detail = true;

    const postQuery = useQuery({
        queryKey: ['post', post_id],
        queryFn: ()=> getPost(),
        refetchInterval: fetchInterval,
    });

    const postPermsQuery = useQuery({
        queryKey: ['post-permissions', postQuery.data?.id],
        queryFn: ()=> getPostPerms(),
        refetchInterval: fetchInterval,
    });

    const getPostPerms = async () =>{
        const config = {
            headers: {
                "Content-Type": "application/json",
            }
        }
        try {
            const response = await api.get(
                `/content/api/post/${post_id}/get_post_author/`,
                config
            )
            return response.data;
        } catch (error) {
            return error;
        }
    };

    const getPost = async () =>{
        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        };
        try {
            const response = await api.get(
                `/content/api/posts/${post_id}/`,
                config
            )
            return response.data;
        } catch (error) {
            return error;
        }
    };

    const onClose = ()=>{setEditing(prev=>!prev)};

    return (
        <SafeAreaView className="bg-gray-100 min-h-screen">
            {!postQuery.isLoading && !postPermsQuery.isLoading && (
                <React.Fragment>
                    <View className="max-w-full mx-auto bg-white shadow-md rounded-lg p-6">
                        {/* Post Header */}
                        <View className="flex justify-between items-center mb-4">
                            <Text className="text-2xl font-bold text-gray-700">Post Details</Text>
                        </View>

                        {/* Post Content */}
                        <View className="mb-6 space-y-7">
                            {postPermsQuery.data?.status ? (
                                <View className="flex flex-row">
                                    {postQuery.data?.content && <Text className="mb-4 flex-1">{postQuery.data?.content}</Text>}
                                    <TouchableOpacity onPress={onClose}>
                                        <AntDesign name="edit" /> 
                                        <Text className="text-gray-700">edit</Text>
                                    </TouchableOpacity>
                                </View>
                            ):(
                                <Text className="text-gray-700 mb-4">{postQuery.data?.content}</Text>
                            )}

                            {/* Post Files */}
                            {postQuery.data?.media && postQuery.data?.media.length > 0 && (
                                <View className="flex flex-row justify-center items-center h-40">
                                    <Slide slides={postQuery.data?.media} />
                                </View>
                            )}
                        </View>

                        
                        {postQuery.data?.id && (
                            <React.Fragment>
                                {/* Reactions Section */}
                                <View className="flex flex-row justify-between items-center p-0">
                                    <Reactions postQuery={postQuery.data} detail={detail} />
                                    <ShareButton postQuery={postQuery.data} />
                                </View>
                                {/* Comments Section */}
                                <CommentSection post={postQuery.data} />
                            </React.Fragment>
                        )}
                    </View>
            
                    <Modal open={editing} onClose={onClose}>
                        <PostEdit post={postQuery.data} onClose={onClose}/>
                    </Modal>
                </React.Fragment>
            )}
        </SafeAreaView>
    );
};

export default PostDetail;
