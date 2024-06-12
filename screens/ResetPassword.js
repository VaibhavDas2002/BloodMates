import { View, Text, Image, TouchableOpacity } from 'react-native'
import React, { useCallback, useReducer, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import PageContainer from '../components/PageContainer'
import { COLORS, FONTS, SIZES, images } from '../constants'
import { MaterialIcons } from '@expo/vector-icons'
import Input from '../components/Input'
import Button from '../components/Button'
import { reducer } from '../utils/reducers/formReducers'
import { validateInput } from '../utils/actions/formActions'
import { firebase } from '../config'

const initialState = {
    inputValidities: {
        email: false,
        password: false,
    },
    formIsValid: false,
}

const ResetPassword = ({ navigation }) => {
    const [formState, dispatchFormState] = useReducer(reducer, initialState)
    const [email, setEmail] = useState('')
    const [error, setError] = useState('')

    const inputChangedHandler = useCallback(
        (inputId, inputValue) => {
            const result = validateInput(inputId, inputValue)
            dispatchFormState({ inputId, validationResult: result })
            if (inputId === 'email') {
                setEmail(inputValue)
            }
        },
        [dispatchFormState]
    )

    const sendResetEmailHandler = async () => {
        try {
            await firebase.auth().sendPasswordResetEmail(email)
            navigation.navigate('SuccessVerification')
        } catch (error) {
            setError(error.message)
        }
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <PageContainer>
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
                            marginVertical: 48,
                        }}
                    />

                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}
                    >
                        <Text style={{ ...FONTS.h2, color: COLORS.primary }}>
                            Reset
                        </Text>
                        <Text
                            style={{
                                ...FONTS.h2,
                                color: COLORS.black,
                                marginHorizontal: 8,
                            }}
                        >
                            Your
                        </Text>
                        <Text style={{ ...FONTS.h2, color: COLORS.primary }}>
                            Password
                        </Text>
                    </View>

                    <View style={{ marginVertical: 20 }}>
                        <Input
                            icon="email"
                            iconPack={MaterialIcons}
                            id="email"
                            onInputChanged={inputChangedHandler}
                            errorText={formState.inputValidities['email']}
                            placeholder="Enter your email"
                            keyboardType="email-address"
                        />
                    </View>
                    <Text
                        style={{
                            ...FONTS.body3,
                            textAlign: 'center',
                            marginVertical: 14,
                        }}
                    >
                        Your password reset will be sent to your registered
                        email
                    </Text>
                    {error ? (
                        <Text style={{ color: 'red' }}>{error}</Text>
                    ) : null}
                    <Button
                        title="SEND"
                        filled
                        onPress={sendResetEmailHandler}
                        style={{
                            width: '100%',
                        }}
                    />

                    <TouchableOpacity
                        onPress={() => navigation.navigate('Login')}
                    >
                        <Text
                            style={{
                                ...FONTS.body3,
                                color: COLORS.primary,
                                marginVertical: 12,
                            }}
                        >
                            Remember Password
                        </Text>
                    </TouchableOpacity>
                </View>
            </PageContainer>
        </SafeAreaView>
    )
}

export default ResetPassword
