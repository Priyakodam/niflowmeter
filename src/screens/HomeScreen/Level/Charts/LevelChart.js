import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, processColor } from 'react-native';
import { LineChart } from 'react-native-charts-wrapper';
import { useDeviceContext } from '../../../../context/DeviceContext';
import CustomModal from '../../../../utils/CustomModal';
import NoUpdateReceived from '../../../../utils/NoUpdate';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
const COLOR_PURPLE = processColor('#697dfb');

const TestLevelChart = ({ deviceId ,navigation,tankId }) => {
  const [chartData, setChartData] = useState({});
  const [xAxis, setXAxis] = useState({});
  const [yAxis, setYAxis] = useState({});
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [selectedXIndex, setSelectedXIndex] = useState(null);
  // const { selectedDevice } = useDeviceContext();
  const [modalVisible, setModalVisible] = useState(false);
  const [errorMsg, setErrorMsg] = useState(0); 
  const [showWave,setShowWave] = useState(false);
  const [isUpdate, setIsUpdate] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`https://nimblevision.io/public/api/gettodaylivestatus?key=chinnu&token=257bbec888a81696529ee979804cca59&device_id=${deviceId}&profile_type=1&tank_id=${tankId}`);
        let data;
        if (response.headers.get("content-type")?.includes("application/json")) {
          try {
            data = await response.json();
          } catch (error) {
            console.log("Error parsing JSON:", error);
          }
        } else {
          console.log("Response is not JSON");
          return;
        }

        if (data.length === 0) {
          setIsUpdate(false);
          return;
        } else if (data.length > 0) {
          const reversedData = data.reverse();
          const size = reversedData.length;

          const updatedXAxis = {
            valueFormatter: reversedData.map(item => item.updated_time),
            position: 'BOTTOM',
            granularityEnabled: true,
            granularity: 1,
            axisMinimum: 0,
            axisMaximum: size - 1,
            textColor: processColor('blue'),
            textSize: responsiveHeight(2),
            gridColor: processColor('red'),
            gridLineWidth: responsiveWidth(0.2),
            axisLineColor: processColor('darkgray'),
            axisLineWidth: responsiveWidth(0.3),
            gridDashedLine: {
              lineLength: responsiveHeight(1),
              spaceLength: responsiveHeight(1)
            },
            avoidFirstLastClipping: true,
          };

          const updatedYAxis = {
            left: {
              valueFormatter: '#',
              granularity: 1,
            }, 
            right: {
              enabled: false,
            },
          };

          const updatedData = {
            dataSets: [{
              values: reversedData.map(item => ({ y: parseInt(item.percentage) })),
              label: '',
              config: {
                lineWidth: responsiveWidth(0.15),
                drawCircles: false,
                mode: 'CUBIC_BEZIER',
                drawHighlightIndicators: false,
                color: COLOR_PURPLE,
                drawFilled: true,
                fillColor: COLOR_PURPLE,
                fillAlpha: 90,
                cubicIntensity: 0.2,
              }
            }],
          };

          setModalVisible(true);
          setErrorMsg(1);
          setXAxis(updatedXAxis);
          setYAxis(updatedYAxis);
          setChartData(updatedData);
        } else if (data.msg.includes("do not have any data for today")) {
          setIsUpdate(false);
        }
      } catch (error) {
        console.error('Level chart error:', error);
        setModalVisible(true);
        setErrorMsg(2);
      }
    };

    fetchData();
  }, [deviceId]);

  const handleSelect = (event) => {
    if (event.nativeEvent == null) {
      setSelectedEntry(null);
      setSelectedXIndex(null);
    } else {
      const entry = chartData.dataSets[0].values[event.nativeEvent.x];
      setSelectedEntry(entry);
      setSelectedXIndex(event.nativeEvent.x);
    }
  };

  const handleClose = () => {
    setModalVisible(false);
    setShowWave(true);
  };

  useEffect(() => {
    if (tankId === 2) {
      setShowWave(true);
    }
  }, [tankId]);

  if (!isUpdate) {
    return (
      <NoUpdateReceived marginTop={responsiveHeight(5)} msg={"There is no update recieved today"}/>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.container}>
        {tankId === 1 && <CustomModal visible={modalVisible} errorMsg={errorMsg} onClose={handleClose}/>}

        {showWave && <LineChart
          style={styles.chart}
          data={chartData}
          chartDescription={{ text: '' }}
          xAxis={xAxis}
          yAxis={yAxis}
          legend={{ enabled: false }}
          onSelect={handleSelect}
          onChange={(event) => console.log(event.nativeEvent)}
          scaleXEnabled={true} 
          scaleYEnabled={true} 
        />}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
    position: 'relative',
  },
  chart: {
    flex: 1
  },
  verticalLine: {
    position: 'absolute',
    backgroundColor: 'red',
    width: 1,
    height: '100%',
    zIndex: 1
  }
});

export default TestLevelChart;
