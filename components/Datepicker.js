// import DatePicker from 'react-native-date-picker'
import DateTimePicker from '@react-native-community/datetimepicker'

const CustomDatePicker = (props) => {
    const {
        isOpenDatePicker,
        setIsOpenDatePicker,
        date,
        setDate,
        onChangeDate,
        mode = 'date',
    } = props

    console.log('opened', { isOpenDatePicker, date })

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate
        setDate(currentDate)
        setIsOpenDatePicker(false)

        const formattedDate = new Date(currentDate)
        onChangeDate(formattedDate)
    }

    return (
        <>
            {isOpenDatePicker && (
                <DateTimePicker
                    testID="dateTimePicker"
                    value={date}
                    mode={mode}
                    is24Hour={true}
                    onChange={onChange}
                />
            )}
        </>
    )
}

export default CustomDatePicker
