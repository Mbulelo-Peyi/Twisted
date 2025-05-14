import React from 'react';
import { VideoTag, ImageTag, PostComment } from '../../features';
import { useAxios, Reactions, ShareButton } from '.';
import { useQuery } from '@tanstack/react-query';
import { TouchableOpacity, View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';

const PostCard = ({ post }) => {
    const api = useAxios();
    const fetchInterval = 1000 * 60 * 10;
    const navigation = useNavigation();

    const postPermsQuery = useQuery({
        queryKey: ['post-permissions', post?.id],
        queryFn: () => getPostPerms(),
        refetchInterval: fetchInterval,
    });

    const getPostPerms = async () => {
        const config = {
        headers: {
            'Content-Type': 'application/json',
        },
        };
        try {
        const response = await api.get(
            `/content/api/post-author/${post?.id}/`,
            config
        );
        return response.data;
        } catch (error) {
        console.error('Get post perms error:', error);
        return error;
        }
    };

    return (
        <View className="bg-white shadow-md rounded-lg p-4 mb-4">
            {/* Post Text */}
            {!postPermsQuery.isLoading && postPermsQuery.data?.status ? (
                <TouchableOpacity className="flex flex-row items-center">
                    <Text className="text-gray-700 mb-4 flex-1">{post?.content}</Text>
                    <TouchableOpacity className="flex flex-row items-center space-x-1">
                        <AntDesign name="edit" size={16} />
                        <Text className="text-sm">edit</Text>
                    </TouchableOpacity>
                </TouchableOpacity>
            ) : (
                <React.Fragment>
                    {post?.content && (
                        <Text className="text-gray-700 mb-4">{post?.content}</Text>
                    )}
                </React.Fragment>
            )}

            {/* Post Files */}
            {post?.media && post?.media?.length > 0 && (
                <View className="flex flex-row justify-between gap-2 mb-4">
                    {Array.from(post?.media?.slice(0, 2)).map((file, index) => (
                        <View
                        key={file?.id}
                        className="border border-gray-300 rounded-lg p-2 w-[48%]"
                        >
                        {index === 1 ? (
                            <TouchableOpacity
                            onPress={() =>
                                navigation.navigate('post', { post_id: post?.id })
                            }
                            >
                                {file?.mime_type?.startsWith('image') ? (
                                    <ImageTag
                                    src={file?.media_file}
                                    last={true}
                                    blurred={file?.blur}
                                    alt={`Attachment ${index + 1}`}
                                    className="w-full h-32 object-cover rounded-md"
                                    />
                                ) : file?.mime_type?.startsWith('video') ? (
                                    <VideoTag
                                    src={file?.media_file}
                                    last={true}
                                    blurred={file?.blur}
                                    />
                                ) : (
                                    <Text className="text-gray-700 text-sm truncate">
                                        {file?.name}
                                    </Text>
                                )}
                            </TouchableOpacity>
                        ) : (
                            <React.Fragment>
                            {file?.mime_type?.startsWith('image') ? (
                                <ImageTag
                                src={file?.media_file}
                                blurred={file?.blur}
                                alt={`Attachment ${index + 1}`}
                                className="w-full h-32 object-cover rounded-md"
                                />
                            ) : file?.mime_type?.startsWith('video') ? (
                                <VideoTag src={file?.media_file} blurred={file?.blur} />
                            ) : (
                                <Text className="text-gray-700 text-sm truncate">
                                    {file?.media_file}
                                </Text>
                            )}
                            </React.Fragment>
                        )}
                        </View>
                    ))}
                </View>
            )}

            {/* Actions */}
            <View className="flex flex-row items-center justify-between mt-4">
                <Reactions postQuery={post} />
                <View className="w-2/5">
                    <PostComment post={post} />
                </View>
                <ShareButton postQuery={post} />
            </View>
        </View>
    );
};

export default PostCard;