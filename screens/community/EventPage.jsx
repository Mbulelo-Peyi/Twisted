import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CommunityHeader, EventAdd, useAxios } from "../../components/comps";
import { useNavigation, useRoute } from "@react-navigation/native";
import { SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import Modal from "../../components/Modal";

const EventPage = () => {
    const [attending, setAttending] = useState(false);
    const [open, setOpen] = useState(false);
    const { params:{event_id,community_id} } = useRoute();
    const navigation = useNavigation();
    const api = useAxios();
    const queryClient = useQueryClient();
    const fetchInterval = 1000*60*10;
    const elevatedRoles = ['Moderator','Admin']

    const eventQuery = useQuery({
        queryKey: ['event', event_id],
        queryFn: ()=> getEvent(),
        refetchInterval: fetchInterval,
    });

    const eventUpdateMutation = useMutation({
        mutationFn: (variables)=> updateEvent(variables),
        onSuccess : ()=> {
            queryClient.invalidateQueries(['event', event_id]);
            queryClient.invalidateQueries(['events', community_id, 'infinite']);
        },
    });

    const eventDeleteMutation = useMutation({
        mutationFn: ()=> deleteEvent(),
        onSuccess : ()=> {
            queryClient.removeQueries(['event', event_id]);
            queryClient.invalidateQueries(['events', community_id, 'infinite']);
            navigation.navigate("events",{community_id:community_id});
        },
    });

    const getEvent = async ()=>{
        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        }
        try {
            const response = await api.get(
                `/user/api/community/${community_id}/community_event/?event_id=${event_id}`,
                config
            )
            return response.data;
        } catch (error) {
            return error;
        }
    };

    const updateEvent = async (data)=>{
        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        }
        try {
            const response = await api.post(
                `/user/api/community/${community_id}/update_event/?event_id=${event_id}`,
                data,
                config
            )
            return response.data;
        } catch (error) {
            return error;
        }
    };

    const deleteEvent = async ()=>{
        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        }
        try {
            const response = await api.post(
                `/user/api/community/${community_id}/delete_event/?event_id=${event_id}`,
                config
            )
            return response.data;
        } catch (error) {
            return error;
        }
    };

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
    const onClose = ()=>{setOpen(prev=>!prev)};
    return (
        <SafeAreaView>
            <CommunityHeader community_id={community_id} />
            {!roleQuery.isLoading && elevatedRoles.includes(roleQuery.data?.role) &&(
                <TouchableOpacity className="flex flex-row space-x-2 items-center px-2 py-4" onPress={onClose}>
                    <FontAwesome name="group" /> 
                    <Text>Actions</Text>
                </TouchableOpacity>
            )}
            <View className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-purple-700 px-6">
                <View className="w-full bg-white rounded-lg shadow-lg p-8 text-center">
                    <Text className="text-xl font-bold text-gray-900">
                        {eventQuery.data?.title}
                    </Text>
                    <Text className="text-gray-600 mt-2">
                        {eventQuery.data?.description}
                    </Text>
                    <View className="mt-4">
                        <Text className="text-lg font-semibold text-gray-800">📅 {eventQuery.data?.timesince}</Text>
                        <Text className="text-lg font-semibold text-gray-800">{eventQuery.data?.venue}</Text>
                    </View>
                    <TouchableOpacity
                    onPress={() => setAttending(!attending)}
                    className={`mt-6 px-6 py-3 rounded-full items-center`}
                    >
                    <Text className={`text-lg font-semibold rounded-md p-2 ${
                        attending
                        ? "bg-red-500 text-white hover:bg-red-600"
                        : "bg-blue-500 text-white hover:bg-blue-600"
                    }`}>
                        {attending ? "Cancel RSVP" : "RSVP Now"}
                    </Text>
                    </TouchableOpacity>
                    {attending && (
                        <Text className="mt-4 text-green-600 font-semibold">✅ You are attending this event!</Text>
                    )}
                </View>
            </View>
            <Modal isOpen={open} onClose={onClose}>
                <EventAdd data={eventQuery.data} update={eventUpdateMutation} remove={eventDeleteMutation} />
            </Modal>
        </SafeAreaView>
    );
};

export default EventPage;