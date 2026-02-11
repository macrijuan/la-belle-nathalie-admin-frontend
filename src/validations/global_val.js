import { errs } from "../errors.js";

export const isString = ( data, field ) => {
  if( typeof data !== 'string' ){
    console.log( `INVALID ${field}:` );
    console.log( data );
    return errs.unknown;
  };
};

export const isNumber = ( data, field ) => {
  if( typeof data !== 'number' || Number.isNaN( data ) ){
    console.log( `INVALID ${field}:` );
    console.log( data );
    return errs.unknown;
  };
};