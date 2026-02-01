export const serverErrFormat = ( dataName, data ) => { return { errors:{ [dataName]: data } }; };
export const errObj = ( dataName, data ) => { return { [dataName ]: data } };

export const errs = {
  conn_server_format: serverErrFormat( "conexión", "Falló la conexión del servidor." ),
  unknown_server_format: serverErrFormat( "desconocido", "Ha ocurrido un error." ),
  conn: { "conexión": "Falló la conexión del servidor."},
  unknown: { desconocido: "Ha ocurrido un error." },
  token: { expirado:"El código de actualización de email expiró. Si aún quiere actualizar su dirección de correo electrónico, vuelva a intentarlo." },
  //dinamyc errors
  length: ( dataName, min, max ) => { return { [ dataName ]: `Debe tener entre ${min} y ${max} caractéres.` } },
  timeOrder: ( dataName, first, last ) => { return { [ dataName ]: `El horario ${first} debe ser menor al ${last}.` } },
  //SINGLE ERROR WITH CUSTOM DATA.
  not_found: ( dataName ) => { return { "no encontrado": `${dataName} no encontrado.` } },
  sign_in_not_found: ( dataName ) => { return { "inicio de sesión": `No existe ningún usuario con ese correo electrónico y contraseña. Verifique los datos ingresados.` } },
  //SINGLE ERROR WITH FIXED MESSAGE.
  req_limit: { errors:{ req_limit: 'Too many requests, please try again later.' } },
  no_session: { errors: { session: "The session has expired. Please, log in again." } },
  //ERROR TO FILL AND "ERRORS" OBJECT (must return a string).
  not_valid: ( dataName ) => `${dataName} no es un valor valido.`,
  is_mandatory: ( dataName ) => `${dataName} es un campo obligatorio.`,
  strict_length: ( dataName, min, max ) => `${dataName} debe tener entre ${min} y ${max} caractéres.`,
  strict_size: ( dataName, min, max ) => `${dataName} debe ser entre ${min} y ${max}.`,
  strict_char_type: ( dataName, types ) => `${dataName} solo puede tener ${types}.`,
  at_least_one: ( dataName, data ) => `${dataName} debe tener al menos ${data}.`,
  cant_contain: ( dataName, data ) => `${dataName} no puede tener ${data}.`,
  existing: ( data ) => `${data} ya está registrado.`,
  auth: ( dataName ) =>  { return{ [dataName]: `Operación no autorizada.` } }
};