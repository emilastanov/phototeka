import { h, Component } from 'preact';
import { connect } from 'redux-zero/preact';
import { route } from 'preact-router';
import axios from 'axios';
import cookie from 'react-cookies';

import style from './style';
import actions from '../../store/actions';


class Auth extends Component {

	state = {
		isLoginForm: true,
		username: null,
		password: null,
		regIsSuccess: false,
		error: null,
		isLoading: false,

	};

	login = () => {
		this.setState({isLoading: true})
		axios.post('/api/v1/auth/token/login/',{
			username: this._UsernameInput.value,
			password: this._PasswordInput.value
		}).then((res) => {
			this.props.setToken(res.data.auth_token);
			cookie.save('authToken',res.data.auth_token,{ path: '/' });
			this.setState({ wrongData: false });

			axios.get('/api/v1/profile/', {
				headers: {
					Authorization: `Token ${res.data.auth_token}`
				}
			}).then((res) => {
				this.props.setUserData(res.data);
				console.log(res.data);
				this.setState({isLoading: false})
				route('/home',true);
			}).catch((error) => {});
		}).catch((error) => {
			this.setState({isLoading: false})
			if (error.response.data.non_field_errors) {
				this.setState({ error: error.response.data.non_field_errors});
			} else {
				this.setState({ error: 'Все поля должны быть заполнены!'});
			}

		});
	};

	reg = () => {
		if (this._Password1Input.value === this._Password2Input.value) {
			axios.post('/api/v1/auth/users/',{
				username: this._UsernameInput.value,
				password: this._Password1Input.value
			}).then((res) => {
				this.setState({ isLoginForm: true, regIsSuccess: true, error: null })
			}).catch((error) => {
				error.response.data.username ? this.setState({error: error.response.data.username}) : this.setState({error: error.response.data.password})
			});
		} else {
			this.setState({error: 'Пароли не совпадают!'})
		}
	};

	componentWillMount() {
		const token = cookie.load('authToken');
		if (token) {
			this.props.setToken(token);
			axios.get('/api/v1/profile/', {
				headers: {
					Authorization: `Token ${token}`
				}
			}).then((res) => {
				this.props.setUserData(res.data);
				route('/home',true);
			}).catch((error) => {});
		}

	}

	render(props,state,context) {
		return (
			<div>
				{this.state.isLoginForm ?
					<div className={style.auth}>
						{this.state.isLoading ? <h1 class={style.loading}>Загрузка...</h1> : ''}
						<h1>Авторизация</h1>
						{ this.state.error ? <p>{this.state.error}</p> : ''}
						{ this.state.regIsSuccess ? <h3>Вы успешно зарегистрированы!</h3> : '' }
						<input type="text" placeholder="Username" ref={ (input) => {this._UsernameInput = input}} />
						<input type="password" placeholder="Password" ref={ (input) => {this._PasswordInput = input}}/>
						<button className={style.login} onClick={this.login}> Войти</button>
						<button className={style.reg} onClick={ () => {this.setState({ isLoginForm: false, isWrondData: false })} }> Регистрация</button>
					</div> :
					<div className={style.auth}>
						<h1>Регистрация</h1>
						{ this.state.error ? <p>{this.state.error}</p> : '' }
						<input type="text" placeholder="Username" ref={ (input) => {this._UsernameInput = input}}/>
						<input type="password" placeholder="Password" ref={ (input) => {this._Password1Input = input}}/>
						<input type="password" placeholder="Password" ref={ (input) => {this._Password2Input = input}}/>
						<button className={style.login} onClick={this.reg}> Регистрация </button>
						<button className={style.reg} onClick={ () => {this.setState({ isLoginForm: true })} }> Назад </button>
					</div>
				}
			</div>
		);
	}
}

const mapToProps = (state) => ({
	token: state.token
});

export default connect(mapToProps, actions)(Auth);