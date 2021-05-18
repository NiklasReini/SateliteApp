import * as React from 'react';
import MapView, {Marker} from 'react-native-maps';
import {Text, View, TextInput, Image, FlatList, KeyboardAvoidingView} from 'react-native';
import {Button, SearchBar} from 'react-native-elements'
import * as SQLite from 'expo-sqlite';
import styles from './components/styling'
import sqlService from './services/sqlService'
import * as Location from 'expo-location';



export default function App() {

  const db = SQLite.openDatabase('satelite.db');
  const [open, setOpen] = React.useState(false);
  const [URL, setURL] = React.useState('https://epic.gsfc.nasa.gov/archive/natural/2015/10/31/png/epic_1b_20151031074844.png');
  const [address, setAddress] = React.useState('');
  const [region, setRegion] = React.useState({latitude: -5.200692, longitude: 24.934302, latitudeDelta: 100, longitudeDelta: 100});
  const [recents, setRecents] = React.useState([]);
  const [location, setLocation] = React.useState(0);

  React.useEffect(() => {
    sqlService.makeDB();
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location.coords.longitude);
    })();
  }, []);


  const getCoords = (value) => {
    setOpen(true);
    fetch('https://epic.gsfc.nasa.gov/api/natural/date/2015-10-31')
    .then(response => response.json())
    .then(data => {
      let length = data.length
      let coordArray = new Array(length);
        for (var i = 0; i < length; i++) {
          coordArray.push(data[i].centroid_coordinates.lon);
        }

      let nearest = coordArray.reduce((a, b) => {
        return Math.abs(b - value) < Math.abs(a - value) ? b : a;
      })
    
      for (var i = 0; i < length; i++) {
        if (data[i].centroid_coordinates.lon == nearest) {
          setURL(`https://epic.gsfc.nasa.gov/archive/natural/2015/10/31/png/epic_1b_${[data[i].identifier]}.png`);
          sqlService.saveRecents({coords: nearest, key: data[i].identifier});
          updateList();
        }
      }
    });
  }

  const updateList = () => {
    db.transaction(tx => {
      tx.executeSql('select * from satelite;', [], (_, { rows }) =>
        setRecents(rows._array)
      ); 
    });
  }
  
  const getAdress = () => {
    fetch('http://www.mapquestapi.com/geocoding/v1/address?key=hh3nMDZrqEMo63qmBgzy6zIWCx6EmovB&location=' + address)
    .then(response => response.json())
    .then(data => {
      const longitude = data.results[0].locations[0].latLng.lng;
      setRegion({Latitude: 5.200692, longitude: longitude, latitudeDelta: 100, longitudeDelta: 100})
      getCoords(data.results[0].locations[0].latLng.lng);
      setCity(data.results[0].locations[0].adminArea5)
    });
  }

  return (
    <KeyboardAvoidingView 
      behavior='position'
      style={styles.container}
      keyboardVerticalOffset={20}
    >
      <View style={styles.container}>
        <View>
          {open == false && 
          <MapView style={{width: 400, height: 500}}
            region={{
              latitude: -5.200692,
              longitude: region.longitude,
              latitudeDelta: 100,
              longitudeDelta: 100,
            }}>
            <Marker coordinate={{
              latitude: -5.200692,
              longitude: region.longitude
            }}/>
          </MapView>} 

          {open == true && 
            <Image 
              source={{uri: URL}}
              style={{ width: 400, height: 300, marginBottom: 20, borderRadius: 20 }}
            />}
      </View>    

      {open == false &&
        <View>
          <TextInput 
            placeholder='Enter address or city name...'
            style={styles.input}
            onChangeText={address => setAddress(address)}
          />
        </View>}

      <View style={{justifyContent: 'space-around', flexDirection: 'row', width: 300}}>

        {open ? (
          <Button 
            buttonStyle={styles.button} 
            title="Show another" 
            onPress={() => setOpen(false)}/>
        ) : (
          <Button 
            buttonStyle={styles.button} 
            title="Show" 
            onPress={() => getAdress()}
          />)}
          <Button 
            buttonStyle={styles.button} 
            title="from location" 
            onPress={() => getCoords(location)}
          />  
          <Button 
            buttonStyle={styles.button} 
            title="delete list" 
            onPress={() => setRecents(sqlService.deleteItems())}
          />
      </View>
        <View>
          <Text style={{fontSize: 20, marginTop: 10}}>Last longitudes</Text>
          <View>
            <FlatList 
              style={styles.list} 
              data={recents}
              renderItem={({ item }) => (
                <Text style={styles.item}>{item.coords}</Text>
              )}
              keyExtractor={(item, index) => index.toString()}
          />
      </View>
      </View>
    </View>
  </KeyboardAvoidingView>
  );
}




