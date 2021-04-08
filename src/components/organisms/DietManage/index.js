import React from 'react';

import ActionBar from 'components/molecules/ActionBar';

import styles from './styles.module.scss';

const DietManage = ({ go }) => (
	<div className={styles.wrapper}>
		<ActionBar go={go} left right />
		<h1>Diet Manage</h1>
	</div>
);

export default DietManage;
