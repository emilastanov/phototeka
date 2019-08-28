import { h, Component } from 'preact';
import style from './style';
import { Link } from 'preact-router/match';
import axios from 'axios';
import { connect } from 'redux-zero/preact';

import actions from '../../store/actions';

class ProfileDetail extends Component {
	state = {
		posts: [],
		user: null,
		isMySub: false,
		subId: null
	};


	declOfNum = (number, titles) => {
		const cases = [2, 0, 1, 1, 1, 2];
		return titles[ (number%100>4 && number%100<20)? 2 : cases[(number%10<5)?number%10:5] ];
	};

	getCurrentUserData = () => {
		axios.get(`/api/v1/profile/id/${this.props.id}/`, {
			headers: {
				Authorization: `Token ${this.props.token}`
			}
		}).then((res) => {
			this.setState({user: res.data});
			this.props.user.subscribtions.data.forEach((item) => {
				console.log(item)
				if (item.subscribtion === res.data.user.id) {
					this.setState({isMySub: true, subId: item.id})
				}
			});
		}).catch((err) => {});
	};


	updateUserData = () => {
		axios.get('/api/v1/profile/', {
			headers: {
				Authorization: `Token ${this.props.token}`
			}
		}).then((res) => {
			this.props.setUserData(res.data);
		}).catch((err) => {});
	};


	componentDidMount() {
		this.getCurrentUserData();
		this.updateUserData();

		axios.get(`/api/v1/post/user/${this.props.id}/`,{
			headers: {
				Authorization: `Token ${this.props.token}`
			}
		}).then((res) => {
			this.setState({ posts: res.data.data });
		}).catch((err) => {});
	}
	setSubscribe = () => {
		if (!this.state.isMySub){
			axios.post('/api/v1/profile/subscription/create/', {
				subscribtion: this.props.id
			},{
				headers: {
					Authorization: `Token ${this.props.token}`
				}
			}).then((res)=> {
				console.log(res.data.id)
				this.setState({isMySub: true, subId: res.data.id})
				this.updateUserData();
			}).catch((err) => {
				console.log(err.response)
			});
		} else {
			axios.delete(`/api/v1/profile/subscription/${this.state.subId}/`,{
				headers: {
					Authorization: `Token ${this.props.token}`
				}
			}).then((res) => {
				this.setState({isMySub: false})
				this.updateUserData();
			}).catch((err) => {});
		}
	};

	render(props,state,context) {
		return (
			<div>
				<div class={style.header}>
					<div class={style.avatar}>
						<img src={this.state.user ? this.state.user.profile.photo ? `${this.state.user.profile.photo}` : 'https://pypik.ru/uploads/posts/2018-09/1536907413_foto-net-no-ya-krasivaya-4.jpg' : ''} />
					</div>
					<h1>{this.state.user ? this.state.user.user.username : ''}</h1>
					<a href="#" onClick={this.setSubscribe}>{this.state.isMySub ? 'Отписаться' : 'Подписаться'}</a>
					<div class={style.info}>
						<h5>{this.state.posts.length} {this.declOfNum(this.state.posts.length,['Публикация', 'Публикации','Публикаций'])}</h5>
						<Link href='/sub/subscribers' onClick={()=>{this.props.setSubList(this.state.user.subscribers.data)}}><h5>{this.state.user ? this.state.user.subscribers.count : ''} {this.state.user ? this.declOfNum(this.state.user.subscribers.count,['Подписчик', 'Подписчика','Подписчиков']) : ''}</h5></Link>
						<Link href='/sub/subscribtions' onClick={()=>{this.props.setSubList(this.state.user.subscribtions.data)}}><h5>{this.state.user ? this.state.user.subscribtions.count : ''} {this.state.user ? this.declOfNum(this.state.user.subscribtions.count,['Подписка', 'Подписки','Подписок']) : ''}</h5></Link>
					</div>
					<p>{this.state.user ? this.state.user.profile.description : ''}</p>
				</div>
				<div class={style.content}>
					{this.state.posts.length > 0 ? this.state.posts.map((item,key) => (
						<div class={style.item} key={key}>
							<Link href={`/post/${item.info.id}`}><img src={`${item.images[0].img}`} alt="" /></Link>
						</div>
					)) : <h5 class={style.placeholder}>Нет публикаций.</h5>}
				</div>
			</div>
		);
	}
}

const mapToProps = (state) => ({
	token: state.token,
	user: state.user
});

export default connect(mapToProps,actions)(ProfileDetail);
