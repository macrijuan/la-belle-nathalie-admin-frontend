import { actioner, actions, config, errs } from "./action_names.js";
import { errs as _errs } from "../errors.js";
import store from "./store.js";

export const requestEmailUpdateToken = async dispatch => {
  const res = await fetch( `${process.env.SERVER}/user/email/put_user_email`, config( store.getState().user.token, "PUT" ) );
  return dispatch(
    actioner(
      actions.PUT,
      actioner(
        actions.USER_EMAIL_UPDATE, !res.ok ?await res.json().catch( () => errs.conn ) :null
      )
    )
  );
};

export const serviceUpdate = ( inds, body ) => async dispatch => {
  //inds -> is an array of indexes to manage local info
  //body example (with name -> single row update):
  //inds = [ 1 ],
  // body = {
  //   update: { name: "new name", am: [ 8, 14 ] },
  //   ids: [ 1 ]
  // }
  //body example (without name -> multi row update allowed):
  // inds= [ 10, 2, 3, 9, 5 ],
  // body= {
  // update: {
  //     pm: [ 15, 18 ],
  //     am: [ 8, 14 ]
  //   },
  //   ids: [ 1, 10, 9 ]
  // }
  try{
    const res = await fetch(`${process.env.SERVER}/service/put_service`, config( store.getState().user.token, "PUT", body ) );
    if( res ){
      if( res.ok ){
        dispatch( actioner( actions.PUT, actioner( actions.SERVICE, { inds, body } ) ) );
      }else{
        const error = await res.json();
        dispatch( actioner( actions.PUT, actioner( actions.SERVICE, error ) ) );
      };
    }else{
      dispatch( actioner( actions.PUT, actioner( actions.SERVICE, _errs.conn_server_format ) ) );
    };
  }catch( err ){
    dispatch( actioner( actions.PUT, actioner( actions.SERVICE, _errs.unknown_server_format ) ) );
  };
};

export const employeeUpdate = ( inds, body ) => async dispatch => {
  //same inds and body workflow as serviceUpdate
  try{
    const res = await fetch(`${process.env.SERVER}/employee/put_employees`, config( store.getState().user.token, "PUT", body ) )
    .catch( err => { console.log( err ); return 0; } );
    if( res ){
      if( res.ok ){
        dispatch( actioner( actions.PUT, actioner( actions.EMPLOYEE, { inds, body } ) ) )
      }else{
        const error = await res.json().catch( err => { console.log( err ); return _errs.unknown_server_format } );
        dispatch( actioner( actions.PUT, actioner( actions.EMPLOYEE, error ) ) );
      };
    }else{
      dispatch( actioner( actions.PUT, actioner( actions.EMPLOYEE, _errs.conn_server_format ) ) );
    };
  }catch( err ){
    dispatch( actioner( actions.PUT, actioner( actions.EMPLOYEE, _errs.unknown_server_format ) ) );
  };
};