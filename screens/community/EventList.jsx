import React, { useState } from 'react';
import { CommunityHeader, EventAdd, useAxios } from '../../components/comps';
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Modal } from '../../features';
import { ActivityIndicator, FlatList, SafeAreaView, Text, TouchableOpacity } from 'react-native';
import SearchBar from '../../components/SearchBar';
import EventCard from '../../components/EventCard';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { View } from 'react-native';

const EventList = () => {
    const [type, setType] = useState("events");
    const [lookup, setLookup] = useState(false);
    const { params:{community_id} } = useRoute();
    const [search, setSearch] = useState("");
    const [open, setOpen] = useState(false);
    const queryClient = useQueryClient();
    const navigation = useNavigation();
    const api = useAxios();
    const fetchInterval = 1000*60*10;
    const elevatedRoles = ['Moderator','Admin']

    const eventsMutation = useMutation({
        mutationFn: (variables)=> addEvent(variables),
        onSuccess : (data)=> {
            queryClient.invalidateQueries(['events', 'infinite']);
            navigation.navigate("event",{community_id:community_id,even_id:data?.id});
        },
    });
    
    const eventsSearchMutation = useMutation({
        mutationFn: (variables)=> eventsFunc(variables),
        onSuccess : ()=> {
            queryClient.invalidateQueries(['events', 'infinite']);
        },
    });
        
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
    } = useInfiniteQuery({
        queryKey:['events', community_id, 'infinite'],
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

    const roleQuery = useQuery({
        queryKey: ['role', community_id],
        queryFn: ()=> getRole(),
        refetchInterval: fetchInterval,
    });

    const getRole = async ()=>{
        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        }
        try {
            const response = await api.get(
                `/user/api/community/${community_id}/check_role/`,
                config
            )
            return response.data;
        } catch (error) {
            return error;
        }
    };
    
    const getData = async ({ pageParam = 1 }) => {
        const config = {
            headers: {
                "Content-Type":"application/json",
            }
        };
        try {
            const response = await api.get(
                lookup?`/user/api/events/?community_id=${community_id}&search_query=${search}&page=${pageParam}`:
                `/user/api/events/?community_id=${community_id}&page=${pageParam}`,
                config
            );
            return response.data;
        } catch (error) {
            return error;
        }
    };

    const addEvent = async (data)=>{
        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        }
        try {
            const response = await api.post(
                `/user/api/community/${community_id}/create_event/`,
                data,
                config
            )
            return response.data;
        } catch (error) {
            return error;
        }
    };
    
    const events = data?.pages.flatMap(page => page?.results);

    const eventsFunc = (value) =>{
        setType(value)
        return events;
    };
    
    const handleSearch = (e) =>{
        e.preventDefault();
        if (search.trim() === "") return;
        setLookup(true);
        eventsSearchMutation.mutate(type);
    };

    const clearSearch = () =>{
        setLookup(false);
        setSearch("");
        eventsSearchMutation.mutate(type);;
    };

    const onClose = ()=>{setOpen(prev=>!prev)};

    const renderItem = ({ item }) => (
        <EventCard event={item} />
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
        <SafeAreaView className="bg-white rounded-lg shadow-md">
            <CommunityHeader community_id={community_id} />
            <Text className="text-xl font-semibold px-2 mb-4">Events</Text>
            {!roleQuery.isLoading && elevatedRoles.includes(roleQuery.data?.role) &&(
                <TouchableOpacity className="flex flex-row space-x-2 items-center px-2 py-4" onPress={onClose}>
                    <AntDesign name="addusergroup" size={24} /> 
                    <Text>Add Event</Text>
                </TouchableOpacity>
            )}
            {/* Search Bar datetime-local*/}
            {lookup ?(
                <Ionicons name="search" onPress={clearSearch} />
            ):(
                <View className="px-2">
                    <SearchBar handleSearch={handleSearch} setSearch={setSearch} search={search} placeholder={"Search event..."} />
                </View>
            )}

            {/* Events List */}
            {!isLoading && (
                <React.Fragment>
                    {!isLoading && events?.length === 0 ? (
                        <Text className="text-gray-500">No events found.</Text>
                    ) : (
                        <View className="space-y-4">
                            <FlatList
                            className=""
                            data={events}
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
            <Modal isOpen={open} onClose={onClose}>
                <EventAdd create={eventsMutation} />
            </Modal>
        </SafeAreaView>
    )
}

export default EventList