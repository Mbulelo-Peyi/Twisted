import React, { useState } from 'react';
import { FollowersCard } from '../../components/comps';
import { useAxios } from '../../features';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AntDesign } from '@expo/vector-icons'
import { useRoute } from "@react-navigation/native";
import { SafeAreaView, TouchableOpacity, View, Text, ActivityIndicator, FlatList } from 'react-native';
import SearchBar from '../../components/SearchBar';

const FriendsList = () => {
    const [type, setType] = useState("friends");
    const [search, setSearch] = useState("");
    const [lookup, setLookup] = useState(false);
    const queryClient = useQueryClient();
    const { params:{user_id} } = useRoute();
    const api = useAxios();

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
    } = useInfiniteQuery({
        queryKey:['friends', 'infinite'],
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

    const friendsMutation = useMutation({
        mutationFn: (variables)=> friendsFunc(variables),
        onSuccess : ()=> {
            queryClient.invalidateQueries(['friends', 'infinite']);
        },
    });


    const getData = async ({ pageParam = 1 }) => {
        const config = {
            headers: {
                "Content-Type":"application/json",
            }
        };
        try {
            const response = await api.get(
                lookup?`/user/api/friends/?query_params=${type}&query_params_id=${user_id}&page=${pageParam}&search_query=${search}`:
                `/user/api/friends/?query_params=${type}&query_params_id=${user_id}&page=${pageParam}`,
                config
            );
            return response.data;
        } catch (error) {
            return error;
        }
    };

    const friends = data?.pages.flatMap(page => page?.results);

    const friendsFunc = (value) =>{
        setType(value);
        return friends;
    };

    const handleSearch = (e) =>{
        e.preventDefault();
        if (search.trim() === "") return;
        setLookup(true);
        friendsMutation.mutate(type);
    };

    const clearSearch = () =>{
        setLookup(false);
        setSearch("");
        friendsMutation.mutate("friends");
    };

    const renderItem = ({ item }) => (
        <FollowersCard relation={item} user_id={user_id}/>
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
            <Text className="text-xl font-semibold mb-4">Friends</Text>

            {/* Search Bar */}
            {lookup ?(
                <AntDesign name="delete" onPress={clearSearch} />
            ):(
                <SearchBar handleSearch={handleSearch} setSearch={setSearch} search={search} placeholder={"Search friends..."} />
            )}
            <View className="flex flex-row justify-center items-center py-4 px-2 w-full space-x-4">
                <TouchableOpacity
                onPress={()=>friendsMutation.mutate("friends")} 
                className={`w-1/3 justify-center items-center ${type==="friends"?"bg-blue-200":"bg-gray-300 text-gray-700"}`} 
                disabled={friendsMutation.isPending}>
                    <Text className={`text-lg font-semibold leading-none ${type==="friends"?"text-blue-700":"text-gray-700"}`}>friends</Text>
                    <View className={`w-full h-1 py-1 ${type==="friends"?"bg-blue-700":"bg-gray-700 "}`}/>
                </TouchableOpacity>
                <TouchableOpacity 
                onPress={()=>friendsMutation.mutate("requests")} 
                className={`w-1/3 justify-center items-center ${type==="requests"?"bg-blue-200":"bg-gray-300 text-gray-700"}`} 
                disabled={friendsMutation.isPending}>
                    <Text className={`text-lg font-semibold leading-none ${type==="requests"?"text-blue-700":"text-gray-700 "}`}>requests</Text>
                    <View className={`w-full h-1 py-1 ${type==="requests"?"bg-blue-700":"bg-gray-700 "}`}/>
                </TouchableOpacity>
                <TouchableOpacity 
                onPress={()=>friendsMutation.mutate("pending")} 
                className={`w-1/3 justify-center items-center ${type==="pending"?"bg-blue-200":"bg-gray-300 text-gray-700"}`} 
                disabled={friendsMutation.isPending}>
                    <Text className={`text-lg font-semibold leading-none ${type==="pending"?"text-blue-700":"text-gray-700 "}`}>pending</Text>
                    <View className={`w-full h-1 py-1 ${type==="pending"?"bg-blue-700":"bg-gray-700 "}`}/>
                </TouchableOpacity>
            </View>
            {/* Friends List */}
            {!isLoading && (
                <React.Fragment>
                    {!isLoading && friends?.length === 0 ? (
                        <Text className="text-gray-500 text-center">{type==="friends"?"No friends found.":"No request found."}</Text>
                    ) : (
                        <View className="space-y-4">
                            <FlatList
                            className=""
                            data={friends}
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

export default FriendsList