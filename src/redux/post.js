import { actioner, actions, config } from "./action_names.js";
import { errs } from "../errors.js";

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
        dispatch( actioner( actions.SESSION, errs.unknown_server_format ) );
      };
    }else{
      dispatch( actioner( actions.SESSION, errs.conn_server_format ) );
    };
  };
};

export const postAppo = ( postData, localData ) =>  async ( dispatch, getState ) => {
  const token = getState().user.token;
  const res = await fetch( `${process.env.SERVER}/appointment/post_appointment`, config( token, "POST", postData ) );
  const formatedRes = await res.json().catch( () => 0 );
  return dispatch( actioner( actions.POST, actioner( actions.APPOINTMENT, { res:formatedRes, postData, localData } ) ) );
};

export const postServ = ( postData ) => async ( dispatch, getState ) => {
  try{
    const token = getState().user.token;
    const res = await fetch( `${process.env.SERVER}/service/post_service`, config( token, "POST", postData ) )
    .catch( err => { console.error( err ); return 0; } );
    if( res ){
      if( res.ok ){
        const id = await res.json();
        const payload = { ...postData, id };
        dispatch( actioner( actions.POST, actioner( actions.SERVICE, payload ) ) );
      }else{
        const err = await res.json();
        dispatch( actioner( actions.POST, actioner( actions.SERVICE, err ) ) );
      };
    }else{
      dispatch( actioner( actions.POST, actioner( actions.SERVICE, errs.conn_server_format ) ) );
    };
  }catch( err ){
    console.error( err );
    dispatch( ( actions.POST, actioner( actions.SERVICE, errs.unknown_server_format ) ) );
  };
};

export const postSubServ = ( postData, selectedServInd ) => async ( dispatch, getState ) => {
  try{
    const token = getState().user.token;
    const res = await fetch( `${process.env.SERVER}/sub_service/post_sub_service`, config( token, "POST", postData ) )
    .catch( err => { console.error( err ); return 0; } );
    if( res ){
      if( res.ok ){
        const id = await res.json();
        const payload = { ...postData, id };
        delete payload.serviceId;
        dispatch( actioner( actions.POST, actioner( actions.SUB_SERVICE, { body: payload, servInd: selectedServInd } ) ) );
      }else{
        const err = await res.json();
        dispatch( actioner( actions.POST, actioner( actions.SUB_SERVICE, err ) ) );
      };
    }else{
      dispatch( actioner( actions.POST, actioner( actions.SUB_SERVICE, errs.conn_server_format ) ) );
    };
  }catch( err ){
    console.error( err );
    dispatch( ( actions.POST, actioner( actions.SUB_SERVICE, errs.unknown_server_format ) ) );
  };
};

export const postEmp = ( postData, selectedServInd ) => async ( dispatch, getState ) => {
  try{
    const token = getState().user.token;
    const res = await fetch( `${process.env.SERVER}/employee/post_employee`, config( token, "POST", postData ) )
    .catch( err => { console.error( err ); return 0 } );
    if( res ){
      if( res.ok ){
        const id = await res.json();
        const payload = { ...postData, id };
        dispatch( actioner( actions.POST, actioner( actions.EMPLOYEE, { body: payload, servInd: selectedServInd } ) ) );
      }else{
        const err = await res.json();
        dispatch( actioner( actions.POST, actioner( actions.EMPLOYEE, err ) ) );
      };
    }else{
      dispatch( actioner( actions.POST, actioner( actions.EMPLOYEE, errs.conn_server_format ) ) );
    };
  }catch( err ){
    console.log( err );
    dispatch( actioner( actions.POST, actioner( actions.EMPLOYEE, errs.unknown_server_format ) ) );
  };
};