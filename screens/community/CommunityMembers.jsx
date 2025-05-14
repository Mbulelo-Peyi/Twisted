import React from 'react';
import { FollowersCard, useAxios, CommunityHeader } from "../../components/comps";
import { useInfiniteQuery } from '@tanstack/react-query';
import { useRoute } from '@react-navigation/native';
import { ActivityIndicator, FlatList, SafeAreaView, Text, View } from 'react-native';

const CommunityMembers = () => {
    const api = useAxios();
    const { params:{community_id} } = useRoute();
    const community = true;

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
    } = useInfiniteQuery({
        queryKey:['community-members', community_id, 'infinite'],
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
                `/user/api/community/${community_id}/community_members/?page=${pageParam}`,
                config
            );
            return response.data;
        } catch (error) {
            return error;
        }
    };

    const members = data?.pages.flatMap(page => page?.results);

    const renderItem = ({ item }) => (
        <FollowersCard relation={item} community={community} community_id={community_id} />
    );
                        
    const loadMore = () => {
        if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    };
            
    if (isLoading) {
        return <ActivityIndicator size="large" />;
    }

    return (
        <SafeAreaView className="bg-gray-100 min-h-screen">
            <CommunityHeader community_id={community_id} />
            {!isLoading && (
                <React.Fragment>
                    {!isLoading && members?.length === 0 ? (
                        <Text className="text-gray-500">No members found.</Text>
                    ) : (
                        <View className="space-y-4 py-5 px-3 bg-slate-200">
                            <FlatList
                            className=""
                            data={members}
                            renderItem={renderItem}
                            keyExtractor={(item) => item?.id.toString()}
                            onEndReached={loadMore}
                            onEndReachedThreshold={0.5} 
                            ListFooterComponent={isFetchingNextPage ? <ActivityIndicator size="small" /> : null}
                            />
                        </View>
                    )}
                </React.Fragment>
            )}
        </SafeAreaView>
    )
}

export default CommunityMembers