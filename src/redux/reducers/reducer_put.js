import { actions } from "../action_names.js";
import { errs } from "../../errors.js";

function putReducer( state, { type, payload } ){
  console.log( "action type:", type );
  if( payload ){ console.log( "payload:" ); console.log( payload ); };
  try{
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
      case actions.EMPLOYEE:{
        if( payload.errors ){
          return { ...state, loader: 0, message: payload.errors };
        }else{
          const employees = [ ...state.employees ];
          payload.inds.forEach( selectedInd => {
            employees[ selectedInd ] = { ...employees[ selectedInd ], ...payload.body.update };
          });
          return { ...state, loader: 0, employees };
        };
      };
      default:{
        console.log( payload );
        return state;
      };
    };
    }catch( err ){
      console.error( err );
      return { ...state, loader: 0, message: errs.unknown };
    };
};

export default putReducer;