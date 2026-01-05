import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import store from "../../redux/store";
import { setProp, setProp2, setEmailUpdateExpiration, signOut } from "../../redux/sync.js";
import { Link, useNavigate } from "react-router-dom";
import EmailUpdate from "./email_update/email_update.jsx";
import PasswordUpdate from "./password_update/password_update.jsx";
import UserDataUpdate from "./user_data_update/user_data_update.jsx";
import { config, errs } from "../../redux/action_names.js";
import { backgroundManager, getAccountBackgrounds } from "../../images_getter.js";
import "./account.css";

const Account = () => {

  const backgrounds = useRef( null );
  const [ selectedBackground, setSelectedBackground ] = useState( null );

  useEffect( () => {
    backgroundManager( getAccountBackgrounds, "account", backgrounds, setSelectedBackground );
    return () => {
      if( selectedBackground ) URL.revokeObjectURL( selectedBackground );
    };
  }, [] );

  const dispatch = useDispatch();
  const user = useSelector ( state => state.user );
  const [ accountOrUpd, setAccountOrUpd ] = useState( "account" );

  const emailUpdateRequest = async () => {
    if( !user.email_update_expiration ){
      dispatch( setProp( "loader", [ true ] ) );
      try{
        const res = await fetch( `${process.env.SERVER}/user/update/email/put_user_email`, config( store.getState().user.token, "PUT" ) );
        if( res.ok ){
          dispatch( setEmailUpdateExpiration( await res.json() ) );
          setAccountOrUpd( "email_update" );
        }else{
          const err = await res.json().catch( ( _err ) => { console.log( _err ); dispatch( setProp( "message", errs.unknown ) ); } );
          if( err ){
            console.log( err.errors );
            dispatch( setProp( "message", err.errors ) );
          };
        };
        console.log( "recived data." );
      }catch( err ){
        console.log( "Did not recive data." );
        console.log( err );
        dispatch( setProp( "message", errs.conn ) );
      };
      dispatch( setProp( "loader", 0 ) );
    }else{
      if( user.email_update_expiration > Date.now() ) setAccountOrUpd( "email_update" );
      else dispatch( setProp( "message", errs.token ) );
    };
  };

  const passwordUpdateRequest = async () => {
    if( user.password_update_expiration > Date.now() ){
      setAccountOrUpd( "password_update" );
    }else{
      console.log( "password update requested." );
      dispatch( setProp( "loader", [ true ] ) );
      try{
        const res = await fetch( `${process.env.SERVER}/user/update/password/update_request/signed_in`, config( store.getState().user.token, "PUT" ) );
        if( res.ok ){
          dispatch( setProp2( { user:{ ...user, password_update_expiration: await res.json() } } ) );
          setAccountOrUpd( "password_update" );
        }else{
          const err = await res.json().catch( ( _err ) => {
            console.log( _err );
            dispatch( setProp( "message", errs.unknown ) );
          } );
          console.log( err );
          if( err ){
            console.log( err );
            dispatch( setProp( "message", err.errors ) );
          };
        };
        console.log( "recived data." );
      }catch( err ){
        console.log( "Did not recive data." );
        console.log( err );
        dispatch( setProp( "message", errs.conn ) );
      };
      dispatch( setProp( "loader", 0 ) );
    };
  };

  const navigate = useNavigate();
  const handleAccountDeletion = async () => {
    try{
      dispatch( setProp( "loader", [ true ] ) );
      const res = await fetch( `${process.env.SERVER}/user/delete_user`, config( user.token, "DELETE" ) );
      if( res.ok ){
        dispatch( signOut() );
        navigate( "/" );
      }else{
        const _err = await res.json();
        dispatch( setProp2( { message: _err.errors, loader: 0 } ) );
      };
    }catch( err ){
      dispatch( setProp2( { loader: 0, message: errs.unknown } ) );
    };
  };
  
  if( user.email ){
    switch( accountOrUpd ){
      case "account": return(
        <div className="Account">
          {
            selectedBackground
              ?<div className="background-container">
                <div className="img-container" style={ selectedBackground.style }>
                  <img alt="" src={ selectedBackground.src } style={ selectedBackground.style }/>
                </div>
              </div>
            :null
          }
          <div className="header">
            <h1>Cuenta</h1>
            <Link to="/home">atrás</Link>
          </div>
          <div className="main">
            <div className="top-div">
              <h2>Datos del usuario</h2>
              <button className="update-button" onClick={ () => { setAccountOrUpd( "user_data_update" ); } }>Actualizar datos de usuario</button>
            </div>
            <div>
              <h3 className="user-data">Nombre: { user.first_name }</h3>
              <h3 className="user-data">Apellido: { user.last_name }</h3>
              <h3 className="user-data">Puntos: 1240</h3>
            </div>
            <hr></hr>
            <h2>Datos de acceso</h2>
            <div>
              <div className="email" >
                <h3 className="user-data">Email: { user.email }</h3>
                <button onClick={ () => { emailUpdateRequest(); } }>cambiar email</button>
              </div>
              <button onClick={ () => { passwordUpdateRequest(); } }>cambiar contraseña</button>
            </div>
            <button className="delete-account" onClick={ () => { handleAccountDeletion(); } }>eliminar cuenta</button>
          </div>
        </div>
      );
      case "email_update": return <EmailUpdate setAccountOrUpd = { setAccountOrUpd } user = { user } />;
      case "password_update": return <PasswordUpdate setAccountOrUpd = { setAccountOrUpd } user = { user } />;
      case "user_data_update": return <UserDataUpdate setAccountOrUpd = { setAccountOrUpd } user = { user } />;
    };
    return null;
  };
};

export default Account;