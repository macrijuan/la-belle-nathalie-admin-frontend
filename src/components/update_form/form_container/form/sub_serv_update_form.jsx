import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setProp, setProp2 } from "../../../../redux/sync.js";
import { subServNameVal, subServMinsVal, subServDetailVal, subServServIdlVal } from "../../../../validations/sub_service_val.js";
import { subServUpdate } from "../../../../redux/put.js";

const SubServUpdateForm = ({ selected, state, data }) => {
  const dispatch = useDispatch();
  return(
    ( selected.name || selected.mins || selected.detail || selected.serviceId )
    ?<form className="ServUpdate-form" onSubmit={ ( e ) => {
          e.preventDefault();
          let errors = {};

          if( "name" in data.current.body ){
            const name = subServNameVal( data.current.body.name );
            if( name ) errors = { ...name };
            else data.current.body.name = data.current.body.name.toLowerCase();
          };

          if( "mins" in data.current.body ){
            const mins = subServMinsVal( data.current.body.mins );
            if( mins ) errors = { ...errors, ...mins };
          };

          if( "detail" in data.current.body ){
            const detail = subServDetailVal( data.current.body.detail );
            if( detail ) errors = { ...errors, ...detail };
          };

          if( "serviceId" in data.current.body ){
            const serviceId = subServServIdlVal( data.current.body.serviceId );
            if( serviceId ) errors = { ...errors, ...serviceId };
          };

          if( Object.keys( errors ).length ){
            dispatch( setProp2( { loader: 0, message: errors } ) );
          }else{
            const body = { ... data.current.body };
            if( 'mins' in body ) body.mins = Number( body.mins );
            if( 'serviceId' in body ) body.serviceId = body.serviceId = Number( body.serviceId );;
            // console.log( { ids: state.update.ids, update: body } );
            // console.log( "Update data submited" );
            // dispatch( setProp( "loader", 0 ) );
            dispatch( setProp( "loader", 1 ) );
            dispatch( subServUpdate( state.update.inds, { ids: state.update.ids, update: body } ) );
          };
        } }>
        {
          Object.values( selected ).map( html => html() )
        }
        <button type='submit'>actualizar</button>
      </form>
    :null
  );
};

export default SubServUpdateForm;