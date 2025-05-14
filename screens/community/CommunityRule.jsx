import React from 'react';
import { AntDesign } from '@expo/vector-icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CommunityHeader, Rule, useAxios } from "../../components/comps";
import { Modal } from "../../features";
import { useNavigation, useRoute } from '@react-navigation/native';
import { TouchableOpacity, View } from 'react-native';

const CommunityRule = () => {
    const [open, setOpen] = useState(false);
    const { params:{rule_id, community_id} } = useRoute();
    const navigation = useNavigation();
    const api = useAxios();
    const queryClient = useQueryClient();
    const fetchInterval = 1000*60*10;
    const elevatedRoles = ['Moderator','Admin']

    const ruleQuery = useQuery({
        queryKey: ['rule', rule_id],
        queryFn: ()=> getRule(),
        refetchInterval: fetchInterval,
    });
    
    const ruleUpdateMutation = useMutation({
        mutationFn: (variables)=> updateRule(variables),
        onSuccess : ()=> {
            queryClient.invalidateQueries(['rule', rule_id]);
            queryClient.invalidateQueries(['rules', community_id, 'infinite']);
        },
    });
    
    const ruleDeleteMutation = useMutation({
        mutationFn: ()=> deleteRule(),
        onSuccess : ()=> {
            queryClient.removeQueries(['rule', rule_id]);
            queryClient.invalidateQueries(['rules', community_id, 'infinite']);
            navigation.navigate("community-rules",{community_id:community_id});
        },
    });
    
    const getRule = async ()=>{
        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        }
        try {
            const response = await api.get(
                `/user/api/community/${community_id}/community_rule/?rule_id=${rule_id}`,
                config
            )
            return response.data;
        } catch (error) {
            return error;
        }
    };
    
    const updateRule = async (data)=>{
        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        }
        try {
            const response = await api.post(
                `/user/api/community/${community_id}/update_community_rule/?rule_id=${rule_id}`,
                data,
                config
            )
            return response.data;
        } catch (error) {
            return error;
        }
    };
    
    const deleteRule = async ()=>{
        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        }
        try {
            const response = await api.post(
                `/user/api/community/${community_id}/delete_community_rule/?rule_id=${rule_id}`,
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
        <React.Fragment>
            <CommunityHeader community_id={community_id} />
            {!roleQuery.isLoading && elevatedRoles.includes(roleQuery.data?.role) &&(
                <TouchableOpacity onPress={onClose}><AntDesign name="edit" /> <Text>Actions</Text></TouchableOpacity>
            )}
            <View className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-purple-700 px-6">
                <View className="max-w-xl w-full bg-white rounded-lg shadow-lg p-8 text-center">
                    <Text className="text-3xl font-bold text-gray-900">{ruleQuery.data?.title}</Text>
                    <Text className="text-gray-600 mt-2">
                        {ruleQuery.data?.text}
                    </Text>
                </View>
            </View>
            <Modal open={open} onClose={onClose}>
                <Rule data={ruleQuery.data} update={ruleUpdateMutation} remove={ruleDeleteMutation} />
            </Modal>
        </React.Fragment>
    )
}

export default CommunityRule