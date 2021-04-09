import React, { useState, useEffect, useRef } from 'react';
import classnames from 'classnames';
import { Tag, Input } from 'antd';
import { TweenOneGroup } from 'rc-tween-one';
import { PlusOutlined } from '@ant-design/icons';

import styles from './styles.module.scss';

const Tags = ({ visible, defaultTags = [] }) => {
	const inputRef = useRef();
	const [selectedMeal, setSelectedMeal] = useState({
		tags: [],
		inputVisible: false,
		inputValue: '',
	});
	const handleClose = removedTag => {
		const tags = selectedMeal.tags.filter(tag => tag !== removedTag);
		setSelectedMeal({ ...selectedMeal, tags });
	};
	const showInput = () => {
		setSelectedMeal({ ...selectedMeal, inputVisible: true });
	};
	const handleInputChange = e => {
		setSelectedMeal({ ...selectedMeal, inputValue: e.target.value });
	};
	const handleInputConfirm = () => {
		const { inputValue } = selectedMeal;
		let { tags } = selectedMeal;
		if (inputValue && tags.indexOf(inputValue) === -1) {
			tags = [...tags, inputValue];
		}
		setSelectedMeal({ ...selectedMeal, tags, inputVisible: false, inputValue: '' });
	};

	useEffect(() => {
		if (selectedMeal.inputVisible) {
			inputRef.current.focus();
		}
	}, [selectedMeal.inputVisible]);

	useEffect(() => {
		if (visible) {
			setSelectedMeal({ ...selectedMeal, tags: defaultTags });
		}
	}, [visible]);

	return (
		<div className={classnames(styles.selectedContent, visible && styles.visible)}>
			<div className={styles.tagsRow}>
				<TweenOneGroup
					enter={{
						scale: 0.8,
						opacity: 0,
						type: 'from',
						duration: 100,
						onComplete: e => {
							e.target.style = '';
						},
					}}
					leave={{ opacity: 0, width: 0, scale: 0, duration: 200 }}
					appear={false}
				>
					{selectedMeal.tags.map(tag => (
						<div className={styles.tag} key={tag}>
							<Tag
								closable
								onClose={e => {
									e.preventDefault();
									handleClose(tag);
								}}
							>
								{tag}
							</Tag>
						</div>
					))}
				</TweenOneGroup>
			</div>
			{selectedMeal.inputVisible && (
				<Input
					ref={inputRef}
					size="small"
					className={styles.input}
					value={selectedMeal.inputValue}
					onChange={handleInputChange}
					onBlur={handleInputConfirm}
					onPressEnter={handleInputConfirm}
					placeholder="what did you eat?"
					bordered={false}
				/>
			)}
			{!selectedMeal.inputVisible && (
				<Tag onClick={showInput} className={styles.plusTag}>
					<PlusOutlined /> new meal
				</Tag>
			)}
		</div>
	);
};

export default Tags;
