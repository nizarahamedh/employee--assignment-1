import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
// import EmployeeCreate from './container/employeec';
import App from './App';
// import App from './App'
import * as serviceWorker from './serviceWorker';
import axios from './axios-dynamo'

ReactDOM.render(<App />, document.getElementById('root'));

axios.interceptors.request.use(request => {
    console.log(request);
    // Edit request config
    return request;
}, error => {
    console.log(error);
    return Promise.reject(error);
});

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
