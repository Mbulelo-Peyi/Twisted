import React from 'react';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';
import { CommentCard, CommentForm, useAxios } from '.';
import { useInfiniteQuery, } from '@tanstack/react-query';


const CommentSection = ({ post }) => {
    const api = useAxios();

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
    } = useInfiniteQuery({
        queryKey:['comments', post?.id, 'infinite'],
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
                `/content/api/comments/?post_id=${post?.id}&page=${pageParam}`,
                config
            );
            return response.data;
        } catch (error) {
            return error;
        }
    };

    const comments = data?.pages.flatMap(page => page?.results);

    const renderItem = ({ item }) => (
        <CommentCard comment={item} />
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
        <View>
            {/* Comments Section */}
            <View className="mb-4">
                <Text className="text-xl font-bold text-gray-700 mb-2">Comments</Text>
                {comments?.length > 0 && !isLoading ? (
                    <View>
                        <FlatList
                        className=""
                        data={comments}
                        renderItem={renderItem}
                        keyExtractor={(item) => item?.id.toString()}
                        onEndReached={loadMore}
                        onEndReachedThreshold={0.5} 
                        ListFooterComponent={isFetchingNextPage ? <ActivityIndicator size="small" /> : null}
                        />
                    </View>
                ) : (
                    <React.Fragment>
                        {!isLoading ? (
                            <Text className="text-gray-500">No comments yet. Be the first to comment!</Text>
                        ):(
                            <Text className="text-gray-500">Loading...</Text>
                        )}
                    </React.Fragment>
                )}
            </View>

            {/* Add a Comment */}
            <CommentForm post={post} />
        </View>
    )
}

export default CommentSection