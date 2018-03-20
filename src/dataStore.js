'use strict';

import React from 'react';
import _     from 'lodash';

import {
  AsyncStorage
} from 'react-native' ;


import packageJson from '../package.json';

const DAYS_OF_WEEK = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

let fetchOptions = {
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
};


// this needs to exist in case an EventItem is rendered before todos are created

export default class DataStore {

  constructor(cb) {
    Promise.all([
      this._fetchFromStorage(),
      this._fetchFromNetwork(),
      this._fetchTodos()
    ]).then(results => {
      let msg = "";
      let storageData = results[0];
      let networkData = results[1];
      let todosData   = results[2];
      let con_data = {};

      if (!todosData) {
        todosData = new Set();
      }

      if (storageData && networkData) {
        // we have both, take whichever is newer
        if (storageData.updated >= networkData.updated) {
          msg = "No schedule updates found.";
          con_data = storageData;
        } else {
          msg = "Found schedule updates. Loading...";
          con_data = networkData;
          dataStore.saveToStorage(con_data);
        }
      } else if (storageData) {
        // network failure, use stored data
        con_data = storageData;
        msg = "No Internet connection. Using stored data from device.";
      } else if (networkData) {
        // first time we are running the app, download from network
        con_data = networkData;
        msg = "First time using app. Downloading schedule data...";
        dataStore.saveToStorage(con_data);
      } else {
        // first time we are running the app, and we have no connection. Bummer.
        msg = "First time, no connection";
      }

      this._data = con_data;
      this._data.guests = _.sortBy(this._data.guests, 'name');
      this._data.todos = todosData;
      let all_events = [];
      Object.keys(this._data.events).forEach(k => {
        all_events = all_events.concat(this._data.events[k]);
      });
      all_events = _.sortBy(all_events, ["day", "time"]).map(e => {
        let momentDate = moment(e.day+e.time, "YYYY-MM-DDThh:mm:ss");
        e.momentDate = momentDate;
        e.formattedDate = momentDate.format('dddd h:mma'); // "Friday 2:30pm"
        e.dayOfWeek = DAYS_OF_WEEK[momentDate.day()];
        return e;
      });
      this._data.sortedEvents = all_events;

      cb({
        msg: msg
      });
    }).done();
  }

  _fetchFromNetwork() {
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
  }

  _fetchFromStorage() {
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

  saveToStorage(data) {
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
  }

  _fetchTodos() {
    return new Promise((resolve, reject) => {
      AsyncStorage.getItem('todo')
        .then(resp => {
          let todos = new Set(JSON.parse(resp));
          resolve(todos);
        })
        .catch(e => {
          global.makeToast("Error fetching to-do list", "error");
          resolve(false);
        })
        .done();
    });
  }


  addTodo(item) {
    this._data.todos.add(item);
    this._saveTodos();
  }

  getAllEvents() {
    return this._data.sortedEvents;
  }

  getContent(key) {
    return this._data.content[key];
  }

  getConName() {
    return this._data.name;
  }

  getDimension(key) {
    return this._data.dimensions[key];
  }

  getEventById(event_id) {
    let ev = _.find(this.getAllEvents(), e => (e.event_id === event_id));
    if (!ev) {
      throw new Error("Event not found!");
    }
    return ev;
  }

  getEventsForGuest(guest_id) {
    return this._data.events
      .filter(e => _.includes(e.guest_list, guest_id))
      .map(e => e.event_id);
  }

  getGuests() {
    return this._data.guests;
  }

  getGuestById(guest_id) {
    let guest = this._data.guests.filter(g => (g.guest_id === guest_id))[0];
    if (!guest) {
      throw new Error("Guest not found");
    }
    return guest;
  }
  
  getImage(key) {
    return this._data.images[key];
  }

  getTodos() {
    return this._data.todos;
    this._fetchTodos()
      .then(todos => {
        let todosArray = Array.from(todos);
        todosArray = _(todosArray).map(todo => {
          return _.find(global.con_data.events, e => e.event_id === todo);
        }).filter(todo => !!todo).sortBy(["day", "time"]).value();

        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(todosArray),
          todoCount: todosArray.length
        });
      }).done();
  }

  getTracks() {
    // TODO: priority
    return Object.keys(this._data.events);
  }

  removeTodo(item) {
    this._data.todos.delete(item);
    this._saveTodos();
  }

  searchEvents(text) {
    const results = this._data.sortedEvents.filter(e => {
      return e.title.toLowerCase().indexOf(text.toLowerCase()) > -1;
    });
    return results;
  }

  _saveTodos() {
    let todo_array = Array.from(this._data.todos);
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
