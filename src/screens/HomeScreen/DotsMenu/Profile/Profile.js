import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import RIcon from 'react-native-remix-icon';
import styles from './ProfileStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUser } from '../../../../context/userContext';
const Profile = ({ route, navigation }) => {
  const { email, phone } = route.params || {};
  const { clearUser } = useUser();
  const handleLogout = async () => {
    try {
      await AsyncStorage.clear(); 
      clearUser();
    } catch (error) {
      console.error('AsyncStorage error during logout:', error);
    }
    navigation.navigate('LoginScreen');
  };

  return (
    <View style={styles.container}>
      <Image source={require('./Profile.png')} style={styles.userIcon} />
      <View style={styles.infoContainer}>
        <RIcon name="ri-mail-fill" size={24} color="black" style={styles.icon} />
        <Text style={styles.infoText}>{email}</Text>
      </View>
      <View style={styles.infoContainer}>
        <RIcon name="ri-phone-fill" size={24} color="black" style={styles.icon} />
        <Text style={styles.infoText}> {phone} {'               '}</Text>
      </View>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
    <RIcon name="ri-logout-box-r-line" size={25} color="white" style={{ marginRight: 8 }} />
    <Text style={styles.buttonText}>Logout</Text>
  </View>
</TouchableOpacity>

    </View>
  );
};

export default Profile;
