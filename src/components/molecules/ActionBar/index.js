import React from 'react';
import {
	SwapLeftOutlined,
	SwapRightOutlined,
	LoginOutlined,
	LogoutOutlined,
} from '@ant-design/icons';

import { authMethods } from 'services/firebaseAuth';

import styles from './styles.module.scss';

const ActionBar = ({ go, left = false, right = false, isLogin = null }) => (
	<div className={styles.actionBarWrapper}>
		{isLogin !== null &&
			(isLogin ? (
				<LogoutOutlined color="#457b9d" style={{ fontSize: 24 }} onClick={authMethods.signOut} />
			) : (
				<LoginOutlined color="#457b9d" style={{ fontSize: 24 }} onClick={authMethods.signIn} />
			))}
		{isLogin === null &&
			(left ? (
				<SwapLeftOutlined color="#457b9d" style={{ fontSize: 24 }} onClick={() => go('left')} />
			) : (
				<div />
			))}
		{right ? (
			<SwapRightOutlined color="#457b9d" style={{ fontSize: 24 }} onClick={() => go('right')} />
		) : (
			<div />
		)}
	</div>
);

export default ActionBar;
