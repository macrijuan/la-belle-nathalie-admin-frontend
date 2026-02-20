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

export const appoCalReq = () => async ( dispatch, getState ) => {
  try{
    const token = getState().user.token;
    const res = await Promise.all( [
      fetch( `${process.env.SERVER}/user/get_users`, config( token, 'GET' ) ).catch( err => { console.error( err ); return 0; } ),
      fetch( `${process.env.SERVER}/service/get_services`, config( token, 'GET' ) ).catch( err => { console.error( err ); return 0; } ),
    ] );

    const okData = {};
    const errors = {};

    if( res[ 0 ] ){
      const users = await res[ 0 ].json().catch( err => { console.error( err ); return errs.unknown_server_format } );
      if( !users.errors ){
        okData.users = users;
      }else{
        errors.usuarios = Object.values( users.errors )[ 0 ];
      };
    }else{
      errors.usuarios = errs.conn[ "conexión" ];
    };

    if( res[ 1 ] ){
      const servs = await res[ 1 ].json().catch( err => { console.error( err ); return errs.unknown_server_format; } );
      if( !servs.errors ){
        okData.services = servs;
        const empsRes = await fetch( `${process.env.SERVER}/employee/get_employees?service=${servs[ 0 ].id}`, config( token, 'GET' ) )
        .catch( err => { console.error( err ); return 0; } );
        if( empsRes ){
          const emps = await empsRes.json().catch( err => { console.error( err ); return errs.unknown_server_format } );
          if( !emps.errors ){
            okData.employees = emps;
          }else{
            errors.empleados = Object.values( emps.errors )[ 0 ];
          };
        }else{
          errors.empleados = errs.conn[ "conexión" ];
        };
      }else{
        errors.servicios = Object.values( servs.errors )[ 0 ];
      };
    }else{
      errors.servicios = errs.conn[ "conexión" ];
    };

    dispatch( actioner( actions.GET, actioner( actions.APPO_CAL, { errors, okData } ) ) );

  }catch( err ){
    console.error( err );
    dispatch( actioner( actions.GET, actioner( actions.APPO_CAL, errs.unknown_server_format ) ) );
  };
};


const res = {
  errors:{
    unknown:"An unknown error occured."
  }
};

const message = {
  servicios: "An unknown error occured.",
  usuarios: "Falló la conexión al servidor."
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