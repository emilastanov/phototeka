import createStore from 'redux-zero';
import cookie from 'react-cookies';

const initialState = {
	token: null,
	user: null,
	theme: cookie.load('theme'),
	subList: []
};
const store = createStore(initialState);

export default store;
