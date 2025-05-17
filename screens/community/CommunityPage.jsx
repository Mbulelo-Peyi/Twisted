import React from 'react';
import { PostList, PostForm, useAxios, CommunityHeader } from "../../components/comps";
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView, Text, TouchableOpacity, View } from 'react-native';

const Community = () => {
    const api = useAxios();
    const { params:{community_id} } = useRoute();
    const navigation = useNavigation();
    const fetchInterval = 1000*60*10;

    const communityQuery = useQuery({
        queryKey: ['community', community_id],
        queryFn: ()=> getCommunity(),
        refetchInterval: fetchInterval,
    });

    const roleQuery = useQuery({
        queryKey: ['community-role', community_id],
        queryFn: ()=> getRole(),
        refetchInterval: fetchInterval,
    });
        
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
    } = useInfiniteQuery({
        queryKey:['community-feed', community_id, 'infinite'],
        getNextPageParam: (lastPage) => {
            try {
                const nextPage = lastPage?.next ? lastPage?.next.split('page=')[1] : null;
                return nextPage;
            } catch (error) {
                return null;
            };
        },
        queryFn: (pageParam)=> getData(pageParam),

    });
    
    const getData = async ({ pageParam = 1 }) => {
        const config = {
            headers: {
                "Content-Type":"application/json",
            }
        };
        try {
            const response = await api.get(
                `/content/api/post/?author_content_type=community&author_object_id=${community_id}&page=${pageParam}`,
                config
            );
            return response.data;
        } catch (error) {
            return error;
        }
    };

    const getCommunity = async () =>{
        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        };
        try {
            const response = await api.get(
                `/user/api/community/${community_id}/`,
                config
            )
            return response.data;
        } catch (error) {
            return error;
        }
    };

    const getRole = async () =>{
        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        };
        try {
            const response = await api.get(
                `/user/api/community/${community_id}/check_role/`,
                config
            )
            return response.data;
        } catch (error) {
            return error
        }
    };
    
    const posts = data?.pages.flatMap(page => page?.results);


    return (
        <SafeAreaView className="bg-gray-100 min-h-screen">
            
            
            {/* Display Posts */}
            <PostList 
            posts={posts} 
            fetchNextPage={fetchNextPage} 
            hasNextPage={hasNextPage} 
            isFetchingNextPage={isFetchingNextPage} 
            isLoading={isLoading} 
            ListHeaderComponent={
            <React.Fragment>
                {/* Community Header */}
                <CommunityHeader community_id={community_id} />

                {/* Join Button */}
                <View className="flex justify-center items-center w-1/2 px-4 mt-4">
                    <TouchableOpacity className="bg-blue-600 px-6 py-2 rounded-lg">
                        <Text className="text-white">Join Community</Text>
                    </TouchableOpacity>
                </View>

                <View className="flex flex-row justify-center items-center py-4 w-full space-x-4">
                    <TouchableOpacity
                    onPress={()=>navigation.navigate("community-members",{community_id:community_id})} 
                    className={`w-1/4 text-center`} 
                    >
                        <Text className={`text-lg font-semibold leading-none`}>members</Text>
                        <View className={`w-full h-1 py-1`}/>
                    </TouchableOpacity>
                    <TouchableOpacity 
                    onPress={()=>navigation.navigate("community-rules",{community_id:community_id})} 
                    className={`w-1/4 text-center`} 
                    >
                        <Text className={`text-lg font-semibold leading-none`}>rules</Text>
                        <View className={`w-full h-1 py-1`}/>
                    </TouchableOpacity>
                    <TouchableOpacity 
                    onPress={()=>navigation.navigate("events",{community_id:community_id})} 
                    className={`w-1/4 text-center`} 
                    >
                        <Text className={`text-lg font-semibold leading-none`}>events</Text>
                        <View className={`w-full h-1 py-1`}/>
                    </TouchableOpacity>
                </View>

                {!roleQuery.isLoading && roleQuery.data?.role==="Moderator" || roleQuery.data?.role==="Admin" &&(
                    <PostForm author_content_type={"community"} author_object_id={communityQuery.data?.id} />
                )}
            </React.Fragment>
            }
            />

        </SafeAreaView>
    );
};

export default Community;
