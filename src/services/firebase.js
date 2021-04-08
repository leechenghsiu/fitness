import firebase from 'firebase/app';
import 'firebase/analytics';
import 'firebase/auth';
import 'firebase/firestore';

const firebaseConfig = {
	apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
	authDomain: 'fitness-33eed.firebaseapp.com',
	projectId: 'fitness-33eed',
	storageBucket: 'fitness-33eed.appspot.com',
	messagingSenderId: '921814966866',
	appId: process.env.REACT_APP_FIREBASE_APP_ID,
	measurementId: 'G-Z3EH7SP7ZX',
};

firebase.initializeApp(firebaseConfig);
firebase.analytics();

const db = firebase.firestore();
export const userRef = db.collection('user');
export const dietRef = db.collection('diet');
export const trainRef = db.collection('train');

export default firebase;
