import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import store from "../../../../redux/store.js";
import { getServs } from "../../../../redux/get.js";
import { appointmentUpdate } from "../../../../redux/put.js";
import { setProp } from "../../../../redux/sync.js";
import { servIdVal } from "../../../../validations/appointment_val.js";
import { errs } from "../../../../errors.js";
import "./appo_update_form.css";

const AppoUpdateForm = ({ state, data }) => {
  console.log( "AppoUpdateForm rendered" );

  const dispatch = useDispatch();

  const selected = useRef( {
    postData: {
      selToAddIds: new Set(),
      selToDelIds: new Set(),
    },
    reducerData: {
      selToAddObj: new Map(),
      selToDelInds: new Set()
    },
    subServs: undefined,
    listManager: ( set, id, flag, ind, selToDelInds, selToAddObj, subServToAdd ) => {
      if( set.has( id ) ){
        // console.log("del");
        if( ind !== undefined ) selToDelInds.delete( ind );
        if( subServToAdd !== undefined ) selToAddObj.delete( id );
        set.delete( id );
      }else{
        // console.log("add");
        if( ind !== undefined ) selToDelInds.add( ind );
        if( subServToAdd !== undefined ) selToAddObj.set( id, subServToAdd );
        set.add( id );
      };
      setFlag( !flag );
    },
    update: ( add, del, indsToDel, selToAddObj, appoId, appoInd ) => {
      const body = {};
      if( add.size ) body.add = [ ...add ];
      if( del.size ){
        if( indsToDel.size < 1 ){
          console.error( 'NO selToDelInds size.' );
          return dispatch( setProp( "message", errs.unknown ) );
        };
        body.del = [ ...del ];
      };
      if( body.add || body.del )
      {
        console.log( "appoId: ", appoId );
        console.log( "indsToDel: ", indsToDel.size ?[ ...indsToDel ] :null );
        console.log( "selToAddObj: ", selToAddObj );
        console.log( "body: ", body );
      }
      //   dispatch( appointmentUpdate(
      //   appoId,
      //   state.update.ind,
      //   indsToDel.size ?[ ...indsToDel ] :null,
      //   selToAddObj,
      //   body
      // ) );
      else dispatch( setProp( "message", errs.unknown ) );
    }
  } );

  const [ flag, setFlag ] = useState( false );

  useEffect( () => {
    const servs = store.getState().services;
    if( servs.length === 0 ){
      dispatch( setProp( "loader", 1 ) );
      const loadServs = async () => {
        const _servs = await dispatch( getServs() );
        if( _servs ){
          const selServ = _servs.find( s => s.id == state.update.currentData.service.id );
          if( selServ ){
            selected.current.subServs = selServ.sub_services;
            setFlag( !flag );
          };
        };
      };
      loadServs();
    };
  }, [] );

  return(
    <div className="AppoUpdateForm">

      <h3 className="AppoUpdateForm-noMarginTop">Sub servicios asignados al turno</h3>

      <div className="AppoUpdateForm-subServsContainer">
        {
          state.update.currentData.sub_services.map( ( ss, i ) => (
            <button
              className={ `AppoUpdateForm-${selected.current.postData.selToDelIds.has( ss.id )}` }
              onClick={ () => {
                const { listManager, postData, reducerData } = selected.current;
                listManager( postData.selToDelIds, ss.id, flag, i, reducerData.selToDelInds );
              } }
              key={ ss.id }
            >
              {ss.name}
            </button>
          ) )
        }
      </div>

      <div className="breakLine"></div>

      <h3>Sub servicios para agregar</h3>

      <div className="AppoUpdateForm-subServsContainer">
        {
          ( selected.current.subServs !== undefined && selected.current.subServs.length > 0 )
            ?selected.current.subServs.map( ( ss, i ) => (
              <button
                className={ `AppoUpdateForm-${selected.current.postData.selToAddIds.has( ss.id )}` }
                onClick={ () => {
                  const { listManager, postData, reducerData } = selected.current;
                  listManager( postData.selToAddIds, ss.id, flag, undefined, undefined, reducerData.selToAddObj, ss );
                } }
                key={ ss.id }
              >
                {ss.name}
              </button>
            ) )
          :<b><p>No se encuentran sub servicios que correspondan al servicio asignado a la cita seleccionada.</p></b>
        }
      </div>

      <button
        onClick={ () => {
          console.log( "submit executed" );
          const { postData, postData, reducerData, reducerData } = selected.current;
          selected.current.update( postData.selToAddIds, postData.selToDelIds, reducerData.selToDelInds, reducerData.selToAddObj, state.update.currentData.id, state.update.ind );
        } }
      >aplicar</button>

    </div>
  );

};

export default AppoUpdateForm;