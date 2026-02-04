import { actions, actioner, config } from "./action_names.js";
import { errs } from "../errors.js";
import store from "./store";


export const appoDel = ( id, appoInd, empId, appoDay, appoTime ) => async dispatch => {
  const token  = store.getState().user.token;
  const res = await fetch( `${process.env.SERVER}/appointment/delete_appointment/${id}`, config( token, 'DELETE' ) )
  .catch( err => { console.log( err ); return 0; } );
  if( res ){
    if( res.ok ){
      dispatch( actioner( actions.DELETE, actioner( actions.APPOINTMENT, { appoInd, empId, appoDay, appoTime } ) ) );
    }else{
      const resBody = await res.json().catch( ( err ) => { console.log( err ); return errs.conn_server_format } );
      dispatch( actioner( actions.DELETE, actioner( actions.APPOINTMENT, resBody ) ) );
    };
  }else{
    dispatch( actioner( actions.DELETE, actioner( actions.APPOINTMENT, errs.conn_server_format ) ) );
  };
};

export const servDel = ( servIds, servInds ) => async ( dispatch, getState ) => {
  const token  = getState().user.token;
  const res = await fetch( `${process.env.SERVER}/service/delete_services`, config( token, 'DELETE', servIds ) )
  .catch( err => { console.log( err ); return 0 } );
  if( res ){
    if( res.ok ){
      dispatch( actioner( actions.DELETE, actioner( actions.SERVICE, servInds ) ) );
    }else{
      const resBody = await res.json().catch( ( err ) => { console.log( err ); return  errs.unknown_server_format } );
      dispatch( actioner( actions.DELETE, actioner( actions.SERVICE, resBody ) ) );
    };
    return 1;
  }else{
    dispatch( actioner( actions.DELETE, actioner( actions.SERVICE, errs.conn_server_format ) ) );
    return 0;
  };
};

export const sub_servDel = ( ids, inds ) => async ( dispatch, getState ) => {
  const token  = getState().user.token;
  const res = await fetch( `${process.env.SERVER}/sub_service/delete_sub_services`, config( token, 'DELETE', ids ) )
  .catch( err => { console.log( err ); return 0 } );
  if( res ){
    if( res.ok ){
      console.log( "got executed 1 " );
      dispatch( actioner( actions.DELETE, actioner( actions.SUB_SERVICE, inds ) ) );
    }else{
      console.log( "got executed 1.2 " );
      const resBody = await res.json().catch( ( err ) => { console.log( err ); return  errs.unknown_server_format } );
      dispatch( actioner( actions.DELETE, actioner( actions.SUB_SERVICE, resBody ) ) );
    };
    return 1;
  }else{
    console.log( "got executed 2 " );
    dispatch( actioner( actions.DELETE, actioner( actions.SUB_SERVICE, errs.conn_server_format ) ) );
    return 0;
  };
};

export const empDel = ( ids, inds ) => async ( dispatch, getState ) => {
  const token  = getState().user.token;
  const res = await fetch( `${process.env.SERVER}/employee/delete_employees`, config( token, 'DELETE', ids ) )
  .catch( err => { console.log( err ); return 0 } );
  if( res ){
    if( res.ok ){
      dispatch( actioner( actions.DELETE, actioner( actions.EMPLOYEE, inds ) ) );
    }else{
      const resBody = await res.json().catch( ( err ) => { console.log( err ); return  errs.unknown_server_format } );
      dispatch( actioner( actions.DELETE, actioner( actions.EMPLOYEE, resBody ) ) );
    };
    return 1;
  }else{
    dispatch( actioner( actions.DELETE, actioner( actions.EMPLOYEE, errs.conn_server_format ) ) );
    return 0;
  };
};