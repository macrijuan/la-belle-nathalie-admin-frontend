import { errs, errObj } from "../errors.js";
import { isString, isNumber } from "./global_val.js";

export const subServNameVal = ( name ) => {
  const dataType = isString( name, "NAME" );
  if( dataType ) return dataType;
  if( name.length > 35 || name.length < 1 ){
    console.log( console.log( "INVALID NAME" ) );
    return errObj( "nombre", errs.strict_length( "El nombre", 1, 35 ) );
  };
};

export const subServMinsVal = ( mins ) => {
  const dataType = isString( mins, "MINS" );
  if( dataType ) return dataType;
  if( !(/\d/).test( mins ) || mins > 420 || mins < 1 ){
    console.log( console.log( "INVALID MINS" ) );
    return errObj( "duración", errs.strict_char_type( "duración", "números (max: 420, min: 1)" ) );
  };
};

export const subServDetailVal = ( detail ) => {
  const dataType = isString( detail, "DETAIL" );
  if( dataType ) return dataType;
  if( detail.length > 500 || detail.length < 1 ){
    console.log( console.log( "INVALID DETAIL" ) );
    return errObj( "detalle", errs.strict_length( "detalle", 1, 500 ) );
  };
};

export const subServServIdlVal = ( serviceId ) => {
  const dataType = isNumber( serviceId, "SERVID");
  if( dataType ) return dataType;
  if( !(/\d/).test( serviceId ) || serviceId > 10000 || serviceId < 1 ){
    console.log( console.log( "INVALID SERVID" ) );
    return errs.unknown;
  };
};

export const postSubServVal = ( body ) => {
  const name = subServNameVal( body.name );
  if( name ) return name;

  const mins = subServMinsVal( body.mins );
  if( mins ) return mins;

  const detail = subServDetailVal( body.detail );
  if( detail ) return detail;

  const serviceId = subServServIdlVal( body.serviceId );
  if( serviceId ) return serviceId;
};