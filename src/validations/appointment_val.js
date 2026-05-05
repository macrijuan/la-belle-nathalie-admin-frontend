import { errs, errObj } from "../errors.js";

const servIdVal = ( serv ) => {
  if(
    typeof serv !== 'number'
    || !Number.isSafeInteger( serv )
    || serv < 0
  ) return errObj( 'service', errs.unknown.desconocido );
};