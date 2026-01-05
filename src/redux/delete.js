import { actions, actioner, errs, config } from "./action_names";
import store from "./store";


export const appoDel = ( id, appoInd, empId, appoDay, appoTime ) => async dispatch => {
  const token  = store.getState().user.token;
  const res = await fetch( `${process.env.SERVER}/appointment/delete_appointment/${id}`, config( token, 'DELETE' ) );
  if( res.ok ){
    dispatch( actioner( actions.DELETE, actioner( actions.APPOINTMENT, { appoInd, empId, appoDay, appoTime } ) ) );
  }else{
    const resBody = await res.json().catch( ( err ) => { console.log( err ); return { errors:errs.conn } } );
    dispatch( actioner( actions.DELETE, actioner( actions.APPOINTMENT, resBody ) ) );
  };
};
