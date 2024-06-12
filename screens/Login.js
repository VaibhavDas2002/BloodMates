import React, { useCallback, useReducer, useState } from 'react'
import { View, Text, Image, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { MaterialIcons, FontAwesome } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import PageContainer from '../components/PageContainer'
import Input from '../components/Input'
import Button from '../components/Button'
import { COLORS, images, FONTS } from '../constants'
import { reducer } from '../utils/reducers/formReducers'
import { validateInput } from '../utils/actions/formActions'
import { firebase } from '../config'

const initialState = {
    inputValues: {
        email: '',
        password: '',
    },
    inputValidities: {
        email: false,
        password: false,
    },
    formIsValid: false,
}

const Login = () => {
    const navigation = useNavigation()
    const [formState, dispatchFormState] = useReducer(reducer, initialState)
    const [error, setError] = useState('')

    const inputChangedHandler = useCallback(
        (inputId, inputValue) => {
            const trimmedValue = inputValue.trim() // Trim input
            const result = validateInput(inputId, trimmedValue)

            dispatchFormState({
                type: 'UPDATE',
                inputId,
                validationResult: result,
                inputValue: trimmedValue,
            })
        },
        [dispatchFormState]
    )

    const loginUser = async () => {
        if (!formState.formIsValid) {
            setError(
                'Please check your email and password are entered correctly.'
            )
            return
        }
        try {
            await firebase
                .auth()
                .signInWithEmailAndPassword(
                    formState.inputValues.email,
                    formState.inputValues.password
                )
            navigation.navigate('BottomTabNavigation')
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
                        style={{ flexDirection: 'row', alignItems: 'center' }}
                    >
                        <Text style={{ ...FONTS.h1, color: COLORS.primary }}>
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
                        <Text style={{ ...FONTS.h1, color: COLORS.primary }}>
                            Mates
                        </Text>
                    </View>
                    <View style={{ marginVertical: 20 }}>
                        <Input
                            icon="email"
                            iconPack={MaterialIcons}
                            id="email"
                            onInputChanged={inputChangedHandler}
                            errorText={
                                !formState.inputValidities['email'] && error
                            }
                            placeholder="Enter your email"
                            keyboardType="email-address"
                        />
                        <Input
                            icon="lock"
                            iconPack={FontAwesome}
                            id="password"
                            onInputChanged={inputChangedHandler}
                            errorText={
                                !formState.inputValidities['password'] && error
                            }
                            autoCapitalize="none"
                            placeholder="Enter your password"
                            secureTextEntry
                        />
                    </View>
                    <Button
                        title="LOGIN"
                        filled
                        onPress={loginUser}
                        style={{ width: '100%' }}
                    />
                    {error ? (
                        <Text style={{ color: 'red' }}>{error}</Text>
                    ) : null}
                    <TouchableOpacity
                        onPress={() => navigation.navigate('ResetPassword')}
                    >
                        <Text
                            style={{
                                ...FONTS.body3,
                                color: COLORS.primary,
                                marginVertical: 12,
                            }}
                        >
                            Forgot Password?
                        </Text>
                    </TouchableOpacity>
                    <View style={{ marginVertical: 20, flexDirection: 'row' }}>
                        <Text style={{ ...FONTS.body3, color: COLORS.black }}>
                            Don't have an account ?{' '}
                        </Text>
                        <TouchableOpacity
                            onPress={() => navigation.navigate('Register')}
                        >
                            <Text
                                style={{
                                    ...FONTS.body3,
                                    color: COLORS.primary,
                                }}
                            >
                                Register
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </PageContainer>
        </SafeAreaView>
    )
}

export default Login
