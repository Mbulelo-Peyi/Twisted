import React from 'react';
import { ActivityIndicator, FlatList, SafeAreaView, Text, View } from 'react-native';
import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';
import FaqCard from './FaqCard';

const Faq = () => {
    const BASE_URL = "http://192.168.8.101:8000";
    

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
    } = useInfiniteQuery({
    queryKey:['questions', 'infinite'],
    getNextPageParam: (lastPage) => {
        try {
            const nextPage = lastPage?.next ? lastPage?.next?.split('page=')[1] : null;
            return nextPage;
        } catch (error) {
            return null;
        };
    },
    queryFn: (pageParam)=> getQuestions(pageParam),

    });


    const getQuestions = async ({ pageParam = 1 }) =>{
        const config ={
            header:{
                "Content-Type": "application/json",
            }
        };
        try {
            const response = await axios.get(
                `${BASE_URL}/api/frequent-questions/?page=${pageParam}`,
                config
            );
            return response.data;
        } catch (error) {
        }
    };

    const renderItem = ({ item }) => (
        <FaqCard question={item} />
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
        <SafeAreaView className="relative">
            <View className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto h-full">
                <View className="max-w-2xl mx-auto text-center items-center mb-10 lg:mb-14">
                    <Text className="text-2xl font-bold md:text-4xl md:leading-tight dark:text-white">Your questions, answered</Text>
                    <Text className="mt-1 text-gray-900 text-lg dark:text-neutral-400">Answers to the most frequently asked questions.</Text>
                </View>

                <View className="max-w-2xl mx-auto">
                    <View className="flex pb-24">
                        <FlatList
                        className=""
                        data={data?.pages.flatMap(page => page?.results)}
                        renderItem={renderItem}
                        keyExtractor={(item) => item?.id.toString()}
                        onEndReached={loadMore}
                        onEndReachedThreshold={0.5} 
                        ListFooterComponent={isFetchingNextPage ? <ActivityIndicator size="small" /> : null}
                        />
                    </View>
                </View>
            </View>
        </SafeAreaView>
    )
}

export default Faq
