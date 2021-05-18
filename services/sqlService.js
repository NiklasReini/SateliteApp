import * as React from 'react';
import * as SQLite from 'expo-sqlite';



const db = SQLite.openDatabase('satelite.db');

  const makeDB = () => {
    db.transaction(tx => {
        tx.executeSql('create table if not exists satelite (id integer primary key not null, coords int, title name);');
      });
  }

  const deleteItems = () => {
    db.transaction(
      tx => {tx .executeSql('DELETE from satelite;');})
      return([]);
  }

  const saveRecents = (coordObject) => {
    db.transaction(
      tx => {tx .executeSql('insert into satelite (coords, title) values (?, ?);',
          [parseInt(coordObject.coords), coordObject.name]);
    }, null)
  }

  const sqlService = {
      deleteItems,
      saveRecents,
      makeDB
  }

export default sqlService;


