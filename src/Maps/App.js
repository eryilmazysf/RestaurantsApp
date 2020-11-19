import React from 'react';
import Geolocation from '@react-native-community/geolocation';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';

const App = () => {
  Geolocation.getCurrentPosition(
    (info) => console.log(info),
    (error) => console.log(error),
    {
      enableHighAccuracy: true,
    },
  );
  return (
    <MapView
      provider={PROVIDER_GOOGLE}
      style={{flex: 1}}
      initialRegion={{
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }}
    />
  );
};
export default App;
