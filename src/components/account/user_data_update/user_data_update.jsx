import React, { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { setProp, setProp2 } from "../../../redux/sync.js";
import { errs, config } from "../../../redux/action_names.js";
import "./user_data_update.css";

const UserDataUpdate = ({ setAccountOrUpd, user }) => {
  
  const possibleFieldsToUpdate = [ "first_name", "last_name" ];

  const dispatch = useDispatch();
  
  const [ flag, setFlag ] = useState( false );

  const data = useRef({
    body:{},
    handlers:{
      checkboxChange: ( prop, curFlag ) => {
        if( `${prop}` in data.current.body ) delete data.current.body[ prop ];
        else data.current.body[ prop ] = "";
        console.log( data.current.body );
        setFlag( !curFlag );
      },
      writtingFieldChange: ( prop, value ) => {
        data.current.body[ prop ] = value.toUpperCase();
        console.log( data.current.body[ prop ] );
      },
      formSubmit: async ( body, bodyKeys ) => {
        try{
          for( let key of bodyKeys ){
            if( !body[ key ] ){ 
              return dispatch( setProp( "message", errs.empty( key ) ) );
            };
          };
          dispatch( setProp( "loader", 1 ) );
          const res = await fetch( `${process.env.SERVER}/user/update/update_names`, config( user.token, "PUT", body ) );
          if( res.ok ){
            dispatch( setProp2( { user:{ ...user, ...data.current.body } } ) );
            setAccountOrUpd( "account" );
          }else{
            const errFromServer = await res.json().catch( () => { dispatch( setProp( "message", errs.unknown ) ) } );
            if( errFromServer) dispatch( setProp( "message", errFromServer.errors ) );
          };
          dispatch( setProp( "loader", 0 ) );
        }catch( err ){
          console.log( "error case" );
          console.log( err );
          dispatch( setProp( "message", errs.conn ) );
          dispatch( setProp( "loader", 0 ) );
        };
      }
    }
  });

  const bodyKeys = Object.keys( data.current.body );

  return(
    <div className="UserDataUpdate">
      <div className="header">
        <button onClick={ () => { setAccountOrUpd( "account" ); } } >atrás</button>
        <h1>Actualización de datos del usuario</h1>
      </div>
      <h3>Selecciona los datos que quieres actualizar</h3>
      <div className="field-selection">
        {
          possibleFieldsToUpdate.map( ( prop, i ) => (
            <div key={ `possibleFieldsToUpdate_${i}`}>
              <label>{ prop }:</label>
              <input type="checkbox" onChange = { () => { data.current.handlers.checkboxChange( prop, flag ); } }/>
            </div>
          ) )
        }
      </div>
      {
        bodyKeys.length
          ?<form className="update-form" onSubmit={ ( e ) => { e.preventDefault(); data.current.handlers.formSubmit( data.current.body, bodyKeys ); } }>
            <div>
              <h3>Escribe en los campos con la nueva información</h3>
              {
                bodyKeys.map( ( prop, i ) => (
                  <div key={ `bodyKeys_${i}` }>
                    <label>{ prop.replace( "_"," " ) }:</label>
                    <input onChange={ ( e ) => { data.current.handlers.writtingFieldChange( prop, e.target.value ); } }/>
                  </div>
                ) )
              }
            </div>
            <button type="submit" >actualizar</button>
          </form>
        :null
      }
    </div>
  );
};

export default UserDataUpdate;