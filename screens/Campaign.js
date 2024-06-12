import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
} from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import PageContainer from '../components/PageContainer'
import { COLORS, SIZES, FONTS } from '../constants'
import { MaterialIcons, Ionicons } from '@expo/vector-icons'
import { fetchCampaignList } from '../utils/service'
import CampaignCard from '../components/CampaignCard'

const Campaign = ({ navigation }) => {
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
                    onPress={() => navigation.navigate('BottomTabNavigation')}
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
                <Text style={{ ...FONTS.h4 }}>Campaign</Text>
                <View>
                    <View style={styles.notificationDot}></View>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('CampaignRegister')}
                    >
                        <Ionicons
                            name="add-sharp"
                            size={28}
                            color={COLORS.black}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    function renderContent() {
        const [campaign, setcampaign] = useState([])

        useEffect(async () => {
            const results = await fetchCampaignList()
            const sorted = results.sort((a, b) => b.Date - a.Date)
            setcampaign(sorted)
        }, [])

        if (campaign.length === 0) {
            return (
                <View
                    style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <Text style={{ ...FONTS.h3 }}>Campaign</Text>
                </View>
            )
        }

        return (
            <ScrollView>
                {campaign.map((Campaign, index) => (
                    <CampaignCard
                        key={index}
                        name={Campaign.orgName}
                        orgrname={Campaign.orgrName}
                        location={Campaign.location}
                        Date={Campaign.Date}
                        mobile={Campaign.mobile}
                        note={Campaign.note}
                    />
                ))}
            </ScrollView>
        )
    }
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <PageContainer>
                <View
                    style={{
                        marginHorizontal: 22,
                    }}
                >
                    {renderHeader()}
                    {renderContent()}
                </View>
            </PageContainer>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    notificationDot: {
        height: 6,
        width: 6,
        backgroundColor: COLORS.primary,
        borderRadius: 3,
        position: 'absolute',
        right: 5,
        top: 5,
    },
})

export default Campaign
