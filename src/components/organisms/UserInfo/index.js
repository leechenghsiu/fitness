/* eslint-disable max-len */
import React, { useEffect, useState, useRef } from 'react';
import classnames from 'classnames';
import dayjs from 'dayjs';
import { GoogleCircleFilled, FrownFilled, CalendarFilled } from '@ant-design/icons';

import ActionBar from 'components/molecules/ActionBar';

import { colorMap } from 'constants/colorMap';

import firebase, { userRef, dietRef } from 'services/firebase';

import styles from './styles.module.scss';

const UserInfo = ({ isLogin, go }) => {
	const scrollRef = useRef();
	const [userInfo, setUserInfo] = useState({ name: 'User', avatar: '', createdAt: null });
	const [dietLogs, setDietLogs] = useState([]);
	const [isScroll, setIsScroll] = useState(false);
	const fetchUserData = () => {
		userRef
			.doc(firebase.auth().currentUser?.uid)
			.get()
			.then(snapshot => {
				if (snapshot.exists) {
					setUserInfo(snapshot.data());
				}
			});
	};
	const fetchDietLogs = () => {
		dietRef
			.where('user', '==', firebase.auth().currentUser?.uid)
			.where('createdAt', '>=', dayjs(dayjs().subtract(3, 'day').format('YYYY-MM-DD')).toDate())
			.where('createdAt', '<', dayjs(dayjs().format('YYYY-MM-DD')).toDate())
			.get()
			.then(snapshot => {
				const result = [];
				snapshot.forEach(snap => result.push({ ...snap.data() }));
				setDietLogs(result);
			});
	};
	const onScroll = () => {
		if (scrollRef.current.scrollTop > 0 && !isScroll) {
			setIsScroll(true);
		} else if (scrollRef.current.scrollTop < 20 && isScroll) {
			setIsScroll(false);
		}
	};

	useEffect(() => {
		if (isLogin) {
			fetchUserData();
			fetchDietLogs();
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
				<h1>Past 3 Days</h1>
				<div className={styles.bottomContentRow} ref={scrollRef} onScroll={onScroll}>
					<div className={classnames(styles.sticky, isScroll && styles.isScroll)} />
					{dietLogs.length > 0 ? (
						dietLogs.map(log => (
							<div key={log.createdAt.toMillis()} className={styles.bottomContentBox}>
								<h4 className={styles.title}>
									{dayjs(log.createdAt.toDate()).format('YYYY/MM/DD ddd')}
								</h4>
								<div className={styles.content}>
									<div
										className={styles.bar}
										style={{ backgroundColor: colorMap.breakfast.color }}
									/>
									<p>
										{`[ ${log.breakfast.data
											.map((_data, idx) => {
												if (idx !== log.breakfast.data.length - 1) return `${_data}、`;
												return _data;
											})
											.join('')} ]`}
									</p>
								</div>
								<div className={styles.content}>
									<div className={styles.bar} style={{ backgroundColor: colorMap.lunch.color }} />
									<p>
										{`[ ${log.lunch.data
											.map((_data, idx) => {
												if (idx !== log.lunch.data.length - 1) return `${_data}、`;
												return _data;
											})
											.join('')} ]`}
									</p>
								</div>
								<div className={styles.content}>
									<div className={styles.bar} style={{ backgroundColor: colorMap.dinner.color }} />
									<p>
										{`[ ${log.dinner.data
											.map((_data, idx) => {
												if (idx !== log.dinner.data.length - 1) return `${_data}、`;
												return _data;
											})
											.join('')} ]`}
									</p>
								</div>
								<div className={styles.content}>
									<div className={styles.bar} style={{ backgroundColor: colorMap.weight.color }} />
									<p>
										{`[ ${log.weight.data
											.map((_data, idx) => {
												if (idx !== log.weight.data.length - 1) return `${_data} kg、`;
												return `${_data} kg`;
											})
											.join('')} ]`}
									</p>
								</div>
							</div>
						))
					) : (
						<button type="button" className={styles.statusText} onClick={() => {}}>
							no data exists
						</button>
					)}
				</div>
			</div>
		</div>
	);
};

export default UserInfo;
