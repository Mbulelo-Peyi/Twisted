import React, { useState } from 'react';
import { useAxios, CommunityCard } from '../../components/comps';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ActivityIndicator, FlatList, SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import SearchBar from '../../components/SearchBar';

const CommunityList = () => {
    const [type, setType] = useState("communities");
    const [lookup, setLookup] = useState(false);
    const [search, setSearch] = useState("");
    const queryClient = useQueryClient();
    const api = useAxios();

    const communitiesMutation = useMutation({
        mutationFn: (variables)=> communitiesFunc(variables),
        onSuccess : ()=> {
            queryClient.invalidateQueries(['communities', 'infinite']);
        },
    });
    
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
    } = useInfiniteQuery({
        queryKey:['communities', 'infinite'],
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
        const searchEndpoint = type==="joined"?`/user/api/community/joined_communities/?search_query=${search}&page=${pageParam}`:
        `/user/api/community/?search_query=${search}&page=${pageParam}`;
        const config = {
            headers: {
                "Content-Type":"application/json",
            }
        };
        try {
            const response = await api.get(
                lookup?searchEndpoint:
                type==="joined"? `/user/api/community/joined_communities/?page=${pageParam}`:
                `/user/api/community/?page=${pageParam}`,
                config
            );
            return response.data;
        } catch (error) {
            return error;
        }
    };

    const communities = data?.pages.flatMap(page => page?.results);

    const communitiesFunc = (value) =>{
        setType(value)
        return communities;
    };

    const handleSearch = (e) =>{
        e.preventDefault();
        if (search.trim() === "") return;
        setLookup(true);
        communitiesMutation.mutate(type);
    };

    const clearSearch = () =>{
        setLookup(false);
        setSearch("");
        communitiesMutation.mutate(type);
    };

    const renderItem = ({ item }) => (
        <CommunityCard community={item} />
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
        <SafeAreaView className="bg-white p-4 rounded-lg shadow-md">
            <Text className="text-xl font-semibold mb-4">Communities</Text>

            {/* Search Bar */}
            {lookup ?(
                <AntDesign name="delete" onPress={clearSearch} />
            ):(
                <SearchBar handleSearch={handleSearch} setSearch={setSearch} search={search} placeholder={"Search community..."} />
            )}
            {!lookup &&(
                <View className="flex flex-row justify-center items-center py-4 w-full space-x-0">
                    <TouchableOpacity
                    onPress={()=>communitiesMutation.mutate("communities")} 
                    className={`w-1/2 items-center ${type==="communities"?"bg-blue-200":"bg-gray-300 text-gray-700"}`} 
                    disabled={communitiesMutation.isPending}>
                        <Text className={`text-lg font-semibold leading-none ${type==="communities"?"text-blue-700":"text-gray-700"} `}>communities</Text>
                        <View className={`w-full h-1 py-1 ${type==="communities"?"bg-blue-700":"bg-gray-700 "}`}/>
                    </TouchableOpacity>
                    <TouchableOpacity 
                    onPress={()=>communitiesMutation.mutate("joined")} 
                    className={`w-1/2 items-center ${type==="joined"?"bg-blue-200":"bg-gray-300 text-gray-700 "}`} 
                    disabled={communitiesMutation.isPending}>
                        <Text className={`text-lg font-semibold leading-none ${type==="joined"?"text-blue-700":"text-gray-700"} `}>joined</Text>
                        <View className={`w-full h-1 py-1 ${type==="joined"?"bg-blue-700":"bg-gray-700 "}`}/>
                    </TouchableOpacity>
                </View>
            )}
            {/* Communities List */}
            {!isLoading && (
                <React.Fragment>
                    {!isLoading && communities?.length === 0 ? (
                        <Text className="text-gray-500">No communities found.</Text>
                    ) : (
                        <View className="space-y-4">
                            <FlatList
                            className=""
                            data={communities}
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

export default CommunityList