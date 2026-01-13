import React, { useRef } from "react";
import { useDispatch } from "react-redux";
import store from "../../../redux/store.js";
import { setEmailUpdateExpiration } from "../../../redux/sync.js";
import { config, errs } from "../../../redux/action_names.js";
import { setProp } from "../../../redux/sync.js";

const ConfirmCurrentEmailOwnerShip = ( { setAccountOrUpd, setEmailToCheck, user, possibleNewEmail } ) => {

  const body = useRef( { token:"506cc8", email:"amacri48@gmail.com" } );
  
  const handleChange = ( prop, value ) => {
    body.current[ prop ] = value;
  };
  
  const dispatch = useDispatch();

  const handleSubmit = async () => {
    if( user.email_update_expiration > Date.now() ){
      dispatch( setProp( "loader", 1 ) );
      try{
        const res = await fetch( `${process.env.SERVER}/user/update/email/confirm_current_email_ownership`, config( store.getState().user.token, "PUT", body.current ) );
        if( res.ok ){
          possibleNewEmail.current = body.current.email;
          dispatch( setEmailUpdateExpiration( { email_update_expiration: await res.json(), possible_new_email: true } ) );
          setEmailToCheck( "new" );
        }else{
          const err = await res.json().catch( ( _err ) => {
            console.log( _err );
            dispatch( setProp( "message", errs.unknown ) );
            console.log( "redirect to account");
            setAccountOrUpd( "account" );
          } );
          if( err ){
            console.log( err.errors );
            dispatch(setProp( "message", err.errors ) );
            if( !( res.status === 403 || res.status === 410 ) ){ console.log( "redirect to account"); setAccountOrUpd( "account" ); }
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
      dispatch( setProp( "message", errs.token ) );
      console.log( "redirect to account");
      setAccountOrUpd( "account" );
    };
  };

  return(//
    <div className="EmailUpdate">
      <p>Hemos enviado un correo a la dirección de correo electrónico ({ user.email }) actualmente asignada a esta cuenta de La Belle Nathalie cuyo contenido es el código que debe escribir aquí abajo para confirmar que usted es el/la dueña.</p>
      <form onSubmit={ ( e ) => { e.preventDefault(); handleSubmit(); } }>
        <label>Código:</label>
        <input placeholder="código" onChange={ ( e ) => { handleChange( "token", e.target.value ); } } />
        <br></br>
        <p>Aquí abajo debe escribir la dirección de correo electrónico que reemplazará la actual.</p>
        <label>Nuevo email:</label>
        <input placeholder="nuevoemail@ejemplo.com" onChange={ ( e ) => { handleChange( "email", e.target.value ); } } />
        <button type="submit" style={{ marginTop: "2em", display: "block", justifySelf: "center" }}>enviar</button>
      </form>
    </div>
  )
};

export default ConfirmCurrentEmailOwnerShip;