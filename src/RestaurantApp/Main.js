import Axios from 'axios';
import React, {useEffect, useState, useRef} from 'react';
import {SafeAreaView, View, Text, FlatList, Modal} from 'react-native';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import {City, RestaurantDetail, SearchBar} from './components';

import {mapStyle} from './styles';

let originalList = []; //use for filter ,to keep original city list

const Main = (props) => {
  const [modalFlag, setModalFlag] = useState(false);
  const [cityList, setCityList] = useState([]); //to keep all cities and show city list
  const [restaurants, setRestaurants] = useState([]); // to keep restaurant data
  const [selectedRestaurant, setSelectedRestaurant] = useState(''); // modal marker
  const mapRef = useRef(null); // to use fitToCoordinate referans

  const fetchCities = async () => {
    // to get data   {data}=response.data
    const {data} = await Axios.get(
      'https://opentable.herokuapp.com/api/cities',
    );
    setCityList(data.cities);
    originalList = [...data.cities]; //filter
  };

  useEffect(() => {
    fetchCities();
  }, []);

  const onCitySearch = (text) => {
    const filteredList = originalList.filter((item) => {
      const userText = text.toUpperCase();
      const cityName = item.toUpperCase();

      return cityName.indexOf(userText) > -1;
    });

    setCityList(filteredList);
  };

  const onCitySelect = async (city) => {
    //selected city restaurant
    const {
      data: {restaurants}, //data altindaki restaurant erisim yapmak icin
    } = await Axios.get(
      'https://opentable.herokuapp.com/api/restaurants?city=' + city,
    );
    setRestaurants(restaurants);

    const restaurantsCoordinates = restaurants.map((res) => {
      return {
        latitude: res.lat,
        longitude: res.lng,
      };
    });
    mapRef.current.fitToCoordinates(restaurantsCoordinates, {
      edgePadding: {
        top: 50,
        right: 50,
        bottom: 50,
        left: 50,
      },
    });
  };
  // marker modal
  const onRestaurantSelect = (restaurant) => {
    setSelectedRestaurant(restaurant);
    setModalFlag(true);
  };
  const renderList = ({item}) => (
    <City
      cityName={item}
      onSelect={() =>
        onCitySelect(item)
      } /* parametre gelmedigi icin call back olarak kullaniyoruz */
    />
  );

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{flex: 1}}>
        <MapView // MapView en ustte olmasi gerekiyor herzaman
          provider={PROVIDER_GOOGLE} //Mapstyle for ios
          customMapStyle={mapStyle}
          ref={mapRef}
          style={{flex: 1}}
          initialRegion={{
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}>
          {restaurants.map((r, index) => (
            // r her bir restaurant datasi
            <Marker
              key={index}
              coordinate={{
                latitude: r.lat,
                longitude: r.lng,
              }}
              onPress={() => onRestaurantSelect(r)}
            />
          ))}
        </MapView>
        <View
          style={{
            position: 'absolute',
          }} /*herzaman view mapview altina tanimla , position absolute olsun */
        >
          <SearchBar
            onSearch={
              onCitySearch
            } /* text parametresi geldigi icin call back yapma direk fonksyonu tetikle  */
          />
          <FlatList
            horizontal //yan olarak hizalamak icin
            showsHorizontalScrollIndicator={false} // scroll line remove
            keyExtractor={(_, index) => index.toString()}
            data={cityList}
            renderItem={renderList}
          />

          <RestaurantDetail
            isVisible={modalFlag}
            restaurant={selectedRestaurant}
            onClose={() => setModalFlag(false)}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Main;
