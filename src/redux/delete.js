import { actions, actioner, config } from "./action_names.js";
import { errs } from "../errors.js";
import store from "./store";

export const servDel = ( servIds, servInds ) => async ( dispatch, getState ) => {
  try{
    const token  = getState().user.token;
    const res = await fetch( `${process.env.SERVER}/service/delete_services`, config( token, 'DELETE', servIds ) )
    .catch( err => { console.error( err ); return 0 } );
    if( res ){
      if( res.ok ){
        dispatch( actioner( actions.DELETE, actioner( actions.SERVICE, servInds ) ) );
      }else{
        const resBody = await res.json().catch( ( err ) => { console.error( err ); return  errs.unknown_server_format } );
        dispatch( actioner( actions.DELETE, actioner( actions.SERVICE, resBody ) ) );
      };
      return 1;
    }else{
      dispatch( actioner( actions.DELETE, actioner( actions.SERVICE, errs.conn_server_format ) ) );
      return 0;
    };
  }catch( err ){
    console.error( err );
    dispatch( actioner( actions.DELETE, actioner( actions.SERVICE, errs.unknown_server_format ) ) );
  };
};

export const sub_servDel = ( ids, inds ) => async ( dispatch, getState ) => {
  try{
    const token  = getState().user.token;
    const res = await fetch( `${process.env.SERVER}/sub_service/delete_sub_services`, config( token, 'DELETE', ids ) )
    .catch( err => { console.error( err ); return 0 } );
    if( res ){
      if( res.ok ){
        console.log( "got executed 1 " );
        dispatch( actioner( actions.DELETE, actioner( actions.SUB_SERVICE, inds ) ) );
      }else{
        console.log( "got executed 1.2 " );
        const resBody = await res.json().catch( ( err ) => { console.error( err ); return  errs.unknown_server_format } );
        dispatch( actioner( actions.DELETE, actioner( actions.SUB_SERVICE, resBody ) ) );
      };
      return 1;
    }else{
      console.log( "got executed 2 " );
      dispatch( actioner( actions.DELETE, actioner( actions.SUB_SERVICE, errs.conn_server_format ) ) );
      return 0;
    };
  }catch( err ){
    console.error( err );
    dispatch( actioner( actions.DELETE, actioner( actions.SUB_SERVICE, errs.unknown_server_format ) ) );
  };
};

export const empDel = ( ids, inds ) => async ( dispatch, getState ) => {
  try{
    const token  = getState().user.token;
    const res = await fetch( `${process.env.SERVER}/employee/delete_employees`, config( token, 'DELETE', ids ) )
    .catch( err => { console.error( err ); return 0 } );
    if( res ){
      if( res.ok ){
        dispatch( actioner( actions.DELETE, actioner( actions.EMPLOYEE, inds ) ) );
      }else{
        const resBody = await res.json().catch( ( err ) => { console.error( err ); return  errs.unknown_server_format } );
        dispatch( actioner( actions.DELETE, actioner( actions.EMPLOYEE, resBody ) ) );
      };
      return 1;
    }else{
      dispatch( actioner( actions.DELETE, actioner( actions.EMPLOYEE, errs.conn_server_format ) ) );
      return 0;
    };
  }catch( err ){
    console.error( err );
    dispatch( actioner( actions.DELETE, actioner( actions.EMPLOYEE, errs.unknown_server_format ) ) );
  };
};

export const appoDel = ( ids, appoInd ) => async dispatch => {
  try{
    const token  = store.getState().user.token;
    const res = await fetch( `${process.env.SERVER}/appointment/delete_appointments`, config( token, 'DELETE', ids ) )
    .catch( err => { console.error( err ); return 0; } );
    if( res ){
      if( res.ok ){
        dispatch( actioner( actions.DELETE, actioner( actions.APPOINTMENT, appoInd ) ) );
        return 1;
      }else{
        const resBody = await res.json();
        dispatch( actioner( actions.DELETE, actioner( actions.APPOINTMENT, resBody ) ) );
      };
    }else{
      dispatch( actioner( actions.DELETE, actioner( actions.APPOINTMENT, errs.conn_server_format ) ) );
    };
    return 0;
  }catch( err ){
    console.error( err );
    dispatch( actioner( actions.DELETE, actioner( actions.APPOINTMENT, errs.unknown_server_format ) ) );
    return 0;
  };
};