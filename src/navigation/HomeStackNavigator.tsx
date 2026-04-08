import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {HomeScreen} from '../presentation/home/HomeScreen';
import {CardDetailScreen} from '../presentation/cardDetail/CardDetailScreen';

export type HomeStackParamList = {
  HomeMain: {refreshHome?: number} | undefined;
  CardDetail: {maskedCardNumber: string};
};

const Stack = createNativeStackNavigator<HomeStackParamList>();

export function HomeStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}>
      <Stack.Screen name="HomeMain" component={HomeScreen} />
      <Stack.Screen name="CardDetail" component={CardDetailScreen} />
    </Stack.Navigator>
  );
}
