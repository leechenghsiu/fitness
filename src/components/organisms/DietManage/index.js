/* eslint-disable indent */
import React, { useEffect, useState } from 'react';
import classnames from 'classnames';
import dayjs from 'dayjs';
import { Button, Radio } from 'antd';
import { CloseOutlined } from '@ant-design/icons';

import Tags from 'components/atoms/Tags';
import ActionBar from 'components/molecules/ActionBar';
import MealItem from 'components/molecules/MealItem';

import firebase, { dietRef } from 'services/firebase';
import { authMethods } from 'services/firebaseAuth';

import styles from './styles.module.scss';

const DietManage = ({ isLogin, go }) => {
	const [add, setAdd] = useState(false);
	const [dietInfo, setDietInfo] = useState({
		createdAt: null,
		breakfast: { createdAt: null, data: [] },
		lunch: { createdAt: null, data: [] },
		dinner: { createdAt: null, data: [] },
		weight: { createdAt: null, data: null },
	});
	const [addForm, setAddForm] = useState({
		type: '',
		data: [],
	});

	useEffect(() => {
		if (isLogin) {
			dietRef
				.where('user', '==', firebase.auth().currentUser?.uid)
				.where('createdAt', '>=', dayjs(dayjs().format('YYYY-MM-DD')).toDate())
				.where('createdAt', '<', dayjs(dayjs().add(1, 'day').format('YYYY-MM-DD')).toDate())
				.get()
				.then(snapshot => {
					if (snapshot.empty) {
						dietRef.doc().set({
							createdAt: firebase.firestore.FieldValue.serverTimestamp(),
							user: firebase.auth().currentUser?.uid,
							breakfast: { createdAt: null, data: [] },
							lunch: { createdAt: null, data: [] },
							dinner: { createdAt: null, data: [] },
							weight: { createdAt: null, data: null },
						});
					} else {
						snapshot.forEach(snap => setDietInfo(snap.data()));
					}
				});
		}
	}, [isLogin]);

	return (
		<div className={styles.wrapper}>
			<ActionBar go={go} left right />
			<h1>Diet Management</h1>
			<div className={styles.content}>
				{isLogin ? (
					<>
						{dietInfo.breakfast.createdAt && (
							<MealItem type="breakfast" data={dietInfo.breakfast} />
						)}
						{dietInfo.lunch.createdAt && <MealItem type="lunch" data={dietInfo.lunch} />}
						{dietInfo.dinner.createdAt && <MealItem type="dinner" data={dietInfo.dinner} />}
						{dietInfo.weight.createdAt && <MealItem type="weight" data={dietInfo.weight} />}
					</>
				) : (
					<button type="button" className={styles.statusText} onClick={authMethods.signIn}>
						please login first
					</button>
				)}
				{isLogin &&
					!dietInfo.breakfast.createdAt &&
					!dietInfo.lunch.createdAt &&
					!dietInfo.dinner.createdAt &&
					!dietInfo.weight.createdAt && (
						<button type="button" className={styles.statusText} onClick={() => {}}>
							no data exists
						</button>
					)}
				{isLogin && (
					<div className={styles.addWrapper}>
						<div className={classnames(styles.tagsWrapper, add && styles.show)}>
							<Radio.Group
								className={styles.typeSelect}
								value={addForm.type}
								onChange={e => setAddForm({ ...addForm, type: e.target.value })}
								buttonStyle="solid"
							>
								<Radio.Button value="breakfast">Breakfast</Radio.Button>
								<Radio.Button value="lunch">Lunch</Radio.Button>
								<Radio.Button value="dinner">Dinner</Radio.Button>
								<Radio.Button value="weight">Weight</Radio.Button>
							</Radio.Group>
							<Tags visible={add} />
						</div>
						<Button className={styles.addRecord} onClick={() => setAdd(!add)}>
							{add ? 'submit' : 'add record'}
						</Button>
						{add && (
							<Button className={styles.close} onClick={() => setAdd(!add)}>
								<CloseOutlined style={{ color: 'white' }} />
							</Button>
						)}
					</div>
				)}
			</div>
		</div>
	);
};

export default DietManage;
