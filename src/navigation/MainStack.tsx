import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MainStackParamList } from '../types/navigation';
import { MainTabs } from './MainTabs';
import { NewReportScreen } from '../screens';

const Stack = createNativeStackNavigator<MainStackParamList>();

export const MainStack: React.FC = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MainTabs"
        component={MainTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="NewReport"
        component={NewReportScreen}
        options={{
          title: 'Nuevo Reporte',
          presentation: 'modal',
        }}
      />
    </Stack.Navigator>
  );
};
