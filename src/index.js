import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import firebase from 'services/firebase';

import Routes from './routes';
import configureStore from './store';
import reportWebVitals from './reportWebVitals';

import 'styles/global.scss';

const store = configureStore({});

firebase.auth().onAuthStateChanged(user => {
	ReactDOM.render(
		<Provider store={store}>
			<Routes user={user} />
		</Provider>,
		document.getElementById('root'),
	);
});

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
