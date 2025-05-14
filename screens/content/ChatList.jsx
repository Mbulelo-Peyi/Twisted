import React, { useContext } from 'react';
import { AuthContext, ChatCard } from "../../components/comps";
import { useAxios } from '../../features';
import { useInfiniteQuery } from '@tanstack/react-query';
import { ActivityIndicator, FlatList, SafeAreaView, Text, View } from 'react-native';

const ChatList = () => {
    const { user } = useContext(AuthContext);
    const api = useAxios();

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
    } = useInfiniteQuery({
        queryKey:['user-chats', user?.id, 'infinite'],
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
                `/user/api/chatrooms/?page=${pageParam}`,
                config
            );
            return response.data;
        } catch (error) {
            return error;
        }
    };

    const renderItem = ({ item }) => (
        <ChatCard chat={item} />
    );
                
    const loadMore = () => {
        if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    };

    if (isLoading) {
        return <ActivityIndicator size="large" />;
    }

    const chats = data?.pages.flatMap(page => page?.results);
    

    return (
        <SafeAreaView className="bg-inherit p-4 mt-5 rounded-lg shadow-md">
            <Text className="text-xl font-semibold mb-4">Chats</Text>
            {/* Chat List */}
            {!isLoading && (
                <React.Fragment>
                    {!isLoading && chats?.length === 0 ? (
                        <Text className="text-gray-500">No chats found.</Text>
                    ) : (
                        <View className="space-y-4">
                            <FlatList
                            className=""
                            data={chats}
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

export default ChatList