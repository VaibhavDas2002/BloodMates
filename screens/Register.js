import React, { useCallback, useReducer, useState } from 'react'
import {
    View,
    Text,
    ScrollView,
    Image,
    TouchableOpacity,
    Alert,
} from 'react-native'
import CheckBox from 'expo-checkbox'
import { SafeAreaView } from 'react-native-safe-area-context'
import PageContainer from '../components/PageContainer'
import { FONTS, COLORS, images } from '../constants'
import {
    MaterialIcons,
    FontAwesome,
    Fontisto,
    Entypo,
} from '@expo/vector-icons'
import Input from '../components/Input'
import Button from '../components/Button'
import { reducer } from '../utils/reducers/formReducers'
import { validateInput } from '../utils/actions/formActions'
import { firebase } from '../config'
import * as Location from 'expo-location'
import { getReverseGeocode } from '../utils/location'
import { formatDate } from '../utils/format'

const initialState = {
    inputValues: {
        email: '',
        password: '',
        fullName: '',
        phoneNumber: '',
        bloodType: '',
        location: '',
        hospital: '',
        DOB: '',
        lastDonationDate: '', // New field
    },
    inputValidities: {
        email: false,
        password: false,
        fullName: false,
        phoneNumber: false,
        bloodType: false,
        location: false,
        hospital: false,
        DOB: false,
        lastDonationDate: true, // This field is optional, so it's valid by default
    },
    formIsValid: false,
}

const Register = ({ navigation }) => {
    const [formState, dispatchFormState] = useReducer(reducer, initialState)
    const [error, setError] = useState('')
    const [isDeclared, setIsDeclared] = useState(false) // New state
    const [location, setLocation] = useState([])

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
        setLocation([latitude, longitude])

        const { county, city, state_district, state, postcode } =
            await getReverseGeocode(latitude, longitude)

        inputChangedHandler(
            'location',
            `${county}, ${city}, ${state_district}, ${state}, ${postcode}`
        )
    }

    const registerUser = async () => {
        if (!isDeclared) {
            Alert.alert('Please accept the condition')
            return
        }

        try {
            setError('')
            const userCredential = await firebase
                .auth()
                .createUserWithEmailAndPassword(
                    formState.inputValues.email,
                    formState.inputValues.password
                )
            const user = userCredential.user

            await user.sendEmailVerification({
                handleCodeInApp: true,
                url: 'https://bloodmates-afcaf.firebaseapp.com',
            })

            const usersRef = firebase.firestore().collection('users')
            const userCountDoc = await usersRef.doc('userCount').get()

            let userId
            if (!userCountDoc.exists) {
                await usersRef.doc('userCount').set({ count: 1 })
                userId = 1
            } else {
                const currentCount = userCountDoc.data().count
                userId = currentCount + 1
                await usersRef.doc('userCount').update({ count: userId })
            }

            await usersRef.doc(user.uid).set({
                id: userId,
                fullName: formState.inputValues.fullName,
                email: formState.inputValues.email,
                phoneNumber: formState.inputValues.phoneNumber,
                bloodType: formState.inputValues.bloodType,
                // location: formState.inputValues.location,
                location: location,
                hospital: formState.inputValues.hospital,
                DOB: formState.inputValues.DOB,
                lastDonationDate: formState.inputValues.lastDonationDate, // New field
            })

            Alert.alert(
                'Success',
                'Verification Mail sent to your email address'
            )

            navigation.navigate('BottomTabNavigation')
        } catch (error) {
            console.log('Error during registration:', error) // Log the error
            setError(error.message)
        }
    }

    console.log('Input value DOB', formState.inputValues.DOB)
    console.log('Input value bloodType', formState.inputValues.bloodType)

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
                                value={formState.inputValues.fullName}
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
                                value={formState.inputValues.email}
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
                                value={formState.inputValues.password}
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
                                value={formState.inputValues.phoneNumber}
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
                                value={formState.inputValues.bloodType}
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
                                placeholder="Enter your full location"
                            />
                            <Input
                                icon="hospital-o"
                                iconPack={FontAwesome}
                                id="hospital"
                                value={formState.inputValues.hospital}
                                onInputChanged={inputChangedHandler}
                                errorText={
                                    !formState.inputValidities.hospital && error
                                }
                                placeholder="Nearest Hospital/Blood Donation Center"
                            />
                            <Input
                                icon="calendar"
                                iconPack={FontAwesome}
                                id="DOB"
                                type="date"
                                value={formatDate(
                                    formState.inputValues.DOB,
                                    'Date of Birth (DD/MM/YYYY)'
                                )}
                                onInputChanged={inputChangedHandler}
                                errorText={
                                    !formState.inputValidities.DOB && error
                                }
                                placeholder="Date of Birth (DD/MM/YYYY)"
                                isDateType={true}
                            />
                            <Input
                                icon="calendar"
                                iconPack={FontAwesome}
                                id="lastDonationDate"
                                value={formatDate(
                                    formState.inputValues.lastDonationDate,
                                    'Date of Last Blood Donation (optional)'
                                )}
                                onInputChanged={inputChangedHandler}
                                errorText={
                                    !formState.inputValidities
                                        .lastDonationDate && error
                                }
                                placeholder="Date of Last Blood Donation (optional)"
                                isDateType={true}
                            />
                            <TouchableOpacity
                                onPress={fetchLocation}
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    marginTop: 10,
                                }}
                            >
                                <Entypo
                                    name="location"
                                    size={24}
                                    color={COLORS.primary}
                                />
                                <Text style={{ marginLeft: 10 }}>
                                    Current Location
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                marginVertical: 10,
                            }}
                        >
                            <CheckBox
                                value={isDeclared}
                                onValueChange={setIsDeclared}
                                style={{ marginRight: 10 }}
                                color={isDeclared ? COLORS.primary : undefined}
                            />
                            <Text
                                style={{ ...FONTS.body4, color: COLORS.black }}
                            >
                                I hereby declare that I am physically fit and
                                have no health-related issues
                            </Text>
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
