//firebase config key setup

import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import 'firebase/compat/firestore'

//Your web app;s Firebsae Configuration
const firebaseConfig = {
    apiKey: 'AIzaSyAKCQyieHNW7L5ImXta27LyfhK-BGcGC38',
    authDomain: 'bloodmates-afcaf.firebaseapp.com',
    projectId: 'bloodmates-afcaf',
    storageBucket: 'bloodmates-afcaf.appspot.com',
    messagingSenderId: '116698440777',
    appId: '1:116698440777:web:aa64a5a695f120200f0b98',
    measurementId: 'G-KZH5CE48KL',
}

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig)
}
export { firebase }
