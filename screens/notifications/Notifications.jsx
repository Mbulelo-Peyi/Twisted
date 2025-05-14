import React from 'react';
import { useAxios, NotificationList } from './index';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ActivityIndicator, SafeAreaView, View } from 'react-native';



const Notifications = () =>{
    const api = useAxios();
    const queryClient = useQueryClient();
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteQuery({
        queryKey:['notifications', 'infinite'],
        getNextPageParam: (lastPage) => {
            try {
                const nextPage = lastPage?.next ? lastPage?.next.split('page=')[1] : null;
                return nextPage;
            } catch (error) {
                return null;
            };
        },
        queryFn: (pageParam)=> getNotifications(pageParam),

    });

    const readMutation = useMutation({
        mutationFn: (variables)=> markAsRead(variables),
        onSuccess: ()=> {
            queryClient.invalidateQueries(['notifications', 'infinite']);
        }
    });
    const deleteMutation = useMutation({
        mutationFn: (variables)=> deleteNotification(variables),
        onSuccess: ()=> {
            queryClient.invalidateQueries(['notifications', 'infinite']);
        }
    });


    const getNotifications = async ({ pageParam = 1 }) =>{
        const config = {
            headers: {
                "Content-Type": "application/json",
            }
        };
        try {
            const response = await api.get(
            `/content/api/notifications/?page=${pageParam}`,
                config
            )
            return response.data;
        } catch (error) {
            console.error("Error:",error)
        }
    };

    const markAsRead = async (id) => {
        const config = {
            headers: {
                "Content-Type": "application/json",
            }
        };
        try {
            const response = await api.get(
            `/content/api/notifications/${id}/`,
                config
            )
            return response.data;
        } catch (error) {
            console.error("Error:",error)

        }
    };
    const deleteNotification = async (id) => {
        const config = {
            headers: {
                "Content-Type": "application/json",
            }
        };
        try {
            const response = await api.delete(
            `/content/api/notifications/${id}/`,
                config
            )
            return response.data;
        } catch (error) {
            console.error("Error:",error)

        }
    };
    const _data = data?.pages.flatMap(page => page?.results);

    if (isLoading) {
        return <ActivityIndicator size="large" />;
    }

    return (
        <SafeAreaView className="relative">
            <View className="pb-2">
                <NotificationList 
                objects={_data} 
                readMutation={readMutation} 
                deleteMutation={deleteMutation}
                hasNextPage={hasNextPage} 
                isFetchingNextPage={isFetchingNextPage} 
                fetchNextPage={fetchNextPage}
                />
            </View>
        </SafeAreaView>
    )
};

export default Notifications;