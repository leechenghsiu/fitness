import React from 'react';

import ActionBar from 'components/molecules/ActionBar';

import firebase, { dietRef } from 'services/firebase';

import styles from './styles.module.scss';

const DietManage = ({ isLogin, go }) => {
	if (isLogin) {
		const arr = dietRef
			.where('user', '==', firebase.auth().currentUser?.uid)
			.get()
			.then(snapshot => snapshot.forEach(snap => console.log(snap.data())));
	}
	return (
		<div className={styles.wrapper}>
			<ActionBar go={go} left right />
			<h1>Diet Management</h1>
		</div>
	);
};

export default DietManage;
