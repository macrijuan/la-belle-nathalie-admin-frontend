import { actions } from "../action_names.js";

function deleteReducer( state, { type, payload } ){
  console.log( 'action type:', type );
  console.log( "payload:" ); console.log( payload );
  switch ( type ) {
    case actions.APPOINTMENT:{
      if( !payload.errors ){       
        const appos = [ ...state.appos ];
        appos.splice( payload.appoInd, 1 );

        // let empAppoDay;
        // const empInd = state.employees.findIndex( e => e.id === payload.empId );
        // if( empInd !== -1 ){
        //   if( state.employees[ empInd ].appointments[ payload.appoDay ].length > 1 ){
        //     empAppoDay = [ ...state.employees[ empInd ].appointments[ payload.appoDay ] ];
        //     empAppoDay.splice( empAppoDay.findIndex( a => a === payload.appoTime ), 1 );
        //     return { ...state, loader: 0, message:0,
        //       appos,
        //       employees:state.employees.map( e => {
        //         if( e.id !== payload.empId ) return e;
        //         return { ...e, appointments:{ ...e.appointments, [ payload.appoDay ]:empAppoDay } };
        //       } )
        //     };
        //   }else{
        //     const empAppos = { ...state.employees[ empInd ].appointments };
        //     delete empAppos[ payload.appoDay ];
        //     return { ...state, loader: 0, message:0,
        //       appos,
        //       employees:state.employees.map( e => {
        //         if( e.id !== payload.empId ) return e;
        //         return { ...e, appointments:empAppos };
        //       } )
        //     };
        //   };
        // };
        return { ...state, loader: 0, message:0, appos };
      };
      return { ...state, loader: 0, message: payload.errors };
    };
    
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

    case actions.SESSION: return { loader: 0, message: 0, user: {}, appos: [], services: [], employees: [] };

    default:
    console.log( payload );
    return state;
  };
};

export default deleteReducer;