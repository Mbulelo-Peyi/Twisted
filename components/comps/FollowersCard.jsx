import React, { useContext } from 'react';
import { CommunityButton, FollowButton, FriendShipButton, useAxios } from '../../features';
import { useQuery } from '@tanstack/react-query';
import { AuthContext } from '.';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';


const FollowersCard = ({ relation, follow, type, community, community_id, user_id }) => {
    const { user } = useContext(AuthContext);
    const api = useAxios();
    const fetchInterval = 1000*60*10;
    const navigation = useNavigation();
    const elevatedRoles = ['Moderator','Admin']
    const roleQuery = useQuery({
        queryKey: ['role', community_id],
        queryFn: ()=> community_id?getRole():(null),
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
    return (
        <View className="flex flex-row items-center justify-between py-2">
            <View className="flex flex-row items-center space-x-4">
                <TouchableOpacity onPress={()=>navigation.navigate("profile", {user_id:relation?.id})}>
                    <Image
                    src={
                        relation?.profile_pic?.length>0? 
                        relation?.profile_pic?.filter((pic)=>pic.is_active)[0]?.picture:
                        relation?.image
                    }
                    alt={relation?.username}
                    className="w-12 h-12 rounded-full object-cover"
                    />
                </TouchableOpacity>
                <View>
                    <Text className="font-semibold">{relation?.username}</Text>
                    <Text className="text-sm text-gray-600">@{relation?.username}</Text>
                </View>
            </View>
            <React.Fragment>
                {community ? (
                    <React.Fragment>
                        {!roleQuery.isLoading && elevatedRoles.includes(roleQuery.data?.role) &&(
                            <CommunityButton id={relation?.id} community_id={community_id} />
                        )}
                    </React.Fragment>
                ):(
                    <React.Fragment>
                        {user_id && type && (
                            <React.Fragment>
                                {user?.id === user_id && (
                                    <React.Fragment>
                                        {follow ?(
                                            <FollowButton id={relation?.id} type={type} />
                                        ):(
                                            <FriendShipButton id={relation?.id} type={type} />
                                        )}
                                    </React.Fragment>
                                )}
                            </React.Fragment>
                        )}
                    </React.Fragment>
                )}
            </React.Fragment>
        </View>
    )
}

export default FollowersCard