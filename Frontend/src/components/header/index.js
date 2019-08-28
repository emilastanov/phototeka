import { Link } from 'preact-router/match';
import style from './style';
import { FaUser, FaHome, FaSearch, FaInstagram } from 'react-icons/fa';
import { connect } from 'redux-zero/preact';
import { h, Component } from 'preact';
import { route } from 'preact-router';


class Header extends Component {
	componentDidMount() {
		if (!this.props.token) {
			route('/',true);
		}
		document.title = 'Phototeka';
	}

	render(props,state,context) {
		return (
			<header class={`${style.header} ${this.props.theme === 'black' ? style.black : style.white}`}>
				<h1>Phototeka</h1>
				{this.props.token ? <nav>
					<Link activeClassName={style.active} href="/search">
						<FaSearch />
					</Link>
					<Link activeClassName={style.active} href="/home">
						<FaHome />
					</Link>
					<Link activeClassName={style.active} href="/profile">
						<FaUser />
					</Link>
				</nav> : null}
			</header>
		);
	}
}

const mapToProps = (state) => ({
	token: state.token,
	theme: state.theme
});

export default connect(mapToProps)(Header);
