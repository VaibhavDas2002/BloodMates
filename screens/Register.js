import React, { useCallback, useReducer, useState } from 'react'
import {
    View,
    Text,
    ScrollView,
    Image,
    TouchableOpacity,
    Alert,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import PageContainer from '../components/PageContainer'
import { FONTS, COLORS, SIZES, images } from '../constants'
import { MaterialIcons, FontAwesome, Fontisto } from '@expo/vector-icons'
import Input from '../components/Input'
import Button from '../components/Button'
import { reducer } from '../utils/reducers/formReducers'
import { validateInput } from '../utils/actions/formActions'
import { firebase } from '../config' // Import Firebase from Code 1
import * as Location from 'expo-location'

const initialState = {
    inputValues: {
        email: '',
        password: '',
        fullName: '',
        phoneNumber: '',
        bloodType: '',
        location: '',
    },
    inputValidities: {
        email: false,
        password: false,
        fullName: false,
        phoneNumber: false,
        bloodType: false,
        location: false,
    },
    formIsValid: false,
}

const Register = ({ navigation }) => {
    const [formState, dispatchFormState] = useReducer(reducer, initialState)
    const [error, setError] = useState('')

    const inputChangedHandler = useCallback(
        (inputId, inputValue) => {
            const result = validateInput(inputId, inputValue)
            dispatchFormState({ inputId, inputValue, validationResult: result })
        },
        [dispatchFormState]
    )

    const fetchLocation = async () => {
        const { status } = await Location.requestForegroundPermissionsAsync()
        if (status !== 'granted') {
            Alert.alert('Permission to access location was denied')
            return
        }

        const location = await Location.getCurrentPositionAsync({})
        const { latitude, longitude } = location.coords
        inputChangedHandler('location', `${latitude}, ${longitude}`)
    }

    const registerUser = async () => {
        try {
            setError('')
            await firebase
                .auth()
                .createUserWithEmailAndPassword(
                    formState.inputValues.email,
                    formState.inputValues.password
                )
                .then(async (userCredential) => {
                    const user = userCredential.user
                    await user.sendEmailVerification({
                        handleCodeInApp: true,
                        url: 'https://bloodmates-afcaf.firebaseapp.com', // Ensure URL is correctly formatted
                    })
                    await firebase
                        .firestore()
                        .collection('users')
                        .doc(user.uid)
                        .set({
                            fullName: formState.inputValues.fullName,
                            email: formState.inputValues.email,
                            phoneNumber: formState.inputValues.phoneNumber,
                            bloodType: formState.inputValues.bloodType,
                            location: formState.inputValues.location,
                        })
                    navigation.navigate('Home')
                })
        } catch (error) {
            setError(error.message)
        }
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <PageContainer>
                <ScrollView>
                    <View
                        style={{
                            flex: 1,
                            marginHorizontal: 22,
                            alignItems: 'center',
                        }}
                    >
                        <Image
                            source={images.logo}
                            resizeMode="contain"
                            style={{
                                tintColor: COLORS.primary,
                                marginVertical: 22,
                            }}
                        />

                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                            }}
                        >
                            <Text
                                style={{ ...FONTS.h1, color: COLORS.primary }}
                            >
                                Blood
                            </Text>
                            <Text
                                style={{
                                    ...FONTS.h1,
                                    color: COLORS.black,
                                    marginHorizontal: 8,
                                }}
                            >
                                🩸
                            </Text>
                            <Text
                                style={{ ...FONTS.h1, color: COLORS.primary }}
                            >
                                Mates
                            </Text>
                        </View>

                        <View style={{ marginVertical: 20 }}>
                            <Input
                                icon="user"
                                iconPack={FontAwesome}
                                id="fullName"
                                onInputChanged={inputChangedHandler}
                                errorText={
                                    !formState.inputValidities.fullName && error
                                }
                                placeholder="Enter your full name"
                            />
                            <Input
                                icon="email"
                                iconPack={MaterialIcons}
                                id="email"
                                onInputChanged={inputChangedHandler}
                                errorText={
                                    !formState.inputValidities.email && error
                                }
                                placeholder="Enter your email"
                                keyboardType="email-address"
                            />
                            <Input
                                icon="lock"
                                iconPack={FontAwesome}
                                id="password"
                                onInputChanged={inputChangedHandler}
                                errorText={
                                    !formState.inputValidities.password && error
                                }
                                autoCapitalize="none"
                                placeholder="Enter your password"
                                secureTextEntry
                            />
                            <Input
                                icon="phone"
                                iconPack={FontAwesome}
                                id="phoneNumber"
                                onInputChanged={inputChangedHandler}
                                errorText={
                                    !formState.inputValidities.phoneNumber &&
                                    error
                                }
                                placeholder="Enter your phone number"
                            />
                            <Input
                                icon="blood-drop"
                                iconPack={Fontisto}
                                id="bloodType"
                                onInputChanged={inputChangedHandler}
                                errorText={
                                    !formState.inputValidities.bloodType &&
                                    error
                                }
                                autoCapitalize
                                placeholder="Enter your blood type"
                            />
                            <Input
                                icon="location-on"
                                iconPack={MaterialIcons}
                                id="location"
                                value={formState.inputValues.location}
                                onInputChanged={inputChangedHandler}
                                errorText={
                                    !formState.inputValidities.location && error
                                }
                                placeholder="Enter your location"
                            />
                            <Button
                                title="Use Current Location"
                                filled
                                onPress={fetchLocation}
                                style={{
                                    width: '80%',
                                    marginVertical: 5,
                                }}
                            />
                        </View>
                        <Button
                            title="REGISTER"
                            filled
                            onPress={registerUser}
                            style={{
                                width: '100%',
                            }}
                            disabled={!formState.formIsValid}
                        />

                        {error ? (
                            <Text style={{ color: 'red', marginTop: 10 }}>
                                {error}
                            </Text>
                        ) : null}

                        <View
                            style={{
                                marginVertical: 20,
                                flexDirection: 'row',
                            }}
                        >
                            <Text
                                style={{ ...FONTS.body3, color: COLORS.black }}
                            >
                                Already have an account?{' '}
                            </Text>
                            <TouchableOpacity
                                onPress={() => navigation.navigate('Login')}
                            >
                                <Text
                                    style={{
                                        ...FONTS.body3,
                                        color: COLORS.primary,
                                    }}
                                >
                                    Login
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </PageContainer>
        </SafeAreaView>
    )
}

export default Register
