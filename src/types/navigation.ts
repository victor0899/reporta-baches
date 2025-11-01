import { NavigatorScreenParams } from '@react-navigation/native';

// Auth Stack
export type AuthStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
};

// Main App Stack
export type MainStackParamList = {
  MainTabs: NavigatorScreenParams<MainTabParamList>;
  NewReport: undefined;
};

// Bottom Tabs
export type MainTabParamList = {
  Map: undefined;
  Profile: undefined;
};

// Root Navigator
export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainStackParamList>;
};
