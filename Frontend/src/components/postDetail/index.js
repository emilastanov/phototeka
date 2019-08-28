import './style';
import { h, Component } from 'preact';
import { FaComment, FaHeart, FaTrash, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import axios from 'axios';
import { connect } from 'redux-zero/preact';
import actions from '../../store/actions';
import { route } from 'preact-router';
import { Link } from 'preact-router/match';

class PostDetail extends Component {

	state = {
		data: null,
		user: null,
		isOwner: false,
		isMany: false,
		img: 0
	};

	componentWillMount() {
		if (!this.props.user) {
			route('/',true);
		}
	}

	componentDidMount() {
		axios.get(`/api/v1/post/${this.props.id}/`, {
			headers: {
				Authorization: `Token ${this.props.token}`
			}
		}).then((res) => {
			this.setState({isMany: res.data.images.length > 1})
			this.setState({data: res.data});

			axios.get(`/api/v1/profile/id/${res.data.post.user}/`, {
				headers: {
					Authorization: `Token ${this.props.token}`
				}
			}).then((res) => {
				this.setState({user: res.data, isOwner: this.state.data.post.user === this.props.user.user.id});
			});
		});

	}

	sendComment = () => {
		const text = this._Input.value;
		this._Input.value = '';

		axios.post('/api/v1/post/comment/create/', {
			post: this.state.data.post.id,
			comment: text
		},{
			headers: {
				Authorization: `Token ${this.props.token}`
			}
		}).then((res)=> {
			axios.get(`/api/v1/post/${this.props.id}/`, {
				headers: {
					Authorization: `Token ${this.props.token}`
				}
			}).then((res) => {
				this.setState({ data: res.data });
			});
		});
	};

	setLike = () => {
		let likeId = null;
		this.state.data.likes.data.forEach((item) => {
			if (item.user === this.props.user.user.username){
				likeId = item.id;
			}
		});
		if (!likeId){
			axios.post('/api/v1/post/like/create/', {
				post: this.state.data.post.id,
				like: 'like'
			},{
				headers: {
					Authorization: `Token ${this.props.token}`
				}
			}).then((res)=> {
				axios.get(`/api/v1/post/${this.props.id}/`, {
					headers: {
						Authorization: `Token ${this.props.token}`
					}
				}).then((res) => {
					this.setState({ data: res.data });
				});
			});
		} else {
			axios.delete(`/api/v1/post/like/${likeId}/`,{
				headers: {
					Authorization: `Token ${this.props.token}`
				}
			}).then((res) => {
				axios.get(`/api/v1/post/${this.props.id}/`, {
					headers: {
						Authorization: `Token ${this.props.token}`
					}
				}).then((res) => {
					this.setState({ data: res.data });
				});
			});
		}
	};

	leftArrow = () => {
		const count = this.state.data.images.length - 1;
		let img = this.state.img;

		if (img === 0){
			img = count
		} else {
			img = img - 1
		}

		this.setState({img: img})
	};

	rightArrow = () => {
		const count = this.state.data.images.length - 1;
		let img = this.state.img;

		if (img === count){
			img = 0;
		} else {
			img = img + 1;
		}

		this.setState({img: img})
	};

	deletePost = () => {
		axios.delete(`/api/v1/post/${this.props.id}/`,{
			headers: {
				Authorization: `Token ${this.props.token}`
			}
		}).then((res) => {
			route('/home',true);
		});
	};


	render(props, state, context) {
		let date = null;
		if (this.state.data) {
			date = new Date(this.state.data.post.date);
		}
		return (
			<div class='posts'>
				<div className='post'>
					<div className='header' style={{position: 'relative'}}>
						<div className='avatar'>
							<Link href={`/profile/${this.state.user ? this.state.user.user.id : ''}`}>
								<img src={this.state.user ? this.state.user.profile.photo ? `${this.state.user.profile.photo}` : 'https://pypik.ru/uploads/posts/2018-09/1536907413_foto-net-no-ya-krasivaya-4.jpg' : ''} alt=""/>
							</Link>
						</div>
						<h1>{this.state.user ? this.state.user.user.username : ''}</h1>
						{this.state.isOwner ? <button onClick={this.deletePost} class='deleteBtn'><FaTrash /></button> : ''}
					</div>
					<div className='body'>
						<img src={this.state.data ? `${this.state.data.images[this.state.img].img}` : ''} alt=""/>
						{this.state.isMany ? <div class='arrow'>
							<div class='left' onClick={this.leftArrow}><FaArrowLeft /></div>
							<div class='right' onClick={this.rightArrow}> <FaArrowRight /> </div>
						</div> : ''}
					</div>
					<div className='footer'>

						<div onClick={this.setLike} style={{cursor: 'pointer'}}><FaHeart /></div>
						<div>{this.state.data ? this.state.data.likes.count : ''}</div>
						<div><FaComment /></div>
						<div>{this.state.data ? this.state.data.comments.count : ''}</div>
						<div>{date ? `${date.getDate()}.${date.getMonth()}.${date.getFullYear()}` : ''}</div>
					</div>
				</div>
				{this.state.data ? this.state.data.post.description ?
					<div class='description'>
						<p>
							{this.state.data ? this.state.data.post.description.split(' ').map((item,key)=>{
								if (item[0] === '#') {
									return  <span><Link style={{color: '#7477A0'}} href={`/postsbytag/${item.slice(1)}`}>{item}</Link> </span>
								} else {
									return <span>{item} </span>
								}
							})  : ''}
						</p>
					</div>: ' ' : '' }
				<div class='commentForm'>
					<input type="text" ref={(input) => {this._Input = input}}/>
					<button onClick={this.sendComment}>Отправить</button>
				</div>
				<div class='comments'>
					{this.state.data ? this.state.data.comments.count > 0 ?
						this.state.data.comments.data.map((item,key) => (
							<div class='item' key={key}>
								<h4>{item.user}:</h4>
								<p>{item.comment}</p>
							</div>
						)):<div class='item'>
							<p style={{textAlign: 'center'}}>Нет комментариев...</p>
						</div>: ''}
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

export default connect(mapToProps, actions)(PostDetail);