import { AntDesign } from '@expo/vector-icons';
import React, { useContext } from 'react';
import { SafeAreaView, View } from 'react-native';
import SettingsOption from '../../components/SettingsOption';
import AuthContext from '../../context/AuthContext';


const Settings = () => {
    const { user } = useContext(AuthContext);
    return (
        <SafeAreaView className="relative">
            <View className="relative left-1/2 sm:w-[85vw] flex w-[85vw] max-w-max -translate-x-1/2 px-4">
                <View className="w-screen max-w-lg flex-auto overflow-hidden rounded-3xl bg-white text-sm leading-6 shadow-lg ring-1 ring-gray-900/5">
                    <View className="p-4">
                        <SettingsOption 
                        icon={<AntDesign name="profile" size={16}/>}
                        title={"Profile"}
                        info={"Update your profile information"}
                        link={"profile"}
                        user_id={user?.id}
                        />
                        
                        <SettingsOption 
                        icon={<AntDesign name="lock" size={16}/>}
                        title={"Change Password"}
                        info={"Update your password"}
                        link={"password-update"}
                        />
                        
                        <SettingsOption 
                        icon={<AntDesign name="setting" size={16}/>}
                        title={"Account Settings"}
                        info={"Your account options"}
                        link={"account-options"}
                        />
                        
                        <SettingsOption 
                        icon={<AntDesign name="info" size={16}/>}
                        title={"Terms"}
                        info={"View our Terms and Conditions"}
                        link={"Login"}
                        />
                        
                        <SettingsOption 
                        icon={<AntDesign name="mail" size={16}/>}
                        title={"Report"}
                        info={"You can report any issues here"}
                        link={"complaint"}
                        />
                    </View>
                </View>
            </View>
        </SafeAreaView>
    ) 
}

export default Settings
