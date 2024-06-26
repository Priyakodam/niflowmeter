import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, processColor } from 'react-native';
import { BarChart } from 'react-native-charts-wrapper';
import { styles } from './YearlyStyles';
import CustomModal from '../../../utils/CustomModal'; // Assuming you have a custom modal component
import Loader from '../../../utils/Loader'; // Assuming you have a loader component

const App = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [errorMsg, setErrorMsg] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://nimblevision.io/public/api/getYearlyMonthwiseWaterConsumption?key=chinnu&token=257bbec888a81696529ee979804cca59&profile_type=1&device_id=2313192&tank_id=1&year=2024');
      const result = await response.json();
      processChartData(result.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      setErrorMsg(2);
    }
    setLoading(false);
  };

  const processChartData = (apiData) => {
    const colors = [
      processColor('rgba(244, 143, 177, 0.8)'),
      processColor('rgba(129, 199, 132, 0.8)'),
      processColor('rgba(79, 195, 247, 0.8)'),
      processColor('rgba(255, 238, 88, 0.8)'),
      processColor('rgba(255, 138, 101, 0.8)'),
      processColor('rgba(129, 199, 132, 0.4)'),
      processColor('rgba(255, 238, 88, 0.5)')
    ];

    const chartData = {
      dataSets: [{
        values: apiData.map((item, index) => ({ y: item.consumption, x: index })),
        label: 'Water Consumption',
        config: {
          colors: colors,
          barShadowColor: processColor('lightgrey'),
          highlightAlpha: 90,
          highlightColor: processColor('red'),
          drawValues: true // Show values on bars
        },
      }],
    };

    setData(chartData);
  };

  if (loading || !data) {
    return <Loader />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Monthly Water Consumption for 2024</Text>
      <CustomModal visible={modalVisible} errorMsg={errorMsg} onClose={() => setModalVisible(false)} />
      <View style={styles.chartContainer}>
        <BarChart
          style={styles.chart}
          data={data}
          xAxis={{
            valueFormatter: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            granularityEnabled: true,
            granularity: 1,
            zoomEnabled: true,
            labelRotationAngle: 0,
          }}
          yAxis={{
            left: {
              enabled: true,
              zoomEnabled: true,
            },
            right: {
              enabled: false,
              zoomEnabled: false,
            }
          }}
          legend={{
            enabled: false
          }}
          doubleTapToZoomEnabled={false}
          highlights={[]}
          drawGridBackground={false}
          drawBorders={false}
          marker={{ enabled: true, markerColor: processColor('black'), textColor: processColor('white') }}
          description={{
            text: 'Past Data',
            textSize: 15,
            textColor: processColor('darkgray'),
          }}
        />
      </View>
      <View style={{padding:20,marginTop:-24,backgroundColor:'white'}}></View>
    </View>
  );
};




export default App;
