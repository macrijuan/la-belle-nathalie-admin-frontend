import { actions } from "../action_names.js";

function putReducer( state, { type, payload } ){
  console.log( "action type:", type );
  if( payload ){ console.log( "payload:" ); console.log( payload ); };
  switch ( type ) {
    case actions.USER_EMAIL_UPDATE:{
      if( payload ) return { ...state, message:payload };
    };
    case actions.SERVICE:{
      if( payload.errors ){
        return { ...state, loader: 0, message: payload.errors };
      }else{
        const services = [ ...state.services ];
        payload.inds.forEach( selectedInd => {
          services[ selectedInd ] = { ...services[ selectedInd ], ...payload.body.update };
        });
        return { ...state, loader: 0, services };
      };
    };
    default:
    console.log( payload );
    return state;
  };
};

export default putReducer;