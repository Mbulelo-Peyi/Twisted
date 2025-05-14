import React from 'react';
import { PostCard } from '.';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';

const PostList = ({ posts, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, ListHeaderComponent }) => {
    
    const renderItem = ({ item }) => (
        <PostCard post={item}/>
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
            {posts?.length && !isLoading > 0 ? (
                <FlatList
                className="w-full"
                data={posts}
                renderItem={renderItem}
                keyExtractor={(item) => item?.id.toString()}
                onEndReached={loadMore}
                onEndReachedThreshold={0.5} 
                nestedScrollEnabled
                ListFooterComponent={isFetchingNextPage ? <ActivityIndicator size="small" /> : null}
                ListHeaderComponent={ListHeaderComponent?ListHeaderComponent:null}
                />
            ) : (
                <Text className="text-gray-500 text-center">No posts yet. Be the first to share!</Text>
            )}
        </View>
    )
}

export default PostList;