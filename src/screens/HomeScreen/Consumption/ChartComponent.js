import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ActivityIndicator, processColor } from 'react-native';
import { BarChart } from 'react-native-charts-wrapper';
import { fetchBarChartData } from '../../../apiUtils/apiServices';
import CustomModal from '../../../utils/CustomModal';
import Loader from '../../../utils/Loader';

const ChartComponent = ({ profileType, deviceId, tankId }) => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isUpdate, setIsUpdate] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [showWave, setShowWave] = useState(false);
  const [errorMsg, setErrorMsg] = useState(0); 
  useEffect(() => {
    if (tankId === 2) {
      setShowWave(true);
    }
  }, [tankId]);
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data, updateAvailable } = await fetchBarChartData(profileType, deviceId, tankId);
        if (data === undefined || !updateAvailable) {
          setModalVisible(true);
          setErrorMsg(2);
          setIsUpdate(false);
        } else {
          const reversedData = [...data].reverse();
          setChartData(reversedData);
          // setModalVisible(true);
          setErrorMsg(1);
          setIsUpdate(true);
        }
      } catch (error) {
        setModalVisible(true);
        setErrorMsg(2);
        console.error('An error occurred:', error);
        setIsUpdate(false);
      }
      setLoading(false);
    }
    fetchData();
  }, [deviceId, tankId, profileType])

  if (loading || !chartData) {
    return <Loader/>
  }

  if (!isUpdate) {
    return (
      <View style={styles.loaderContainer}>
        <Text style={{ fontSize: 18, textAlign: 'center' }}>
          There is no update received today
        </Text>
      </View>
    )
  }

  const handleClose = () => {
    setModalVisible(false);
    setShowWave(true); 
  }

  const dates = chartData.map(item => item.created_at.substring(0, 10)); // Extract dates from chart data

  // Define an array of colors to assign to each bar
  const colors = [
    'rgba(244, 143, 177, 0.8)',
    'rgba(129, 199, 132, 0.8)',
    'rgba(79, 195, 247, 0.8)',
    'rgba(255, 238, 88, 0.8)',
    'rgba(255, 138, 101, 0.8)',
    'rgba(129, 199, 132, 0.4)',
    'rgba(255, 238, 88, 0.5)'
  ];
  let colorIndex = 0; 

  return (
    <View style={styles.container}>
    { tankId===1 && <CustomModal visible={modalVisible} errorMsg={errorMsg} onClose={handleClose}  />}
      {showWave && (
        <View style={styles.chartContainer}>
          <BarChart
            style={styles.chart}
            data={{
              dataSets: [{
                values: chartData.map((item, index) => ({ y: item.oneday_night })),
                config: {
                  colors: chartData.map(() => {
                      const color = colors[colorIndex]; // Get the color from the array based on the current index
                      colorIndex = (colorIndex + 1) % colors.length; // Increment the index and reset if it reaches the end
                      return processColor(color);
                    }),
                  barShadowColor: processColor('lightgrey'),
                  highlightAlpha: 90,
                  highlightColor: processColor('red'),
                  drawValues: true // Show values on bars
                }
              }],
            }}
            xAxis={{
              valueFormatter: dates,
              granularityEnabled: true,
              granularity: 1,
              zoomEnabled: true, // Enable zooming on x-axis
              labelRotationAngle: 0, // Rotate labels by 45 degrees
            }}
            yAxis={{
              left: {
                enabled: true,
                zoomEnabled: true, // Disable zooming on y-axis
              },
              right: {
                enabled: false,
                zoomEnabled: false, // Disable zooming on y-axis
              }
            }}
            legend={{
              enabled: false // Hide legend
            }}
            doubleTapToZoomEnabled={false}
            highlights={[]}
            drawGridBackground={false} // Disable grid background
            drawBorders={false} // Disable borders
            marker={{ enabled: true, markerColor: processColor('black'), textColor: processColor('white') }} // Show marker on tap
            onChange={(event) => console.log("on cahnge",event.nativeEvent)}
            description= {{
                text: 'Past Data',
                textSize: 15,
                textColor: processColor('darkgray'),
        }
              }
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF'
  },
  chartContainer: {
    flex: 1
  },
  chart: {
    flex: 1
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ChartComponent;
