import { actioner, actions, errs, config } from "./action_names.js";
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
  //   ids: [ 1 ]
  // }
  const res = await fetch(`${process.env.SERVER}/service/put_service`, config( store.getState().user.token, "PUT", body ) );
  if( res ){
    if( res.ok ){
      dispatch( actioner( actions.PUT, actioner( actions.SERVICE, { inds, body } ) ) )
    }else{
      const error = await res.json();
      dispatch( actioner( actions.PUT, actioner( actions.SERVICE, error ) ) )
    };
  }else{
    dispatch( actions.PUT, actioner( actions.SERVICE, errs.conn ) );
  };
};