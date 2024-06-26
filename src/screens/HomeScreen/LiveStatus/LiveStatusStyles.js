import { StyleSheet, Dimensions } from 'react-native'; 
import { responsiveHeight, responsiveFontSize } from 'react-native-responsive-dimensions';
const { width: screenWidth } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    marginTop: responsiveHeight(0.5),
    marginBottom: responsiveHeight(10), 
  },
  tankContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: responsiveHeight(0.5),

    padding: responsiveHeight(1),
    backgroundColor: '#e91e63',
  },
  tankName: {
    color: 'white',
    fontSize: responsiveFontSize(3),
  },
  percentageContainer: {
    alignItems: 'center',
    marginTop: responsiveHeight(2),
     height: Dimensions.get('window').height/ 1.7
  },
 
  percentage: {
    // position:'absolute',
    color: 'black',
    fontSize: responsiveFontSize(6),
    textAlign: 'center',
    marginTop: responsiveHeight(20), 
    zIndex:40,
    
  },
  waveStyle: {
    width:screenWidth,
    height: responsiveHeight(18), 
    marginBottom: responsiveHeight(2), 
    marginTop: responsiveHeight(2), 
  },
});

export default styles;
