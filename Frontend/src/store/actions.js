

const actions = store => ({
	setToken: (state, payload) => ({ ...state, token: payload }),
	setUserData: (state, payload) => ({ ...state, user: payload }),
	setNewDescription: (state, payload) => {
		state.user.profile.description = payload;
		return state;
	},
	setNewAvatarPhoto: (state, payload) => {
		state.user.profile.photo = payload;
		return state;
	},
	setTheme: (state, payload) => ({ ...state, theme: payload }),
	setSubList: (state, payload) => ({ ...state, subList: payload }),
});

export default actions;