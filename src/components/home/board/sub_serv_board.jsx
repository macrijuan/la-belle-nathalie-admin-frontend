import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { errs } from "../../../redux/action_names.js";
import store from "../../../redux/store.js";
import { setProp } from "../../../redux/sync.js";
import { getSubServs } from "../../../redux/get.js";
import { sub_servDel } from "../../../redux/delete.js";
// import Alert from "../../alert/alert.jsx";
import SubServUpdate from "../../update_form/sub_serv_update.jsx";
import "./sub_serv_board.css";

const SubServBoard = () => {
  const user = useSelector( state => state.user );
  const sub_servs = useSelector( state => state.sub_services );
  const dispatch = useDispatch();

  useEffect( () => {
    if( user.email && !store.getState().sub_servReq ){
      dispatch( setProp( "loader", 1 ) );
      dispatch( getSubServs() );
    };
  }, [ user ] );

  const toDelete = useRef( { ids: new Set(), inds:new Set() } );
  const [ state, setState ] = useState( { multipleDeletion: 0, update: null, selectedNames: [], post: 0  } );

  const handleMultipleDeletionList = ( id, ind, name ) => {
    if( toDelete.current.inds.has( ind ) ){
      const indToDel = state.selectedNames.findIndex( sub_ervName => sub_ervName === name );
      if( indToDel !== -1 ){
        toDelete.current.ids.delete( id );
        toDelete.current.inds.delete( ind );
        const remainingNames = [ ...state.selectedNames ];
        remainingNames.splice( indToDel, 1 );
        setState( { ...state, selectedNames: remainingNames } );
      }else{
        console.log( "Index to delete not found." );
        dispatch( setProp( "message", errs.unknown ) );
      };
    }else{
      toDelete.current.ids.add( id );
      toDelete.current.inds.add( ind );
      setState( { ...state, selectedNames: [ ...state.selectedNames, name ] } );
    };
  };

const handleDelete = async ( id, ind ) => {
    dispatch( setProp( "loader", 1 ) );
    let deleted = undefined;
    if( state.selectedNames.length ){
      deleted = await dispatch( sub_servDel( [ ...toDelete.current.ids ], [ ...toDelete.current.inds ] ) );
    }else{
      deleted = await dispatch( sub_servDel( [ id ], [ ind ] ) );
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
    setState( { ...state, multipleDeletion: 0, selectedNames: [] } );
  };

  return(
    <div className="Home-board">
      {/* <Alert accept={ () => { ; } } cancel={ () => { ; } } /> */}
      <SubServUpdate state={ state } setState={ setState } />
      {
        state.multipleDeletion
          ?<div className="SubServBoard-selectedToDelete">
            <button onClick={ () => { handleCancelMultDel(); } }>cancelar eliminación multiple</button>
            <label>Servicios a eliminar:</label>
            <div className="AppoRowData-ss">
              { state.selectedNames.join( ", " ) }
            </div>
            <button onClick={ () => { handleDelete( [ ...toDelete.current.ids ], [ ...toDelete.current.inds ] ); } }>eliminación multiple</button>
          </div>
        :<button className="SubServBoard-multipleDeletion" onClick={ () => { setState( { ...state, multipleDeletion: 1 } ); } }>activar eliminación multiple</button>
      }
      <div className="SubServBoard-row" style={{ backgroundColor: "rgb( 239, 239, 239 )" }}>
        <h4 className="SubServBoard-column-name">Nombre</h4>
        <h4 className="SubServBoard-column-mins">Duración (minutos)</h4>
        <h4 className="SubServBoard-column-name">Servicio asignado</h4>
        <h4 className="SubServBoard-column-detail">Descripción</h4>
      </div>
      {
        ( sub_servs && sub_servs.length )
          ?sub_servs.map( ( s, i ) => {
            return(
              <div key={ i } className="SubServBoard-row" style={{ backgroundColor: i%2 !== 0 ?"rgb( 239, 239, 239 )" :"rgb( 253, 172, 238 )" }}>
                <div className="Home-row-buttons">
                  <button onClick={ () => { handleUpdateList( s, i ); } }>actualizar</button>
                  <button onClick={ () => { if( state.multipleDeletion ) handleMultipleDeletionList( s.id, i, s.name ); else handleDelete( s.id, i ); } }>eliminar</button>
                </div>
                <h4 className="SubServBoard-column-name">{ s.name }</h4>
                <h4 className="SubServBoard-column-mins">{ s.mins }</h4>
                <h4 className="SubServBoard-column-name">{ s.service.name }</h4>
                <h4 className="SubServBoard-column-detail">{ s.detail }</h4>
              </div>
            );
          } )
        :null
      }
    </div>
  );
};

export default SubServBoard;