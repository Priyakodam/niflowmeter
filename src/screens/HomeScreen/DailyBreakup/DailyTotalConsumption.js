import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView,ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import styles from './DailyTotalConsumptionStyles'; 
import { fetchPieChartData } from '../../../apiUtils/apiServices';
import CustomModal from '../../../utils/CustomModal';
import Loader from '../../../utils/Loader';
const DailyTotalConsumption = ({ profileId,deviceId, tankId }) => {
    const [totalConsumption, setTotalConsumption] = useState(0);
    const [consumptionDetails, setConsumptionDetails] = useState([]);
    const todayDate = new Date().toISOString().slice(0, 10);
    const [loading, setLoading] = useState(true);
    const [isUpdate,setIsUpdate] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [showWave, setShowWave] = useState(false); 
    const [errorMsg, setErrorMsg] = useState(0); 
    useEffect(() => {
        const fetchData = async () => {
          setLoading(true); 
          try {
           const { total, details,updateAvailable } = await fetchPieChartData(profileId, deviceId, tankId);
            
            if (updateAvailable) 
           {
            
              setModalVisible(true);
              setErrorMsg(1);
           
            setTotalConsumption(total);
            const reversedDetails = details.slice().reverse();
    setConsumptionDetails(reversedDetails);
            setIsUpdate(true);
          }
          else{
            setModalVisible(true);
            setErrorMsg(2);
            setIsUpdate(false);
          }
          } catch (error) {
            setModalVisible(true);
              setErrorMsg(2);
            console.error('Error fetching data:', error);
          } finally {
            setLoading(false);
          }
        };
        fetchData();
      }, [deviceId, tankId, profileId]);
 
   
      if(loading){
        <Loader/>
      }
    const getChartHtml = () => {

        const labels = consumptionDetails.map(detail => {
            let [hours, minutes] = detail.created_at.split(' ')[1].split(':');
            hours = parseInt(hours);
            const ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12;
            hours = hours ? hours : 12; 
            return `${hours}:${minutes} ${ampm}`;
        });
        
        console.log(labels);
        const data = consumptionDetails.map(detail => detail.onehrs);

        return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Doughnut Chart</title>
        <script src="https://cdn.jsdelivr.net/npm/chart.js@2.9.4"></script>
        <script src="https://cdn.jsdelivr.net/npm/chartjs-plugin-datalabels@0.7.0"></script>
        <style>
          body { 
            margin: 0; 
            display: flex; 
            justify-content: center; 
            align-items: center; 
            height: 100vh; 
            font-family: 'Roboto', sans-serif;
            background-color: white;
          }
          .chart-container {
            position: relative;
            width: 350px;
            height: 350px;
          }
          .inner-circle {
            position: absolute;
            background-color: white;
            border-radius: 50%;
            width: 50%; /* Adjust size as per your requirement */
            height: 50%; /* Adjust size as per your requirement */
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            border: 5px solid #B4B4B8;
          }
          .chart-text {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            text-align: center;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
          }
        </style>
        </head>
        <body>
        <div class="chart-container">
          <canvas id="myChart"></canvas>
          <div class="inner-circle">
            <span style="font-size: 16px; color:grey;">${totalConsumption} Litres Used</span>
            <span style="font-size: 14px; color:grey;">Info by </span>
            <span style="font-size: 18px;color:#40A2E3; font-weight:bold; font-style: italic;">Nimble Vision</span>

          </div>
        </div>
        <script>
        const ctx = document.getElementById('myChart').getContext('2d');
        const myChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ${JSON.stringify(labels)},
                datasets: [{
                    data: ${JSON.stringify(data)},
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.7)',
                        'rgba(54, 162, 235, 0.7)',
                        'rgba(255, 206, 86, 0.7)',
                        'rgba(75, 192, 192, 0.7)',
                        'rgba(255, 99, 132, 0.7)',
                        'rgba(54, 162, 235, 0.7)',
                        'rgba(255, 206, 86, 0.7)',
                        'rgba(75, 192, 192, 0.7)',
                        'rgba(255, 99, 132, 0.7)',
                        'rgba(54, 162, 235, 0.7)',
                        'rgba(255, 206, 86, 0.7)',
                        'rgba(75, 192, 192, 0.7)',
                        'rgba(255, 99, 132, 0.7)',
                        'rgba(54, 162, 235, 0.7)',
                        'rgba(255, 206, 86, 0.7)',
                        'rgba(75, 192, 192, 0.7)',
                        'rgba(255, 99, 132, 0.7)',
                        'rgba(54, 162, 235, 0.7)',
                        'rgba(255, 206, 86, 0.7)',
                        'rgba(75, 192, 192, 0.7)',
                        'rgba(255, 99, 132, 0.7)',
                        'rgba(54, 162, 235, 0.7)',
                        'rgba(255, 206, 86, 0.7)',
                        'rgba(75, 192, 192, 0.7)',
                    ],
                    borderColor: 'rgba(255,255,255,1)',
                    borderWidth: 3
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutoutPercentage: 40, // Decreased to make the doughnut sections thicker
                legend: {
                    display: false
                },
                tooltips: {
                    enabled: false // Disable tooltips
                },
                
                plugins: {
                    datalabels: {
                        color: '#000',
                        textAlign: 'center',
                        font: {
                            weight: 'bold'
                        },
                        formatter: (value, ctx) => {
                            return ctx.chart.data.labels[ctx.dataIndex] + '\\n' + value + 'L';
                        }
                    }
                }
            }
        });
        </script>
        </body>
        </html>
        `;
    };
    const handleClose=()=>{
      setModalVisible(false);
      setShowWave(true); // Show the wave after closing the modal
     }
    return (
        <View style={[styles.consumptionContainer,{height:tankId===1?400:400}]}>
            {/* <Text style={styles.consumptionTitle}>Total Consumption: {totalConsumption}</Text> */}
            <CustomModal visible={modalVisible} errorMsg={errorMsg} onClose={handleClose} />

            {showWave && <Text style={styles.consumptionTitle}> {todayDate}</Text> }
            {showWave &&<WebView 
              originWhitelist={['*']} 
              source={{ html: getChartHtml() }} 
              style={{ height: 300 }} 
            /> }
            {/* <ScrollView style={{flexGrow: 1}} scrollEnabled={true}>
                {consumptionDetails.map((item, index) => (
                    <View key={index} style={styles.consumptionDetailRow}>
                        <Text style={styles.consumptionDetailText}>{item.created_at}, {item.onehrs} Litres</Text>
                    </View>
                ))}
            </ScrollView> */}
            <View style={{marginBottom: tankId===1?-20:-10}}></View>
        </View>
    );
};

export default DailyTotalConsumption;
