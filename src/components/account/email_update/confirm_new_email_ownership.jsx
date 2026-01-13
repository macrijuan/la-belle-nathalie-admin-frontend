import React, { useRef } from "react";
import { useDispatch } from "react-redux";
import store from "../../../redux/store.js";
import { config, errs } from "../../../redux/action_names.js";
import { setProp, setProp2, setEmailUpdateExpiration } from "../../../redux/sync.js";

const ConfirmNewEmailOwnerShip = ({ setAccountOrUpd, user, possibleNewEmail }) => {

  const body = useRef( { token:"3d6892" } );

  const dispatch = useDispatch();
  const handleSubmit = async () => {
    if( user.email_update_expiration > Date.now() ){
      dispatch( setProp( "loader", 1 ) );
      try{
        const res = await fetch( `${process.env.SERVER}/user/update/email/confirm_new_email_ownership`, config( store.getState().user.token, "PUT", body.current ) );
        if( res.ok ){
          console.log( "ALL GOOD!!" );
          dispatch( setProp2( { user:{ ...user, email: possibleNewEmail, email_update_expiration: null, possible_new_email: false } } ) );
          setAccountOrUpd( "account" );
        }else{
          const err = await res.json().catch( ( _err ) => {
            console.log( _err );
            dispatch( setProp( "message", errs.unknown ) );
            console.log( "redirect to account");
            setAccountOrUpd( "account" );
          } );
          console.log( err.errors );
          dispatch( setProp( "message", err.errors ) );
          if( !( res.status === 401 || res.status === 403 || res.status === 409 ) ){ console.log( "redirect to account"); setAccountOrUpd( "account" ); }
        };
        console.log( "recived data." );
      }catch( err ){
        console.log( "Did not recive data." );
        console.log( err );
        dispatch( setProp( "message", errs.conn ) );
      };
      dispatch( setProp( "loader", 0 ) );
    }else{
      console.log( "email_update_expiration: ", user.email_update_expiration );
      dispatch( setProp( "message", errs.token ) );
      console.log( "redirect to account"); setAccountOrUpd( "account" );
    };
  };

  return(
    <div className="EmailUpdate">
      <h3>Hemos enviado un correo a la dirección de correo electrónico con la que desea reemplazar la actual para confirmar que usted es el/la dueña de dicha dirección de correo electrónico.</h3>
      <form onSubmit={ ( e ) => { e.preventDefault(); handleSubmit(); } }>
        <label>Código:</label>
        <input placeholder="código" onChange = { ( e ) => { body.current.token = e.target.value; } } />
        <button type="submit" style={{ marginTop: "2em", display: "block", justifySelf: "center"}}>enviar</button>
      </form>
    </div>
  )
};

export default ConfirmNewEmailOwnerShip;