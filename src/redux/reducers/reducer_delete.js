import { actions } from "../action_names.js";

function deleteReducer( state, { type, payload } ){
  console.log( 'action type:', type );
  console.log( "payload:" ); console.log( payload );
  try{
    switch( type ){

      case actions.SERVICE:{
        if( Array.isArray( payload ) ){
          const servs = [ ...state.services ];
          payload.forEach( i => {
            servs[ i ] = 0;
          });
          let a = 0;
          while( a < servs.length ){
            if( servs[ a ] === 0 ) servs.splice( a, 1 );
            else a++;
          };
          return { ...state, loader: 0, services: servs };
        }else{
          return { ...state, message: payload.errors };
        };
      };
      
      case actions.SUB_SERVICE:{
        if( Array.isArray( payload ) ){
          const sub_servs = [ ...state.sub_services ];
          payload.forEach( i => {
            sub_servs[ i ] = 0;
          });
          let a = 0;
          while( a < sub_servs.length ){
            if( sub_servs[ a ] === 0 ) sub_servs.splice( a, 1 );
            else a++;
          };
          return { ...state, loader: 0, sub_services: sub_servs };
        }else{
          return { ...state, message: payload.errors };
        };
      };
      
      case actions.EMPLOYEE:{
        if( Array.isArray( payload ) ){
          const emps = [ ...state.employees ];
          payload.forEach( i => {
            emps[ i ] = 0;
          } );
          let a = 0;
          while( a < emps.length ){
            if( emps[ a ] === 0 ) emps.splice( a, 1 );
            else a++;
          };
          return { ...state, loader: 0, employees: emps };
        }else{
          return { ...state, message: payload.errors };
        };
      };
      
      case actions.APPOINTMENT:{
        if( Array.isArray( payload ) ){
          const appos = [ ...state.appos ];
          payload.forEach( i => {
            appos[ i ] = 0;
          } );
          let a = 0;
          while( a < appos.length ){
            if( appos[ a ] === 0 ) appos.splice( a, 1 );
            else a++;
          };
          return { ...state, loader: 0, appos };
        }else{
          return { ...state, message: payload.errors };
        };
      };

      case actions.SESSION: return { loader: 0, message: 0, user: {}, appos: [], services: [], employees: [] };
      
      default:{
        console.log( "DELETE REDUCER: DEFAULT CASE" );
        console.log( 'action type:', type );
        console.log( "payload:" ); console.log( payload );
        return state;
      };
    };
  }catch( err ){
    console.error( err );
    return { ...state, loader: 0, message: errs.unknown };
  };
};

export default deleteReducer;