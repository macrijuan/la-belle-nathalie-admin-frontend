import { actioner, actions, filtersToURL, config, errs } from "./action_names.js";
import store from "./store.js";

export const appoCalReq = () => async ( dispatch ) => {
  const token = store.getState().user.token
  const servsReq = await fetch( `${process.env.SERVER}/service/get_services`, config( token, 'GET' ) );
  const servs = await servsReq.json().catch( () => { return { errors:errs.conn } } );
  if( !servs.errors ){
    if( servs.length ){
      const empsReq = await fetch( `${process.env.SERVER}/employee/get_employees?service=${servs[ 0 ].id}`, config( token, 'GET' ) );
      const emps = await empsReq.json().catch( () => { return { errors:errs.conn } } );
      if( !emps.errors ){
        dispatch( actioner( actions.GET, actioner( actions.APPO_CAL, { servs, emps } ) ) );
      }else{
        dispatch( actioner( actions.GET, actioner( actions.APPO_CAL, emps ) ) );
      };
    }else{
      dispatch( actioner( actions.GET, actioner( actions.APPO_CAL, { errors:{ services:"Services not found." } } ) ) );
    };
  }else{
    dispatch( actioner( actions.GET, actioner( actions.APPO_CAL, servs ) ) );
  };
};

export const getServEmps = ( serviceId ) => async ( dispatch ) => {
  const token = store.getState().user.token;
  const empsReq = await fetch( `${process.env.SERVER}/employee/get_employees?service=${serviceId}`, config( token, 'GET' ) );
  const emps = await empsReq.json().catch( () => { return { errors:errs.conn } } );
  if( !emps.errors ){
    dispatch( actioner( actions.GET, actioner( actions.APPO_CAL, { emps } ) ) );
  }else{
    dispatch( actioner( actions.GET, actioner( actions.APPO_CAL, emps ) ) );
  };
};

export const getServices = () => async ( dispatch ) => {
  const token = store.getState().user.token
  const res = await fetch( `${process.env.SERVER}/service/get_services`, config( token, 'GET' ) )
  .catch( err => { console.log( err ); return 0 } );
  if( res ){
    const servs = await res.json().catch( () => { return { errors: errs.unknown } } );
    dispatch( actioner( actions.GET, actioner( actions.SERVICE, servs ) ) );
  }else{
    dispatch( actioner( actions.GET, actioner( actions.SERVICE, { errors: errs.conn } ) ) );
  };
};

export const followed_users = ( id, token, filters ) => async( dispatch ) => {
  const res = fetch( `${process.env.SERVER}/user/get_followed/${id}?${ filtersToURL( filters ) }`, config( token, 'GET' ) );
  const resBody = await res.json().catch( () => { return { errors:errs.conn }; } );
  dispatch( actioner( actions.FOLLOWED_USERS, resBody  ) );
};


export const getAppos = () => async ( dispatch ) => {
  console.log( "appos requested" );
  try{
    const token = store.getState().user.token;
    const res = await fetch( `${process.env.SERVER}/appointment/get_appointments`, config( token, 'GET' )
    );
    dispatch( actioner( actions.GET, actioner( actions.APPOINTMENT, await res.json() ) ) );
  }catch( err ){
    console.log( err );
  };
};

export const users = ( token, in_page, filters )=>{
  return async(dispatch)=>{
    fetch(
      `${process.env.SERVER}/user/get_users?index=${ in_page.index }&perPage=${ in_page.perPage }${ filtersToURL( filters.users ) }${in_page.options ?"&options=t" :""}`
      , config( token, 'GET' )
    ).then( res =>res.json() )
    .then( res =>dispatch( actioner( actions.GET, actioner( actions.USER, res ) ) ) );
  };
};