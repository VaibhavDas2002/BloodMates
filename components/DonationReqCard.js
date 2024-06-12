import React from 'react'
import { View, Image, Button, StyleSheet } from 'react-native'
import { useNavigation } from '@react-navigation/native'

const DonationReqCard = () => {
    const navigation = useNavigation()

    return (
        <View style={styles.container}>
            <Image
                source={require('../assets/images/pana.png')} // Replace with your image path
                style={styles.image}
            />
            <Button
                title="Go to Home"
                onPress={() => navigation.navigate('Bottom')}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        width: 200,
        height: 200,
        marginBottom: 20,
    },
})

export default DonationReqCard
