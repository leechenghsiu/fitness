import { combineReducers } from 'redux';

import routing from './routing';

export default combineReducers({
	...routing.reducer,
});
