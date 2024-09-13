import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  searchContainer: {
    marginBottom: 20,
  },
  searchInput: {
    height: 45,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 15,
    borderColor: '#DDDDDD',
    borderWidth: 1,
    fontSize: 16,
    marginTop: 20,
  },
  loadingIndicator: {
    marginVertical: 20,
  },
  resultContainer: {
    marginVertical: 20,
  },
  resultItem: {
    padding: 15,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginBottom: 15,
    borderColor: '#DDDDDD',
    borderWidth: 1,
  },
  resultText: {
    color: '#333333',
    fontSize: 16,
  },
  selectedLocationContainer: {
    padding: 15,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderColor: '#DDDDDD',
    borderWidth: 1,
    marginTop: -20,
  },
  selectedLocationText: {
    color: '#333333',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  changeLocationButton: {
    marginTop: -8,
    padding: 12,
    backgroundColor: '#FF5722',
    borderRadius: 10,
  },
  changeLocationButtonText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
  map: {
    flex: 1, // Map takes up available space
    marginTop: 20, // Adjust margin for spacing
    borderRadius: 10, // Rounded corners for the map
    borderColor: '#DDDDDD',
    borderWidth: 1,
    overflow: 'hidden', // Hide anything overflowing from rounded corners
  },
  buttonContainer: {
    paddingVertical: 20,
  },
  button: {
    padding: 15,
    backgroundColor: '#4CAF50',
    borderRadius: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
