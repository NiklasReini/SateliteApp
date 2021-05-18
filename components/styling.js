import * as React from 'react';
import { StyleSheet } from 'react-native';


const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    button: {
      width: 90,
      height: 70,
    },
    list: {
      fontSize: 30,
      alignContent: 'center'
    }, 
    input: {
      margin: 10,
      padding: 4, 
      width: 300, 
      borderColor: '#4287f5', 
      borderRadius: 5, 
      fontSize: 20,
      borderBottomWidth: 5
    },
    item: {
      marginTop: 10,
      paddingRight: 20,
      paddingLeft: 20,
      width: 100,
      padding: 10,
      fontSize: 24,
      alignSelf: 'center',
      backgroundColor: '#4287f5',
      color: 'white',
      borderRadius: 5,
    }
  });

export default styles;