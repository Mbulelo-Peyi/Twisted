import React, { useContext } from 'react';
import { AuthContext, useAxios } from "./";
import { useQuery } from '@tanstack/react-query';
import { Image, TouchableOpacity, View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const ChatCard = ({ chat }) => {
    const { user } = useContext(AuthContext);
    const api = useAxios();
    const navigation = useNavigation();

    const lastMsgQuery = useQuery({
        queryKey: ['last-chat', chat?.id],
        queryFn: ()=> getLastMsg(),
    });

    const getLastMsg = async() =>{
        const config = {
            headers: {
                "Content-Type":"application/json",
            }
        };
        try {
            const response = await api.get(
                `/user/api/last-chat/${chat?.id}/`,
                config
            )
            return response.data;
        } catch (error) {
            
        }
    };
    const contact_id = chat?.members?.filter((member)=>member?.id !== user?.id)[0]?.id
    return (
        <View className="flex flex-row items-center justify-between">
            <View className="flex flex-row py-2 items-center space-x-4">
                <TouchableOpacity onPress={()=>navigation.navigate("BottomAuth",{screen:"profile",params:{user_id:contact_id}})}>
                    <Image
                        src={
                            chat?.members?.filter((member)=>member?.id !== user?.id)[0]?.profile_pic?.length>0?
                            chat?.members?.filter((member)=>member?.id !== user?.id)[0]?.profile_pic?.filter((pic)=>pic.is_active)[0]?.picture:
                            chat?.members?.filter((member)=>member?.id !== user?.id)[0]?.image
                        }
                        alt={chat?.members?.filter((member)=>member?.id !== user?.id)[0]?.username}
                        className="w-12 h-12 rounded-full object-cover"
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>navigation.navigate("DrawerHome",{screen:"chat",params:{room_id:chat?.id}})}>
                    <View>
                        <Text className="font-semibold">{chat?.members?.filter((member)=>member?.id !== user?.id)[0]?.username}</Text>
                        {!lastMsgQuery.isLoading && lastMsgQuery.data?.sender &&(
                            <React.Fragment>
                                {lastMsgQuery.data?.sender?.id === user?.id ?(
                                    <Text className="text-sm text-blue-600">{lastMsgQuery.data?.sender?.username} : {lastMsgQuery.data?.content}</Text>
                                ):(
                                    <Text className="text-sm text-gray-600">{lastMsgQuery.data?.sender?.username} : {lastMsgQuery.data?.content}</Text>
                                )}
                            </React.Fragment>
                        )}
                    </View>
                </TouchableOpacity>
            </View>

        </View>
    )
}

export default ChatCard