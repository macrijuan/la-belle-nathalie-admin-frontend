import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { errs } from "../../../redux/action_names.js";
import store from "../../../redux/store.js";
import { setProp } from "../../../redux/sync.js";
import { getServices } from "../../../redux/get.js";
import { servDel } from "../../../redux/delete.js";
import Alert from "../../alert/alert.jsx";
import ServUpdate from "../../update_form/serv_update.jsx";
import "./serv_board.css";

const ServBoard = () => {
  const user = useSelector( state => state.user );
  const servs = useSelector( state => state.services );
  const dispatch = useDispatch();

  useEffect( () => {
    if( user.email && !store.getState().servReq ) dispatch( getServices() );
  }, [ user ] );

  const toDelete = useRef( { servIds: new Set(), servInds:new Set() } );
  const [ state, setState ] = useState( { multipleDeletion: 0, update: null, selectedNames: [], post: 0  } );

  const handleMultipleDeletionList = ( id, ind, name ) => {
    if( toDelete.current.servInds.has( ind ) ){
      const indToDel = state.selectedNames.findIndex( servName => servName === name );
      if( indToDel !== -1 ){
        toDelete.current.servIds.delete( id );
        toDelete.current.servInds.delete( ind );
        const remainingNames = [ ...state.selectedNames ];
        remainingNames.splice( indToDel, 1 );
        setState( { ...state, selectedNames: remainingNames } );
      }else{
        console.log( "Index to delete not found." );
        dispatch( setProp( "message", errs.unknown ) );
      };
    }else{
      toDelete.current.servIds.add( id );
      toDelete.current.servInds.add( ind );
      setState( { ...state, selectedNames: [ ...state.selectedNames, name ] } );
    };
  };

const handleDelete = async ( id, ind ) => {
    dispatch( setProp( "loader", 1 ) );
    let deleted = undefined;
    if( state.selectedNames.length ){
      deleted = await dispatch( servDel( [ ...toDelete.current.servIds ], [ ...toDelete.current.servInds ] ) );
    }else{
      deleted = await dispatch( servDel( [ id ], [ ind ] ) );
    };
    if( deleted ){
      toDelete.current.servIds.clear();
      toDelete.current.servInds.clear();
      setState( { ...state, multipleDeletion: 0, selectedToDel: [] } );
    };
  };

  const handleUpdateList = ( currentToAdd, ind ) => {
    if( !state.update ){
      setState( { ...state, update: { currentData:[ currentToAdd ], inds:[ ind ] } } );
    }else{
      setState( { ...state, update: {
        currentData: [ ...state.update.currentData, currentToAdd ],
        inds: [ ...state.update.inds, ind ]
      } } );
    };
  };

  const handleCancelMultDel = () => {
    toDelete.current.servIds.clear();
    toDelete.current.servInds.clear();
    setState( { ...state, multipleDeletion: 0, selectedNames: [] } );
  };

  return(
    <div className="Home-board">
      <Alert accept={ () => { ; } } cancel={ () => { ; } } />
      <ServUpdate state={ state } setState={ setState } />
      {
        state.multipleDeletion
          ?<div className="ServBoard-selectedToDelete">
            <button onClick={ () => { handleCancelMultDel(); } }>cancelar eliminación multiple</button>
            <label>Servicios a eliminar:</label>
            <div className="AppoRowData-ss">
              { state.selectedNames.join( ", " ) }
            </div>
            <button onClick={ () => { handleDelete( [ ...toDelete.current.servIds ], [ ...toDelete.current.servInds ] ); } }>eliminación multiple</button>
          </div>
        :<button className="ServBoard-multipleDeletion" onClick={ () => { setState( { ...state, multipleDeletion: 1 } ); } }>activar eliminación multiple</button>
      }
      <div className="ServBoard-row" style={{ backgroundColor: "rgb( 239, 239, 239 )" }}>
        <h4>Nombre</h4>
        <h4>Turno mañana</h4>
        <h4>Turno tarde</h4>
      </div>
      {
        ( servs && servs.length )
          ?servs.map( ( s, i ) => {
            return(
              <div key={ i } className="ServBoard-row" style={{ backgroundColor: i%2 !== 0 ?"rgb( 239, 239, 239 )" :"rgb( 253, 172, 238 )" }}>
                <div className="Home-row-buttons">
                  <button onClick={ () => { handleUpdateList( s, i ); } }>actualizar</button>
                  <button onClick={ () => { if( state.multipleDeletion ) handleMultipleDeletionList( s.id, i, s.name ); else handleDelete( s.id, i ); } }>eliminar</button>
                </div>
                <h4>{ s.name }</h4>
                <h4>{ s.am.join( " - " ) }</h4>
                <h4>{ s.pm.join( " - " ) }</h4>
                <p className="AppoRowData-ss">Sub servicios: { s.sub_services.map( ( ss ) => ss.name ).join( ", " ) }</p>
              </div>
            );
          } )
        :null
      }
    </div>
  );
};

export default ServBoard;