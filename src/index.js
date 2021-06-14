import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import FileView from './FileView'
import reportWebVitals from './reportWebVitals';

import {Provider} from 'react-redux';

import store from './store';
import './index.css';


const rootDiv = document.getElementById('root');

const comp =
  <div>
    <div className={'btn-padding'}>
    </div>
    <App />
     
  </div>;

ReactDOM.render(comp, rootDiv);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
