import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { GoogleCircleFilled, FrownFilled, CalendarFilled } from '@ant-design/icons';

import ActionBar from 'components/molecules/ActionBar';

import firebase, { userRef } from 'services/firebase';

import styles from './styles.module.scss';

const UserInfo = ({ isLogin, go }) => {
	const [userInfo, setUserInfo] = useState({ name: 'User', avatar: '', createdAt: null });

	useEffect(() => {
		if (isLogin) {
			userRef
				.doc(firebase.auth().currentUser?.uid)
				.get()
				.then(snapshot => {
					if (snapshot.exists) {
						setUserInfo(snapshot.data());
					}
				});
		}
	}, [isLogin]);

	return (
		<div className={styles.wrapper}>
			<ActionBar go={go} right isLogin={isLogin} />
			<div className={styles.topContent}>
				<h1>Your Fitness Pal</h1>
				<div className={styles.topContentRow}>
					<div className={styles.topContentBox}>
						<GoogleCircleFilled
							style={{ position: 'absolute', left: 12, top: 12, fontSize: 16, color: '#0f0e0e' }}
						/>
						{userInfo.avatar ? (
							<div
								className={styles.avatar}
								style={{ backgroundImage: `url(${userInfo.avatar})` }}
							/>
						) : (
							<FrownFilled style={{ fontSize: 50, color: '#5b5858' }} />
						)}
						<p>{userInfo.name}</p>
					</div>
					<div className={styles.topContentBox}>
						<CalendarFilled
							style={{ position: 'absolute', left: 12, top: 12, fontSize: 16, color: '#0f0e0e' }}
						/>
						<div className={styles.dayCount}>
							{userInfo.createdAt
								? dayjs().diff(dayjs(userInfo.createdAt.toDate()).format('YYYY/MM/DD'), 'day')
								: 'No'}
						</div>
						<p>day(s) passed</p>
					</div>
				</div>
			</div>
			<div className={styles.bottomContent}>
				<h1>Past 7 Days</h1>
			</div>
		</div>
	);
};

export default UserInfo;
