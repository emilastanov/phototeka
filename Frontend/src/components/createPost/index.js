import { h, Component } from 'preact';
import './style';
import axios from 'axios';
import { connect } from 'redux-zero/preact';
import actions from '../../store/actions';


class CreatePost extends Component {
	state = {
		photo: null,
		error: null,
		isSuccess: false
	};

	uploadFile = (elem) => {
		this.setState({photo: Array.from(elem.target.files)});
	};

	publish = () => {
		if (!this.state.photo) {
			this.setState({ error: 'Загрузите фото!' })
		} else {
			let fd = new FormData();
			this.state.photo.forEach((item,key) => {
				fd.append(`img${key}`,item);
			});
			fd.append('description', this._Input.value);
			axios.post('/api/v1/post/create/', fd, {
				headers: {
					Authorization: `Token ${this.props.token}`
				}
			}).then((res) => {
				this._Input.value = '';
				this.setState({ photo: null, isSuccess: true });

			});
		}
	};

	componentDidMount() {
		this.setState({ error: null, isSuccess: false });
	}

	render(props, state, context) {
		return (
			<div class='createPost'>
				{this.state.isSuccess ? <h1>Пост успешно опубликован!</h1> : ''}
				{this.state.error ? <h1 style={{ color: 'red' }}>{this.state.error}</h1> : ''}
				<textarea placeholder="Описание" ref={(input) => {this._Input = input}}/>
				<input type="file" onChange={(elem)=>{this.uploadFile(elem)}} multiple="multiple" id="files"/>
				<label for="files">Загрузить фото</label>
				<div class='photos'>
					<div>
						{this.state.photo ? this.state.photo.map((item,key) => (
							<img key={key} src={URL.createObjectURL(item)} alt="" />
						)) : <h1>Пусто...</h1>}
					</div>
				</div>
				<button onClick={this.publish}>Опубликовать</button>
			</div>
		);
	}
}

const mapToProps = ({
	token
}) => ({
	token
});

export default connect(mapToProps, actions)(CreatePost);