import { actioner, actions, filtersToURL, config } from "./action_names.js";
import { errs } from "../errors.js";

export const getServs = () => async ( dispatch, getState ) => {
  const res = await fetch( `${process.env.SERVER}/service/get_services`, config( getState().user.token, 'GET' ) )
  .catch( err => { console.log( err ); return 0 } );
  if( res ){
    const servs = await res.json().catch( () => errs.unknown_server_format );
    dispatch( actioner( actions.GET, actioner( actions.SERVICE, servs ) ) );
  }else{
    dispatch( actioner( actions.GET, actioner( actions.SERVICE, errs.conn_server_format ) ) );
  };
};

export const getSubServs = () => async ( dispatch, getState ) => {
  const res = await fetch( `${process.env.SERVER}/sub_service/get_sub_services`, config( getState().user.token, 'GET' ) )
  .catch( err => { console.log( err ); return 0 } );
  if( res ){
    const servs = await res.json().catch( () => errs.unknown_server_format );
    dispatch( actioner( actions.GET, actioner( actions.SUB_SERVICE, servs ) ) );
  }else{
    dispatch( actioner( actions.GET, actioner( actions.SUB_SERVICE, errs.conn_server_format ) ) );
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
    dispatch( actioner( actions.GET, actioner( actions.EMPLOYEE, errs.unknown_server_format ) ) );
  };
};

export const getAppos = () => async ( dispatch, getState ) => {
  console.log( "appos requested" );
  try{
    const res = await fetch( `${process.env.SERVER}/appointment/get_appointments`, config( getState().user.token, 'GET' )
  );
  dispatch( actioner( actions.GET, actioner( actions.APPOINTMENT, await res.json() ) ) );
}catch( err ){
  console.log( err );
};
};

export const users = () => async( dispatch, getState )=>{
  try{
    const res = await fetch( `${process.env.SERVER}/user/get_users`, config( getState().user.token, 'GET' ) );
    if( res ){
      const body = await res.json();
      dispatch( actioner( actions.GET, actioner( actions.USER, body ) ) );
    }else{
      dispatch( actioner( actions.GET, actioner( actions.USER, errs.conn_server_format ) ) );
    };
  }catch( err ){
    dispatch( actioner( actions.GET, actioner( actions.USER, errs.unknown_server_format ) ) );
    throw new Error( err );
  };
};

export const appoCalReq = () => async ( dispatch, getState ) => {
  const servsReq = await fetch( `${process.env.SERVER}/service/get_services`, config( getState().user.token, 'GET' ) );
  const servs = await servsReq.json().catch( () => errs.conn_server_format );
  if( !servs.errors ){
    if( servs.length ){
      const empsReq = await fetch( `${process.env.SERVER}/employee/get_employees?service=${servs[ 0 ].id}`, config( token, 'GET' ) );
      const emps = await empsReq.json().catch( () => errs.conn_server_format );
      if( !emps.errors ){
        dispatch( actioner( actions.GET, actioner( actions.APPO_CAL, { servs, emps } ) ) );
      }else{
        dispatch( actioner( actions.GET, actioner( actions.APPO_CAL, emps ) ) );
      };
    }else{
      dispatch( actioner( actions.GET, actioner( actions.APPO_CAL, { errors:{ services:"Services not found." } } ) ) );
    };
  }else{
    dispatch( actioner( actions.GET, actioner( actions.APPO_CAL, servs ) ) );
  };
};

export const getServEmps = ( serviceId ) => async ( dispatch ) => {
  const token = store.getState().user.token;
  const empsReq = await fetch( `${process.env.SERVER}/employee/get_employees?service=${serviceId}`, config( token, 'GET' ) );
  const emps = await empsReq.json().catch( () => errs.conn_server_format );
  if( !emps.errors ){
    dispatch( actioner( actions.GET, actioner( actions.APPO_CAL, { emps } ) ) );
  }else{
    dispatch( actioner( actions.GET, actioner( actions.APPO_CAL, emps ) ) );
  };
};