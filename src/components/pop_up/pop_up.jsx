import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setProp } from "../../redux/sync";

import "./pop_up.css";

const PopUp = () => {
  // console.log( "PopUp --> EXECUTED" );
  const dispatch = useDispatch();
  const message = useSelector( state => state.message );
  if( message ){
    return(
      <div className="PopUp-Wrap">
        <div className="PopUp">
          <button className="close" onClick={ () => { dispatch( setProp( "message", 0 ) ); } }>cerrar</button>
          {
            Object.keys( message ).map( ( msg_key, i ) => (
              !Array.isArray( message[ msg_key ] )
                ?(
                  <div key={ "errors_"+i }>
                    <h4 className="title">{ msg_key }:</h4>
                    <p className="msg">{ message[ msg_key ] }</p>
                  </div>
                ) 
              :(
                <div key={ "errors_"+i }>
                  <h4 className="title">{ msg_key }:</h4>
                  { message[ msg_key ].map( ( msg, _i ) => <p className="msg" key={ "msg_"+_i }>{ msg }</p> ) }
                </div>
              )
            ) )
          }
        </div>
      </div>
    );
  };
};

export default PopUp;