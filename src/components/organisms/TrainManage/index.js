import React from 'react';

import ActionBar from 'components/molecules/ActionBar';

import styles from './styles.module.scss';

const TrainManage = ({ go }) => (
	<div className={styles.wrapper}>
		<ActionBar go={go} left />
		<h1>Train Manage</h1>
	</div>
);

export default TrainManage;
