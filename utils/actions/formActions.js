import {
    validateEmail,
    validatePassword,
    validateString,
} from '../ValidationConstraints'

export const validateInput = (inputId, inputValue) => {
    if (
        inputId === 'fullName' ||
        inputId === 'bloodType' ||
        inputId === 'location' ||
        inputId === 'phoneNumber' ||
        inputId === 'hospital' ||
        inputId === 'DOB' ||
        inputId === 'organizerName' ||
        inputId === 'organizationName' ||
        inputId === 'address' ||
        inputId === 'donationDate' ||
        inputId === 'phoneNumber' ||
        inputId === 'note'
    ) {
        return validateString(inputId, inputValue)
    } else if (inputId === 'email') {
        return validateEmail(inputId, inputValue)
    } else if (inputId === 'password') {
        return validatePassword(inputId, inputValue)
    }
    return false
    // return true
}
