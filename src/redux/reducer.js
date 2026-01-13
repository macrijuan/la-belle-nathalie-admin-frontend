import { actions } from "./action_names.js";
import syncReducer from "./reducers/reducer_sync.js";
import getReducer from "./reducers/reducer_get.js";
import putReducer from "./reducers/reducer_put.js";
import deleteReducer from "./reducers/reducer_delete.js";
// import filtersReducer from "./reducers/reducer_filters.js";
import postReducer from "./reducers/reducer_post.js";

const currentDate = new Date().toLocaleDateString( "en-CA", { year:"numeric", month:"2-digit", day:"2-digit" } );

const initialState = {
	loader: 0,
  message: 0,
  alert: 0,
  user: {},
  appos: [],
  services: [],
  employees: [],
  appoReq: 0,
  servReq: 0,
  empReq: 0
};

function rootReducer( state = initialState, { payload, type } ){
  // console.log('action type:',type);
  // if(payload)console.log(payload);
  switch ( type ) {
    case actions.SYNC: return syncReducer( state, payload );
    case actions.GET: return getReducer( state, payload );
    case actions.PUT: return putReducer( state, payload );
    case actions.POST: return postReducer( state, payload );
    case actions.DELETE: return deleteReducer( state, payload );
		case actions.SESSION:
      if( !payload.errors ){
        payload.id = parseInt( payload.id );
        if( payload.password_update_expiration ) payload.password_update_expiration = parseInt( payload.password_update_expiration );
        if( payload.email_update_expiration ) payload.email_update_expiration = parseInt( payload.email_update_expiration );
        return { ...state, user: payload, loader: 0 };
      }else{
        return { ...state, message: payload.errors, loader: 0 };
      };
    default:
      if( type !== "@@INIT" ){
        console.log("DEFAULT FALL!");
        console.log( 'action type: ', type );
        console.log( 'payload: ' );
        console.log( payload );
      };
    return state;
  };
};

export default rootReducer;