import React, { useState } from 'react';
import { FollowersCard } from '../../components/comps';
import { useAxios } from '../../features';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AntDesign } from '@expo/vector-icons'
import { useRoute } from "@react-navigation/native";
import { SafeAreaView, TouchableOpacity, View, Text, FlatList, ActivityIndicator } from 'react-native';
import SearchBar from '../../components/SearchBar';

const FollowersList = () => {
    const [type, setType] = useState("followers");
    const [search, setSearch] = useState('');
    const [lookup, setLookup] = useState(false);
    const { params:{user_id} } = useRoute();
    const queryClient = useQueryClient();
    const api = useAxios();

    const follow = true
    
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
    } = useInfiniteQuery({
        queryKey:['followers', user_id, 'infinite'],
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

    
    const followersMutation = useMutation({
        mutationFn: (variables)=> followersFunc(variables),
        onSuccess : ()=> {
            queryClient.invalidateQueries(['followers', user_id, 'infinite']);
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
                lookup?`/user/api/followers/?query_params_id=${user_id}&query_params=${type}&search_query=${search}&page=${pageParam}`:
                `/user/api/followers/?query_params_id=${user_id}&query_params=${type}&page=${pageParam}`,
                config
            );
            return response.data;
        } catch (error) {
            return error;
        }
    };

    const followers = data?.pages.flatMap(page => page?.results);

    const followersFunc = (value) =>{
        setType(value)
        return followers
    };

    const handleSearch = (e) =>{
        e.preventDefault();
        if (search.trim() === "") return;
        setLookup(true);
        console.log(lookup,search.trim())
        followersMutation.mutate(type);
    };

    const clearSearch = () =>{
        setLookup(false);
        setSearch("");
        followersMutation.mutate("followers");
    };

    const renderItem = ({ item }) => (
        <FollowersCard relation={item} follow={follow} type={type} user_id={user_id}/>
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
            <Text className="text-xl font-semibold mb-4">Followers</Text>

            {/* Search Bar */}
            <SearchBar handleSearch={handleSearch} setSearch={setSearch} search={search} placeholder={"Search followers..."} />
            {lookup ?(
                <AntDesign name='delete' onPress={clearSearch} />
            ):(
                <View className="flex flex-row justify-center items-center py-4 w-full space-x-0">
                    <TouchableOpacity
                    onPress={()=>followersMutation.mutate("followers")} 
                    className={`w-1/2 justify-center items-center ${type==="followers"?"bg-blue-200":"bg-gray-300 text-gray-700"}`} 
                    disabled={followersMutation.isPending}>
                        <Text className={`text-lg font-semibold leading-none ${type==="followers"?"text-blue-700":"text-gray-700"} `}>followers</Text>
                        <View className={`w-full h-1 py-1 ${type==="followers"?"bg-blue-700":"bg-gray-700 "}`}/>
                    </TouchableOpacity>
                    <TouchableOpacity 
                    onPress={()=>followersMutation.mutate("following")} 
                    className={`w-1/2 justify-center items-center ${type==="following"?"bg-blue-200":"bg-gray-300 text-gray-700 "}`} 
                    disabled={followersMutation.isPending}>
                        <Text className={`text-lg font-semibold leading-none ${type==="following"?"text-blue-700":"text-gray-700"} `}>following</Text>
                        <View className={`w-full h-1 py-1 ${type==="following"?"bg-blue-700":"bg-gray-700 "}`}/>
                    </TouchableOpacity>
                </View>
            )}
            {/* Followers List */}
            {!isLoading && (
                <React.Fragment>
                    {!isLoading && followers?.length === 0 ? (
                        <Text className="text-gray-500">No followers found.</Text>
                    ) : (
                        <View className="space-y-4">
                            <FlatList
                            className=""
                            data={followers}
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
    );
};

export default FollowersList;
