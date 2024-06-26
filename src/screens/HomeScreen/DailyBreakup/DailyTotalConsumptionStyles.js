
import { StyleSheet } from 'react-native';
import { responsiveHeight, responsiveFontSize } from 'react-native-responsive-dimensions';

const styles = StyleSheet.create({
    consumptionContainer: {
        backgroundColor: 'white',
        borderRadius: 5,
        marginTop: responsiveHeight(1), 
    },
    consumptionTitle: {
        fontSize: responsiveFontSize(2.2), 
        marginBottom: responsiveHeight(1), 
        textAlign: 'center'
    },
    consumptionDetailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: responsiveHeight(0.6), 
    },
    consumptionDetailText: {
        fontSize: responsiveFontSize(2), 
    },
});

export default styles;
