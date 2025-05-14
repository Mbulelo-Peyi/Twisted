import React, { useState } from 'react';
import { useAxios } from '../../features';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CommunityCard, FollowersCard } from '../../components/comps';
import EventCard from '../../components/EventCard';
import { ActivityIndicator, FlatList, SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import SearchBar from '../../components/SearchBar';



const SearchPage = () =>{
    const api = useAxios();
    const queryClient = useQueryClient();
    const [query, setQuery] = useState("");
    const [filter, setFilter] = useState("friends");
    const community = false;

    const handleSelect = (value) =>{
        setFilter(value)
        filterMutation.mutate();
    };

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
    } = useInfiniteQuery({
        queryKey:['general-search', 'infinite'],
        getNextPageParam: (lastPage) => {
            try {
                const nextPage = lastPage?.next ? lastPage?.next.split('page=')[1] : null;
                return nextPage;
            } catch (error) {
                return null;
            };
        },
        queryFn: (pageParam)=> getSearchResults(pageParam),

    });

    const filterMutation = useMutation({
        mutationFn: ()=> (filter),
        onSuccess : ()=> {
            queryClient.removeQueries(['general-search', 'infinite']);
        },
    });


    const getSearchResults = ({ pageParam = 1 }) =>{
        if (query.trim() === "") return;
        return getQuery(
            filter === "friends" ? `/user/api/profile/?search_query=${query}&page=${pageParam}`:
            filter === "events" ? `/user/api/events/?search_query=${query}&page=${pageParam}`:
            `/user/api/community/?search_query=${query}&page=${pageParam}`
        );
    };

    const getQuery = async (url) =>{
        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        }
        try {
            const response = await api.get(
                url,
                config
            )
            return response.data;
        } catch (error) {
            return error;
        }
    };

    const renderItem = ({ item }) => (
        <React.Fragment>
            {filter === "friends" ?(
                <FollowersCard relation={item} community={community}/>
            ):filter === "events" ?(
                <EventCard event={item} />
            ):(
                <CommunityCard community={item} />
            )}
        </React.Fragment>
    );
    
    const loadMore = () => {
        if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    };

    if (isLoading) {
        return <ActivityIndicator size="large" />;
    }

    const results = data?.pages.flatMap(page => page?.results);
    
    return (
        <SafeAreaView className="bg-white p-4 rounded-lg shadow-md">
            <Text className="text-xl font-semibold mb-4">Search</Text>
            <SearchBar handleSearch={()=>getSearchResults(1)} setSearch={setQuery} search={query} placeholder={"Search..."} />
            <View className="flex flex-row justify-between items-center py-4 w-full">
                <TouchableOpacity
                onPress={()=>handleSelect("friends")} 
                className={`w-1/4 ${filter==="friends"?"bg-blue-200":"bg-gray-300 text-gray-700"}`} 
                disabled={filterMutation.isPending}>
                    <Text className={`text-lg font-semibold leading-none truncate text-center ${filter==="friends"?"text-blue-700":"text-gray-700"}`}>friends</Text>
                    <View className={`w-full h-1 py-1 ${filter==="friends"?"bg-blue-700":"bg-gray-700 "}`}/>
                </TouchableOpacity>
                <TouchableOpacity 
                onPress={()=>handleSelect("events")} 
                className={`w-1/4 ${filter==="events"?"bg-blue-200":"bg-gray-300 text-gray-700"}`} 
                disabled={filterMutation.isPending}>
                    <Text className={`text-lg font-semibold leading-none truncate text-center ${filter==="events"?"text-blue-700":"text-gray-700 "}`}>events</Text>
                    <View className={`w-full h-1 py-1 ${filter==="events"?"bg-blue-700":"bg-gray-700 "}`}/>
                </TouchableOpacity>
                <TouchableOpacity 
                onPress={()=>handleSelect("communities")} 
                className={`w-auto ${filter==="communities"?"bg-blue-200":"bg-gray-300 text-gray-700"}`} 
                disabled={filterMutation.isPending}>
                    <Text className={`text-lg font-semibold leading-none truncate text-center px-2 ${filter==="communities"?"text-blue-700":"text-gray-700 "}`}>communities</Text>
                    <View className={`w-full h-1 py-1 ${filter==="communities"?"bg-blue-700":"bg-gray-700 "}`}/>
                </TouchableOpacity>
            </View>
            {/* Search List */}
            {!isLoading && query.trim() !== "" && (
                <React.Fragment>
                    {results?.length > 0 && query.trim() !== "" ? (
                        <View className="space-y-4">
                            <FlatList
                            className=""
                            data={results}
                            renderItem={renderItem}
                            keyExtractor={(item) => item?.id.toString()}
                            onEndReached={loadMore}
                            onEndReachedThreshold={0.5} 
                            ListFooterComponent={isFetchingNextPage ? <ActivityIndicator size="small" /> : null}
                            />
                        </View>
                    ) : (
                        <Text className="text-gray-500 text-center">No results found.</Text>
                    )}
                </React.Fragment>
            )}
            
        </SafeAreaView>
    )
};

export default SearchPage;