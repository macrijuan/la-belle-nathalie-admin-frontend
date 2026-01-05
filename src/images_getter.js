import store from "./redux/store";
import { saveImageArr, getImageArr } from "./indexed_db.js";

const getBackgroundImgs = async ( urlArray ) => {
  try{
    const imgs = await Promise.all( urlArray ).catch( ( err ) => { throw new Error( err ); } );
    const blobs = await Promise.all([
      imgs[ 0 ].blob(),
      imgs[ 1 ].blob(),
      imgs[ 2 ].blob()
    ]);
    return { long: blobs[ 0 ], square: blobs[ 1 ], wide: blobs[ 2 ]  };
  }catch( err ){
    throw new Error( err );
  };
};

export const getHomeBackgrounds = async () => {
  const blobbedImagesObj = await getBackgroundImgs(
    [
      fetch('https://agict1frouocbueq.public.blob.vercel-storage.com/la-belle-nathalie/home_long.jpg'),
      fetch('https://agict1frouocbueq.public.blob.vercel-storage.com/la-belle-nathalie/home_square.jpg'),
      fetch('https://agict1frouocbueq.public.blob.vercel-storage.com/la-belle-nathalie/home_wide.jpg')
    ]
  );
  return blobbedImagesObj;
};

export const getSessionBackgrounds = async () => {
  const blobbedImagesObj = await getBackgroundImgs(
    [
      fetch('https://agict1frouocbueq.public.blob.vercel-storage.com/la-belle-nathalie/session_long.jpg'),
      fetch('https://agict1frouocbueq.public.blob.vercel-storage.com/la-belle-nathalie/session_square.jpeg'),
      fetch('https://agict1frouocbueq.public.blob.vercel-storage.com/la-belle-nathalie/session_wide.jpg')
    ]
  );
  return blobbedImagesObj;
};

export const getAppoCalendarBackgrounds = async () => {
  const blobbedImagesObj = await getBackgroundImgs(
    [
      fetch('https://agict1frouocbueq.public.blob.vercel-storage.com/la-belle-nathalie/appo_cal_long.jpg'),
      fetch('https://agict1frouocbueq.public.blob.vercel-storage.com/la-belle-nathalie/appocal_square.jpg'),
      fetch('https://agict1frouocbueq.public.blob.vercel-storage.com/la-belle-nathalie/appocal_wide.jpg')
    ]
  );
  return blobbedImagesObj;
};

export const getAboutBackgrounds = async () => {
  const blobbedImagesObj = await getBackgroundImgs(
    [
      fetch('https://agict1frouocbueq.public.blob.vercel-storage.com/la-belle-nathalie/about_long.jpg'),
      fetch('https://agict1frouocbueq.public.blob.vercel-storage.com/la-belle-nathalie/about_square.jpg'),
      fetch('https://agict1frouocbueq.public.blob.vercel-storage.com/la-belle-nathalie/about_wide.jpg')
    ]
  );
  return blobbedImagesObj;
};

export const getAccountBackgrounds = async () => {
  const blobbedImagesObj = await getBackgroundImgs(
    [
      fetch('https://agict1frouocbueq.public.blob.vercel-storage.com/la-belle-nathalie/account_long.jpeg'),
      fetch('https://agict1frouocbueq.public.blob.vercel-storage.com/la-belle-nathalie/account_square.jpeg'),
      fetch('https://agict1frouocbueq.public.blob.vercel-storage.com/la-belle-nathalie/account_wide.jpeg')
    ]
  );
  return blobbedImagesObj;
};



export const backgroundSelect = ( backgroundArr ) => {// recives an object with three blobbed images
  try{
    if( backgroundArr ){
    if ( ( window.innerHeight / window.innerWidth ) >= 1.7 ) return { src: URL.createObjectURL( backgroundArr.long ), style:{ height: "100%", width: "auto" } };
    if ( ( window.innerWidth / window.innerHeight ) >= 1.3 ) return { src: URL.createObjectURL( backgroundArr.wide ), style:{ height: "auto", width: "100%" } };
    return { src: URL.createObjectURL( backgroundArr.square ), style:{ width: "auto", height: "100%" } };
    };
  }catch( err ){
    throw new Error( err );
  };
};

export const backgroundManager = async ( getComponentBackgrounds, IndexedDBKey, backgrounds, setSelectedBackground ) => {
  //HACK: This function must remain at the bottom of the file
  //HACK: IndexedDBKey MUST MATCH the name of the "most-parent" component being rendered (the one that has no parent... the main div being rendered)
  if( !backgrounds.current ){
    getImageArr( IndexedDBKey ).then( async existingIndexedDBData => {
      if( existingIndexedDBData ){
        backgrounds.current = existingIndexedDBData;
        setSelectedBackground( backgroundSelect( existingIndexedDBData ) );
      }else{
        const blobbedImgsArr = await getComponentBackgrounds().catch( ( err ) => { throw new Error( err ); return 0 } );
        if( blobbedImgsArr !== 0 ){
          saveImageArr( IndexedDBKey, blobbedImgsArr )
          .then( async () => {
            if( !backgrounds.current ){
              getImageArr( IndexedDBKey )
              .then( ( backgroundArr ) => {
                backgrounds.current = backgroundArr;
                setSelectedBackground( backgroundSelect( backgrounds.current ) );
              } ).catch( err => { console.log( err ); } );
            };  
          } ).catch( err => { console.log( err ); } );
        };
      };
    } ).catch( err => { console.log( err ); } );
  };
};

//  La imagen se focaliza en el maquillaje de sus labios carnosos, el de sus ojos verdes y sus cejas perfiladas.