import React from "react";
import PostServ from "./serv_post.jsx";

const PostFormSelector = ( { state, setState } ) => {
  console.log( "PostFormSelector" );
  switch( state.post ){
    case "serv": { console.log( "here" ); return <PostServ state={ state } setState={ setState }/>; }
    default: <div>NINGÚN TABLERO SELECCIONADO POR "PostFormSelector". Si el error persiste contactese con el equipo de software (job.email.jami@gmail.com).</div>;
  };
};

export default PostFormSelector;