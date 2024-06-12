import React, { useEffect, useState, useCallback } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { useFonts } from 'expo-font'
import * as SplashScreen from 'expo-splash-screen'
import AsyncStorage from '@react-native-async-storage/async-storage'
import BottomTabNavigation from './navigation/BottomTabNavigation'
import {
    Assistant,
    Campaign,
    Donates,
    GetStarted,
    Home,
    Login,
    OTPVerification,
    OnboardingStarter,
    Register,
    ResetPassword,
    SuccessVerification,
    CampaignRegister,
} from './screens'
import { firebase } from './config' // Import your Firebase configuration

const Stack = createNativeStackNavigator()

export default function App() {
    const [isFirstLaunch, setIsFirstLaunch] = useState(null)
    const [fontsLoaded] = useFonts({
        black: require('./assets/fonts/Poppins-Black.ttf'),
        bold: require('./assets/fonts/Poppins-Bold.ttf'),
        medium: require('./assets/fonts/Poppins-Medium.ttf'),
        regular: require('./assets/fonts/Poppins-Regular.ttf'),
        semiBold: require('./assets/fonts/Poppins-SemiBold.ttf'),
    })
    const [user, setUser] = useState(null)

    const loadFontsAndCheckLaunch = useCallback(async () => {
        await SplashScreen.preventAutoHideAsync()
        try {
            const value = await AsyncStorage.getItem('alreadyLaunched')
            if (value === null) {
                await AsyncStorage.setItem('alreadyLaunched', 'true')
                setIsFirstLaunch(true)
            } else {
                setIsFirstLaunch(false)
            }
        } catch (error) {
            console.error('Error loading data:', error)
        } finally {
            await SplashScreen.hideAsync()
        }
    }, [])

    const handleAuthStateChange = useCallback((user) => {
        setUser(user)
    }, [])

    useEffect(() => {
        loadFontsAndCheckLaunch()
        const unsubscribe = firebase
            .auth()
            .onAuthStateChanged(handleAuthStateChange)
        return unsubscribe
    }, [loadFontsAndCheckLaunch, handleAuthStateChange])

    if (!fontsLoaded || isFirstLaunch === null) {
        return null
    }

    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName={
                    user
                        ? 'BottomTabNavigation'
                        : isFirstLaunch
                        ? 'OnboardingStarter'
                        : 'GetStarted'
                }
            >
                <Stack.Screen
                    name="OnboardingStarter"
                    component={OnboardingStarter}
                    options={{
                        headerShown: false,
                    }}
                />
                <Stack.Screen
                    name="BottomTabNavigation"
                    component={BottomTabNavigation}
                    options={{
                        headerShown: false,
                    }}
                />
                <Stack.Screen
                    name="Login"
                    component={Login}
                    options={{
                        headerShown: false,
                    }}
                />
                <Stack.Screen
                    name="Register"
                    component={Register}
                    options={{
                        headerShown: false,
                    }}
                />
                <Stack.Screen
                    name="Home"
                    component={Home}
                    options={{
                        headerShown: false,
                    }}
                />
                <Stack.Screen
                    name="ResetPassword"
                    component={ResetPassword}
                    options={{
                        headerShown: false,
                    }}
                />
                <Stack.Screen
                    name="OTPVerification"
                    component={OTPVerification}
                    options={{
                        headerShown: false,
                    }}
                />
                <Stack.Screen
                    name="SuccessVerification"
                    component={SuccessVerification}
                    options={{
                        headerShown: false,
                    }}
                />
                <Stack.Screen
                    name="GetStarted"
                    component={GetStarted}
                    options={{
                        headerShown: false,
                    }}
                />
                <Stack.Screen
                    name="Assistant"
                    component={Assistant}
                    options={{
                        headerShown: false,
                    }}
                />
                <Stack.Screen
                    name="Campaign"
                    component={Campaign}
                    options={{
                        headerShown: false,
                    }}
                />
                <Stack.Screen
                    name="Donate Blood"
                    component={Donates}
                    options={{
                        headerShown: false,
                    }}
                />
                <Stack.Screen
                    name="CampaignRegister"
                    component={CampaignRegister}
                    options={{
                        headerShown: false,
                    }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    )
}
