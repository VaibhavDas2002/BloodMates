import React, { useEffect, useReducer, useRef, useState } from 'react'
import {
    View,
    Text,
    StyleSheet,
    Alert,
    TouchableOpacity,
    Platform,
} from 'react-native'
import {
    MaterialIcons,
    FontAwesome,
    Fontisto,
    SimpleLineIcons,
    Entypo,
} from '@expo/vector-icons'
import { SafeAreaView } from 'react-native-safe-area-context'
import PageContainer from '../components/PageContainer'
import { COLORS, FONTS } from '../constants'
import Input from '../components/Input'
import Button from '../components/Button'
import * as Location from 'expo-location'
import { getReverseGeocode } from '../utils/location'
import { firebase } from '../config'
import * as Notifications from 'expo-notifications'
import * as Device from 'expo-device'
import Constants from 'expo-constants'

const initialState = {
    inputValues: {
        fullName: '',
        city: '',
        hospital: '',
        bloodType: '',
        mobile: '',
        note: '',
    },
    inputValidities: {
        fullName: false,
        city: false,
        hospital: false,
        bloodType: false,
        mobile: false,
        note: true, // This field is optional, so it's valid by default
    },
    formIsValid: false,
}

const formReducer = (state, action) => {
    if (action.type === 'UPDATE') {
        const updatedValues = {
            ...state.inputValues,
            [action.input]: action.value,
        }
        const updatedValidities = {
            ...state.inputValidities,
            [action.input]: action.isValid,
        }
        let updatedFormIsValid = true
        for (const key in updatedValidities) {
            updatedFormIsValid = updatedFormIsValid && updatedValidities[key]
        }
        return {
            inputValues: updatedValues,
            inputValidities: updatedValidities,
            formIsValid: updatedFormIsValid,
        }
    }
    return state
}

