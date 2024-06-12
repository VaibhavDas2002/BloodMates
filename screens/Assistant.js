import React, { useState } from 'react'
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    ActivityIndicator,
    StyleSheet,
} from 'react-native'
import axios from 'axios'
import ChatBubble from './ChatBubble'
import { speak, isSpeakingAsync, stop } from 'expo-speech'
import { SafeAreaView } from 'react-native-safe-area-context'
import PageContainer from '../components/PageContainer'
import { images, COLORS, FONTS, SIZES } from '../constants'
import { Ionicons } from '@expo/vector-icons'

const Assistant = ({ navigation }) => {
    const [chat, setChat] = useState([])
    const [userInput, setUserInput] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [isSpeaking, setIsSpeaking] = useState(false)

    const API_KEY = 'AIzaSyDRd9oH0n9WSeUISwts4QzUfL7Arv_7K2E'
    const keywords = [
        'blood',
        'sugar',
        'pressure',
        'lipid profile',
        'cholesterol',
        'dibaties',
    ]

    const handleUserInput = async () => {
        let updatedChat = [
            ...chat,
            {
                role: 'user',
                parts: [{ text: userInput }],
            },
        ]

        // Check for keywords
        const foundKeyword = keywords.some((keyword) =>
            userInput.toLowerCase().includes(keyword)
        )

        if (!foundKeyword) {
            // Default message if no keyword is found
            const defaultMessage =
                'I am your BloodMates assistant !! Ask me anything on your health and Blood 🩸🩸'
            updatedChat = [
                ...updatedChat,
                {
                    role: 'model',
                    parts: [{ text: defaultMessage }],
                },
            ]
            setChat(updatedChat)
            setUserInput('')
            return
        }

        setLoading(true)
        try {
            const response = await axios.post(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`,
                {
                    contents: updatedChat,
                }
            )

            console.log('Gemini Pro API Response:', response.data)

            const modelResponse =
                response.data?.candidates?.[0]?.content?.parts?.[0]?.text || ''

            if (modelResponse) {
                const updatedChatWithModel = [
                    ...updatedChat,
                    {
                        role: 'model',
                        parts: [{ text: modelResponse }],
                    },
                ]

                setChat(updatedChatWithModel)
                setUserInput('')
            }
        } catch (error) {
            console.error('Error calling Gemini Pro API:', error)
            setError('An error occurred. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const handleSpeech = async (text) => {
        if (isSpeaking) {
            stop()
            setIsSpeaking(false)
        } else {
            if (!(await isSpeakingAsync())) {
                speak(text)
                setIsSpeaking(true)
            }
        }
    }

    const renderChatItem = ({ item }) => (
        <ChatBubble
            role={item.role}
            text={item.parts[0].text}
            onSpeech={() => handleSpeech(item.parts[0].text)}
        />
    )
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <PageContainer>
                <View style={styles.container}>
                    <Text style={{ ...FONTS.h2 }}>BloodMates Assistant</Text>
                    <FlatList
                        data={chat}
                        renderItem={renderChatItem}
                        keyExtractor={(item, index) => index.toString()}
                        contentContainerStyle={styles.chatContainer}
                    />
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Type your message..."
                            placeholderTextColor="#aaa"
                            value={userInput}
                            onChangeText={setUserInput}
                        />
                        <TouchableOpacity
                            style={styles.button}
                            onPress={handleUserInput}
                        >
                            <Ionicons
                                name="send"
                                size={24}
                                color={COLORS.primary}
                            />
                        </TouchableOpacity>
                    </View>
                    {loading && (
                        <ActivityIndicator
                            style={styles.loading}
                            color="#333"
                        />
                    )}
                    {error && <Text style={styles.error}>{error}</Text>}
                </View>
            </PageContainer>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f8f8f8',
    },

    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
        marginTop: 40,
        textAlign: 'center',
    },
    chatContainer: {
        flexGrow: 1,
        justifyContent: 'flex-end',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    input: {
        flex: 1,
        height: 50,
        marginRight: 10,
        padding: 8,
        borderColor: COLORS.primary,
        borderWidth: 1,
        borderRadius: 25,
        color: '#333',
        backgroundColor: '#fff',
    },
    button: {
        padding: 10,
        backgroundColor: '#ffffff',
        borderRadius: 25,
        shadowColor: '#000',
        shadowOpacity: 0.5,
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center',
    },
    loading: {
        marginTop: 10,
    },
    error: {
        color: 'red',
        marginTop: 10,
    },
})

export default Assistant
