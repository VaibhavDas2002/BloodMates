import React, { useEffect, useState } from 'react'
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    Alert,
    Share,
    Linking,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import PageContainer from '../components/PageContainer'
import {
    MaterialIcons,
    Feather,
    EvilIcons,
    Ionicons,
    Entypo,
    MaterialCommunityIcons,
    AntDesign,
} from '@expo/vector-icons'
import { COLORS, FONTS, SIZES, images } from '../constants'
import * as Location from 'expo-location'
import { firebase } from '../config'

const Profile = ({ navigation }) => {
    const [address, setAddress] = useState('Loading...')
    const [errorMsg, setErrorMsg] = useState(null)
    const [userName, setUserName] = useState('Vaibhav Das')
    const [bloodType, setBloodType] = useState('AB+')
    const [phoneNumber, setPhoneNumber] = useState('')

    useEffect(() => {
        const getPermissions = async () => {
            let { status } = await Location.requestBackgroundPermissionsAsync()
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied')
                return
            }

            let location = await Location.getCurrentPositionAsync()
            const { latitude, longitude } = location.coords
            let resolvedAddress = await Location.reverseGeocodeAsync({
                latitude,
                longitude,
            })
            if (resolvedAddress.length > 0) {
                setAddress(
                    `${resolvedAddress[0].name}, ${resolvedAddress[0].district}, ${resolvedAddress[0].city}`
                )
            }
        }

        const fetchUserData = async () => {
            const user = firebase.auth().currentUser
            if (user) {
                const userDoc = await firebase
                    .firestore()
                    .collection('users')
                    .doc(user.uid)
                    .get()
                if (userDoc.exists) {
                    const data = userDoc.data()
                    setUserName(data.fullName || 'No Name Provided')
                    setBloodType(data.bloodType || 'No Blood Type Provided')
                    setPhoneNumber(
                        data.phoneNumber || 'No Phone Number Provided'
                    )
                }
            }
        }

        getPermissions()
        fetchUserData()
    }, [])

    const handleLogout = () => {
        firebase
            .auth()
            .signOut()
            .then(() => {
                navigation.replace('Login')
            })
            .catch((error) => {
                console.error(error)
                Alert.alert('Logout Failed', error.message)
            })
    }

    const handleInviteFriend = () => {
        Share.share({
            message:
                'Hi, I got to know about an app called BLOODMATES. A mate always available during your needy times. Go and Download from IOS: App Store and Android: Play Store',
        }).catch((error) => {
            console.error(error)
            Alert.alert('Error', 'Failed to share')
        })
    }

    const handleCallNow = () => {
        if (phoneNumber) {
            const url = `tel:${phoneNumber}`
            Linking.openURL(url).catch((err) =>
                console.error('Error calling number: ', err)
            )
        } else {
            Alert.alert('Phone number is not available.')
        }
    }

    const handleUrlOpen = () => {
        const url = 'https://forms.gle/hwC1YYwtCgrsMrut6'
        Linking.openURL(url).catch((err) =>
            console.error('Error Opening Feedback form ', err)
        )
    }

    function renderHeader() {
        return (
            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                <TouchableOpacity
                    onPress={() => navigation.navigate('Home')}
                    style={{
                        height: 44,
                        width: 44,
                        borderRadius: 4,
                        backgroundColor: COLORS.secondaryWhite,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <MaterialIcons
                        name="keyboard-arrow-left"
                        size={24}
                        color={COLORS.black}
                    />
                </TouchableOpacity>
                <Text style={{ ...FONTS.h4 }}>Profile</Text>
                <TouchableOpacity onPress={() => console.log('Edit Pressed')}>
                    <Feather name="edit" size={24} color={COLORS.black} />
                </TouchableOpacity>
            </View>
        )
    }

    function renderProfile() {
        return (
            <View style={{ alignItems: 'center', marginVertical: 22 }}>
                <Image
                    source={images.user}
                    resizeMode="contain"
                    style={{
                        height: 100,
                        width: 100,
                        borderRadius: SIZES.padding,
                    }}
                />
                <Text style={{ ...FONTS.h2, marginTop: 24 }}>{userName}</Text>
                <View
                    style={{
                        flexDirection: 'row',
                        marginVertical: SIZES.padding,
                    }}
                >
                    <EvilIcons
                        name="location"
                        size={24}
                        color={COLORS.primary}
                    />
                    <Text style={{ ...FONTS.body4, marginLeft: 8 }}>
                        {address}
                    </Text>
                </View>
            </View>
        )
    }

    function renderButtons() {
        return (
            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                }}
            >
                <TouchableOpacity
                    onPress={handleCallNow}
                    style={{
                        backgroundColor: COLORS.secondary,
                        width: 150,
                        height: 50,
                        borderRadius: SIZES.padding,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Ionicons
                        name="person-add-outline"
                        size={24}
                        color={COLORS.white}
                    />
                    <Text
                        style={{
                            ...FONTS.body4,
                            color: COLORS.white,
                            marginLeft: 12,
                        }}
                    >
                        Call Now
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => console.log('Pressed')}
                    style={{
                        backgroundColor: COLORS.primary,
                        width: 150,
                        height: 50,
                        borderRadius: SIZES.padding,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Entypo name="forward" size={24} color={COLORS.white} />
                    <Text
                        style={{
                            ...FONTS.body4,
                            color: COLORS.white,
                            marginLeft: 12,
                        }}
                    >
                        Request
                    </Text>
                </TouchableOpacity>
            </View>
        )
    }

    function renderFeatures() {
        return (
            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginVertical: 22,
                }}
            >
                <View
                    style={{
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Text style={{ ...FONTS.h1 }}>{bloodType}</Text>
                    <Text style={{ ...FONTS.body3 }}>Blood Type</Text>
                </View>
                <View
                    style={{
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Text style={{ ...FONTS.h1 }}>05</Text>
                    <Text style={{ ...FONTS.body3 }}>Donated</Text>
                </View>
                <View
                    style={{
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Text style={{ ...FONTS.h1 }}>02</Text>
                    <Text style={{ ...FONTS.body3 }}>Requested</Text>
                </View>
            </View>
        )
    }

    function renderSettings() {
        return (
            <View
                style={{
                    flexDirection: 'column',
                }}
            >
                <TouchableOpacity
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginVertical: 12,
                    }}
                    onPress={() => console.log('Pressed')}
                >
                    <MaterialCommunityIcons
                        name="calendar-clock-outline"
                        size={24}
                        color={COLORS.primary}
                    />
                    <Text
                        style={{
                            ...FONTS.body3,
                            marginLeft: 24,
                        }}
                    >
                        Available for Donate
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginVertical: 12,
                    }}
                    onPress={handleInviteFriend}
                >
                    <Ionicons
                        name="share-outline"
                        size={24}
                        color={COLORS.primary}
                    />
                    <Text
                        style={{
                            ...FONTS.body3,
                            marginLeft: 24,
                        }}
                    >
                        Invite a friend
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginVertical: 12,
                    }}
                    onPress={handleUrlOpen}
                >
                    <Feather name="info" size={24} color={COLORS.primary} />
                    <Text
                        style={{
                            ...FONTS.body3,
                            marginLeft: 24,
                        }}
                    >
                        Get help
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginVertical: 12,
                    }}
                    onPress={handleLogout}
                >
                    <AntDesign name="logout" size={24} color={COLORS.primary} />
                    <Text
                        style={{
                            ...FONTS.body3,
                            marginLeft: 24,
                        }}
                    >
                        Logout
                    </Text>
                </TouchableOpacity>
            </View>
        )
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <PageContainer>
                <View style={{ marginHorizontal: 22 }}>
                    {renderHeader()}
                    {renderProfile()}
                    {renderButtons()}
                    {renderFeatures()}
                    {renderSettings()}
                </View>
            </PageContainer>
        </SafeAreaView>
    )
}

export default Profile
