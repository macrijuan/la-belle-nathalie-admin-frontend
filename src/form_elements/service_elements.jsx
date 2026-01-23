import React from "react";

export const normalInput = ( shouldAdd, key, selected, setSelected, body ) => {
  console.log( "normalInput executed" );
  if( shouldAdd ){
    setSelected( { ...selected, [ key ]: () => (
      <div key={ key } className="ServUpdate-normalInput">
        <label>Nombre:</label>
        <input onChange = { ( e ) => { body[ key ] = e.target.value; } } />
      </div>
    ) } );
  }else{
    delete body[ key ];
    const remainingKeys = { ...selected };
    delete remainingKeys[ key ];
    setSelected( remainingKeys );
  };
};

const options = ( times ) => {
  const opts = []
  for( let o = times[ 0 ]; o < times[ 1 ]; o++ ){
    if( o > 9 ) opts.push( `${o}` );
    else opts.push( `0${o}` );
  };
  return opts;
};

const options2 = ( times ) => {
  const opts = []
  for( let o = times[ 0 ]+1; o < times[ 1 ]+1; o++ ){
    if( o > 9 ) opts.push( `${o}` );
    else opts.push( `0${o}` );
  };
  return opts;
};

export const betweenTimes = ( shouldAdd, key, selected, setSelected, body, label ) => {
  console.log( "betweenTimes executed" );
  if( shouldAdd ){
    const times = key === "am" ?[ 8, 15 ] :[ 15, 21 ];
    const times1 = times[ 0 ]+1;
    body[ key ] = [ `${( times[ 0 ] > 9 ?times[ 0 ] :`0${times[ 0 ]}` )}:00`, `${( times1 > 9 ?times1 :`0${times1}` )}:00` ];
    setSelected( { ...selected, [ key ]: () => (
      <div key={ key } className="ServUpdate-betweenTimes">
        <label>{label}:</label>
        <div>
          <p>Hora de inicio:</p>
          <p>Hora:</p>
          <select onChange = { e => { body[ key ][ 0 ] =  `${ e.target.value }:${ body[key][ 0 ][ 3 ] }${ body[key][ 0 ][ 4 ] }`; } }>
            { options( times ).map( ( o, i ) => ( <option value={ o } key={ i }>{ o }</option>))}
          </select>
          <p>Minuto:</p>
          <select onChange = { e => { body[ key ][ 0 ] =  `${body[key][ 0 ][ 0 ]}${body[key][ 0 ][ 1 ]}:${e.target.value}`; } }>
            <option value="00" >00</option>
            <option value="10" >10</option>
            <option value="20" >20</option>
            <option value="30" >30</option>
            <option value="40" >40</option>
            <option value="50" >50</option>
          </select>
        </div>
        <div>
          <p>Hora de finalización:</p>
          <p>Hora</p>
          <select onChange = { e => { body[ key ][ 1 ] =  `${ e.target.value }:${ body[key][ 1 ][ 3 ] }${ body[key][ 1 ][ 4 ] }`; } }>
            { options2( times ).map( ( o, i ) => ( <option value={ o } key={ i }>{ o }</option>))}
          </select>
          <p>Minuto:</p>
          <select onChange = { e => { body[ key ][ 1 ] =  `${body[key][ 1 ][ 0 ]}${body[key][ 1 ][ 1 ]}:${e.target.value}`; } }>
            <option value="00" >00</option>
            <option value="10" >10</option>
            <option value="20" >20</option>
            <option value="30" >30</option>
            <option value="40" >40</option>
            <option value="50" >50</option>
          </select>
        </div>
      </div>
    ) } );
  }else{
    delete body[ key ];
    const remainingKeys = { ...selected };
    delete remainingKeys[ key ];
    setSelected( remainingKeys );
  };
};