import { actioner, actions, config, errs } from "./action_names.js";
import { errs as _errs } from "../errors.js";
import store from "./store.js";

export const adminSignIn = ( data ) => {
  console.log( "adminSignIn requested" );
  return async ( dispatch ) => {
    let res = await fetch(`${process.env.SERVER}/admin/sign_in`, {
      method: 'POST',
      credentials: "include",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify( data )
    }).catch( ( err ) => { console.log( err ); return 0; } );
    if( res ){
      const formatedRes = await res.json().catch( () => 0 );
      if( formatedRes ){
        formatedRes.token = res.headers.get('X-Csrf-Token');
        dispatch( actioner( actions.SESSION, formatedRes ) );
      }else{
        dispatch( actioner( actions.SESSION, _errs.unknown_server_format ) );
      };
    }else{
      dispatch( actioner( actions.SESSION, _errs.conn_server_format ) );
    };
  };
};

export const postAppo = ( postData, localData ) =>  async dispatch => {
  const res = await fetch(`${process.env.SERVER}/appointment/post_appointment`, config(
    store.getState().user.token, "POST", postData
  ));
  const formatedRes = await res.json().catch( () => 0 );
  return dispatch( actioner( actions.POST, actioner( actions.APPOINTMENT, { res:formatedRes, postData, localData } ) ) );
};

export const postServ = ( postData ) => async dispatch => {
  const res = await fetch( `${process.env.SERVER}/service/post_service`, config( store.getState().user.token, "POST", postData ) );
  if( res ){
    if( res.ok ){
      const id = await res.json();
      postData.id = id;
      dispatch( actioner( actions.POST, actioner( actions.SERVICE, postData ) ) );
    }else{
      const err = await res.json();
      dispatch( actioner( actions.POST, actioner( actions.SERVICE, err ) ) );
    };
  }else{
    dispatch( actioner( actions.POST, actioner( actions.SERVICE, _errs.conn_server_format ) ) );
  };
};