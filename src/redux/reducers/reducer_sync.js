import { actions } from "../action_names.js";

function syncReducer( state, { type, payload } ){
  // console.log( "type:", type );
  // console.log( "payload:" );
  // console.log( payload );
  switch( type ){
    case actions.SET_PROP:
      return { ...state, [ payload.prop ]:payload.data };
    case actions.SET_PROP2: return { ...state, ...payload };
    case actions.USER_EMAIL_UPDATE:
      if( typeof payload === "number" ) return { ...state, user:{ ...state.user, email_update_expiration: parseInt( payload ) } };
      if( !payload ) return { ...state, user: { ...state.user, email_update_expiration: null, possible_new_email: false } };
      return { ...state, user:{ ...state.user, ...payload } };
    case actions.SESSION: return {
      loader: 0,
      message: 0,
      user: {},
      appos: [],
      services: [],
      employees: []
    };
    default:
    console.log( "DEFAULT CASE" );
    console.log( "type:", type );
    console.log( "payload:" );
    console.log( payload );
  };

};

export default syncReducer;