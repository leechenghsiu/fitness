import React, { useState, useEffect, useRef } from 'react';
import classnames from 'classnames';
import { Tag, Input } from 'antd';
import { TweenOneGroup } from 'rc-tween-one';
import { PlusOutlined } from '@ant-design/icons';

import styles from './styles.module.scss';

const Tags = ({ visible, tags, setTags, isWeight = false }) => {
	const inputRef = useRef();
	const [inputVisible, setInputVisible] = useState(false);

	const handleClose = removedTag => {
		const newList = tags.list.filter(li => li !== removedTag);
		setTags({ ...tags, list: newList });
	};
	const handleInputChange = e => {
		setTags({ ...tags, inputValue: e.target.value });
	};
	const handleInputConfirm = () => {
		const { inputValue } = tags;
		let { list } = tags;
		if (inputValue && list.indexOf(inputValue) === -1) {
			list = [...list, inputValue];
		}
		setTags({ ...tags, list, inputValue: '' });
		setInputVisible(false);
	};

	useEffect(() => {
		if (inputVisible) {
			inputRef.current.focus();
		}
	}, [inputVisible]);

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
					{tags.list.map(tag => (
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
			{inputVisible && (
				<Input
					ref={inputRef}
					size="small"
					className={styles.input}
					value={tags.inputValue}
					onChange={handleInputChange}
					onBlur={handleInputConfirm}
					onPressEnter={handleInputConfirm}
					placeholder={isWeight ? 'what was your weight?' : 'what did you eat?'}
					bordered={false}
				/>
			)}
			{!inputVisible && (
				<Tag onClick={() => setInputVisible(true)} className={styles.plusTag}>
					<PlusOutlined /> {isWeight ? 'new weight' : 'new meal'}
				</Tag>
			)}
		</div>
	);
};

export default Tags;
