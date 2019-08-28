import { h, Component } from 'preact';
import './style.scss';
import axios from 'axios';
import { connect } from 'redux-zero/preact';
import cookie from 'react-cookies';

import actions from '../../store/actions';

class ProfileEdit extends Component {

	state = {
		stChaged: false,
	};

	setDescription = () => {
		axios.put('/api/v1/profile/', {
			description: this._Input.value
		} , {
			headers: {
				Authorization: `Token ${this.props.token}`
			}
		}).then((res) => {
			this.props.setNewDescription(this._Input.value);
			this.setState({ stChaged: true });
		});
	};

	setPhoto = (event) => {
		const file = event.target.files[0];
		let fd = new FormData();
		fd.append('photo',file);
		axios.put('/api/v1/profile/', fd , {
			headers: {
				Authorization: `Token ${this.props.token}`,
				'Content-Type': 'multipart/form-data'
			}
		}).then((res) => {
			this.setState({ stChaged: true });
			this.props.setNewAvatarPhoto(res.data.photo);
		}).catch((err)=> {
			console.log(err.response)
		});
	};

	changeTheme = () => {
		if (this.props.theme === 'black') {
			this.props.setTheme( 'white');
			cookie.save('theme', 'white', {path: '/'});
		} else {
			this.props.setTheme( 'black');
			cookie.save('theme', 'black', {path: '/'});
		}
	};

	componentDidMount() {
		this.setState({ stChaged: false });
	}

	render(props, state, context) {
		return (
			<div class='header__c'>
				{this.state.stChaged ? <h2>Изменения успешно применены!</h2> : ''}
				<div class='avatar'>
					<input type="file" id="file" onChange={(event)=>(this.setPhoto(event))}/>
					<label for="file">Фото</label>
					<img src={this.props.user ? this.props.user.profile.photo ? `${this.props.user.profile.photo}` : 'https://pypik.ru/uploads/posts/2018-09/1536907413_foto-net-no-ya-krasivaya-4.jpg' : ''} />
				</div>
				<h1>{this.props.user ? this.props.user.user.username : ''}</h1>
				<button class='changeBtn' onClick={this.changeTheme}>{this.props.theme === 'black' ? 'Белая тема' : 'Темная тема'}</button>
				<div class='description__d'>
					<textarea type="text" value={this.props.user ? this.props.user.profile.description : ''} ref={(input) => {this._Input = input}}/>
				</div>
				<button class='editBtn' onClick={this.setDescription}>Изменить</button>

			</div>
		);
	}
}


const mapToProps = ({
	token,
	user,
	theme
}) => ({
	token,
	user,
	theme
});

export default connect(mapToProps,actions)(ProfileEdit);
