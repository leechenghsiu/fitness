import React from 'react';
import { HashRouter, BrowserRouter, Switch } from 'react-router-dom';

import history from 'store/history';

import App from 'layouts/App';

import routePath from 'constants/path';

import NavRoute from 'utils/hoc/NavRoute';

import { HomePage } from 'layouts/Home';

const RouterWrapper = ({ children }) =>
	process.env.NODE_ENV !== 'production' ? (
		<BrowserRouter>{children}</BrowserRouter>
	) : (
		<HashRouter history={history} basename={process.env.REACT_APP_PUBLIC_URL}>
			{children}
		</HashRouter>
	);

const Routes = props => (
	<RouterWrapper>
		<App>
			<Switch>
				<NavRoute exact path={routePath.home} component={HomePage} {...props} />
			</Switch>
		</App>
	</RouterWrapper>
);

export default Routes;
