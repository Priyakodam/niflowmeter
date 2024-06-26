import { StyleSheet } from 'react-native';
import { responsiveHeight, responsiveFontSize, responsiveWidth } from 'react-native-responsive-dimensions';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: responsiveHeight(2),
    paddingHorizontal: responsiveWidth(4),
    backgroundColor: '#fff',
  },
  title: {
    fontSize: responsiveFontSize(2.5),
    fontWeight: 'bold',
    marginBottom: responsiveHeight(2),
    textAlign: 'center',
  },
  chartContainer: {
    flex: 0.8, // Adjust the flex value to decrease the height
  },
  chart: {
    flex: 1,
  },
});
