import React, { useRef } from "react";
import { useDispatch } from "react-redux";
import { errs, config } from "../../../redux/action_names";
import store from "../../../redux/store.js";
import { setProp } from "../../../redux/sync.js";

const PasswordUpdate = ( { setAccountOrUpd, user }) => {

  const dispatch = useDispatch();

  const data = useRef({
    body:{ token:"", password:"", password_conf:"" },
    handlers:{
      handleChange: ( prop, value ) => {
        data.current.body[ prop ] = value;
      },
      handleSubmit: async () => {
        if( user.password_update_expiration > Date.now() ){          
          dispatch( setProp( "loader", [ true ] ) );
          try{
            const res = await fetch( `${process.env.SERVER}/user/update/password/confirm_update/signed_in`, config( store.getState().user.token, "PUT", data.current.body ) );
            if( res.ok ){
              dispatch( setProp( "message", { éxito:"Actualización exitosa." } ) );
              setAccountOrUpd( "account" );
            }else{
              const err = await res.json().catch( ( _err ) => { console.log( _err ); dispatch( setProp( "message", errs.unknown ) ); } );
              console.log( err.errors );
              dispatch( setProp( "message", err.errors ) );
              if( !( res.status === 403 || res.status === 410 ) ){ console.log( "redirect to account"); setAccountOrUpd( "account" ); };
            };
            console.log( "recived data." );
          }catch( err ){
            console.log( "Did not recive data." );
            console.log( err );
            dispatch( setProp( "message", errs.conn ) );
          };
          dispatch( setProp( "loader", [ false ] ) );
        }else{
          console.log( "password_update_expiration: ", user.password_update_expiration );
          dispatch( setProp( "message", errs.token ) );
          setAccountOrUpd( "account" );
        };
      }
    }
  });

  return(
    <div className="PasswordUpdate">
      <button onClick={ () => { setAccountOrUpd( "account" ); } } >atrás</button>
      <p>Hemos enviado un correo a la dirección de correo electrónico ({ user.email }) actualmente asignada a esta cuenta de La Belle Nathalie cuyo contenido es el código que debe escribir aquí abajo para confirmar que usted es el/la dueña.</p>
      <form onSubmit={ ( e ) => { e.preventDefault(); data.current.handlers.handleSubmit(); } }>
        <label>Código:</label>
        <input placeholder="código" onChange={ ( e ) => { data.current.handlers.handleChange( "token", e.target.value ); } } />
        <br></br>
        <p>Aquí abajo debe escribir la contraseña que reemplazará la actual.</p>
        <label>Nueva contraseña:</label>
        <input placeholder="contraseña" onChange={ ( e ) => { data.current.handlers.handleChange( "password", e.target.value ); } } />
        <br></br>
        <label>Repita su nueva contraseña:</label>
        <input placeholder="contraseña" onChange={ ( e ) => { data.current.handlers.handleChange( "password_conf", e.target.value ); } } />
        <button type="submit" style={{ marginTop: "2em", display: "block", justifySelf: "center" }}>actualizar</button>
      </form>
    </div>
  )
};

export default PasswordUpdate;