import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    TouchableWithoutFeedback,
    Modal,
    Image,
    FlatList,
    Alert,
} from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import PageContainer from '../components/PageContainer'
import { COLORS, SIZES, FONTS, images, icons } from '../constants'
import {
    MaterialIcons,
    Ionicons,
    EvilIcons,
    MaterialCommunityIcons,
    Entypo,
    AntDesign,
} from '@expo/vector-icons'
// import { donors } from '../constants/data'
import MapView, { Marker } from 'react-native-maps'
import { firebase } from '../config'
import { getReverseGeocode } from '../utils/location'
import * as Linking from 'expo-linking'

const Search = ({ navigation }) => {
    const [search, setSearch] = useState('')
    const [users, setUsers] = useState([])
    const [filteredDonors, setFilteredDonors] = useState(users)
    const [modalVisible, setModalVisible] = useState(false)
    const [currentUserId, setCurrentUserId] = useState('')

    const handleSearch = (data) => {
        setSearch(data)
        const filteredData = users.filter(
            (donor) =>
                donor.location.toLowerCase().includes(data.toLowerCase()) ||
                donor.name.toLowerCase().includes(data.toLowerCase()) ||
                donor.bloodType.toLowerCase().includes(data.toLowerCase())
        )
        setFilteredDonors(filteredData)
    }

    const fetchAllDonors = async () => {
        const snapshot = await firebase.firestore().collection('users').get()
        const results = snapshot.docs.map((doc) => doc.data())

        const _users = results.filter((_item) => _item.id !== undefined)

        let userData = []

        for (let _user of _users) {
            const { county, city, state_district, state, postcode } =
                await getReverseGeocode(_user.location[0], _user.location[1])

            userData.push({
                id: _user.id,
                image: images.user,
                name: _user.fullName,
                location: `${county}\n${city}, ${state_district}\n${state}\nPIN-${postcode}`,
                coordinates: _user.location,
                bloodType: _user.bloodType,
                mobile: _user.phoneNumber,
            })
        }

        console.log({ userData })
        setUsers(userData)
        setFilteredDonors(userData)
    }

    useEffect(() => {
        fetchAllDonors()
    }, [])

    const handleItemClick = (id) => {
        setCurrentUserId(id)
        setModalVisible(true)
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
                <Text style={{ ...FONTS.h4 }}>Search</Text>
            </View>
        )
    }

    function renderSearchBar() {
        return (
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: COLORS.secondaryWhite,
                    height: 48,
                    marginVertical: 22,
                    paddingHorizontal: 22,
                    borderRadius: 4,
                }}
            >
                <AntDesign name="search1" size={24} color="black" />
                <TextInput
                    style={{
                        width: SIZES.width - 144,
                        height: '100%',
                        marginHorizontal: 12,
                    }}
                    placeholder="Search"
                    value={search}
                    onChangeText={handleSearch}
                />
                <TouchableOpacity
                    onPress={() => console.log('Pressed')}
                    style={{
                        height: 48,
                        width: 48,
                        borderRadius: 8,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: COLORS.primary,
                    }}
                >
                    <MaterialCommunityIcons
                        name="swap-vertical"
                        size={24}
                        color={COLORS.white}
                    />
                </TouchableOpacity>
            </View>
        )
    }

    const renderItem = ({ item, index }) => {
        return (
            <TouchableOpacity
                onPress={() => handleItemClick(item.id)}
                key={index}
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    height: 110,
                    borderColor: COLORS.secondaryWhite,
                    borderWidth: 1,
                    borderRadius: 10,
                }}
            >
                <Image
                    source={item.image}
                    resizeMode="contain"
                    style={{
                        height: 85,
                        width: 85,
                        borderRadius: 10,
                        marginRight: 16,
                        marginLeft: 4,
                    }}
                />
                <View
                    style={{
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                    }}
                >
                    <Text
                        style={{
                            ...FONTS.body4,
                            fontWeight: 'bold',
                            marginLeft: 4,
                            marginBottom: 6,
                        }}
                    >
                        {item.name}
                    </Text>
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'center',
                        }}
                    >
                        <EvilIcons
                            name="location"
                            size={24}
                            color={COLORS.primary}
                        />
                        <Text
                            style={{
                                ...FONTS.body4,
                                marginLeft: 8,
                            }}
                        >
                            {item.location}
                        </Text>
                    </View>
                </View>

                <View
                    style={{
                        position: 'absolute',
                        right: 2,
                    }}
                >
                    <Image
                        source={icons.bloodVectorIcon}
                        resizeMode="contain"
                    />
                    <Text
                        style={{
                            ...FONTS.body3,
                            color: COLORS.white,
                            position: 'absolute',
                            top: 20,
                            left: 8,
                        }}
                    >
                        {item.bloodType}
                    </Text>
                </View>
            </TouchableOpacity>
        )
    }

    function renderDonorsList() {
        return (
            <View>
                <FlatList
                    data={filteredDonors}
                    renderItem={renderItem}
                    keyExtractor={(item) => item?.id?.toString()}
                    contentContainerStyle={{
                        flexGrow: 1,
                    }}
                />
            </View>
        )
    }

    function renderDonorsDetails() {
        if (!modalVisible) return <></>

        const donor = users.find((_user) => _user.id === currentUserId)

        if (!donor) {
            return Alert.alert(`Donor not found for ID ${currentUserId}`)
        }

        console.log('Coordinates ', donor.coordinates)
        console.log('Number form ', Number(donor.coordinates[0]))

        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
            >
                <TouchableWithoutFeedback
                    onLongPress={() => setModalVisible(false)}
                >
                    <View
                        style={{
                            flex: 1,
                            alignItems: 'center',
                            bottom: 0,
                        }}
                    >
                        <View
                            style={{
                                height: SIZES.height * 0.7,
                                width: SIZES.width,
                                backgroundColor: '#F5F5FF',
                                borderTopLeftRadius: 30,
                                borderTopRightRdius: 30,
                                position: 'absolute',
                                bottom: 0,
                                alignItems: 'center',
                            }}
                        >
                            <Image
                                source={donor?.image}
                                resizeMode="contain"
                                style={{
                                    height: 120,
                                    width: 120,
                                    borderRadius: 10,
                                    position: 'absolute',
                                    top: -80,
                                }}
                            />
                            <View style={{ marginTop: 30 }}>
                                <Text
                                    style={{
                                        ...FONTS.h3,
                                        marginTop: 24,
                                    }}
                                >
                                    {donor?.name}
                                </Text>
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
                                    <Text
                                        style={{
                                            ...FONTS.body4,
                                            marginLeft: 8,
                                        }}
                                    >
                                        {donor?.location}
                                    </Text>
                                </View>
                            </View>

                            <View
                                style={{
                                    justifyContent: 'space-between',
                                    flexDirection: 'row',
                                    width: '100%',
                                    paddingHorizontal: 22,
                                    marginVertical: 22,
                                }}
                            >
                                <View
                                    style={{
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                    }}
                                >
                                    <MaterialCommunityIcons
                                        name="hand-heart-outline"
                                        size={48}
                                        color={COLORS.primary}
                                    />
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            marginTop: 12,
                                        }}
                                    >
                                        <Text
                                            style={{
                                                ...FONTS.body3,
                                                color: COLORS.primary,
                                                marginRight: 6,
                                            }}
                                        >
                                            6
                                        </Text>
                                        <Text
                                            style={{
                                                ...FONTS.body3,
                                                color: COLORS.secondaryBlack,
                                            }}
                                        >
                                            Times Donated
                                        </Text>
                                    </View>
                                </View>

                                <View
                                    style={{
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                    }}
                                >
                                    <MaterialIcons
                                        name="approval"
                                        size={48}
                                        color={COLORS.primary}
                                    />
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            marginTop: 12,
                                        }}
                                    >
                                        <Text
                                            style={{
                                                ...FONTS.body3,
                                                color: COLORS.primary,
                                                marginRight: 6,
                                            }}
                                        >
                                            Blood Type
                                        </Text>
                                        <Text
                                            style={{
                                                ...FONTS.body3,
                                                color: COLORS.secondaryBlack,
                                            }}
                                        >
                                            {donor?.bloodType}
                                        </Text>
                                    </View>
                                </View>
                            </View>

                            <View
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    width: '100%',
                                    paddingHorizontal: 22,
                                }}
                            >
                                <TouchableOpacity
                                    onPress={() => {
                                        Linking.openURL(
                                            `tel://${donor?.mobile}`
                                        )
                                    }}
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
                                    <Entypo
                                        name="forward"
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
                            </View>

                            {/* just an example to show the maps */}
                            <View
                                style={{
                                    marginHorizontal: 22,
                                    borderRadius: 60,
                                }}
                            >
                                <MapView
                                    style={{
                                        height: 200,
                                        width: SIZES.width - 44,
                                        marginVertical: 22,
                                    }}
                                    region={{
                                        latitude: Number(
                                            donor?.coordinates?.[0]
                                        ),
                                        longitude: Number(
                                            donor?.coordinates?.[1]
                                        ),
                                        latitudeDelta: 0.0922,
                                        longitudeDelta: 0.0921,
                                    }}
                                >
                                    <Marker
                                        key="0"
                                        coordinate={{
                                            latitude: Number(
                                                donor?.coordinates?.[0]
                                            ),
                                            longitude: Number(
                                                donor?.coordinates?.[1]
                                            ),
                                        }}
                                        title={donor.name}
                                    />
                                </MapView>
                            </View>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        )
    }
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <PageContainer>
                <View
                    style={{ marginHorizontal: 22, flex: 1, marginBottom: 200 }}
                >
                    {renderHeader()}
                    {renderSearchBar()}
                    {renderDonorsList()}
                    {renderDonorsDetails()}
                </View>
            </PageContainer>
        </SafeAreaView>
    )
}

export default Search
