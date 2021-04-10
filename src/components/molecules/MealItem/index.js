import React, { useState } from 'react';
import dayjs from 'dayjs';
import _ from 'lodash';
import { EditOutlined, CheckOutlined } from '@ant-design/icons';

import Tags from 'components/atoms/Tags';

import firebase, { dietRef } from 'services/firebase';

import styles from './styles.module.scss';

const colorMap = {
	breakfast: {
		title: 'Breakfast',
		color: '#5cdae3',
	},
	lunch: {
		title: 'Lunch',
		color: '#c9b0ee',
	},
	dinner: {
		title: 'Dinner',
		color: '#eae2b7',
	},
	weight: {
		title: 'Weight',
		color: '#e0f4b9',
	},
};

const MealItem = ({ type, data, id, fetchDietData }) => {
	const [edit, setEdit] = useState(false);
	const [tags, setTags] = useState({
		list: data.data,
		inputValue: '',
	});
	const handleButtonClick = async () => {
		if (tags.list.length === 0 || _.isEqual(data.data.sort(), tags.list.sort())) {
			setEdit(false);
			return;
		}
		await dietRef.doc(id).update({
			[`${type}.createdAt`]: firebase.firestore.FieldValue.serverTimestamp(),
			[`${type}.data`]: tags.list,
		});
		fetchDietData();
		setEdit(false);
	};

	return (
		<div className={styles.wrapper}>
			<div className={styles.statusItem}>
				<div>
					<p>{dayjs(data.createdAt.toDate()).format('HH:mm')}</p>
					<p style={{ backgroundColor: colorMap[type].color }}>{colorMap[type].title}</p>
				</div>
				<p>
					{`[ ${data.data
						.map((_data, idx) => {
							if (idx !== data.data.length - 1) {
								return type === 'weight' ? `${_data} kg、` : `${_data}、`;
							}
							return type === 'weight' ? `${_data} kg` : _data;
						})
						.join('')} ]`}
				</p>
				{edit ? (
					<CheckOutlined className={styles.editIcon} onClick={handleButtonClick} />
				) : (
					<EditOutlined className={styles.editIcon} onClick={() => setEdit(true)} />
				)}
			</div>
			<Tags isWeight={type === 'weight'} visible={edit} tags={tags} setTags={setTags} />
		</div>
	);
};

export default MealItem;
