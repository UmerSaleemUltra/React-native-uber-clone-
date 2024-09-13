import { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import styles from '../../styles/carselectionstyles'; // Make sure the path is correct
import { getDistance } from 'geolib';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Ensure the icon library is installed
import { collection, addDoc, updateDoc, doc } from 'firebase/firestore'; // Firestore methods
import { db } from '../Confing/firebase';

export default function CarSelectionScreen() {
  const params = useLocalSearchParams(); // Grabs search params from the navigation
  const [selectedCar, setSelectedCar] = useState(null);
  const [totalPrice, setTotalPrice] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter(); // For navigation

  // Define car options with base prices and per-kilometer rates
  const carOptions = [
    { type: 'Ride Mini', basePrice: 100, perKmRate: 20, icon: 'local-taxi' },
    { type: 'Ride AC', basePrice: 150, perKmRate: 30, icon: 'airline-seat-recline-extra' },
    { type: 'Business', basePrice: 300, perKmRate: 40, icon: 'business-center' },
  ];

  // Calculate the distance in meters between the pickup and dropoff locations
  const distance = getDistance(
    { latitude: params.pickupLatitude, longitude: params.pickupLongitude },
    { latitude: params.dropoffLatitude, longitude: params.dropoffLongitude }
  );

  // Function to calculate total price based on the selected car and distance
  const calculateTotalPrice = (car) => {
    const calculatedTotalPrice = car.basePrice + (distance / 1000) * car.perKmRate;
    setSelectedCar(car);
    setTotalPrice(calculatedTotalPrice);
  };

  // Function to save the selected car information to Firestore with 'pending' status
  const confirmCarSelection = async () => {
    if (!selectedCar) return;

    try {
      await addDoc(collection(db, 'carSelection'), {
        pickupName: params.pickupName,
        pickupLatitude: params.pickupLatitude,
        pickupLongitude: params.pickupLongitude,
        dropoffName: params.dropoffName,
        dropoffLatitude: params.dropoffLatitude,
        dropoffLongitude: params.dropoffLongitude,
        distance: distance / 1000, // Store distance in kilometers
        carType: selectedCar.type,
        totalPrice,
        status: 'pending',  // Add status as 'pending'
        timestamp: new Date(),
      });

      // Show success message
      alert('Car selection saved successfully! Status: Pending');
    } catch (error) {
      console.error('Error saving car selection: ', error);
    }
  };

  // Function to update the status of a car selection
  const updateStatus = async (newStatus) => {
    if (!selectedCar) return;

    setLoading(true);

    try {
      const carRef = doc(db, 'carSelection', selectedCar.id); // Get reference to the document
      await updateDoc(carRef, { status: newStatus });
      
      setLoading(false);
      alert(`Car selection ${newStatus}`);
    } catch (error) {
      console.error('Error updating car selection: ', error);
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Select Your Ride</Text>

      {carOptions.map((car) => (
        <TouchableOpacity
          key={car.type}
          style={[
            styles.carOption,
            selectedCar?.type === car.type && styles.selectedCarOption,
          ]}
          onPress={() => calculateTotalPrice(car)}
        >
          <Icon name={car.icon} size={24} color="#000" style={styles.carIcon} />
          <Text style={styles.carType}>{car.type}</Text>
          <Text style={styles.carPrice}>
            PKR {car.basePrice} + {car.perKmRate} per km
          </Text>
        </TouchableOpacity>
      ))}

      {selectedCar && (
        <View style={styles.selectedCarContainer}>
          <Text style={styles.selectedCarText}>Selected Car: {selectedCar.type}</Text>
          <Text style={styles.totalPriceText}>Total Price: PKR {totalPrice}</Text>
        </View>
      )}

      {/* Confirm Ride Button */}
      <TouchableOpacity
        style={[styles.confirmButton, !selectedCar && styles.disabledConfirmButton]}
        onPress={confirmCarSelection}
        disabled={!selectedCar}
      >
        <Text style={styles.confirmButtonText}>Confirm Selection</Text>
      </TouchableOpacity>

      {/* Accept Button */}
      

      <TouchableOpacity
        style={styles.confirmButton}
        onPress={() => router.push('/rider')} // Adjust route path if necessary
      >
        <Text style={styles.confirmButtonText}>Go to Rider Page</Text>
      </TouchableOpacity>
    </View>
  );
}
