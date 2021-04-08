import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { GoogleCircleFilled, FrownFilled, CalendarFilled } from '@ant-design/icons';

import ActionBar from 'components/molecules/ActionBar';

import firebase, { userRef, dietRef } from 'services/firebase';

import styles from './styles.module.scss';

const UserInfo = ({ isLogin, go }) => {
	const [userInfo, setUserInfo] = useState({ name: 'User', avatar: '', createdAt: null });
	const [dietInfo, setDietInfo] = useState({
		createdAt: null,
		breakfast: { createdAt: null, data: [] },
		lunch: { createdAt: null, data: [] },
		dinner: { createdAt: null, data: [] },
		weight: { createdAt: null, data: null },
	});

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
			dietRef
				.where('user', '==', firebase.auth().currentUser?.uid)
				.where('createdAt', '<=', new Date())
				.get()
				.then(snapshot => {
					snapshot.forEach(snap => setDietInfo(snap.data()));
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
							{userInfo.createdAt ? dayjs(userInfo.createdAt.toDate()).diff(dayjs(), 'day') : 'No'}
						</div>
						<p>day(s) passed</p>
					</div>
				</div>
			</div>
			<div className={styles.bottomContent}>
				<h1>Your Status Today</h1>
				{isLogin ? (
					<>
						{dietInfo.breakfast.createdAt && (
							<div className={styles.statusItem}>
								<div>
									<p>{dayjs(dietInfo.breakfast.createdAt.toDate()).format('HH:mm')}</p>
									<p style={{ backgroundColor: '#5cdae3' }}>Breakfast</p>
								</div>
								<p>
									{`[ ${dietInfo.breakfast.data
										.map((_data, idx) => {
											if (idx !== dietInfo.breakfast.data.length - 1) return `${_data}、`;
											return _data;
										})
										.join('')} ]`}
								</p>
							</div>
						)}
						<div className={styles.statusItem}>
							<div>
								<p>{dayjs(dietInfo.lunch.createdAt.toDate()).format('HH:mm')}</p>
								<p style={{ backgroundColor: '#c9b0ee' }}>Lunch</p>
							</div>
							<p>
								{`[ ${dietInfo.lunch.data
									.map((_data, idx) => {
										if (idx !== dietInfo.lunch.data.length - 1) return `${_data}、`;
										return _data;
									})
									.join('')} ]`}
							</p>
						</div>
						<div className={styles.statusItem}>
							<div>
								<p>{dayjs(dietInfo.dinner.createdAt.toDate()).format('HH:mm')}</p>
								<p style={{ backgroundColor: '#eae2b7' }}>Dinner</p>
							</div>
							<p>
								{`[ ${dietInfo.dinner.data
									.map((_data, idx) => {
										if (idx !== dietInfo.dinner.data.length - 1) return `${_data}、`;
										return _data;
									})
									.join('')} ]`}
							</p>
						</div>
						<div className={styles.statusItem}>
							<div>
								<p>{dayjs(dietInfo.weight.createdAt.toDate()).format('HH:mm')}</p>
								<p style={{ backgroundColor: '#e0f4b9' }}>Weight</p>
							</div>
							<p>{`[ ${dietInfo.weight.data} kg ]`}</p>
						</div>
					</>
				) : (
					<p className={styles.unLoginText}>Please Login First</p>
				)}
			</div>
		</div>
	);
};

export default UserInfo;
