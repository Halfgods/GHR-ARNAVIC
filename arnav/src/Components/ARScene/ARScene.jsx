
import React from 'react'
import NavigationCompass from './NavigationCompass'
import NavigationController from './NavigationController'
import Pannellum from './Pannellum';

import '../../CSS/ARScene.css'
import CameraBackground from './CameraBackground'
import ARMap from './ARMap';

const ARScene = ({ imgUrl }) => {
  const [isARScence, setIsARScence] = React.useState(true);
  const [coords, setCoords] = React.useState({
    src: null,
    dest: null
  });
  const [data, setData] = React.useState({
    image_url: imgUrl,
    phone_width: null,
    phone_height: null,
    start: null,
    end: null
  })
  const [apiData, setApiData] = React.useState(null)
  const [loading, setLoading] = React.useState(false);

  return (
    <>
      {isARScence ?
        <section className="on-the-go">
          <div className="ar-scene">
            <NavigationCompass />
            <ARMap
              imgUrl1={imgUrl}
              coords={coords}
              setCoords={setCoords}
              loading={loading}
              setLoading={setLoading}
              setData={setData}
              apiData={apiData}
            />
            <NavigationController
              setIsARScence={setIsARScence}
              coords={coords}
              loading={loading}
              setLoading={setLoading}
              data={data}
              setApiData={setApiData}
            />
          </div>
          <CameraBackground />
        </section> :
        <Pannellum setIsARScence={setIsARScence} />
      }
    </>


  )
}

export default ARScene