import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  BackHandler,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './LoginStyles';
import LogoImage from './Logo.jpg';
import { postUserByPhoneEmailUrl } from '../../apiUtils/apiUrls';
import { useUser } from '../../context/userContext';

const LoginScreen = ({ navigation }) => {
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const { storeUser } = useUser();

  // Function to store data
  const storeData = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error storing data:', error);
    }
  };

  useEffect(() => {
    const backAction = () => {
      BackHandler.exitApp();
      return true;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, []);

  const getData = async (key) => {
    try {
      const value = await AsyncStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Error retrieving data:', error);
      return null;
    }
  };

  const handleApiCall = async () => {
    try {
      const response = await fetch(postUserByPhoneEmailUrl(phone, email), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const responseData = await response.json();
      if (responseData.registered === 0) {
        await storeData('credentials', { email, phone });
        storeUser(email, phone);
        navigation.replace('Home');
      } else if (responseData.registered === 1) {
        alert('You are already registered, Please contact admin');
      } else {
        alert('Invalid Credentials');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    const checkCredentialsAndLogin = async () => {
      const storedCredentials = await getData('credentials');
      if (storedCredentials && storedCredentials.email && storedCredentials.phone) {
        storeUser(storedCredentials.email, storedCredentials.phone);
        navigation.replace('Home');
      }
    };
    checkCredentialsAndLogin();
  }, [navigation]);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Image source={LogoImage} style={styles.logo} />
        </View>
        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#000" 
            onChangeText={setEmail}
            value={email}
          />
          <TextInput
            style={styles.input}
            placeholder="Phone"
            placeholderTextColor="#000" 
            onChangeText={setPhone}
            value={phone}
          />
          <TouchableOpacity onPress={handleApiCall} style={styles.button}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;