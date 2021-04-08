import React, { Suspense } from 'react';

import styles from './styles.module.scss';

const App = ({ children }) => (
	<Suspense fallback={<div>Loading...</div>}>
		<div className={styles.wrapper}>{children}</div>
	</Suspense>
);

export default App;
