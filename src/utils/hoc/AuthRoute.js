import React from 'react';
import { Route, Redirect } from 'react-router-dom';

import Header from 'components/organisms/Header';
import BackstageHeader from 'components/organisms/BackstageHeader';

import routePath from 'constants/path';

const AuthRoute = ({ user, component: Component, ...props }) => (
	<Route
		component={_props =>
			user ? (
				<>
					{props.location.pathname.startsWith('/backstage') ? <BackstageHeader /> : <Header />}
					<Component {..._props} user={user} />
				</>
			) : (
				<Redirect push to={routePath.backstage} />
			)
		}
		{...props}
	/>
);

export default AuthRoute;
