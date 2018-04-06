import _      from 'lodash';
import moment from 'moment';
import React  from 'react';

import {
  AsyncStorage
} from 'react-native' ;


import packageJson from '../package.json';

const DAYS_OF_WEEK = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const DEFAULT_VENUE = {
  name: "",
  address: [],
  phone: "",
  maps_url: ""
};
const DEFAULT_COLORS = {
  "border": "#DDD",
  "headerBg": "#4270a9",
  "highlight": "#1C8BAD",
  "highlightDark": "#0e5166",
  "highlightAlt": "#C83",
  "feedbackBtn": "#678"
};

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
        todosData = [];
      }

      if (storageData && networkData) {
        // we have both, take whichever is newer
        if (storageData.updated >= networkData.updated) {
          msg = "No schedule updates found.";
          con_data = storageData;
        } else {
          msg = "Found schedule updates. Loading...";
          con_data = networkData;
          this.saveToStorage(con_data);
        }
      } else if (storageData) {
        // network failure, use stored data
        con_data = storageData;
        msg = "No Internet connection. Using stored data from device.";
      } else if (networkData) {
        // first time we are running the app, download from network
        con_data = networkData;
        msg = "First time using app. Downloading schedule data...";
        this.saveToStorage(con_data);
      } else {
        // first time we are running the app, and we have no connection. Bummer.
        msg = "First time, no connection";
      }

      this._data = con_data;
      this._data.guests = _.sortBy(this._data.guests, 'name');
      this._data.todoSet = new Set(todosData);
      let all_events = [];
      Object.keys(this._data.tracks).forEach(k => {
        all_events = all_events.concat(this._data.tracks[k].events || []);
      });
      all_events = _.sortBy(all_events, ["day", "time"]).map(this._hydrateEvent);
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
  }

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

  // Add calculated fields an event.
  // Remember to keep this idempotent.
  _hydrateEvent(e) {
    let momentDate = moment(e.day+e.time, "YYYY-MM-DDThh:mm:ss");
    e.momentDate = momentDate;
    e.formattedDateTime = momentDate.format('dddd h:mma'); // "Friday 2:30pm"
    e.dayOfWeek = DAYS_OF_WEEK[momentDate.day()];
    return e;
  }

  addTodo(item) {
    this._data.todoSet.add(item);
    this._saveTodos();
  }

  getAllEvents() {
    // already hydrated
    return this._data.sortedEvents;
  }

  getColor(key) {
    if (this._data.colors) {
      return this._data.colors[key];
    } else {
      return DEFAULT_COLORS[key];
    }
  }

  getContent(key) {
    return this._data.content[key];
  }

  getVenueInfo() {
    return Object.assign({}, DEFAULT_VENUE, this._data.venue);
  }

  getConName() {
    return this._data.name;
  }

  getDefaultTrack() {
    return this._data.tracks.filter(tr => !!tr.default)[0].name || "";
  }

  getDimension(key) {
    return this._data.dimensions[key];
  }

  getEventById(event_id) {
    let ev = _.find(this.getAllEvents(), e => (e.event_id === event_id));
    if (!ev) {
      console.warn("Event ["+event_id+"] not found!");
      return null;
    }
    return ev;
  }

  getEventsByTrack(trackName) {
    let track = _.find(this._data.tracks, tr => trackName === tr.name);
    let events = [];
    if (track && track.events) {
       events = _.sortBy(track.events, ["day", "time"]).map(this._hydrateEvent);
    } else {
      console.warn("Empty track!", trackName);
    }
    return events;
  }

  getEventsForGuest(guest_id) {
    return this._data.sortedEvents
      .filter(e => _.includes(e.guests, guest_id))
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

  getTodosArray() {
    let todos = Array.from(this._data.todoSet);
    todos = todos.map(this.getEventById.bind(this)).filter(t => !!t);
    todos = _.sortBy(todos, ["day", "time"]);
    return todos;
  }

  getTrackNames() {
    return _.sortBy(this._data.tracks.map(ev => ev.name));
  }

  isTodo(event_id) {
    return this._data.todoSet.has(event_id);
  }

  removeTodo(item) {
    this._data.todoSet.delete(item);
    this._saveTodos();
  }

  searchEvents(text) {
    const results = this._data.sortedEvents.filter(e => {
      return e.title.toLowerCase().indexOf(text.toLowerCase()) > -1;
    });
    return results;
  }

  _saveTodos() {
    let todo_array = Array.from(this._data.todoSet);
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
