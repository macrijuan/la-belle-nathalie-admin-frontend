import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { adminSignIn } from "../redux/post.js";
import { config } from "../redux/action_names.js";

const configNoToken = ( method, body ) =>  {
  return {
    method: method,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body:JSON.stringify( body )
  };
};

const routeTester = () => {

  const dispatch = useDispatch();
  const user = useSelector ( state => state.user );
    
  useEffect( () => {
    if( !user.email ) {
      console.log( "SIGN IN" );
      dispatch( adminSignIn( { email:"amacri48@yahoo.com", password:"Password1?" } ) );
    };
  }, [ user ] );

  const t = async () => {
    try{
      console.log( "req sent" );
      const route1 = "/appointment/get_appointments";
      const body1 = { email:"ejemplo@yahoo.com" };
      const response1 = await fetch( `${ process.env.SERVER }${ route1 }`, configNoToken( "POST", body1 ) );
      
      // const route2 = "/user/post_user/";
      // const body2 = { email:"ejemplo@yahoo.com", password:"NewPassword1!", first_name:"firstname", last_name:"lastname", token:"abc123" };
      // const response2 = await fetch( `${ process.env.SERVER }${ route2 }`, configNoToken( "POST", body2 ) );

    
      if( response1.ok ) console.log( "OK" );
      else console.log( await response1.json().catch( () => 0 ) );
      // if( response1.ok && response2.ok ) console.log( "OK" );
      // else console.log( await response1.json().catch( () => 0 ) || await response2.json() );
      console.log("______________________________________________");
    }catch( err ){
      console.log( err );
    };
  };

  // if( user.email ) t();
  t();

  return null;
};

export default routeTester;
