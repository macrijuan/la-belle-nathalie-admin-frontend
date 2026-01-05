import { actions } from "../action_names.js";

function filtersReducer( state, { type, payload } ){
  // console.log( "type:", type );
  // console.log( "payload:" );
  // console.log( payload );
  switch( type ){
    case actions.UPDATE:
      state.filters[ payload.prop ] = payload.filters;
    break;
  };
  return { ...state };
  // return state;
};

export default filtersReducer;