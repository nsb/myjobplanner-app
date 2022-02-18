import * as React from 'react';
import { View, Text } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import type { DrawerScreenProps } from '@react-navigation/drawer';
import { SafeAreaProvider } from 'react-native-safe-area-context';

type DrawerParamList = {
    Home: undefined
}
type HomeProps = DrawerScreenProps<DrawerParamList, 'Home'>;

const Drawer = createDrawerNavigator<DrawerParamList>();

function HomeScreen({ navigation }: HomeProps) {
    return (
        <View>
            <Text>Hello world</Text>
        </View>
    )
}

export default function App() {
    return (
        <SafeAreaProvider>
            <NavigationContainer>
                <Drawer.Navigator initialRouteName='Home'>
                    <Drawer.Screen name="Home" component={HomeScreen} />
                </Drawer.Navigator>
            </NavigationContainer>
        </SafeAreaProvider>
    )
}