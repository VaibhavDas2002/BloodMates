import { View, Text } from 'react-native'
import React from 'react'
import { COLORS, FONTS, SIZES, icons } from '../constants'
import { Image } from 'react-native'
import * as Linking from 'expo-linking'
import { TouchableOpacity } from 'react-native'

const CampaignCard = (props) => {
    return (
        <View
            style={{
                width: SIZES.width - 44,
                height: 225,
                borderRadius: SIZES.padding,
                backgroundColor: COLORS.white,
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingHorizontal: SIZES.padding,
                paddingVertical: SIZES.padding,
                marginVertical: 4,
                borderColor: COLORS.secondaryWhite,
                borderWidth: 1,
                elevation: 2,
                shadowColor: COLORS.secondaryWhite,
                shadowRadius: 3,
            }}
        >
            <View
                style={{
                    flexDirection: 'column',
                }}
            >
                <Text
                    style={{
                        fontSize: 14,
                        color: COLORS.secondaryBlack,
                        marginVertical: 2,
                    }}
                >
                    Organizer Name
                </Text>
                <Text
                    style={{
                        fontSize: 14,
                        color: COLORS.black,
                        fontWeight: 500,
                    }}
                >
                    {props.name}
                </Text>
                <Text
                    style={{
                        fontSize: 14,
                        color: COLORS.secondaryBlack,
                        marginVertical: 2,
                    }}
                >
                    Organization
                </Text>
                <Text
                    style={{
                        fontSize: 14,
                        color: COLORS.black,
                        fontWeight: 500,
                    }}
                >
                    {props.orgrname}
                </Text>
                <Text
                    style={{
                        fontSize: 14,
                        color: COLORS.secondaryBlack,
                        marginVertical: 2,
                    }}
                >
                    Location
                </Text>
                <Text
                    style={{
                        fontSize: 14,
                        color: COLORS.black,
                        fontWeight: 500,
                        marginVertical: 2,
                    }}
                >
                    {props.location}
                </Text>
                <Text style={{ ...FONTS.body4, color: COLORS.black }}>
                    {new Date(props.Date).toLocaleDateString()}
                    {/* {props.Date} */}
                </Text>
                <Text
                    style={{
                        fontSize: 14,
                        color: COLORS.black,
                        fontWeight: 500,
                        marginVertical: 2,
                    }}
                >
                    Contact
                </Text>
                <Text style={{ ...FONTS.body4, color: COLORS.black }}>
                    {props.mobile}
                </Text>
                <Text style={{ ...FONTS.body4, color: COLORS.black }}>
                    {props.note}
                </Text>
            </View>

            <View
                style={{
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Image source={icons.categoryIcon6} resizeMode="contain" />
                <TouchableOpacity
                    onPress={() => {
                        Linking.openURL(`tel://${props.mobile}`)
                    }}
                >
                    <Text
                        style={{
                            ...FONTS.h4,
                            color: COLORS.primary,
                        }}
                    >
                        Contact
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default CampaignCard
