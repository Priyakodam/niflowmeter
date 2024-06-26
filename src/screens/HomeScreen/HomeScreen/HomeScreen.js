import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import RIcon from 'react-native-remix-icon';
import styles from './HomeStyles';
import TopNavBar from '../../Navbar/TopNavBar';
import Daily from '../DayWise/Daily';
import Monthly from '../Monthwise/Monthly';
import Yearly from '../Yearwise/Yearly';
import { useOptionsContext } from '../../../context/OptionsContext';
import { useEllipsisOptions } from '../../../context/EllipsisContext';
import { useUser } from '../../../context/userContext';

const BottomNavbar = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('Daily');
  const { hideOptions } = useOptionsContext();
  const { hideEllipsisOptions } = useEllipsisOptions();
  const { user } = useUser();

  const navigateToScreen = (screenName) => {
    setActiveTab(screenName);
    hideOptions();
    hideEllipsisOptions();
  };

  return (
    <>
      <TopNavBar email={user.email} phone={user.phone} />
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigateToScreen('Daily')}
        >
          <RIcon
            name="ri-global-line"
            size={28}
            color={activeTab === 'Daily' ? 'white' : 'black'}
          />
          <Text
            style={[
              styles.label,
              activeTab === 'Daily' && { color: 'white' },
            ]}
          >
            Daily 
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigateToScreen('Monthly')}
        >
          <RIcon
            name="ri-bar-chart-line"
            size={28}
            color={activeTab === 'Monthly' ? 'white' : 'black'}
          />
          <Text
            style={[
              styles.label,
              activeTab === 'Monthly' && { color: 'white' },
            ]}
          >
            Monthly
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigateToScreen('Yearly')}
        >
          <RIcon
            name="ri-time-line"
            size={28}
            color={activeTab === 'Yearly' ? 'white' : 'black'}
          />
          <Text
            style={[
              styles.label,
              activeTab === 'Yearly' && { color: 'white' },
            ]}
          >
            Yearly
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'Daily' && <Daily />}
      {activeTab === 'Monthly' && <Monthly />}
      {activeTab === 'Yearly' && <Yearly />}
    </>
  );
};

export default BottomNavbar;
