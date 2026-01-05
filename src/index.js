import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import store from './redux/store.js';

import './index.css';

import Loader from './components/loader/loader.jsx';
import ErrorPopUp from "./components/pop_up/pop_up.jsx";
import Test from "./components/routeTest.jsx";
import Home from './components/home/home.jsx';
import Appo_calendar from "./components/appo_calendar/appo_calendar.jsx";
import Account from './components/account/account.jsx';
import SignUp from './components/session/sign_up/sign_up_index.jsx';
import PasswordRecovery from './components/account/password_recovery/password_recovery.jsx';
import SignIn from './components/session/sign_in.jsx';


const root = ReactDOM.createRoot( document.getElementById('root') );
root.render(
  <Provider store={ store }>
    <Loader />
    <ErrorPopUp />
    <BrowserRouter>
      <Routes>
        <Route exact path="/test" element={ <Test /> } />
        <Route exact path="/home" element={ <Home /> } />
        <Route exact path="/appo_cal" element={ <Appo_calendar /> } />
        <Route exact path="/account" element={ <Account /> } />
        <Route exact path="/sign_up" element={ <SignUp /> } />
        <Route exact path="/password_recovery" element={ <PasswordRecovery /> } />
        <Route exact path="/" element={ <SignIn /> } />
      </Routes>
    </BrowserRouter>
  </Provider>
);