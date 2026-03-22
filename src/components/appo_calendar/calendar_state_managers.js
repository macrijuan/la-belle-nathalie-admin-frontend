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

export const handleUserApply = async ( selUser, setState, dispatch ) => {
  try{
    const servReq = store.getState().servReq;
    if( servReq ){
      setState( curState => ( { ...curState, user: selUser, service: null, displayCalendar: 0, displayApplyBtn: 0 } ) );
    }else{
      dispatch( setProp2( { loader: 1 } ) );
      const res = await fetch( `${process.env.SERVER}/service/get_services`, config( store.getState().user.token, 'GET' ) )
      .catch( err => { console.log( err ); return 0 } );
      if( res ){
        const body = await res.json();
        if( !body.errors ){
          // body.forEach( u => u.id = Number( u.id ) );
          setState( curState => ( { ...curState, user: selUser, service: null, displayCalendar: 0, displayApplyBtn: 0 } ) );
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

export const handleServApply = async ( selServInd, selServId, setState, dispatch ) => {
  try{
    if( !selServId ) throw new Error( `No id found. (selServId -> ${selServId}).` );
    const empReq = store.getState().empReq;
    if( empReq ){
      const employees = store.getState().employees.filter( e => e.service.id === selServId );
      console.log( "selServId: ", selServId );
      setState( curState => ( { ...curState, service: selServInd, employees: employees, employee: null, displayCalendar: 0, displayApplyBtn: 0 } ) );
    }else{
      dispatch( setProp2( { loader: 1 } ) );
      const res = await fetch( `${process.env.SERVER}/employee/get_employees`, config( store.getState().user.token, 'GET' ) )
      .catch( err => { console.log( err ); return 0; } );
      if( res ){
        const body = await res.json();
        if( !body.errors ){
          const employees = body.filter( e => e.service.id === selServId );
          setState( curState => ( { ...curState, service: selServInd, employees: employees, employee: null, displayCalendar: 0, displayApplyBtn: 0 } ) );
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

export const getServEmps = async ( serviceId, setState, dispatch ) => {
  try{
    const token = store.getState().user.token;
    const res = await fetch( `${process.env.SERVER}/employee/get_employees?service=${serviceId}`, config( token, 'GET' ) )
    .catch( err => { console.error( err ); return 0; } );
    if( res ){
      const body = await res.json();
      if( !body.errors ){
        setState( curState => ( { ...curState, empReq: 1, employees: body.filter( e => e.service.id === serviceId ) } ) );
        dispatch( setProp2( { loader: 0 } ) );
      }else{
        dispatch( setProp2( { loader: 0, message: body.errors } ) );
      };
    }else{
      dispatch( setProp2( { loader: 0, message: errs.conn } ) );
    };
  }catch( err ){
    console.error( err );
    dispatch( setProp2( { loader: 0, message: errs.unknown } ) );
  };
};

