import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
    CommunityList,
    CommunityMembers,
    CommunityPage,
    CommunityRule,
    CommunityRules,
    EventList,
    EventPage

} from '../screens/community';

const Stack = createNativeStackNavigator()

const CommunityNavigation = () => {
    return (
        <Stack.Navigator
        screenOptions={{
            headerShown:false,
        }}
        initialRouteName='communities'
        >
            
            <Stack.Screen 
            name='communities' 
            screenOptions={{
                headerShown:false,
            }}
            component={CommunityList} />
            <Stack.Screen 
            name='community' 
            screenOptions={{
                headerShown:false,
            }}
            component={CommunityPage} />
            <Stack.Screen 
            name='community-members' 
            screenOptions={{
                headerShown:false,
            }}
            component={CommunityMembers} />
            <Stack.Screen 
            name='community-rules' 
            screenOptions={{
                headerShown:false,
            }}
            component={CommunityRules} />
            <Stack.Screen 
            name='community-rule' 
            screenOptions={{
                headerShown:false,
            }}
            component={CommunityRule} />
            <Stack.Screen 
            name='events' 
            screenOptions={{
                headerShown:false,
            }}
            component={EventList} />
            <Stack.Screen 
            name='event' 
            screenOptions={{
                headerShown:false,
            }}
            component={EventPage} />
        </Stack.Navigator>
    )
}

export default CommunityNavigation;