import React, { useState } from 'react';
import { NotificationCard, Modal } from './index';
import { ActivityIndicator, FlatList, Text, TouchableOpacity, View } from 'react-native';
import { Feather } from '@expo/vector-icons';

const NotificationList = ({ objects, readMutation, deleteMutation, hasNextPage, isFetchingNextPage, fetchNextPage }) => {
    const [showOptions, setShowOptions] = useState(false);
    const [notificationId, setNotificationId] = useState(null);
    const Options = ()=>{
        setShowOptions((prev)=>!prev)
    };

    const renderItem = ({ item }) => (
        <View className="flex flex-row">
            <NotificationCard notification={item}/>
            <TouchableOpacity 
            className="px-4" 
            onPress={
                ()=>{
                    setNotificationId(item?.id);
                    Options();
                }
            }>
                <Feather name="more-vertical" size={20} />
            </TouchableOpacity>
        </View>
    );
        
    const loadMore = () => {
        if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    };

    return (
        <React.Fragment>
            <FlatList
            className=""
            data={objects}
            renderItem={renderItem}
            keyExtractor={(item) => item?.id.toString()}
            onEndReached={loadMore}
            onEndReachedThreshold={0.5} 
            ListFooterComponent={isFetchingNextPage ? <ActivityIndicator size="small" /> : null}
            />
            <Modal isOpen={showOptions} onClose={Options}>
                <View className="flex flex-col items-center justify-center">
                    <TouchableOpacity 
                    onPress={()=>{
                        readMutation.mutate(notificationId);
                        Options();
                        }}>
                            <Text className="text-pretty text-slate-950 capitalize">mark as read</Text>
                        </TouchableOpacity>
                    <TouchableOpacity 
                    onPress={()=>{
                        deleteMutation.mutate(notificationId);
                        Options();
                        }}>
                            <Text className="text-pretty text-slate-950 capitalize">delete</Text>
                        </TouchableOpacity>
                </View>
            </Modal>
        </React.Fragment>
    )
}

export default NotificationList
