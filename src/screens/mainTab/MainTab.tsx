import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MainTabParamList } from '../../types/stackTypes';
import BottomTabBar from '../../components/tabBar/BottomTabBar';
import Main from './screens/Main';
import Etc from './screens/Etc';
import MyZ from './screens/MyZ';
import ShopStack from './screens/shopStack/ShopStack';

const Tab = createBottomTabNavigator<MainTabParamList>()

const MainTab = (): JSX.Element => {

    return (
        <Tab.Navigator tabBar={ (props) => <BottomTabBar { ...props } />} >
            <Tab.Screen name='Main' component={ Main } options={{ headerShown: false }} />
            <Tab.Screen name='ShopStack' component={ ShopStack } options={{ headerShown: false }} />
            <Tab.Screen name='MyZ' component={ MyZ }  options={{ headerShown: false }} />
            <Tab.Screen name='Etc' component={ Etc } options={{ headerShown: false }} />
        </Tab.Navigator>
    )
}

export default MainTab