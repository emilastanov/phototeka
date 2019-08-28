import { h, Component } from 'preact';
import './style';
import { FaSearch } from 'react-icons/fa';
import axios from 'axios';
import { connect } from 'redux-zero/preact';
import actions from '../../store/actions';
import { Link } from 'preact-router';


class Search extends Component {
	state = {
		user: null,
		isFound: true
	};

	searchUser = event => {
		if (event.key === 'Enter') {
			axios.get(`/api/v1/profile/${this._Input.value}/`, {
				headers: {
					Authorization: `Token ${this.props.token}`
				}
			}).then((res) => {
				this.setState({user: res.data})
			});
		}
	};

	render(props, state, context) {
		return (
			<div>
				<div class='search' >
					<FaSearch />
					<input type="text" onKeyPress={this.searchUser} ref={(input) => {this._Input = input}} />
				</div>

				{this.state.user ?
					this.state.user.error ?
						<div class='result'>
							<div class='item'>
								<h1 />
								<h1 style={{width: '100%'}}>{this.state.user.error}</h1>
							</div>
						</div>:
						<div class='result'>
							<div class='item'>
								<div class='avatar'>
									{this.state.user.user.username !== this.props.user.user.username ?
										<Link href={`/profile/${this.state.user.user.id}`}><img src={this.state.user.profile.photo ? `${this.state.user.profile.photo}` : 'https://pypik.ru/uploads/posts/2018-09/1536907413_foto-net-no-ya-krasivaya-4.jpg'} alt="a"/></Link>:
										<Link href={`/profile`}><img src={this.state.user.profile.photo ? `${this.state.user.profile.photo}` : 'https://pypik.ru/uploads/posts/2018-09/1536907413_foto-net-no-ya-krasivaya-4.jpg'} alt="a"/></Link>}
								</div>
								<h1>{this.state.user.user.username}</h1>

							</div>
						</div>: ''}

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

export default connect(mapToProps, actions)(Search);