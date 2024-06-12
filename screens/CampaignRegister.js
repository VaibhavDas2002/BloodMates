import React, { useCallback, useState, useReducer } from 'react'
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native'
import {
    MaterialIcons,
    FontAwesome,
    Fontisto,
    SimpleLineIcons,
    Octicons,
    FontAwesome6, // Changed from FontAwesome6 to FontAwesome5
} from '@expo/vector-icons'
import { SafeAreaView } from 'react-native-safe-area-context'
import PageContainer from '../components/PageContainer'
import { COLORS, FONTS } from '../constants'
import Input from '../components/Input'
import Button from '../components/Button'
import { firebase } from '../config'
import { reducer } from '../utils/reducers/formReducers'
import { validateInput } from '../utils/actions/formActions'
import { formatDate } from '../utils/format'

const initialState = {
    inputValues: {
        organizerName: '',
        organizationName: '',
        address: '',
        donationDate: '',
        phoneNumber: '',
        note: '',
    },
    inputValidities: {
        organizerName: false,
        organizationName: false,
        address: false,
        donationDate: false,
        phoneNumber: false,
        note: true,
    },
    formIsValid: false,
}

const CampaignRegister = ({ navigation }) => {
    const [formState, dispatchFormState] = useReducer(reducer, initialState)

    const inputChangedHandler = useCallback(
        (inputId, inputValue) => {
            const result = validateInput(inputId, inputValue)
            console.log({ inputId, inputValue })
            dispatchFormState({
                type: 'UPDATE_INPUT',
                inputId,
                inputValue,
                validationResult: result,
            })
        },
        [dispatchFormState]
    )
    const handleSubmit = async () => {
        const {
            organizerName,
            organizationName,
            address,
            donationDate,
            phoneNumber,
            note,
        } = formState?.inputValues || {}

        try {
            const campaignRef = firebase.firestore().collection('campaign')
            const snapshot = await campaignRef.get()
            const nextId = snapshot.size + 1

            await campaignRef.doc(nextId.toString()).set({
                id: nextId,
                organizerName,
                organizationName,
                address,
                donationDate: donationDate?.toString(),
                phoneNumber,
                note,
            })

            Alert.alert('Success', 'Campaign scheduled successfully!')
            navigation.goBack()
        } catch (error) {
            Alert.alert('Error', 'Something went wrong!')
            console.error(error)
        }
    }

    return (
        <SafeAreaView style={styles.safeAreaView}>
            <PageContainer>
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
                    <Text style={styles.headerTitle}>Schedule a Campaign</Text>
                </View>
                <View style={styles.contentContainer}>
                    <Input
                        id="organizerName"
                        value={formState.inputValues.organizerName}
                        onInputChanged={inputChangedHandler}
                        placeholder="Name of the Organizer"
                        icon="user"
                        iconPack={FontAwesome}
                    />
                    <Input
                        id="organizationName"
                        value={formState.inputValues.organizationName}
                        onInputChanged={inputChangedHandler}
                        placeholder="Name of the Organization"
                        icon="organization"
                        iconPack={Octicons}
                    />
                    <Input
                        id="address"
                        value={formState.inputValues.address}
                        onInputChanged={inputChangedHandler}
                        placeholder="Full addreess"
                        icon="location-dot"
                        iconPack={FontAwesome6}
                    />
                    <Input
                        id="donationDate"
                        value={formatDate(formState.inputValues.donationDate)}
                        onInputChanged={inputChangedHandler}
                        placeholder="Date of Donation"
                        icon="date"
                        iconPack={Fontisto}
                        isDateType={true}
                    />
                    <Input
                        id="phoneNumber"
                        value={formState.inputValues.phoneNumber}
                        onInputChanged={inputChangedHandler}
                        placeholder="Mobile"
                        icon="phone"
                        iconPack={FontAwesome}
                        keyboardType="phone-pad"
                    />
                    <Input
                        id="note"
                        value={formState.inputValues.note}
                        onInputChanged={inputChangedHandler}
                        placeholder="Add a note"
                        multiline
                        icon="note"
                        iconPack={SimpleLineIcons}
                    />
                    <Button title="Submit" onPress={handleSubmit} />
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
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        paddingHorizontal: 22,
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
    contentContainer: {
        flex: 1,
        paddingHorizontal: 22,
    },
})

export default CampaignRegister
