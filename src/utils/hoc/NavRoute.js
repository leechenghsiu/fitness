import React from 'react';
import { Route } from 'react-router-dom';

const NavRoute = ({ user, component: Component, ...props }) => (
	<Route component={_props => <Component {..._props} user={user} />} {...props} />
);
export default NavRoute;
