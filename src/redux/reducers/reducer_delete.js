import { actions } from "../action_names.js";

function deleteReducer( state, { type, payload } ){
  // console.log( 'action type:', type );
  // console.log( "payload:" ); console.log( payload );
  switch ( type ) {
    case actions.APPOINTMENT:{
      if( !payload.errors ){       
        const appos = [ ...state.appos ];
        appos.splice( payload.appoInd, 1 );

        let empAppoDay;
        const empInd = state.employees.findIndex( e => e.id === payload.empId );
        if( empInd !== -1 ){
          if( state.employees[ empInd ].appointments[ payload.appoDay ].length > 1 ){
            empAppoDay = [ ...state.employees[ empInd ].appointments[ payload.appoDay ] ];
            empAppoDay.splice( empAppoDay.findIndex( a => a === payload.appoTime ), 1 );
            return { ...state, loader:[ false ], message:0,
              appos,
              employees:state.employees.map( e => {
                if( e.id !== payload.empId ) return e;
                return { ...e, appointments:{ ...e.appointments, [ payload.appoDay ]:empAppoDay } };
              } )
            };
          }else{
            const empAppos = { ...state.employees[ empInd ].appointments };
            delete empAppos[ payload.appoDay ];
            return { ...state, loader:[ false ], message:0,
              appos,
              employees:state.employees.map( e => {
                if( e.id !== payload.empId ) return e;
                return { ...e, appointments:empAppos };
              } )
            };
          };
        };
        return { ...state, loader:[ false ], message:0, appos };
      };
      return { ...state, loader:[ false ], message:payload.errors };
    };
    case actions.SESSION: return { loader:[ false ], message:0, user:{}, appos:[], services:[], employees:[] };
    default:
    console.log( payload );
    return state;
  };
};

export default deleteReducer;