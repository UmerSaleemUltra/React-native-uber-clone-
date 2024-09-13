import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { router } from 'expo-router';
import * as Location from 'expo-location';
import styles from '../../styles/dashboard';

export default function PickupScreen() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [searchResult, setSearchResult] = useState();
  const [pickupLocation, setPickupLocation] = useState();
  const [loading, setLoading] = useState(false);

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

  const findPickupLocation = (text) => {
    if (!location) return;

    const { latitude, longitude } = location.coords;
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: 'fsq3FD7N81ps6AbcaJbYJXN2dzv5H/rLw/mp63gS6wPiRao=',
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

  const changeLocation = () => {
    setPickupLocation(null);
    setSearchResult(null);
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search Pickup Location"
          onChangeText={findPickupLocation}
          placeholderTextColor="#888"
        />
      </View>

      {loading && <ActivityIndicator size="large" color="#0000ff" style={styles.loadingIndicator} />}

      {searchResult && !pickupLocation && (
        <ScrollView style={styles.resultContainer}>
          {searchResult.map((item) => (
            <TouchableOpacity
              key={item.fsq_id}
              style={styles.resultItem}
              onPress={() => setPickupLocation(item)}
            >
              <Text style={styles.resultText}>
                {item.name} | {item.location.formatted_address}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {pickupLocation && (
        <View style={styles.selectedLocationContainer}>
          <Text style={styles.selectedLocationText}>
            Pickup Location Selected: {pickupLocation.name}
          </Text>

          <TouchableOpacity onPress={changeLocation} style={styles.changeLocationButton}>
            <Text style={styles.changeLocationButtonText}>Change Location</Text>
          </TouchableOpacity>
        </View>
      )}

      {location && (
        <MapView
          region={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.002,
            longitudeDelta: 0.002,
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
        </MapView>
      )}

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            router.push({
              pathname: '/dropoff',
              params: {
                pickupName: pickupLocation.name,
                pickupAddress: pickupLocation.location.formatted_address,
                pickupLatitude: pickupLocation.geocodes.main.latitude,
                pickupLongitude: pickupLocation.geocodes.main.longitude,
              },
            })
          }
          disabled={!pickupLocation}
        >
          <Text style={styles.buttonText}>Select Dropoff</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
