import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { router, useLocalSearchParams } from 'expo-router';
import * as Location from 'expo-location';
import styles from '../../styles/dropoff'; // Assuming you're using a separate stylesheet for dropoff screen

const PRICE_PER_KM = 150; // PKR 150 per kilometer

export default function DropoffScreen() {
  const params = useLocalSearchParams();
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [searchResult, setSearchResult] = useState([]);
  const [dropoffLocation, setDropoffLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [distance, setDistance] = useState(0);
  const [price, setPrice] = useState(0);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  const findDropoffLocation = (text) => {
    if (!location) return;

    const { latitude, longitude } = location.coords;

    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: 'fsq3ePtTbHw9G3vZ+4+7Kx1V2FxCw66U57Q/f49feZgrwpg=',
      },
    };

    setLoading(true);
    fetch(
      `https://api.foursquare.com/v3/places/search?query=${text}&ll=${latitude},${longitude}`,
      options
    )
      .then((response) => response.json())
      .then((response) => setSearchResult(response.results))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  const selectDropoffLocation = (item) => {
    setDropoffLocation(item);

    // Simulate a random distance between 1 and 15 kilometers
    const randomDistance = Math.random() * 15;
    const roundedDistance = Math.ceil(randomDistance);

    setDistance(roundedDistance);

    // Calculate price based on distance
    const calculatedPrice = roundedDistance * PRICE_PER_KM;
    setPrice(calculatedPrice);
  };

  const confirmSelection = () => {
    if (!dropoffLocation) return;

    router.push({
      pathname: '/carselection',
      params: {
        pickupName: params.pickupName,
        pickupAddress: params.pickupAddress,
        pickupLatitude: params.pickupLatitude,
        pickupLongitude: params.pickupLongitude,
        dropoffName: dropoffLocation.name,
        dropoffAddress: dropoffLocation.location.formatted_address,
        dropoffLatitude: dropoffLocation.geocodes.main.latitude,
        dropoffLongitude: dropoffLocation.geocodes.main.longitude,
        distance,
        price,
      },
    });
  };

  const changeDropoffLocation = () => {
    setDropoffLocation(null);
    setSearchResult([]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search Dropoff Location"
          onChangeText={findDropoffLocation}
          placeholderTextColor="#888"
        />
      </View>

      {loading && <ActivityIndicator size="large" color="#0000ff" style={styles.loadingIndicator} />}

      {searchResult.length > 0 && !dropoffLocation && (
        <View style={styles.resultContainer}>
          {searchResult.map((item) => (
            <TouchableOpacity
              key={item.fsq_id}
              style={styles.resultItem}
              onPress={() => selectDropoffLocation(item)}
            >
              <Text style={styles.resultText}>
                {item.name} | {item.location.formatted_address}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {dropoffLocation && (
        <View style={styles.selectedLocationContainer}>
          <Text style={styles.selectedLocationText}>
            Dropoff Location Selected: {dropoffLocation.name}
          </Text>
          
          <TouchableOpacity onPress={changeDropoffLocation} style={styles.changeLocationButton}>
            <Text style={styles.changeLocationButtonText}>Change Location</Text>
          </TouchableOpacity>
        </View>
      )}

      {location && (
        <MapView
          region={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          }}
          style={styles.map}
        >
          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
            title={'You are here'}
            description={'Your current location'}
          />
          {dropoffLocation && (
            <>
              <Marker
                coordinate={{
                  latitude: dropoffLocation.geocodes.main.latitude,
                  longitude: dropoffLocation.geocodes.main.longitude,
                }}
                pinColor="green"
                title={'Dropoff Location'}
                description={dropoffLocation.name}
              />
            <Polyline
  coordinates={[
    {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    },
    {
      latitude: dropoffLocation.geocodes.main.latitude,
      longitude: dropoffLocation.geocodes.main.longitude,
    },
  ]}
  strokeColor="#008000" // Correct color format with #
  strokeWidth={3}
/>

            </>
          )}
        </MapView>
      )}

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={confirmSelection}
          disabled={!dropoffLocation}
        >
          <Text style={styles.buttonText}>Confirm and Select Car</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
