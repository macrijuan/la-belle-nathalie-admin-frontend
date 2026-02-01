import { actions, errs } from "../action_names.js";

function postReducer( state, { type, payload } ){
  console.log( "action type:", type );
  if( payload ){ console.log( "payload:" ); console.log( payload ); };
  switch ( type ) {
    case actions.APPOINTMENT:{
      if( payload.res && !payload.res.errors && payload.res[ 0 ] ){
        const id = parseInt( payload.res[ 0 ].id );
        const appos = [ ...state.appos ];
        const firstAppoOccurence = appos.findIndex( a => ( a.day === payload.postData.day ) );
        if( firstAppoOccurence === -1 ){
          const firstNextsDay = appos.findIndex( a => a.day > payload.postData.day );
          if( firstNextsDay === -1 ){
            appos.push( {
              id, day:payload.postData.day, start_time:payload.localData.start_time, end_time:payload.localData.end_time,
              service:payload.localData.service, sub_services:payload.localData.sub_servs, employee:payload.localData.employee
            } );
          }else{
            appos.splice( firstNextsDay, 0, {
              id, day:payload.postData.day, start_time:payload.localData.start_time, end_time:payload.localData.end_time,
              service:payload.localData.service, sub_services:payload.localData.sub_servs, employee:payload.localData.employee
            } );
          };
        }else{
          let i = firstAppoOccurence;
          customFindIndex: while( i < appos.length && appos[ i ].day === appos[ firstAppoOccurence ].day ){
            if( appos[ i ].start_time > payload.localData.start_time ) break customFindIndex;
            i++;
          };
          appos.splice( i, 0, {
            id, day:payload.postData.day, start_time:payload.localData.start_time, end_time:payload.localData.end_time,
            service:payload.localData.service, sub_services:payload.localData.sub_servs, employee:payload.localData.employee
          } );
        };

        const emp = { ...state.employees[ payload.localData.empInd ], appointments:{ ...state.employees[ payload.localData.empInd ].appointments } };
        let empAppoDay = emp.appointments[ payload.postData.day ];
        if( !empAppoDay ){
          emp.appointments[ payload.postData.day ] = [ { start_time:payload.localData.start_time, end_time:payload.localData.end_time } ];
        }else{
          const empAppoInd = empAppoDay.findIndex( a => a.start_time > payload.localData.start_time );
          if( empAppoInd === -1 ){
            empAppoDay.push( { start_time:payload.localData.start_time, end_time:payload.localData.end_time } );
          }else{
            empAppoDay.splice( empAppoInd, 0, { start_time:payload.localData.start_time, end_time:payload.localData.end_time } );
          };
        };
        return {
          ...state, loader: 0, appos, employees:state.employees.map( e => e.id !== emp.id ?e :emp ),
          message:{
            "¡Éxito!":`Has reservado una cita con ${emp.first_name} el día ${ payload.postData.day } de ${ payload.localData.start_time } a ${ payload.localData.end_time }`
          }
        };
      }else{
        return { ...state, loader: 0, message:payload.res ?payload.res.errors :errs.conn };
      };
    };

    case actions.SERVICE:{
      if( payload.errors ){
        return { ...state, loader: 0, message: payload.errors };
      };
      return { ...state, loader: 0, services:[ ...state.services, { ...payload, sub_services: [] } ] };
    };

    case actions.EMPLOYEE:{
      if( payload.errors ) return { ...state, loader: 0, message: payload.errors };
      payload.first_name = payload.first_name.toUpperCase();
      payload.last_name = payload.last_name.toUpperCase();
      return { ...state, loader: 0, employees:[ ...state.employees, payload ] };
    };
    default:
    console.log( "POST DEFAULT CASE" );
    console.log( "action type:", type );
    console.log( "payload:" ); console.log( payload );
    return state;
  };
};

export default postReducer;