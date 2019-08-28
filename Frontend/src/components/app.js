import { h, Component } from 'preact';
import './style';
import { Router } from 'preact-router';


import Header from './header';
import Home from './home';
import Search from './search';
import Profile from './profile';
import Auth from './auth';
import ProfileEdit from './profileEdit';
import PostDetail from './postDetail';
import ProfileDetail from './profileDetail';
import CreatePost from './createPost';
import TagList from './tagList';
import SubList from './subList';


class App extends Component {

	handleRoute = e => {
		this.currentUrl = e.url;
	};

	render(props,state,context) {
		return (
			<div id="app">
				<Header />

				<Router>
					<Auth path="/" />
					<Home path="/home" />
					<Search path="/search" />
					<Profile path="/profile" />
					<ProfileEdit path="/profile/edit" />
					<PostDetail path="/post/:id" />
					<ProfileDetail path="/profile/:id" />
					<CreatePost path="/createPost" />
					<TagList path="/postsbytag/:tag" />
					<SubList path="/sub/:s" />
				</Router>
			</div>
		);
	}
}


export default App;