import { View, Text, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';

const EventCard = ({ event }) => {
    const navigation = useNavigation();
    return (
        <TouchableOpacity 
        className="bg-white border p-4 border-slate-200"
        onPress={()=>navigation.navigate("event",{event_id:event?.id,community_id:event?.community?.id})}
        >
            <View className="flex flex-row space-x-4">
                <View>
                    <Image
                    source={{uri:event?.community?.logo}}
                    alt={event?.title}
                    className="h-28 w-28 bg-gray-300 p-2"
                    />
                </View>
                <View className="flex flex-col flex-1 pr-2">
                    <Text className="text-lg font-semibold mb-1">{event?.title}</Text>
                    <Text className="text-gray-700">{event?.timesince}</Text>
                </View>
                
            </View>
        </TouchableOpacity>
    )
}

export default EventCard