const RequestForm = ({ navigation }) => {
    const [formState, dispatchFormState] = useReducer(formReducer, initialState)
    const [location, setLocation] = useState([])

    const [expoPushToken, setExpoPushToken] = useState('')
    const [channels, setChannels] = useState([])
    const [notification, setNotification] = useState(undefined)
    const notificationListener = useRef()
    const responseListener = useRef()

    Notifications.setNotificationHandler({
        handleNotification: async () => ({
            shouldPlaySound: true,
            shouldShowAlert: true,
            shouldSetBadge: false,
        }),
    })

    useEffect(() => {
        console.log('start')
        registerForPushNotificationsAsync().then(
            (token) => token && setExpoPushToken(token)
        )

        if (Platform.OS === 'android') {
            Notifications.getNotificationChannelsAsync().then((value) =>
                setChannels(value ?? [])
            )
        }
        notificationListener.current =
            Notifications.addNotificationReceivedListener((notification) => {
                setNotification(notification)
            })

        responseListener.current =
            Notifications.addNotificationResponseReceivedListener(
                (response) => {
                    console.log(response)
                }
            )

        return () => {
            notificationListener.current &&
                Notifications.removeNotificationSubscription(
                    notificationListener.current
                )
            responseListener.current &&
                Notifications.removeNotificationSubscription(
                    responseListener.current
                )
        }
    }, [window])

    async function registerForPushNotificationsAsync() {
        let token

        console.log('registering')

        if (Platform.OS === 'android') {
            await Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#FF231F7C',
            })
        }

        if (Device.isDevice) {
            const { status: existingStatus } =
                await Notifications.getPermissionsAsync()
            console.log({ existingStatus })
            let finalStatus = existingStatus
            if (existingStatus !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync()
                finalStatus = status
            }
            if (finalStatus !== 'granted') {
                alert('Failed to get push token for push notification!')
                return
            }
            // Learn more about projectId:
            // https://docs.expo.dev/push-notifications/push-notifications-setup/#configure-projectid
            // EAS projectId is used here.
            try {
                const projectId =
                    Constants?.expoConfig?.extra?.eas?.projectId ??
                    Constants?.easConfig?.projectId

                console.log({ projectId })
                if (!projectId) {
                    throw new Error('Project ID not found')
                }
                token = (
                    await Notifications.getExpoPushTokenAsync({
                        projectId,
                    })
                ).data
                console.log({ token })
            } catch (e) {
                token = `${e}`
            }
        } else {
            alert('Must use physical device for Push Notifications')
        }

        return token
    }

    async function schedulePushNotification() {
        console.log('calling')
        await Notifications.scheduleNotificationAsync({
            content: {
                title: 'Donate Blood',
                body: 'Someone  Needs your blood',
                data: { data: 'goes here', test: { test1: 'more data' } },
            },
            trigger: { seconds: 1 },
        })
    }

    const inputChangedHandler = (inputIdentifier, inputValue) => {
        let isValid = true
        if (inputIdentifier !== 'note' && inputValue.trim().length === 0) {
            isValid = false
        }
        dispatchFormState({
            type: 'UPDATE',
            value: inputValue,
            isValid: isValid,
            input: inputIdentifier,
        })
    }

    const validateForm = () => {
        const { city, hospital, bloodType, mobile } = formState.inputValues
        if (!city || !hospital || !bloodType || !mobile) {
            Alert.alert(
                'Validation Error',
                'All fields except "Add a note" are required.'
            )
            return false
        }
        if (!/^\d+$/.test(mobile)) {
            Alert.alert(
                'Validation Error',
                'Mobile number should contain only digits.'
            )
            return false
        }
        return true
    }

    const fetchLocation = async () => {
        const { status } = await Location.requestForegroundPermissionsAsync()
        if (status !== 'granted') {
            Alert.alert('Permission to access location was denied')
            return
        }

        const location = await Location.getCurrentPositionAsync({})
        const { latitude, longitude } = location.coords

        const { county, city, state_district, state, postcode } =
            await getReverseGeocode(latitude, longitude)

        inputChangedHandler(
            'city',
            `${county}, ${city}, ${state_district}, ${state}, ${postcode}`
        )

        setLocation([latitude, longitude])
    }

    const handleSubmit = async () => {
        if (validateForm()) {
            try {
                const donReqRef = firebase.firestore().collection('don_req')
                const snapshot = await donReqRef.get()
                const nextId = snapshot.size + 1

                const timestamp = new Date().toString()

                await donReqRef.doc(nextId.toString()).set({
                    id: nextId,
                    ...formState.inputValues,
                    city: location,
                    timestamp,
                })

                schedulePushNotification()

                Alert.alert('Success', 'Request submitted successfully!')
                navigation.goBack()
            } catch (error) {
                Alert.alert('Error', 'Something went wrong!')
                console.error(error)
            }
        }
    }

    const renderHeader = () => (
        <View style={styles.header}>
            <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={styles.backButton}
            >
                <MaterialIcons
                    name="keyboard-arrow-left"
                    size={24}
                    color={COLORS.black}
                />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Create a Blood Request</Text>
        </View>
    )

    const renderContent = () => (
        <View style={styles.container}>
            <Input
                id="fullName"
                style={styles.input}
                placeholder="Full Name"
                value={formState.inputValues.fullName}
                onInputChanged={inputChangedHandler}
                icon="hospital-o"
                iconPack={FontAwesome}
            />
            <View style={styles.inputContainer}>
                <Input
                    id="city"
                    style={styles.input}
                    placeholder="City"
                    value={formState.inputValues.city}
                    onInputChanged={inputChangedHandler}
                    icon="location-on"
                    iconPack={MaterialIcons}
                />
                <TouchableOpacity onPress={fetchLocation} style={styles.icon}>
                    <Entypo name="location" size={24} color={COLORS.primary} />
                </TouchableOpacity>
            </View>
            <Input
                id="hospital"
                style={styles.input}
                placeholder="Hospital"
                value={formState.inputValues.hospital}
                onInputChanged={inputChangedHandler}
                icon="hospital-o"
                iconPack={FontAwesome}
            />
            <Input
                id="bloodType"
                style={styles.input}
                placeholder="Blood Type"
                value={formState.inputValues.bloodType}
                onInputChanged={inputChangedHandler}
                icon="blood-drop"
                iconPack={Fontisto}
            />
            <Input
                id="mobile"
                style={styles.input}
                placeholder="Mobile"
                value={formState.inputValues.mobile}
                onInputChanged={inputChangedHandler}
                icon="phone"
                iconPack={FontAwesome}
                keyboardType="phone-pad"
            />
            <Input
                id="note"
                style={[styles.input, styles.noteInput]}
                placeholder="Add a note"
                value={formState.inputValues.note}
                onInputChanged={inputChangedHandler}
                multiline
                icon="note"
                iconPack={SimpleLineIcons}
            />
            <Button
                title="Request"
                onPress={handleSubmit}
                textStyle={styles.buttonText}
            />
        </View>
    )

    return (
        <SafeAreaView style={styles.safeAreaView}>
            <PageContainer>
                <View style={styles.pageContainer}>
                    {renderHeader()}
                    {renderContent()}
                </View>
            </PageContainer>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    safeAreaView: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
    pageContainer: {
        flex: 1,
        paddingHorizontal: 22,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    backButton: {
        height: 44,
        width: 44,
        borderRadius: 4,
        backgroundColor: COLORS.secondaryWhite,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        ...FONTS.h4,
        color: COLORS.black,
    },
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        marginBottom: 16,
    },
    input: {
        flex: 1,
        height: 50,
        fontSize: 16,
    },
    icon: {
        padding: 5,
    },
    noteInput: {
        height: 100,
    },
    button: {
        width: '100%',
        backgroundColor: COLORS.primary,
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: COLORS.white,
        ...FONTS.h4,
    },
})

export default RequestForm
