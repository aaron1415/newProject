import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { HomeScreen, ComplaintScreen, HistoryScreen, ProfileScreen, ChangePasswordScreen, ViewComplaintScreen } from '../screens';

const Stack = createStackNavigator();

export const AppStack = () => {
  return (
    <Stack.Navigator
      initialRouteName = 'Home'
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#000000' },
        cardStyleInterpolator: ({ current: { progress } }) => ({
          cardStyle: {
            opacity: progress,
          },
        }),
      }}
    >
      <Stack.Screen name='Home' component={HomeScreen} />
      <Stack.Screen name='Profile' component={ProfileScreen} />
      <Stack.Screen name='Complaint' component={ComplaintScreen} />
      <Stack.Screen name='History' component={HistoryScreen} />
      <Stack.Screen name='ViewComplaint' component={ViewComplaintScreen} />
      <Stack.Screen name='ChangePassword' component={ChangePasswordScreen} />
    </Stack.Navigator>
  );
};
