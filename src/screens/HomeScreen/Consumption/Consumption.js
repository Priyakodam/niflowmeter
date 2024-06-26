import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, ActivityIndicator,TouchableOpacity } from 'react-native';
import { useDeviceContext} from '../../../context/DeviceContext';
import ChartComponent from './ChartComponent';
import styles from './ConsumptionStyles';
import { responsiveHeight } from 'react-native-responsive-dimensions';
import { getDeviceTanksData } from '../../../apiUtils/apiServices';
import { useEllipsisOptions } from '../../../context/EllipsisContext';
import DailyTotalConsumption from '../DailyBreakup/DailyTotalConsumption';
import NoTanks from '../../../utils/NoTanks';
const Consumption = () => {

    const { selectedDevice } = useDeviceContext();
    const [isLoading, setIsLoading] = useState(true);
    const [tankDetails, setTankDetails] = useState([]);
    const {  hideEllipsisOptions } = useEllipsisOptions();
    useEffect(() => {
      const fetchData = async () => {
        if (!selectedDevice) return;
        setIsLoading(true);
        try {
          const data = await getDeviceTanksData(selectedDevice.profile_type,selectedDevice.device_id);
          setTankDetails(data);
        } catch (error) {
          console.error('Error fetching tank details:', error);
          setTankDetails([]);
        } finally {
          setIsLoading(false);
        }
      };
  
      fetchData();
    }, [selectedDevice]);
  
  
    if (isLoading) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      );
    }
  
    
  if (!tankDetails.length) {
    return (
      <NoTanks/>
    );
  }
  return (
    <ScrollView style={{ flex: 1,backgroundColor:'white' }} contentContainerStyle={{ flexGrow: 1 }}>

    <View style={{ flex: 1 }}>
        {tankDetails.map((tank,index) => (
                <View key={index} style={{marginTop:8}}>
                <View style={[styles.leftcontainer,{marginTop:index==1? responsiveHeight(0) :0}]}>

                        <Text style={styles.title}>{tank.tank_name}</Text>
                    </View>
                    <View style={{ position: 'relative', height:'auto', width: '100%', marginTop: 10 }}>
                      <View style={styles.leftcontainer}>
                      <Text style={styles.title}>Today's Consumption</Text>
                      </View>
                    
                        <DailyTotalConsumption profileId={selectedDevice.profile_type} 
                        tankId={tank.tank_id} deviceId={selectedDevice.device_id}  
                        loading={tank.loading}
                        />
                    </View>
                    <View style={{ position: 'relative', height: responsiveHeight(50), width: '100%', marginTop: 10 }}>
                    <View style={styles.rightcontainer}>
                      <Text style={styles.title}>Past Consumption Daywise</Text>
                      </View>
            
            <ChartComponent 
            profileType = {selectedDevice.profile_type}
            tankId={tank.tank_id}
             deviceId={selectedDevice.device_id}
              />
                   
            <View style={{padding:20,marginTop:-24,backgroundColor:'white'}}>
            </View>
          </View>
                </View>
            ))}
            
      {/* {tankDetails.map((tank, index) => (
        <View key={index} style={{marginTop:8}}>

          <View style={[styles.leftcontainer,{marginTop:index==1? responsiveHeight(1) :0}]}>
            <Text style={styles.title}>{tank.tank_name}</Text>
          </View>
          <View style={{ position: 'relative', height: responsiveHeight(50), width: '100%', marginTop: 10 }}>
            <ChartComponent 
            profileType = {selectedDevice.profile_type}
            tankId={tank.tank_id}
             deviceId={selectedDevice.device_id}
              />
                   

          </View>
        </View>
      ))} */}
      <View style={{ marginBottom: 99 }}></View>
    </View>
    </ScrollView>
  );
};

export default Consumption;
