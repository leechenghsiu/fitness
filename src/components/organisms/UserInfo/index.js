import React from 'react';

import ActionBar from 'components/molecules/ActionBar';

import styles from './styles.module.scss';

const UserInfo = ({ isLogin, go }) => (
	<div className={styles.wrapper}>
		<ActionBar go={go} right isLogin={isLogin} />
		<h1>Your Fitness Pal</h1>
	</div>
);

export default UserInfo;
