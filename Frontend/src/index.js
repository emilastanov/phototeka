import { h, render } from 'preact';
import { Provider } from 'redux-zero/react';

import App from './components/app';
import store from './store';


const phototekaDOM = document.getElementById('root');

console.log(phototekaDOM);

const Application = () => (
    <Provider store={store}>
        <App/>
    </Provider>
);

render(
    <Application/>, phototekaDOM
);