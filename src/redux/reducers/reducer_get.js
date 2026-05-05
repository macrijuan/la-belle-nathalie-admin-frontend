import { actions } from "../action_names.js";
import { errs } from "../../errors.js";

const getReducer = ( state, { type, payload } ) => {
  // console.log( 'action type:', type );
  // console.log( "payload:" ); console.log( payload );
  try{
    switch ( type ) {
      
      case actions.SERVICE:{
        if( !payload.errors ){
          payload.forEach( s => {
            s.id = parseInt( s.id );
            s.sub_services.forEach( ss => {
              ss.id = parseInt( ss.id );
              ss.mins = parseInt( ss.mins );
              ss.serviceId = parseInt( ss.serviceId );
            } );
          } );
          return { ...state, loader: 0, servReq: 1, services: payload };
        }else return { ...state, loader: 0, servReq: 1, message: payload.errors };
      };

      case actions.SUB_SERVICE:{
        if( !payload.errors ) return { ...state, loader: 0, sub_servReq: 1, sub_services: payload };
        return { ...state, loader: 0, sub_servReq: 1, message: payload.errors }; 
      };
      
      case actions.EMPLOYEE:{
        if( payload.errors ) return { ...state, loader: 0, empReq: 1, message: payload.errors };
        return { ...state, loader: 0, empReq: 1, employees: payload };
      };

      case actions.APPOINTMENT:{
        if( payload.errors ){
          return { ...state, loader: 0, appoReq: 1, message: payload.errors };
        }else{
          payload.forEach( ( a, i ) => {
            a.id = parseInt( a.id );
            a.service.id = parseInt( a.service.id );
            a.sub_services.forEach( ss => { ss.id = Number( ss.id ); ss.mins = Number( ss.mins ); } );
            a.employee.id = parseInt( a.employee.id );
          } );
          return { ...state, loader: 0, appos: payload, appoReq: 1 };
        };
      };
      
      case actions.APPO_CAL: {
        return state;
      };

    case actions.USER: {
      if( !payload.errors ){
        payload.forEach( u => u.id = Number( u.id ) );
        return { ...state, loader: 0, users: payload, userReq: 1 }
      }else{ 
        return { ...state, loader: 0, message: payload.errors, userReq: 1 }
      };
    };

    default:
      console.log( "GET REDUCER: DEFAULT CASE" );
      console.log( 'action type:', type );
      console.log( "payload:" ); console.log( payload );
      return state;
    };

  }catch( err ){
    console.error( err );
    return { ...state, loader: 0, message: errs.unknown };
  };
};

export default getReducer;