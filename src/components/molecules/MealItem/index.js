import React, { useState } from 'react';
import dayjs from 'dayjs';
import { EditOutlined, CheckOutlined } from '@ant-design/icons';

import Tags from 'components/atoms/Tags';

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

const MealItem = ({ type, data }) => {
	const [edit, setEdit] = useState(false);

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
							if (idx !== data.data.length - 1) return `${_data}、`;
							return _data;
						})
						.join('')} ]`}
				</p>
				{edit ? (
					<CheckOutlined className={styles.editIcon} onClick={() => setEdit(false)} />
				) : (
					<EditOutlined className={styles.editIcon} onClick={() => setEdit(true)} />
				)}
			</div>
			<Tags visible={edit} defaultTags={data.data} />
		</div>
	);
};

export default MealItem;
