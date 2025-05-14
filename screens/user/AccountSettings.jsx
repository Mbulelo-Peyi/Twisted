import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView, View, Text, TouchableOpacity } from 'react-native';

const AccountSettings = () => {
    const navigation = useNavigation();

    return (
        <SafeAreaView className="relative">
            <View className="relative left-1/2 sm:w-[85vw] flex items-center max-sm:flex-col max-sm:flex-wrap w-[85vw] max-w-max -translate-x-1/2 px-4">
                <View className="bg-slate-800 border border-slate-400 rounded-md p-8 shadow-lg relative">
                    <Text className="text-4xl text-white font-montserrat font-bold text-center mb-6">Account Settings</Text>
                </View>
                <TouchableOpacity onPress={()=>navigation.navigate("delete-account")} className="w-screen max-w-lg flex-auto overflow-hidden rounded-3xl bg-white text-sm leading-6 shadow-lg ring-1 ring-gray-900/5">
                    <View className="p-4">
                        <View className="group relative flex gap-x-6 rounded-lg p-4 hover:bg-gray-50">
                            <View className="mt-1 flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
                                <AntDesign name="delete"/>
                            </View>
                            <View>
                                <View>
                                    <Text className="font-semibold text-gray-900">Delete Account</Text>
                                    <View className="relative inset-0"></View>
                                </View>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

export default AccountSettings
