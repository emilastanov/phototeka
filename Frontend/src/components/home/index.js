import { h, Component } from 'preact';
import './style';
import { FaHeart, FaComment } from 'react-icons/fa';
import axios from 'axios';
import { Link } from 'preact-router';
import { connect } from 'redux-zero/preact';
import actions from '../../store/actions';



class Home extends Component {
	state = {
		data: [],
		imgs: []
	};

	setLike = (post) => {
		console.log(post)
		let likeId = null;
		post.likes.data.forEach((item) => {
			if (item.user === this.props.user.user.username){
				likeId = item.id;
			}
		});
		if (!likeId){
			axios.post('/api/v1/post/like/create/', {
				post: post.info.id,
				like: 'like'
			},{
				headers: {
					Authorization: `Token ${this.props.token}`
				}
			}).then((res)=> {
				this.updateData()
			});
		} else {
			axios.delete(`/api/v1/post/like/${likeId}/`,{
				headers: {
					Authorization: `Token ${this.props.token}`
				}
			}).then((res) => {
				this.updateData()
			});
		}
	};

	updateData = () => {
		axios.get('/api/v1/profile/wall/get/',{
			headers: {
				Authorization: `Token ${this.props.token}`
			}
		}).then((res) => {
			this.setState({data: res.data.data});
		}).catch((err) => {
			console.log(this.props);
			console.log(this.state);
		});
	};

	componentDidMount() {
		this.updateData();

	}


	render (props, state, context) {
		return (
			<div class='posts'>
				{this.state.data.length > 0 ? this.state.data.map((item,key) => {
					const date = new Date(item.info.date);
					return (
						<div className='post' key={key}>
							<div className='header__a'>
								<div className='avatar'>
									<Link href={`/profile/${item.owner.user.id}`}>
										<img src={item.owner.profile.photo ? `${item.owner.profile.photo}` : 'https://pypik.ru/uploads/posts/2018-09/1536907413_foto-net-no-ya-krasivaya-4.jpg'} alt=""/>
									</Link>
								</div>
								<h1>{item.owner.user.username}</h1>
							</div>
							<div className='body'>
								<Link href={`/post/${item.info.id}`}><img src={`${item.images[0].img}`} alt=""/></Link>
							</div>
							<div className='footer'>
								<div><FaHeart onClick={() => {this.setLike(item)}} style={{cursor: 'pointer'}} /></div>
								<div>{item.likes.count}</div>
								<div><FaComment /></div>
								<div>{item.comments.count}</div>
								<div>{date.getDate()}.{date.getMonth()}.{date.getFullYear()}</div>
							</div>
						</div>
					);
				}) : <h1 style={{marginTop: 90, textAlign: 'center'}}>Ваша лента пока пуста!</h1>}

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

export default connect(mapToProps, actions)(Home);