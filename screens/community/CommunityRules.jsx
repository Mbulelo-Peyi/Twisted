import React, { useState } from 'react';
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Modal, useAxios } from '../../features';
import { CommunityHeader, Rule } from '../../components/comps';
import { ActivityIndicator, SafeAreaView, Text, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { FlatList } from 'react-native-gesture-handler';
import { useNavigation, useRoute } from '@react-navigation/native';

const CommunityRules = () => {
    const { params:{community_id} } = useRoute();
    const queryClient = useQueryClient();
    const navigation = useNavigation();
    const api = useAxios();
    const fetchInterval = 1000*60*10;
    const [open, setOpen] = useState(false);
    const elevatedRoles = ['Moderator','Admin']

    const rulesMutation = useMutation({
        mutationFn: (variables)=> addRule(variables),
        onSuccess : (data)=> {
            queryClient.invalidateQueries(['rules', 'infinite']);
            navigation.navigate("community-rule",{community_id:community_id,event_id:data?.id});
        },
    });

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
    } = useInfiniteQuery({
        queryKey:['community-rules', community_id, 'infinite'],
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
                `/user/api/community/${community_id}/community_rules/?=${pageParam}`,
                config
            );
            return response.data;
        } catch (error) {
            return error;
        }
    };

    const addRule = async (data)=>{
        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        }
        try {
            const response = await api.post(
                `/user/api/community/${community_id}/add_community_rule/`,
                data,
                config
            )
            return response.data;
        } catch (error) {
            return error;
        }
    };

    const rules = data?.pages.flatMap(page => page?.results);

    const onClose = ()=>{setOpen(prev=>!prev)};

    const renderItem = ({ item }) => (
        <View className="bg-white border p-4 border-slate-200">
            <View className="flex flex-row space-x-4">
                <TouchableOpacity onPress={()=>navigation.navigate("rule",{community_id:community_id,event_id:item?.id})}>
                    <View className="flex flex-col flex-1 pr-2">
                        <Text className="text-lg font-semibold mb-1">{item?.text}</Text>
                    </View>
                </TouchableOpacity>
                
            </View>
        </View>
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
            <Text className="text-xl font-semibold mb-4">Rules</Text>
            {!roleQuery.isLoading && elevatedRoles.includes(roleQuery.data?.role) &&(
                <TouchableOpacity className="flex flex-row space-x-2 items-center px-4" onPress={onClose}>
                    <FontAwesome name="group" /> 
                    <Text>Add Rule</Text>
                </TouchableOpacity>
            )}

            {/* Rule List */}
            {!isLoading && (
                <React.Fragment>
                    {!isLoading && rules?.length === 0 ? (
                        <Text className="text-gray-500 items-center">No rules found.</Text>
                    ) : (
                        <View className="space-y-4">
                            <FlatList
                            className=""
                            data={rules}
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
            <Modal open={open} onClose={onClose}>
                <Rule create={rulesMutation} />
            </Modal>
        </SafeAreaView>
    )
}

export default CommunityRules