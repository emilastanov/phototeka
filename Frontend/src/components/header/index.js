import { Link } from 'preact-router/match';
import './style';
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

	render(props, state, context) {
		return (
			<header class={`header ${this.props.theme === 'black' ? 'black' : 'white'}`}>
				<h1>Phototeka</h1>
				{this.props.token ? <nav>
					<Link activeClassName='active' href="/search">
						<FaSearch />
					</Link>
					<Link activeClassName='active' href="/home">
						<FaHome />
					</Link>
					<Link activeClassName='active' href="/profile">
						<FaUser />
					</Link>
				</nav> : null}
			</header>
		);
	}
}

const mapToProps = ({
	token,
	theme
}) => ({
	token,
	theme
});

export default connect(mapToProps)(Header);
