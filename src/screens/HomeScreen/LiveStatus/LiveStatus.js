import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, ScrollView,TouchableOpacity, ToastAndroid,TouchableWithoutFeedback } from 'react-native'; // Replace Alert with ToastAndroid
import { useDeviceContext } from '../../../context/DeviceContext';
import WaveView from 'react-native-waveview'; 
import { responsiveHeight } from 'react-native-responsive-dimensions';

import styles from './LiveStatusStyles';
import { fetchTankDetailsAndWaterHeight } from '../../../apiUtils/apiServices';
import { useEllipsisOptions } from '../../../context/EllipsisContext';
import { StyleSheet, Dimensions } from 'react-native'; 
import CustomModal from '../../../utils/CustomModal';
import NoTanks from '../../../utils/NoTanks';
const { width: screenWidth } = Dimensions.get('window');

const LiveStatus = () => {
  const { selectedDevice } = useDeviceContext();
  const [tankDetails, setTankDetails] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [alertShown, setAlertShown] = useState(false);
  const {  hideEllipsisOptions } = useEllipsisOptions();
  const [isUpdate,SetIsUpdate] = useState(true);
  const height = Dimensions.get('window').height / 2 ;

  const [modalVisible, setModalVisible] = useState(false);
  const [showWave, setShowWave] = useState(false);
  const [errorMsg, setErrorMsg] = useState(0); 

  useEffect(() => {
    
    SetIsUpdate(true);
    const fetchData = async () => {
      // console.log("device selected ",selectedDevice)
      if (!selectedDevice) return;
      setIsLoading(true);
      try {
        const tanksDetails = await fetchTankDetailsAndWaterHeight(selectedDevice.profile_type, selectedDevice.device_id);
        // console.log("tank details",tankDetails)
        
        
        const anyTankWithoutUpdate = tanksDetails.some(tank => !tank.updateAvailable);
        //console.log("anyTankWithoutUpdate",anyTankWithoutUpdate);
        if (anyTankWithoutUpdate ) {
          SetIsUpdate(false);
          // showToastInCenter("Failed to get the latest info",'error');
        }
        else{
          SetIsUpdate(true);
            setModalVisible(true);
            setErrorMsg(1);
         
            setTankDetails(tanksDetails);
        }
      } catch (error) {
        console.error('Error:', error);
        setTimeout(() => {
          setModalVisible(true);
          setErrorMsg(2);
        }, 1500);
        SetIsUpdate(false);
       
      } finally {
        // SetIsUpdate(false);
        setAlertShown(false);
        setIsLoading(false);
      }
    };
  
    fetchData();
  }, [selectedDevice]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{color:'black'}}>Please wait getting the data</Text>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  

  
  if (!isUpdate) {
    return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 18, textAlign: 'center',color:'black' }}>
        There is no update received today
      </Text>
    </View>)
  }

  if (!tankDetails.length) {
    return (
      <NoTanks/>
    );
  }

  const handleClose=()=>{
    setModalVisible(false);
    setShowWave(true); 
   }
  return (
    
    <ScrollView style={{ flex: 1 }}  >
            <CustomModal visible={modalVisible} errorMsg={errorMsg} onClose={handleClose} />

          <TouchableOpacity onPress={hideEllipsisOptions} activeOpacity={1}>
          <View style={styles.container}>
  {showWave && tankDetails.map((tank, index) => (
    <View key={index} style={{ marginBottom: index === 1 ? responsiveHeight(1.5) : 0 }}>
      <View style={styles.tankContainer}>
        <Text style={styles.tankName}>{tank.tankName}</Text>
      </View>

      <View style={styles.percentageContainer}>
      <Text style={styles.percentage}>
      <Text>{((tank.percentage / 100) * tank.tankDistanceM).toFixed(1)}m</Text>{"\n"}
  <Text>{tank.percentage}%</Text>
</Text>


        
        <WaveView
          style={styles.waveStyle}
          H={tank.percentage * (height) / 100}
          waveParams={[
            { A: 20, T: 500, fill: '#C4E4FF' },
            { A: 35, T: 400, fill: '#4A90E2' },
          ]}
          animated={true}
        />
      </View>
    </View>
  ))}
</View>

      {/* <View style={{ marginTop:-250 }}></View> */}
      </TouchableOpacity>
    </ScrollView>
   
  );
};

export default LiveStatus;
