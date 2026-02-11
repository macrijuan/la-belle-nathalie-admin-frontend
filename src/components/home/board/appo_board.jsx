import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { errs } from "../../../redux/action_names.js";
import store from "../../../redux/store.js";
import { setProp } from "../../../redux/sync.js";
import { getAppos } from "../../../redux/get.js";
import { appoDel } from "../../../redux/delete.js";
import Alert from "../../alert/alert.jsx";
// import EmpUpdate from "../../update_form/emp_update.jsx";
import "./appo_board.css";

const AppoBoard = () => {
  const user = useSelector( state => state.user );
  const appos = useSelector( state => state.appos );
  const dispatch = useDispatch();

  useEffect( () => {
    if( user.email && !store.getState().appoReq ){
      dispatch( setProp( "loader", 1 ) );
      dispatch( getAppos() );
    };
  }, [ user ] );

  const toDelete = useRef( { ids: new Set(), inds:new Set() } );
  const [ state, setState ] = useState( { multipleDeletion: 0, update: null, selectedToDel: [], post: 0  } );

  const handleMultipleDeletionList = ( id, ind, start_time ) => {
    if( toDelete.current.inds.has( ind ) ){
      const indToDel = state.selectedToDel.findIndex( empIdentity => empIdentity === start_time );
      if( indToDel !== -1 ){
        toDelete.current.ids.delete( id );
        toDelete.current.inds.delete( ind );
        const remainingNames = [ ...state.selectedToDel ];
        remainingNames.splice( indToDel, 1 );
        setState( { ...state, selectedToDel: remainingNames } );
      }else{
        console.log( "Index to delete not found." );
        dispatch( setProp( "message", errs.unknown ) );
      };
    }else{
      toDelete.current.ids.add( id );
      toDelete.current.inds.add( ind );
      setState( { ...state, selectedToDel: [ ...state.selectedToDel, start_time ] } );
    };
  };

  const handleDelete = async ( id, ind ) => {
    dispatch( setProp( "loader", 1 ) );
    let deleted = undefined;
    if( state.selectedToDel.length ){
      console.log( [ ...toDelete.current.ids ], [ ...toDelete.current.inds ] );
      deleted = await dispatch( appoDel( [ ...toDelete.current.ids ], [ ...toDelete.current.inds ] ) );
    }else{
      deleted = await dispatch( appoDel( [ id ], [ ind ] ) );
    };
    if( deleted ){
      toDelete.current.ids.clear();
      toDelete.current.inds.clear();
      setState( { ...state, multipleDeletion: 0, selectedToDel: [] } );
    };
  };

  const handleUpdateList = ( currentToAdd, ind ) => {
    if( !state.update ){
      setState( { ...state, update: { currentData: [ currentToAdd ], inds: [ ind ], ids: [ currentToAdd.id ] } } );
    }else{
      setState( { ...state, update: {
        currentData: [ ...state.update.currentData, currentToAdd ],
        inds: [ ...state.update.inds, ind ],
        ids: [ ...state.update.ids, currentToAdd.id ]
      } } );
    };
  };

  const handleCancelMultDel = () => {
    toDelete.current.ids.clear();
    toDelete.current.inds.clear();
    setState( { ...state, multipleDeletion: 0, selectedToDel: [] } );
  };

  return(
    <div className="Home-board">
      <Alert accept={ () => { ; } } cancel={ () => { ; } } />
      {/* <EmpUpdate state={ state } setState={ setState } /> */}
      {
        state.multipleDeletion
          ?<div className="ServBoard-selectedToDelete">
            <button onClick={ () => { handleCancelMultDel(); } }>cancelar eliminación multiple</button>
            <label>Empleados a eliminar:</label>
            <div className="AppoRowData-ss">
              { state.selectedToDel.join( ", " ) }
            </div>
            <button onClick={ () => { handleDelete( [ ...toDelete.current.ids ], [ ...toDelete.current.inds ] ); } }>eliminación multiple</button>
          </div>
        :<button className="ServBoard-multipleDeletion" onClick={ () => { setState( { ...state, multipleDeletion: 1 } ); } }>activar eliminación multiple</button>
      }
      <div className="AppoBoard-row" style={{ backgroundColor: "rgb( 239, 239, 239 )" }}>
        <h4>Día</h4>
        <h4>Hora de inicio</h4>
        <h4>Hora de finalización</h4>
        <h4>servicio</h4>
        <h4>personal</h4>
      </div>
      {
        ( appos && appos.length )
          ?appos.map( ( a, i ) => {
            return (
              <div key={ a.id } className="AppoBoard-row" style={{ backgroundColor: i%2 !== 0 ?"rgb( 239, 239, 239 )" :"rgb( 253, 172, 238 )" }}>
                <div className="Home-row-buttons">
                  <button onClick={ () => { handleUpdateList( a, i ); } }>actualizar</button>
                  <button onClick={ () => { if( state.multipleDeletion ) handleMultipleDeletionList( a.id, i, a.start_time ); else handleDelete( a.id, i ); } }>eliminar</button>
                </div>
                <h4>{ a.day }</h4>
                <h4>{ a.start_time }</h4>
                <h4>{ a.end_time }</h4>
                <h4>{ a.service.name }</h4>
                <h4>{ a.employee.first_name } { a.employee.last_name }</h4>
                <p className="AppoRowData-ss">Sub servicios: { a.sub_services.map( ( ss ) => ss.name ).join( "," ) }</p>
              </div>
            );
          } )
        :null
      }
    </div>
  );
};

export default AppoBoard;