import React, { useRef } from "react";
import { useDispatch } from "react-redux";
import { options, options2 } from "../../form_elements/service_elements.jsx";
import { postServ } from "../../redux/post.js";
import { setProp } from "../../redux/sync.js";
import { postServVal } from "../../validations/service_val.js";
import "./serv_post.css";

const PostServ = ({ state, setState }) => {
  console.log( "PostServ" );
  const dispatch = useDispatch();

  const body = useRef( {
    name:"",
    am: [ "08:00", "09:00" ],
    pm: [ "12:00", "13:00" ]
  } );

  return(
    <div className="PostServ-container" >
      <form className="PostServ"
        onSubmit={ ( e ) => {
          e.preventDefault(); console.log( body.current );
          dispatch( setProp( "loader", 1 ) );
          const err = postServVal( body.current );
          if( err ) {
            dispatch( setProp( "message", err ) );
            dispatch( setProp( "loader", 0 ) );
          } else dispatch( postServ( body.current ) );
        } }
      >
        <h1>Crear servicio</h1>
        <button className="PostServ-cancel" type='button' onClick={ () => { setState( { ...state, post: 0 } ); } } >cerrar</button>
        <h3>Nombre:</h3>
        <input onChange = { ( e ) => { body.current.name = e.target.value; } } />
        <h3>Turno mañana:</h3>
        <h4>Inicio:</h4>
        <div>
          <label>Hora:</label>
          <select onChange={ e => { body.current.am[ 0 ] =`${ e.target.value}:${body.current.am[ 0 ][ 3 ]}${body.current.am[ 0 ][ 4 ]}`; } } >
            { options( [ 8, 17 ] ).map( ( o, i ) => <option value={ o } key={ i }>{ o }</option> ) }
          </select>
          <label>Minuto:</label>
          <select onChange={ e => { body.current.am[ 0 ] =`${body.current.am[ 0 ][ 0 ]}${body.current.am[ 0 ][ 1 ]}:${ e.target.value}`; } } >
            <option value="00" >00</option>
            <option value="10" >10</option>
            <option value="20" >20</option>
            <option value="30" >30</option>
            <option value="40" >40</option>
            <option value="50" >50</option>
          </select>
        </div>

        <h4>Fin:</h4>
        <div>
          <label>Hora:</label>
        <select onChange={ e => { body.current.am[ 1 ] =`${ e.target.value}:${body.current.am[ 1 ][ 3 ]}${body.current.am[ 1 ][ 4 ]}`; } } >
          { options2( [ 8, 17 ] ).map( ( o, i ) => <option value={ o } key={ i }>{ o }</option> ) }
        </select>
        <label>Minuto:</label>
        <select onChange={ e => { body.current.am[ 1 ] =`${body.current.am[ 1 ][ 0 ]}${body.current.am[ 1 ][ 1 ]}:${ e.target.value}`; } } >
          <option value="00" >00</option>
          <option value="10" >10</option>
          <option value="20" >20</option>
          <option value="30" >30</option>
          <option value="40" >40</option>
          <option value="50" >50</option>
        </select>
        </div>

        <h3>Turno tarde:</h3>
        <h4>Inicio:</h4>
        <div>
          <label>Hora:</label>
          <select onChange={ e => { body.current.pm[ 0 ] =`${ e.target.value}:${body.current.pm[ 0 ][ 3 ]}${body.current.pm[ 0 ][ 4 ]}`; } } >
            { options( [ 12, 21 ] ).map( ( o, i ) => <option value={ o } key={ i }>{ o }</option> ) }
          </select>
          <label>Minuto:</label>
          <select onChange={ e => { body.current.pm[ 0 ] =`${body.current.pm[ 0 ][ 0 ]}${body.current.pm[ 0 ][ 1 ]}:${ e.target.value}`; } } >
            <option value="00" >00</option>
            <option value="10" >10</option>
            <option value="20" >20</option>
            <option value="30" >30</option>
            <option value="40" >40</option>
            <option value="50" >50</option>
          </select>
        </div>

        <h4>Fin:</h4>
        <div>
          <label>Hora:</label>
          <select onChange={ e => { body.current.pm[ 1 ] =`${ e.target.value}:${body.current.pm[ 1 ][ 3 ]}${body.current.pm[ 4 ]}`; } } >
            { options2( [ 12, 21 ] ).map( ( o, i ) => <option value={ o } key={ i }>{ o }</option> ) }
          </select>
          <label>Minuto:</label>
          <select onChange={ e => { body.current.pm[ 1 ] =`${body.current.pm[ 1 ][ 0 ]}${body.current.pm[ 1 ][ 1 ]}:${ e.target.value}`; } } >
            <option value="00" >00</option>
            <option value="10" >10</option>
            <option value="20" >20</option>
            <option value="30" >30</option>
            <option value="40" >40</option>
            <option value="50" >50</option>
          </select>
        </div>
        <button className="PostServ-submit">crear</button>
      </form>
    </div>
  );
};

export default PostServ;