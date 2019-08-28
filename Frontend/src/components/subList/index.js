import { h, Component } from 'preact';
import style from './style';
import axios from 'axios';

import { connect } from 'redux-zero/preact';
import actions from '../../store/actions';


class SubList extends Component {

	state = {
		list: []
	};

	componentDidMount() {
		switch (this.props.s) {
			case 'subscribtions':
				this.props.subList.forEach((item) => {
					axios.get(`/api/v1/profile/id/${item.subscribtion}/`, {
						headers: {
							Authorization: `Token ${this.props.token}`
						}
					}).then((res) => {
						this.setState({list: [ ...this.state.list, res.data.user.username]})
					}).catch((err) => {});
				});
				break;
			case 'subscribers':
				this.props.subList.forEach((item) => {
					this.setState({list: [ ...this.state.list, item.user]})
				});
				break;
		}
	}

	render(props,state,context) {
		return (
			<div>
				<div class={style.result} style={{marginTop: 95}}>
					{this.state.list.length > 0 ?
						this.state.list.map((item,key) => (
							<div class={style.item} key={key} >
								<h1 />
								<h1 style={{width: '100%'}}>{item}</h1>
							</div>
						)) : <div class={style.item} >
							<h1 />
							<h1 style={{width: '100%', textAlign: 'center'}}>Пусто...</h1>
						</div>}
				</div>

			</div>
		);
	}
}

const mapToProps = (state) => ({
	token: state.token,
	user: state.user,
	subList: state.subList
});

export default connect(mapToProps, actions)(SubList);