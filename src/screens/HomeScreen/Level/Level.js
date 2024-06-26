import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import moment from 'moment';
import MotorControl from './MotorControl';
import { useDeviceContext } from '../../../context/DeviceContext';
import styles from './LevelStyles';
import TestLevelChart from './Charts/LevelChart';
import { getDeviceTanksData } from '../../../apiUtils/apiServices';
import Loader from '../../../utils/Loader';
import { responsiveHeight } from 'react-native-responsive-dimensions';
import TestLineChart from './Charts/MotorOnOffLineChart';
import NoTanks from '../../../utils/NoTanks';

const Level = () => {
  const [loading, setLoading] = useState(true);
  const { selectedDevice } = useDeviceContext();
  const [tankDetails, setTankDetails] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedDevice) return;
      setLoading(true);
      try {
        const data = await getDeviceTanksData(selectedDevice.profile_type, selectedDevice.device_id);
        setTankDetails(data);
      } catch (error) {
        console.error('Error fetching tank details:', error);
        setTankDetails([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedDevice]);

  if (loading) {
    return <Loader />;
  }

  if (!tankDetails.length) {
    return (
      <NoTanks/>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={{ flex: 1, backgroundColor: 'white' }} contentContainerStyle={{ flexGrow: 1 }}>
        {tankDetails.map((tank, index) => (
          <View key={index} style={{ marginTop: 7 }}>
            <View style={[styles.leftcontainer, { marginTop: index == 1 ? responsiveHeight(0) : 0 }]}>
              <Text style={styles.title}>{tank.tank_name}</Text>
            </View>
            <View style={[styles.leftcontainer, { marginTop: 7 }]}>
              <Text style={styles.title}>{"Water Level"}</Text>
            </View>
            <View style={{ position: 'relative', height: responsiveHeight(48), width: '100%', marginTop: 7 }}>
              <TestLevelChart
                profileType={selectedDevice.profile_type}
                tankId={tank.tank_id}
                deviceId={selectedDevice.device_id}
              />
            </View>
            <View style={[styles.leftcontainer, { marginTop: 7 }]}>
              <Text style={styles.title}>{"Motor On/Off Status"}</Text>
            </View>
            <View style={{ position: 'relative', height: responsiveHeight(48), width: '100%', marginTop: 7 }}>
              <TestLineChart
                profileType={selectedDevice.profile_type}
                tankId={tank.tank_id}
                deviceId={selectedDevice.device_id}
              />
            </View>
            <View style={{ marginTop: 10 }}>
              {selectedDevice && <MotorControl deviceId={selectedDevice.device_id} tankId={tank.tank_id} />}
            </View>
            <View style={{ margin: tankDetails.length === 1 ? 50 : 0 }}></View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};


export default Level;
