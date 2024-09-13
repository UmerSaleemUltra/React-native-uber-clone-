// carselectionstyles.js
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  carOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  selectedCarOption: {
    backgroundColor: '#e0f7fa',
  },
  iconContainer: {
    marginRight: 16,
  },
  carDetails: {
    flex: 1,
  },
  carType: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  carPrice: {
    fontSize: 16,
    color: '#666',
    marginLeft: 16,

  },
  carImage: {
    width: 100,
    height: 60,
    marginTop: 8,
    borderRadius: 8,
  },
  selectedCarContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#e0f7fa',
    borderRadius: 8,
  },
  selectedCarText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalPriceText: {
    fontSize: 16,
    marginTop: 8,
  },
  confirmButton: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#00796b',
    borderRadius: 8,
    alignItems: 'center',
  },
  disabledConfirmButton: {
    backgroundColor: '#b2dfdb',
  },
  confirmButtonText: {
    fontSize: 18,
    color: '#fff',
  },
  map: {
    height: 300,
    marginTop: 16,
    borderRadius: 8,
  },
});
