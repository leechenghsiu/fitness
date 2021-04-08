import React, { useRef } from 'react';
import clamp from 'lodash-es/clamp';
import { useSprings, animated } from 'react-spring';
import { useDrag } from 'react-use-gesture';

import DietManage from 'components/organisms/DietManage';
import TrainManage from 'components/organisms/TrainManage';
import UserInfo from 'components/organisms/UserInfo';

import firebase from 'services/firebase';

import styles from './styles.module.scss';

const Home = () => {
	const isLogin = !!firebase.auth().currentUser;
	const index = useRef(0);
	const [props, set] = useSprings(3, i => ({
		x: i * window.innerWidth,
		scale: 1,
		display: 'block',
		borderRadius: 0,
	}));
	const bind = useDrag(({ active, movement: [mx], direction: [xDir], distance, cancel }) => {
		if (active && distance > window.innerWidth / 2) {
			cancel((index.current = clamp(index.current + (xDir > 0 ? -1 : 1), 0, 2)));
		}
		set(i => {
			if (i < index.current - 1 || i > index.current + 1) return { display: 'none' };
			const x = (i - index.current) * window.innerWidth + (active ? mx : 0);
			const scale = active ? 1 - distance / window.innerWidth / 2 : 1;
			const borderRadius = active ? '32px' : 0;
			return { x, scale, display: 'block', borderRadius };
		});
	});
	const go = direction => {
		const addon = direction === 'right' ? 1 : -1;
		set(i => {
			if (i < index.current + addon - 1 || i > index.current + addon + 1) {
				return { display: 'none' };
			}
			const x = (i - index.current - addon) * window.innerWidth;
			return { x, scale: 1, display: 'block', borderRadius: 0 };
		});
		index.current += addon;
	};

	return props.map(({ x, display, scale, borderRadius }, i) => (
		<animated.div {...bind()} className={styles.wrapper} key={Math.random()} style={{ display, x }}>
			<animated.div style={{ scale, borderRadius }}>
				{i === 0 && <UserInfo isLogin={isLogin} go={go} />}
				{i === 1 && <DietManage go={go} />}
				{i === 2 && <TrainManage go={go} />}
			</animated.div>
		</animated.div>
	));
};

export default Home;
