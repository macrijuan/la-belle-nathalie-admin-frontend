import React from "react";
import PostServ from "./serv_post.jsx";
import PostSubServ from "./sub_serv_post.jsx";
import PostEmp from "./emp_post.jsx";

const PostFormSelector = ( { state, setState } ) => {
  console.log( "PostFormSelector" );
  switch( state.post ){
    case "serv": { return <PostServ state={ state } setState={ setState }/>; }
    case "sub_serv": { return <PostSubServ state={ state } setState={ setState }/>; }
    case "emp": { return <PostEmp state={ state } setState={ setState }/>; }
    default: <div>NINGÚN TABLERO SELECCIONADO POR "PostFormSelector". Si el error persiste contactese con el equipo de software (job.email.jami@gmail.com).</div>;
  };
};

export default PostFormSelector;