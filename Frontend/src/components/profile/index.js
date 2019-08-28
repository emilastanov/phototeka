import { h, Component } from 'preact';
import './style';
import { Link } from 'preact-router/match';
import { FaDoorOpen } from 'react-icons/fa';
import axios from 'axios';
import cookie from 'react-cookies';
import { route } from 'preact-router';
import { connect } from 'redux-zero/preact';

import actions from '../../store/actions';
import getUserData from '../auth';


class Profile extends Component {
	state = {
		posts: []
	};

	logout = () => {
		let data = {};
		let config = {
			headers: {
				Authorization: `Token ${this.props.token}`
			}
		};
		axios.post('/api/v1/auth/token/logout/', data, config).then((res) => {
			cookie.remove('authToken',{ path: '/' });

			this.props.setToken(null);
			this.props.setUserData(null);

			route('/',true);
		});
	};

	declOfNum = (number, titles) => {
		const cases = [2, 0, 1, 1, 1, 2];
		return titles[ (number%100>4 && number%100<20)? 2 : cases[(number%10<5)?number%10:5] ];
	};
	componentWillMount() {
		if (!this.props.token) {
			route('/',true)
		}
	}

	componentDidMount() {
		axios.get(`/api/v1/post/user/${this.props.user.user.id}/`,{
			headers: {
				Authorization: `Token ${this.props.token}`
			}
		}).then((res) => {
			console.log(res.data.data);
			this.setState({ posts: res.data.data });
		});
	}

	render(props, state, context) {
		return (
			<div>
				<div class='header__b'>
					<div class='avatar'>
						<img src={this.props.user ? this.props.user.profile.photo ? `${this.props.user.profile.photo}` : 'https://pypik.ru/uploads/posts/2018-09/1536907413_foto-net-no-ya-krasivaya-4.jpg' : ''} alt="a"/>
					</div>
					<h1>{this.props.user ? this.props.user.user.username : ''}</h1>
					<button onClick={this.logout}><FaDoorOpen /></button>
					<Link href="/profile/edit">Редактировать</Link>
					<div class='info'>
						<h5>{this.state.posts.length} {this.declOfNum(this.state.posts.length,['Публикация', 'Публикации','Публикаций'])}</h5>
						<Link href="/sub/subscribers" onClick={()=>{this.props.setSubList(this.props.user.subscribers.data)}}><h5>{this.props.user ? this.props.user.subscribers.count: ''} {this.props.user ? this.declOfNum(this.props.user.subscribers.count,['Подписчик', 'Подписчика','Подписчиков']):''}</h5></Link>
						<Link href="/sub/subscribtions" onClick={()=>{this.props.setSubList(this.props.user.subscribtions.data)}}><h5>{this.props.user ? this.props.user.subscribtions.count: ''} {this.props.user ? this.declOfNum(this.props.user.subscribtions.count,['Подписка', 'Подписки','Подписок']): ''}</h5></Link>
					</div>
					<p>{this.props.user ? this.props.user.profile.description : ''}</p>

				</div>
				<div class='createPost'>
					<Link href="/createPost" class='postBtn'>Выложить пост</Link>
				</div>
				<div class='content'>
					{this.state.posts.length > 0 ? this.state.posts.map((item,key) => (
						<div class='item' key={key}>
							<Link href={`/post/${item.info.id}`}><img src={`${item.images[0].img}`} alt="" /></Link>
						</div>
					)) : <h5 class='placeholder'>У вас нет публикаций.</h5>}
				</div>
			</div>
		);
	}
}

const mapToProps = ({
	token,
	user
}) => ({
	token,
	user
});

export default connect(mapToProps,actions)(Profile);
