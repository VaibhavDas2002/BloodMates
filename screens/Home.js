import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons'
import { COLORS, SIZES, FONTS } from '../constants'
import Slideshow from 'react-native-image-slider-show'
import { categories } from '../constants/data'
import DonationCard from '../components/DonationCard'
import { useNavigation } from '@react-navigation/native'
import { fetchDonationRequests } from '../utils/service'

const Home = () => {
    const [position, setPosition] = useState(0)
    const [dataSource, setDataSource] = useState([
        {
            url: 'https://i.ibb.co/YXKSm0q/16262070-tp227-facebookeventcover-06.jpg',
        },
        {
            url: 'https://i.ibb.co/vhBbSQf/16262056-tp227-facebookeventcover-04.jpg',
        },
    ])

    const navigation = useNavigation()

    useEffect(() => {
        const toggle = setInterval(() => {
            setPosition(position === dataSource.length - 1 ? 0 : position + 1)
        }, 3000)

        return () => clearInterval(toggle)
    }, [position, dataSource.length])

    const renderHeader = () => (
        <View style={styles.header}>
            <TouchableOpacity onPress={() => console.log('Pressed')}>
                <MaterialCommunityIcons
                    name="view-dashboard"
                    size={28}
                    color={COLORS.primary}
                />
            </TouchableOpacity>
            <View>
                <View style={styles.notificationDot}></View>
                <TouchableOpacity onPress={() => console.log('Pressed')}>
                    <Ionicons
                        name="notifications-outline"
                        size={28}
                        color={COLORS.black}
                    />
                </TouchableOpacity>
            </View>
        </View>
    )

    const renderSliderBanner = () => (
        <View style={styles.sliderBanner}>
            <Slideshow position={position} dataSource={dataSource} />
        </View>
    )

    const renderFeatures = () => (
        <View style={styles.featuresContainer}>
            {categories.map((category, index) => (
                <TouchableOpacity
                    key={index}
                    style={styles.featureCard}
                    onPress={() => navigation.navigate(category.screen)}
                >
                    <Image
                        source={category.icon}
                        resizeMode="contain"
                        style={styles.featureImage}
                    />
                    <Text style={styles.featureText}>{category.title}</Text>
                </TouchableOpacity>
            ))}
        </View>
    )

    const renderDonationCard = () => {
        const [latestCard, setLatestCard] = useState({})

        const getLatestCard = async () => {
            const results = await fetchDonationRequests()
            const sortedResults = results.sort(
                (a, b) => b.timestamp - a.timestamp
            )
            setLatestCard(sortedResults[0])
        }

        useEffect(() => {
            getLatestCard()
        }, [window])

        return (
            latestCard.bloodType && (
                <View>
                    <Text style={styles.donationTitle}>Donation request</Text>
                    <DonationCard
                        name={latestCard.name}
                        location={latestCard.location}
                        bloodType={latestCard.bloodType}
                        postedDate={latestCard.postedDate}
                    />
                </View>
            )
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                {renderHeader()}
                {renderSliderBanner()}
                {renderFeatures()}
                {renderDonationCard()}
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
    content: {
        marginHorizontal: 22,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 12,
    },
    notificationDot: {
        height: 6,
        width: 6,
        backgroundColor: COLORS.primary,
        borderRadius: 3,
        position: 'absolute',
        right: 5,
        top: 5,
    },
    sliderBanner: {
        height: 200,
        width: '100%',
    },
    featuresContainer: {
        marginVertical: SIZES.padding,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
    },
    featureCard: {
        height: 120,
        width: 110,
        borderColor: COLORS.secondaryWhite,
        borderWidth: 2,
        backgroundColor: COLORS.white,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 22,
    },
    featureImage: {
        height: 40,
        width: 40,
        marginVertical: 12,
    },
    featureText: {
        ...FONTS.body3,
        color: COLORS.secondaryBlack,
    },
    donationTitle: {
        ...FONTS.body3,
        fontWeight: 'bold',
        color: COLORS.secondaryBlack,
    },
})

export default Home
