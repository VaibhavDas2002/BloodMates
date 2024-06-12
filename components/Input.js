import { View, Text, StyleSheet, TextInput } from 'react-native'
import React, { useState } from 'react'
import { COLORS, SIZES } from '../constants'
import CustomDatePicker from './Datepicker'

const Input = (props) => {
    const { isDateType } = props
    const [isOpenDatePicker, setIsOpenDatePicker] = useState(false)
    const [date, setDate] = useState(new Date())

    const onChangeText = (text) => {
        props.onInputChanged(props.id, text)
    }

    const onClick = () => {
        if (isDateType) {
            setIsOpenDatePicker(true)
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.inputContainer}>
                {props.icon && (
                    <props.iconPack
                        name={props.icon}
                        size={24}
                        style={styles.icon}
                    />
                )}
                <TextInput
                    {...props}
                    onChangeText={onChangeText}
                    style={styles.input}
                    placeholder={props.placeholder}
                    placeholderTextColor={COLORS.black}
                    // editable={!isDateType}
                    onFocus={onClick}
                />
                {isDateType && (
                    <CustomDatePicker
                        isOpenDatePicker={isOpenDatePicker}
                        setIsOpenDatePicker={setIsOpenDatePicker}
                        date={date}
                        setDate={setDate}
                        onChangeDate={onChangeText}
                    />
                )}
            </View>
            {props.errorText && (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{props.errorText}</Text>
                </View>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    inputContainer: {
        width: '100%',
        backgroundColor: COLORS.gray,
        paddingHorizontal: SIZES.padding,
        paddingVertical: SIZES.padding,
        borderRadius: 12,
        borderColor: COLORS.primary,
        borderWidth: 1,
        marginVertical: 5,
        flexDirection: 'row',
    },
    icon: {
        marginRight: 10,
        color: COLORS.primary,
    },
    input: {
        color: COLORS.primary,
        flex: 1,
        fontFamily: 'regular',
        paddingTop: 0,
    },
    errorContainer: {
        marginVertical: 4,
    },
    errorText: {
        color: 'red',
        fontSize: 12,
    },
})

export default Input
