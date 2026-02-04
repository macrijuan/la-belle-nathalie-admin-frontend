export const actions = {
  //METHODS
  SYNC:"SYNC",
  POST:"POST",
  GET:"GET",
  PUT:"PUT",
  UPDATE:"UPDATE",
  DELETE:"DELETE",
  //FAMILY DATA
  USER:"USER",
  APPOINTMENT:"APPOINTMENT",
  EMPLOYEE:"EMPLOYEE",
  SERVICE:"SERVICE",
  SUB_SERVICE:"SUB_SERVICE",
  APPO_CAL:"APPO_CAL",
  //Session
  SESSION:"SESSION",
  //Self data
  USER_EMAIL_UPDATE:"USER_EMAIL_UPDATE",
  FOLLOWED_USERS:"FOLLOWED_USERS",
  FAV_HAND_STYLES:"SELF_HAND_STYLES",
  FAV_FOOT_STYLES:"SELF_FEET_STYLES",
  //Search
  FILTER:"FILTER",
  //Sync actions
  LOADER:"LOADER",
  SET_PROP:"SET_PROP",
  SET_PROP2:"SET_PROP2",
  ERROR:"ERROR",
  HOME_REQ:"HOME_REQ",
  SET_BACKGROUNDS:"SET_BACKGROUNDS"
};

export function actioner( type, payload ){
  return { type, payload };
};

export function filtersToURL( filters ){
  if( filters ){
    const keys = Object.keys( filters );
    return keys.map( prop => {
      if( typeof filters[ prop ] === 'string' ){
        return `&${ prop }=${ filters[ prop ] }`;
      };
      return `&${ prop }=${ JSON.stringify( filters[ prop ] ) }`;
    });
  };
  return '';
};

export const config = ( token, method, body ) => {
  if( !body ) return {
    method: method,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json', 
      'X-Csrf-Token': token
    }
  };
  return {
    method: method,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json', 
      'X-Csrf-Token': token
    },
    body:JSON.stringify( body )
  };
};

export const errs = {
  conn:{ conexión: "Falló la conexión del servidor." },
  unknown: { desconocido: "Ha ocurrido un error." },
  token: { expirado:"El código de actualización de email expiró. Si aún quiere actualizar su dirección de correo electrónico, vuelva a intentarlo." },
  //dinamyc errors
  empty: ( dataName ) => { return { [ dataName ]: `${dataName.charAt( 0 ).toUpperCase() + dataName.slice( 1 ).replace( "_", " " )} no puede ser nulo.` } },
  length: ( dataName, min, max ) => { return { [ dataName ]: `Debe tener entre ${min} y ${max} caractéres.` } },
  timeOrder: ( dataName, first, last ) => { return { [ dataName ]: `El horario ${first} debe ser menor al ${last}.` } }
}