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
	const [dietInfo, setDietInfo] = useState({
		createdAt: null,
		breakfast: { createdAt: null, data: [] },
		lunch: { createdAt: null, data: [] },
		dinner: { createdAt: null, data: [] },
		weight: { createdAt: null, data: null },
		id: '',
	});
	const [add, setAdd] = useState(false);
	const [type, setType] = useState('');
	const [tags, setTags] = useState({
		list: [],
		inputValue: '',
	});
	const fetchDietData = () => {
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
						weight: { createdAt: null, data: [] },
					});
				} else {
					snapshot.forEach(snap => setDietInfo({ ...snap.data(), id: snap.id }));
				}
			});
	};
	const handleButtonClick = async () => {
		await dietRef.doc(dietInfo.id).update({
			[`${type}.createdAt`]: firebase.firestore.FieldValue.serverTimestamp(),
			[`${type}.data`]: tags.list,
		});
		setAdd(false);
	};

	useEffect(() => {
		if (isLogin) {
			fetchDietData();
		}
	}, [isLogin, add]);

	useEffect(() => {
		if (!add) {
			setTags({ list: [], inputValue: '' });
			setType('');
		}
	}, [add]);

	return (
		<div className={styles.wrapper}>
			<ActionBar go={go} left /* right */ />
			<h1>Diet Management</h1>
			<div className={styles.content}>
				{isLogin &&
					!dietInfo.breakfast.createdAt &&
					!dietInfo.lunch.createdAt &&
					!dietInfo.dinner.createdAt &&
					!dietInfo.weight.createdAt && (
						<button type="button" className={styles.statusText} onClick={() => {}}>
							no data exists
						</button>
					)}
				{isLogin ? (
					<>
						{dietInfo.breakfast.createdAt && (
							<MealItem
								type="breakfast"
								data={dietInfo.breakfast}
								id={dietInfo.id}
								fetchDietData={fetchDietData}
							/>
						)}
						{dietInfo.lunch.createdAt && (
							<MealItem
								type="lunch"
								data={dietInfo.lunch}
								id={dietInfo.id}
								fetchDietData={fetchDietData}
							/>
						)}
						{dietInfo.dinner.createdAt && (
							<MealItem
								type="dinner"
								data={dietInfo.dinner}
								id={dietInfo.id}
								fetchDietData={fetchDietData}
							/>
						)}
						{dietInfo.weight.createdAt && (
							<MealItem
								type="weight"
								data={dietInfo.weight}
								id={dietInfo.id}
								fetchDietData={fetchDietData}
							/>
						)}
						{!add && (
							<Button className={styles.addRecord} onClick={() => setAdd(true)}>
								add record
							</Button>
						)}
					</>
				) : (
					<button type="button" className={styles.statusText} onClick={authMethods.signIn}>
						please login first
					</button>
				)}
				{isLogin && (
					<div className={classnames(styles.addWrapper, add && styles.show)}>
						<div className={styles.tagsWrapper}>
							<h3>Add Record</h3>
							<Radio.Group
								className={styles.typeSelect}
								value={type}
								onChange={e => setType(e.target.value)}
								buttonStyle="solid"
							>
								<Radio.Button value="breakfast">Breakfast</Radio.Button>
								<Radio.Button value="lunch">Lunch</Radio.Button>
								<Radio.Button value="dinner">Dinner</Radio.Button>
								<Radio.Button value="weight">Weight</Radio.Button>
							</Radio.Group>
							<Tags isWeight={type === 'weight'} visible={add} tags={tags} setTags={setTags} />
						</div>
						<div className={styles.actionWrapper}>
							<Button
								disabled={!type || tags.list.length === 0}
								className={styles.submitRecord}
								onClick={handleButtonClick}
							>
								submit
							</Button>
							<Button className={styles.close} onClick={() => setAdd(false)}>
								<CloseOutlined style={{ color: 'white' }} />
							</Button>
						</div>
					</div>
				)}
			</div>
			<div className={classnames(styles.mask, { [styles.showMask]: add })} />
		</div>
	);
};

export default DietManage;
