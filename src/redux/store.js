import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import rootReducer from './reducer.js';


const devtools = composeWithDevTools( { trace: true } );

const enhancer = devtools(
  applyMiddleware( thunkMiddleware )
);

const loadState = () => {
  try {
    const serialized = sessionStorage.getItem( "reduxState" );
    if ( !serialized ) return undefined;
    return JSON.parse( serialized );
  }catch( err ){
    console.log( err );
    return undefined;
  };
};

const preloadedState = loadState();

const store = createStore(
  rootReducer,
  preloadedState,
  enhancer
);

store.subscribe(() => {
  try {
    sessionStorage.setItem(
      "reduxState",
      JSON.stringify( store.getState() )
    );
  } catch {}
});

export default store;