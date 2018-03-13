'use strict';

import React from 'react';
import _     from 'lodash';

import {
  AsyncStorage
} from 'react-native' ;


import packageJson from '../package.json';


let fetchOptions = {
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
};


// this needs to exist in case an EventItem is rendered before todos are created
global.todos = new Set();


export default {

  fetchFromNetwork: () => {
    return new Promise((resolve, reject) => {
      console.log("Fetching from", packageJson.CON_INFO_URL);
      fetch(packageJson.CON_INFO_URL, fetchOptions)
        .then(resp => resp.json())
        .then(data => {
          resolve(data);
        })
        .catch(e => {
          console.error(e);
          resolve(false);
        })
        .done();
    });
  },

  fetchFromStorage: () => {
    return new Promise((resolve, reject) => {
      AsyncStorage.getItem('con_data')
        .then(resp => {
          resolve(JSON.parse(resp));
        })
        .catch(e => {
          resolve(false);
        })
        .done();
    });
  },

  saveToStorage: (data) => {
    return new Promise((resolve, reject) => {
      let str = JSON.stringify(data);
      AsyncStorage.setItem('con_data', str)
        .then(resp => {
          resolve(true);
        })
        .catch(e => {
          resolve(false);
        })
        .done();
    });
  },

  fetchTodos: () => {
    return new Promise((resolve, reject) => {
      AsyncStorage.getItem('todo')
        .then(resp => {
          let todos = new Set(JSON.parse(resp));
          global.todos = todos;
          resolve(todos);
        })
        .catch(e => {
          global.makeToast("Error fetching to-do list", "error");
          resolve(false);
        })
        .done();
    });
  },

  saveTodos: () => {
    let todo_array = Array.from(global.todos);
    console.log("saving todos");
    AsyncStorage.setItem('todo', JSON.stringify(todo_array))
      .then(resp => {
        console.log("saving "+todo_array.length+" todos", resp);
      })
      .catch(e => {
        global.makeToast("Error saving to-do list", "error");
        resolve(false);
      })
      .done();
  }

}
