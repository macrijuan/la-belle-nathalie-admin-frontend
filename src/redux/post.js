import { actioner, actions, config, errs } from "./action_names";
import store from "./store";

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
        dispatch( actioner( actions.SESSION, { errors:errs.unknown } ) );
      };
    }else{
      dispatch( actioner( actions.SESSION, { errors:errs.conn } ) );
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