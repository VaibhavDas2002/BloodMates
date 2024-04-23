import React, { useState } from 'react'
import { View, Text, TextInput, Button } from 'react-native'
import axios from 'axios'

const ChatComponent = () => {
    const [query, setQuery] = useState('')
    const [response, setResponse] = useState('')

    const sendQuery = async () => {
        try {
            const apiUrl =
                'https://api.openai.com/v1/engines/text-davinci-003/completions'
            const apiKey = 'YOUR_API_KEY'
            const requestBody = {
                prompt: query,
                max_tokens: 150,
            }
            const headers = {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${apiKey}`,
            }

            const result = await axios.post(apiUrl, requestBody, { headers })
            setResponse(result.data.choices[0].text.trim())
        } catch (error) {
            console.error('Error fetching data:', error)
        }
    }

    return (
        <View
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
            <TextInput
                style={{
                    width: '80%',
                    padding: 10,
                    marginBottom: 20,
                    borderColor: 'gray',
                    borderWidth: 1,
                }}
                placeholder="Type your blood-related query here"
                onChangeText={(text) => setQuery(text)}
                value={query}
            />
            <Button title="Send Query" onPress={sendQuery} />
            {response ? <Text>{response}</Text> : null}
        </View>
    )
}

export default ChatComponent
