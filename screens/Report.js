import { View, Text, TouchableOpacity, Image, FlatList } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import PageContainer from '../components/PageContainer'
import { COLORS, SIZES, FONTS, images } from '../constants'
import { MaterialIcons, EvilIcons } from '@expo/vector-icons'
import { features } from '../constants/data'
import Button from '../components/Button'

const Report = ({ navigation }) => {
    const renderItem = ({ item, index }) => (
        <View
            key={index}
            style={{
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 10,
                borderRadius: 8,
                height: 74,
                width: 110,
                borderColor: COLORS.secondaryWhite,
                borderWidth: 1,
            }}
        >
            <Text
                style={{
                    ...FONTS.body3,
                    fontWeight: 'bold',
                }}
            >
                {item.volume}
            </Text>
            <Text
                style={{
                    ...FONTS.body4,
                }}
            >
                {item.substance}
            </Text>
        </View>
    )

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
                <Text style={{ ...FONTS.h4 }}>Report</Text>
            </View>
        )
    }

    function renderContent() {
        return (
            <>
                <View
                    style={{
                        alignItems: 'center',
                        marginVertical: 22,
                    }}
                >
                    <View
                        style={{
                            flexDirection: 'row',
                        }}
                    >
                        <EvilIcons
                            name="location"
                            size={24}
                            color={COLORS.primary}
                        />
                        <Text style={{ ...FONTS.body4 }}>Research Center</Text>
                    </View>
                    <Text style={{ ...FONTS.body4, marginVertical: 10 }}>
                        Djaka Medical College, Dhaka
                    </Text>
                </View>

                <View
                    style={{
                        alignItems: 'center',
                    }}
                >
                    <Image
                        source={images.secureBlood}
                        resizeMode="contain"
                        style={{
                            marginRight: 30,
                        }}
                    />
                </View>

                <FlatList
                    data={features}
                    numColumns={3}
                    columnWrapperStyle={{
                        justifyContent: 'space-between',
                    }}
                    keyExtractor={(item) => `${item.id}`}
                    renderItem={renderItem}
                    style={{
                        marginTop: SIZES.padding * 2,
                    }}
                />

                <Button
                    title="My Report"
                    filled
                    style={{
                        marginTop: SIZES.padding,
                    }}
                />
            </>
        )
    }
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <PageContainer>
                <View style={{ marginHorizontal: 22 }}>
                    {renderHeader()}
                    {renderContent()}
                </View>
            </PageContainer>
        </SafeAreaView>
    )
}

export default Report
