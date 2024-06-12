import { validate } from 'validate.js'

export const validateString = (id, value) => {
    const constraints = {
        [id]: {
            presence: {
                allowEmpty: false,
                message: '^This field is required',
            },
            format: {
                pattern: '[a-zA-Z0-9, ]+',
                flags: 'i',
                message:
                    '^Value can only contain letters, numbers, commas, and spaces',
            },
        },
    }

    const validationResult = validate({ [id]: value }, constraints)
    return !validationResult
}

export const validateEmail = (id, value) => {
    const constraints = {
        [id]: {
            presence: {
                allowEmpty: false,
                message: '^This field is required',
            },
            email: {
                message: '^Invalid email address',
            },
        },
    }

    const validationResult = validate({ [id]: value }, constraints)
    return !validationResult
}

export const validatePassword = (id, value) => {
    const constraints = {
        [id]: {
            presence: {
                allowEmpty: false,
                message: '^This field is required',
            },
            length: {
                minimum: 6,
                message: '^Password must be at least 6 characters',
            },
        },
    }

    const validationResult = validate({ [id]: value }, constraints)
    return !validationResult
}
