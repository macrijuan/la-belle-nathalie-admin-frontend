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
            a.sub_services.forEach( ss => { ss.id = parseInt( ss.id ) } );
            a.employee.id = parseInt( a.employee.id );
          } );
          return { ...state, loader: 0, appos: payload, appoReq: 1 };
        };
      };
      
      case actions.APPO_CAL:{
        if( !payload.errors ){
          if( payload.emps.length ){
            payload.emps.forEach( e => {
              e.id = parseInt( e.id );
              const formatedEmpAppos = {};
              e.appointments.forEach( a => {
                if( !formatedEmpAppos[ a.day ] ){
                  formatedEmpAppos[ a.day ] = [ { start_time:a.start_time, end_time:a.end_time } ];
                }else{
                  const insertIndex = formatedEmpAppos[ a.day ].findIndex( fa => a.start_time < fa.start_time );
                  if( insertIndex === -1 ){
                    formatedEmpAppos[ a.day ].push( { start_time:a.start_time, end_time:a.end_time } );
                  }else{
                    formatedEmpAppos[ a.day ].splice( insertIndex, 0, { start_time:a.start_time, end_time:a.end_time } );
                };
              };
            } );
            //adds appos of user to all emps to avoid booking during user appos
            state.appos.forEach( a => {
              if( !formatedEmpAppos[ a.day ] ){
                formatedEmpAppos[ a.day ] = [ { start_time:a.start_time, end_time:a.end_time } ]
              }else{
                const insertIndex = formatedEmpAppos[ a.day ].findIndex( fa => a.start_time < fa.start_time );
                if( insertIndex === -1 ){
                  formatedEmpAppos[ a.day ].push( { start_time:a.start_time, end_time:a.end_time } );
                }else{
                  formatedEmpAppos[ a.day ].splice( insertIndex, 0, { start_time:a.start_time, end_time:a.end_time } );
                };
              };
            } );
            e.appointments = formatedEmpAppos;
          } );
          payload.servs.forEach( s => {
            s.id = parseInt( s.id );
            s.sub_services.forEach( ss => {
              ss.id = parseInt( ss.id );
              ss.mins = parseInt( ss.mins );
              ss.serviceId = parseInt( ss.serviceId );
            } );
          } );
          return payload.servs
          ?{ ...state, loader: 0, message: 0, services: payload.servs, employees: payload.emps }
          :{ ...state, loader: 0, message: 0, employees: payload.emps,  };
        }else{
          return { ...state, loader: 0, message:{ employees: "Employees not found for this service." } };
        };
      }else{
        return { ...state, loader: 0, message:payload.errors };
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