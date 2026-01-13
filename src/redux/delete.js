import { actions, actioner, errs, config } from "./action_names";
import store from "./store";


export const appoDel = ( id, appoInd, empId, appoDay, appoTime ) => async dispatch => {
  const token  = store.getState().user.token;
  const res = await fetch( `${process.env.SERVER}/appointment/delete_appointment/${id}`, config( token, 'DELETE' ) )
  .catch( err => { console.log( err ); return { ok: 0 } } );
  if( res.ok ){
    dispatch( actioner( actions.DELETE, actioner( actions.APPOINTMENT, { appoInd, empId, appoDay, appoTime } ) ) );
  }else{
    const resBody = await res.json().catch( ( err ) => { console.log( err ); return { errors: errs.conn } } );
    dispatch( actioner( actions.DELETE, actioner( actions.APPOINTMENT, resBody ) ) );
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
      const resBody = await res.json().catch( ( err ) => { console.log( err ); return { errors: errs.unknown } } );
      dispatch( actioner( actions.DELETE, actioner( actions.SERVICE, resBody ) ) );
    };
    return 1;
  }else{
    dispatch( actioner( actions.DELETE, actioner( actions.SERVICE, { errors: errs.conn } ) ) );
    return 0;
  };
};