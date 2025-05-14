import React, { useContext } from "react";
import { PostList, PostForm, useAxios, } from "../../components/comps";
import { useInfiniteQuery } from '@tanstack/react-query';
import { SafeAreaView, View, Text } from "react-native";
import AuthContext from '../../context/AuthContext'

const Home = () => {
    const { user } = useContext(AuthContext);
    const api = useAxios();
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
    } = useInfiniteQuery({
        queryKey:['feed', 'infinite'],
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
                `/content/api/feed/?page=${pageParam}`,
                config
            );
            return response.data;
        } catch (error) {
            return error;
        }
    };

    const posts = data?.pages.flatMap(page => page?.results);
 
    return (
        <SafeAreaView className="bg-white">
            <View className="w-full">
                <Text className="text-xl font-bold py-6 text-center">Your Feed</Text>
                {/* Display Posts && Post Input Form */}
                <PostList 
                posts={posts} 
                fetchNextPage={fetchNextPage} 
                hasNextPage={hasNextPage} 
                isFetchingNextPage={isFetchingNextPage} 
                isLoading={isLoading} 
                ListHeaderComponent={<PostForm author_content_type={"profile"} author_object_id={user?.id} />}
                />
            </View>
        </SafeAreaView>
    );
};

export default Home;
