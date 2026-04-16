import store from "../../redux/store";
import { config, actions, actioner } from "../../redux/action_names.js";
import { errs } from "../../errors.js";
import { setProp2 } from "../../redux/sync.js";

export const getUsers = async ( setState, dispatch ) => {
  try{
    const userReq = store.getState().userReq;
    if( userReq ){
      const users = store.getState().users;
      setState( curState => ( { ...curState, users: users } ) );
    }else{
      const token = store.getState().user.token;
      const res = await fetch( `${process.env.SERVER}/user/get_users`, config( token, 'GET' ) )
      .catch( err => { console.error( err ); return 0; } );
      if( res ){
        const body = await res.json();
        if( !body.errors ){
          body.forEach( u => u.id = Number( u.id ) );
          setState( curState => ( { ...curState, users: body } ) );
          dispatch( setProp2( { loader: 0, users: body } ) );
        }else{
          dispatch( actioner( actions.GET, actioner( actions.USER, body ) ) );
        };
      }else{
        dispatch( actioner( actions.GET, actioner( actions.USER, errs.conn_server_format ) ) );
      };
    };
  }catch( err ){
    console.error( err );
    dispatch( setProp2( { loader: 0, message: errs.unknown } ) );
  };
};

export const handleUserApply = async ( selUser, dateData, setState, dispatch ) => {
  try{
    dateData.sub_servs = [];
    dateData.formattedAppoDur = "0 Hs, 0 Mins";
    dateData.appoDurationInMins = 0;
    dateData.shiftDurationInMins = undefined;
    dateData.empShiftStart = undefined;
    dateData.empShiftEnd = undefined;
    const servReq = store.getState().servReq;
    if( servReq ){
      setState( curState => ( { ...curState, user: selUser, service: null, employee: null, displayCalendar: 0 } ) );
    }else{
      dispatch( setProp2( { loader: 1 } ) );
      const res = await fetch( `${process.env.SERVER}/service/get_services`, config( store.getState().user.token, 'GET' ) )
      .catch( err => { console.log( err ); return 0 } );
      if( res ){
        const body = await res.json();
        if( !body.errors ){
          // body.forEach( u => u.id = Number( u.id ) );
          setState( curState => ( { ...curState, user: selUser, service: null, employee: null, displayCalendar: 0 } ) );
          dispatch( setProp2( { loader: 0, servReq: 1, services: body } ) );
        }else{
          dispatch( actioner( actions.GET, actioner( actions.SERVICE, body ) ) );
        };
      }else{
        dispatch( actioner( actions.GET, actioner( actions.SERVICE, errs.conn_server_format ) ) );
      };
    };
  }catch( err ){
    console.error( err );
    dispatch( actioner( actions.GET, actioner( actions.SERVICE, errs.unknown_server_format ) ) );
  };
};

export const handleServApply = async ( selServInd, selServId, dateData, setState, dispatch ) => {
  try{
    dateData.sub_servs = [];
    dateData.formattedAppoDur = "0 Hs, 0 Mins";
    dateData.appoDurationInMins = 0;
    dateData.shiftDurationInMins = undefined;
    dateData.empShiftStart = undefined;
    dateData.empShiftEnd = undefined;
    if( !selServId ) throw new Error( `No id found. (selServId -> ${selServId}).` );
    const empReq = store.getState().empReq;
    if( empReq ){
      const employees = store.getState().employees.filter( e => e.service.id === selServId );
      setState( curState => ( { ...curState, service: selServInd, employees: employees, employee: null, displayCalendar: 0 } ) );
    }else{
      dispatch( setProp2( { loader: 1 } ) );
      const res = await fetch( `${process.env.SERVER}/employee/get_employees`, config( store.getState().user.token, 'GET' ) )
      .catch( err => { console.log( err ); return 0; } );
      if( res ){
        const body = await res.json();
        if( !body.errors ){
          const employees = body.filter( e => e.service.id === selServId );
          setState( curState => ( { ...curState, service: selServInd, employees: employees, employee: null, displayCalendar: 0 } ) );
          dispatch( setProp2( { loader: 0, empReq: 1, employees: body } ) );
        }else{
          dispatch( actioner( actions.GET, actioner( actions.EMPLOYEE, body ) ) );
        };
      }else{
        dispatch( actioner( actions.GET, actioner( actions.EMPLOYEE, errs.conn_server_format ) ) );
      };
    };
  }catch( err ){
    console.error( err );
    dispatch( actioner( actions.GET, actioner( actions.EMPLOYEE, errs.unknown_server_format ) ) );
  };
};