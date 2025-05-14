import React from 'react';
import { createDrawerNavigator, } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons, AntDesign, MaterialIcons, Feather } from '@expo/vector-icons';
import BottomTabNavigation from './BottomTabNavigation';
import AuthNavigation from './AuthNavigation';
import CommunityNavigation from './CommunityNavigation';
import DrawerProfile from '../components/DrawerProfile';
import { AuthContext, Faq } from '../screens/user';
import { Notifications, } from '../screens/notifications';
import { FollowersList, FriendsList, SearchPage, ChatList } from '../screens/content';

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

const DrawerNavigation = () => {
    const { user } = React.useContext(AuthContext);
    return (
        <React.Fragment>
            {user ? (
                <Drawer.Navigator
                drawerContent={
                    (props)=>{
                        return (
                            <DrawerProfile props={props} />
                        )
                    }
                }
                
                screenOptions={{
                    drawerStyle: {
                        backgroundColor: "#fff",
                        width: 250,
                    },
                    headerStyle: {
                        backgroundColor: "#fff",
                    },
                    headerShown: false,
                    headerTintColor: "#000",
                    drawerLabelStyle: {
                        color: "#000",
                        fontSize: 14,
                        marginLeft: -10,
                    },
                }}
                >
                    <Drawer.Screen
                    name='Home'
                    options={{
                        drawerLabel: "Home",
                        title: "Home",
                        headerShadowVisible: false,
                        drawerIcon: ({color})=>(
                            <Ionicons size={24} name="home-outline" color={color} />
                        )
                    }}
                    component={BottomTabNavigation}
                    />
                    <Drawer.Screen
                    name='CommunitiesScreen'
                    options={{
                        drawerLabel: "Communities",
                        title: "Communities",
                        headerShadowVisible: false,
                        drawerIcon: ({color})=>(
                            <MaterialIcons size={24} name="group" color={color} />
                        ),
                        headerShown:false,
                    }}
                    component={CommunityNavigation}
                    />

                    <Drawer.Screen
                    name='ChatScreen'
                    options={{
                        drawerLabel: "Chats",
                        title: "Chats",
                        headerShadowVisible: false,
                        drawerIcon: ({color})=>(
                            <Ionicons size={24} name="chatbox" color={color} />
                        )
                    }}
                    component={ChatList}
                    />
                    <Drawer.Screen
                    name='SearchScreen'
                    options={{
                        drawerLabel: "Search",
                        title: "Search",
                        headerShadowVisible: false,
                        drawerIcon: ({color})=>(
                            <Ionicons size={24} name="search-outline" color={color} />
                        )
                    }}
                    component={SearchPage}
                    />
                    <Drawer.Screen
                    initialParams={{user_id:user?.id}}
                    name='FriendScreen'
                    options={{
                        drawerLabel: "Friends",
                        title: "Friends",
                        headerShadowVisible: false,
                        drawerIcon: ({color})=>(
                            <Feather size={24} name="users" color={color} />
                        )
                    }}
                    component={FriendsList}
                    />
                    <Drawer.Screen
                    initialParams={{user_id:user?.id}}
                    name='FollowerScreen'
                    options={{
                        drawerLabel: "Followers",
                        title: "Followers",
                        headerShadowVisible: false,
                        drawerIcon: ({color})=>(
                            <Feather size={24} name="user-x" color={color} />
                        )
                    }}
                    component={FollowersList}
                    />
                    
                    <Drawer.Screen
                    name='Notifications'
                    options={{
                        drawerLabel: "Notifications",
                        title: "Notifications",
                        headerShadowVisible: false,
                        drawerIcon: ({color})=>(
                            <Ionicons size={24} name="notifications-outline" color={color} />
                        )
                    }}
                    component={Notifications}
                    />
                    <Drawer.Screen
                    name='AuthPath'
                    options={{
                        drawerLabel: "Login",
                        title: "Login",
                        headerShadowVisible: false,
                        drawerIcon: ({color})=>(
                            <AntDesign size={24} name="login" color={color} />
                        )
                    }}
                    component={AuthNavigation}
                    />
                    <Drawer.Screen
                    name='FaqScreen'
                    options={{
                        drawerLabel: "Faq",
                        title: "Faq",
                        headerShadowVisible: false,
                        drawerIcon: ({color})=>(
                            <AntDesign size={24} name="questioncircleo" color={color} />
                        )
                    }}
                    component={Faq}
                    />
                </Drawer.Navigator>
            ): (
                <Stack.Navigator
                screenOptions={{headerShown:false}}
                initialRouteName='DrawerAuth'
                >
                    <Stack.Screen name="DrawerAuth" component={AuthNavigation} />
                </Stack.Navigator>
            )}
        </React.Fragment>
    )
}

export default DrawerNavigation