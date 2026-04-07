import {
    ConsolidatedPositionDetailScreen
} from "../presentation/ConsolidatedPosition/ConsolidatedPositionDetailScreen.tsx";
import React from "react";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {HomeScreen} from "../presentation/home/HomeScreen.tsx";

export type HomeStackParamList = {
    Home: {refreshHome?: number};
    ConsolidatedPositionDetailScreen: undefined;
};

const Stack = createNativeStackNavigator<HomeStackParamList>();


export const HomeStackNavigator =()=>{
    return(
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                animation: 'slide_from_right',
            }}>
            <Stack.Screen name="Home" component={HomeScreen}/>
            <Stack.Screen name="ConsolidatedPositionDetailScreen" component={ConsolidatedPositionDetailScreen}/>
        </Stack.Navigator>
    )
}
