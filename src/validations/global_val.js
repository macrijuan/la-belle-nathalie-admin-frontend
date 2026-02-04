import { errs } from "../errors.js";

export const isString = ( data, field ) => {
  if( typeof data !== 'string' ){
    console.log( console.log( `INVALID ${field}` ) );
    return errs.unknown;
  };
};

export const isNumber = ( data, field ) => {
  if( typeof data !== 'number' || Number.isNaN( data ) ){
    console.log( console.log( `INVALID ${field}` ) );
    return errs.unknown;
  };
};