import { actions } from "../action_names.js";
import { errs } from "../../errors.js";

const arrItemDeletion = ( arr, indsToDel ) => {
  //arr = array that has the elements to delete
  //indsToDel = array that has the indexes to delete from arr.
  indsToDel.forEach( i => {
    arr[ i ] = 0;
  });
  let a = 0;
  while( a < arr.length ){
    if( arr[ a ] === 0 ) arr.splice( a, 1 );
    else a++;
  };
};

const subArrayItemDeletion = ( state, updatedKeys, parentInds, parentKey, childKey, assocKey ) => {
  //NOTE: service is the parent of sub_service
  //state = current redux state;
  //updatedKeys = The object used to create new references to then spread into the redux state
  //parentInds = Array containing indexes of the parent model. EXAMPLE -> [ 0 ] -> usecase -> state.services[ 0 ]
  //                                                                        ^_________________________________^
  //parentKey = the key to access the parent's data. EXAMPLE -> state.services
  //                                                                     ^
  //childKey = the key to access the child's data. EXAMPLE -> state.sub_services
  //                                                                    ^
  //assocKey = the key to access the value of an association object. EXAMPLE--> state.services[ 0 ].service
  //                                                                                                   ^
  console.log( childKey );
  const remaining = [ ...state[ childKey ] ];
  parentInds.forEach( parentInd => {
    const itemsToDel = [];
    remaining.forEach( ( e, i ) => {
      if( e[ assocKey ].id === state[ parentKey][ parentInd ].id ) itemsToDel.push( i );
    } );
    console.log( itemsToDel );
    arrItemDeletion( remaining, itemsToDel );
  } );
  if( remaining.length !== state[ childKey ] ) updatedKeys[ childKey ] = remaining;
};

function deleteReducer( state, { type, payload } ){
  console.log( 'action type:', type );
  console.log( "payload:" ); console.log( payload );
  try{
    switch( type ){

      case actions.SERVICE:{
        if( Array.isArray( payload ) ){
          const updatedKeys = {}
          if( state.sub_services.length ) subArrayItemDeletion( state, updatedKeys, payload, "services", "sub_services", "service" );
          if( state.employees.length ) subArrayItemDeletion( state, updatedKeys, payload, "services", "employees", "service" );
          if( state.appos.length ) subArrayItemDeletion( state, updatedKeys, payload, "services", "appos", "service" );
          updatedKeys.services = [ ...state.services ];
          arrItemDeletion( updatedKeys.services, payload );
          return { ...state, loader: 0, ...updatedKeys };
        }else{
          return { ...state, loader: 0, message: payload.errors };
        };
      };
      
      case actions.SUB_SERVICE:{
        if( Array.isArray( payload ) ){
          const updatedKeys = {};
          if( state.services.length ){
            updatedKeys.services = [ ...state.services ];
            payload.forEach( subServInd => {
              const servToDel = state.sub_services[ subServInd ];
              const servInd = updatedKeys.services.findIndex( serv => serv.id === servToDel.service.id );
              const subServIndFromServ = state.services[ servInd ].sub_services.findIndex( ss => ss.id === servToDel.id );
              updatedKeys.services[ servInd ].sub_services.splice( subServIndFromServ, 1 );
            } );
          };
          
          if( state.appos.length ){
            updatedKeys.appos = [ ...state.appos ];
            let appoInd = 0;
            while( appoInd < updatedKeys.appos.length ){
              subServsInAppoLoop: for( const subServInd of payload ){
                const subServInAppo = updatedKeys.appos[ appoInd ].sub_services.findIndex( ss => ss.id === state.sub_services[ subServInd ].id );
                if( subServInAppo !== -1 ){
                  if( updatedKeys.appos[ appoInd ].sub_services.length === 1 ){
                    updatedKeys.appos.splice( appoInd, 1 );
                    appoInd--;
                    break subServsInAppoLoop;
                  }else{
                    updatedKeys.appos[ appoInd ].sub_services.splice( subServInAppo, 1 );
                  };
                };
              };
              appoInd++;
            };
          };

          updatedKeys.sub_services = [ ...state.sub_services ];
          arrItemDeletion( updatedKeys.sub_services, payload );
          return { ...state, loader: 0, ...updatedKeys };
        }else{
          return { ...state, loader: 0, message: payload.errors };
        };
      };
      
      case actions.EMPLOYEE:{
        if( Array.isArray( payload ) ){
          const emps = [ ...state.employees ];
          arrItemDeletion( emps, payload );
          return { ...state, loader: 0, employees: emps };
        }else{
          return { ...state, loader: 0, message: payload.errors };
        };
      };
      
      case actions.APPOINTMENT:{
        if( Array.isArray( payload ) ){
          const appos = [ ...state.appos ];
          arrItemDeletion( appos, payload );
          return { ...state, loader: 0, appos };
        }else{
          return { ...state, loader: 0, message: payload.errors };
        };
      };

      case actions.SESSION: if( !payload ) return {
        loader: 0,
        message: 0,
        alert: 0,
        user: {},
        services: [],
        sub_services: [],
        employees: [],
        appos: [],
        servReq: 0,
        sub_servReq: 0,
        empReq: 0,
        appoReq: 0
      };
      return { ...state, loader: 0, message: payload.errors };
      
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