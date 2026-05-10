import { actioner, actions, filtersToURL, config } from "./action_names.js";
import { errs } from "../errors.js";

export const getServs = () => async ( dispatch, getState ) => {
  try{
    const res = await fetch( `${process.env.SERVER}/service/get_services`, config( getState().user.token, 'GET' ) )
    .catch( err => { console.log( err ); return 0 } );
    if( res ){
      const servs = await res.json();
      dispatch( actioner( actions.GET, actioner( actions.SERVICE, servs ) ) );
      return servs;
    }else{
      dispatch( actioner( actions.GET, actioner( actions.SERVICE, errs.conn_server_format ) ) );
    };
    return 0;
  }catch( err ){
    console.error( err );
    dispatch( actioner( actions.GET, actioner( actions.SERVICE, errs.unknown_server_format ) ) );
    return 0;
  };
};

export const getSubServs = () => async ( dispatch, getState ) => {
  try{
    const res = await fetch( `${process.env.SERVER}/sub_service/get_sub_services`, config( getState().user.token, 'GET' ) )
    .catch( err => { console.log( err ); return 0 } );
    if( res ){
      const servs = await res.json();
      dispatch( actioner( actions.GET, actioner( actions.SUB_SERVICE, servs ) ) );
    }else{
      dispatch( actioner( actions.GET, actioner( actions.SUB_SERVICE, errs.conn_server_format ) ) );
    };
  }catch( err ){
    console.error( err );
    dispatch( actioner( actions.GET, actioner( actions.SUB_SERVICE, errs.unknown_server_format ) ) );
  };
};

export const getEmps = () => async ( dispatch, getState ) => {
  try{
    const res = await fetch( `${process.env.SERVER}/employee/get_employees`, config( getState().user.token, 'GET' ) )
    .catch( err => { console.log( err ); return 0; } );
    if( res ){
      const body = await res.json();
      dispatch( actioner( actions.GET, actioner( actions.EMPLOYEE, body ) ) );
    }else{
      dispatch( actioner( actions.GET, actioner( actions.EMPLOYEE, errs.conn_server_format ) ) );
    };
  }catch( err ){
    console.error( err );
    dispatch( actioner( actions.GET, actioner( actions.EMPLOYEE, errs.unknown_server_format ) ) );
  };
};

export const getAppos = () => async ( dispatch, getState ) => {
  try{
    const token = getState().user.token;
    const res = await fetch( `${process.env.SERVER}/appointment/get_appointments`, config( token, 'GET' ) );
    if( res ){
      const body = await res.json();
      dispatch( actioner( actions.GET, actioner( actions.APPOINTMENT, body ) ) );
    }else{
      dispatch( actioner( actions.GET, actioner( actions.APPOINTMENT, errs.conn_server_format ) ) );
    };
  }catch( err ){
    console.error( err );
    dispatch( actioner( actions.GET, actioner( actions.APPOINTMENT, errs.unknown_server_format ) ) );
  };
};

export const getAllAppos = () => async ( dispatch, getState ) => {
  try{
    const token = getState().user.token;
    const res = await fetch( `${process.env.SERVER}/appointment/get_all_appos`, config( token, 'GET' ) );
    if( res ){
      const body = await res.json();
      dispatch( actioner( actions.GET, actioner( actions.APPO_CAL, body ) ) );
    }else{
      dispatch( actioner( actions.GET, actioner( actions.APPO_CAL, errs.conn_server_format ) ) );
    };
  }catch( err ){
    console.error( err );
    dispatch( actioner( actions.GET, actioner( actions.APPO_CAL, errs.unknown_server_format ) ) );
  };
};

export const getUsers = () => async( dispatch, getState )=>{
  try{
    const token = getState().user.token;
    const res = await fetch( `${process.env.SERVER}/user/get_users`, config( token, 'GET' ) )
    .catch( err => { console.error( err ); return 0; } );
    if( res ){
      const body = await res.json();
      dispatch( actioner( actions.GET, actioner( actions.USER, body ) ) );
    }else{
      dispatch( actioner( actions.GET, actioner( actions.USER, errs.conn_server_format ) ) );
    };
  }catch( err ){
    console.error( err );
    dispatch( actioner( actions.GET, actioner( actions.USER, errs.unknown_server_format ) ) );
  };
};