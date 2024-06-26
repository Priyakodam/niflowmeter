import React, { useState, useEffect,useRef } from 'react';
import { View, ScrollView, Text, ActivityIndicator ,TouchableOpacity} from 'react-native';
import { useDeviceContext} from '../../../context/DeviceContext';
import styles from './DailyBreakupStyles';
import { responsiveHeight } from 'react-native-responsive-dimensions';
import DailyTotalConsumption from './DailyTotalConsumption'
import { getDeviceTanksData } from '../../../apiUtils/apiServices';
import { useEllipsisOptions } from '../../../context/EllipsisContext';
const DailyBreakup = () => {
  const { selectedDevice } = useDeviceContext();
  const [isLoading, setIsLoading] = useState(true);
  const [tankDetails, setTankDetails] = useState([]);
  const { hideEllipsisOptions } = useEllipsisOptions();

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedDevice) return;
      setIsLoading(true);
      try {
        const data = await getDeviceTanksData(selectedDevice.profile_type, selectedDevice.device_id);
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

  // Check if any tank is still loading
  const tanksLoading = tankDetails.some(tank => tank.loading);

  if (isLoading || tanksLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: 'black' }}>Please wait getting the data</Text>
        <ActivityIndicator size="large" />
      </View>
    );
  }
    return (
        <ScrollView style={{ flex: 1,backgroundColor:'white' }} contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
            <TouchableOpacity onPress={hideEllipsisOptions} activeOpacity={1} >
            {tankDetails.map((tank,index) => (
                <View key={index} style={{marginTop:10}}>
                <View style={[styles.leftcontainer,{marginTop:index==1? responsiveHeight(-12) :0}]}>

                        <Text style={styles.title}>{tank.tank_name}</Text>
                    </View>
                    <View style={{ position: 'relative', height:'auto', width: '100%', marginTop: 10 }}>

                        <DailyTotalConsumption profileId={selectedDevice.profile_type} 
                        tankId={tank.tank_id} deviceId={selectedDevice.device_id}  
                        loading={tank.loading}
                        />
                    </View>
                </View>
            ))}
            </TouchableOpacity>
        </ScrollView>
    );
};

export default DailyBreakup;
