import { actions } from "../action_names.js";

function putReducer( state, { type, payload } ){
  console.log( "action type:", type );
  if( payload ){ console.log( "payload:" ); console.log( payload ); };
  switch ( type ) {
    case actions.USER_EMAIL_UPDATE:{
      if( payload ) return { ...state, message:payload };

    };
    default:
    console.log( payload );
    return state;
  };
};

export default putReducer;