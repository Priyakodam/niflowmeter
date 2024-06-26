import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, processColor } from 'react-native';
import { LineChart } from 'react-native-charts-wrapper';
import { useDeviceContext } from '../../../../context/DeviceContext';
import CustomModal from '../../../../utils/CustomModal';
import NoUpdateReceived from '../../../../utils/NoUpdate';
import { responsiveHeight } from 'react-native-responsive-dimensions';
const COLOR_PURPLE = processColor('#697dfb');

const TestLineChart = ({ deviceId ,navigation, tankId }) => {
  const [chartData, setChartData] = useState({});
  const [xAxis, setXAxis] = useState({});
  const [yAxis, setYAxis] = useState({});
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [selectedXIndex, setSelectedXIndex] = useState(null);
  // const { selectedDevice } = useDeviceContext();
  const [modalVisible, setModalVisible] = useState(false);
  const [errorMsg, setErrorMsg] = useState(0); 
  const [isUpdate,SetIsUpdate] = useState(true);
  const [showChart,setShowChart] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`https://nimblevision.io/public/api/getDeviceMotorStatus?key=chinnu&token=257bbec888a81696529ee979804cca59&device_id=${deviceId}&profile_type=1&tank_id=${tankId}`);
        let data;
        if (response.headers.get("content-type")?.includes("application/json")) {
          try {
            data = await response.json();
            // console.log("Data parsed successfully in Line Chart :", data);
            // console.log("Type of data in Line :", typeof data);
          } catch (error) {
            console.log("Error parsing JSON:", error);
          }
        } else {
          console.log("Response is not JSON");
          return;
        }
  
        
        // console.log("Data after parsing in Line chart :", data);
        // console.log("type of data ",typeof(data))
        // console.log("legth  of data ",(data.data.length))
       
        if (data.data.length === 0) {
          SetIsUpdate(false);
          console.log("reversedData is empty");
          return;
        }
        else{
          const reversedData = data.data.reverse();
          const size = reversedData.length;
          // console.log("legth  of reversedData in Line ",size)
          const updatedXAxis = {
            valueFormatter: reversedData.map(item => item.updated_time),
            position: 'BOTTOM',
            granularityEnabled: true,
            granularity: 1,
            axisMinimum: 0,
            axisMaximum: size - 1,
            textColor: processColor('blue'),
            textSize: 16,
            gridColor: processColor('red'),
            gridLineWidth: 1,
            axisLineColor: processColor('darkgray'),
            axisLineWidth: 1.5,
            gridDashedLine: {
              lineLength: 10,
              spaceLength: 10
            },
            avoidFirstLastClipping: true,
          };
    
          const updatedYAxis = {
            left: {
              drawGridLines: false,
              axisMinimum: 0,
              axisMaximum: 1,
            },
            right: {
              enabled: false
            }
          };
    
          const updatedData = {
            dataSets: [{
              values: reversedData.map(item => ({ y: parseInt(item.motor_status) })),
              label: '',
              config: {
                lineWidth: 1.5,
                drawCircles: false,
                drawCubicIntensity: 0.3,
                drawCubic: true,
                drawHighlightIndicators: false,
                color: COLOR_PURPLE,
                drawFilled: true,
                fillColor: COLOR_PURPLE,
                fillAlpha: 90
              }
            }],
          };
    
          // setModalVisible(true);
          // setErrorMsg(1);
          
          setXAxis(updatedXAxis);
          setYAxis(updatedYAxis);
          setChartData(updatedData);
        }
        
      } catch (error) {
        console.log('Line Chart error :', error);
        setModalVisible(true);
        setErrorMsg(2);
      }
    };
  
    fetchData();
  }, [deviceId]);
  
  
  if (!isUpdate) {
    return (
      <NoUpdateReceived marginTop={responsiveHeight(5)} msg={"There is no update recieved today"}/>
    );
  }


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
 const handleClose=()=>{
  setModalVisible(false);
  setShowChart(true);
 }
 

 if(!isUpdate) {
  return <View></View>;
}
  return (
    <View style={{ flex: 1 }}>
      <View style={styles.container}>
      <CustomModal visible={modalVisible} errorMsg={errorMsg} onClose={handleClose} />

       {showChart &&  <LineChart
          style={styles.chart}
          data={chartData}
          chartDescription={{ text: '' }}
          xAxis={xAxis}
          yAxis={yAxis}
          legend={{ enabled: false }}
          onSelect={handleSelect}
          onChange={(event) => console.log(event.nativeEvent)}
          scaleXEnabled={true} // Enable x-axis zooming
          scaleYEnabled={true}
        />}
        {/* {renderVerticalLine()} */}
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

export default TestLineChart;
