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

// not a real guid, but good enough for us
function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + s4();
}


// this needs to exist in case an EventItem is rendered before todos are created

export default class DataStore {

  constructor(cb) {
    Promise.all([
      this._fetchFromStorage(),
      this._fetchFromNetwork(),
      this._fetchTodos(),
      this._fetchSettings()
    ]).then(results => {
      let msg = "";
      let storageData = results[0];
      let networkData = results[1];
      let todosArray  = results[2];
      let settingsObj = results[3];
      let con_data = {};

      if (!todosArray) {
        todosArray = [];
      }
      if (!settingsObj) {
        settingsObj = {};
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

      todosArray = todosArray.map(item => {
        if (typeof item === 'string') {
          return {
            event_id: item
          }
        } else {
          return item;
        }
      });
      
      this._data.todos = todosArray;
      this._data.settings = settingsObj;

      let all_events = [];
      this._data.tracks.forEach(track => {
        track.events.forEach(ev => {
          ev.trackName = track.name;
        });
        all_events = all_events.concat(track.events || []);
      });
      all_events = _.sortBy(all_events, ["day", "time"]).map(this._hydrateEvent);
      this._data.sortedEvents = all_events;
      this._data.guests = this._data.guests.map(g => {
        let parts = g.name.split(' ');
        let l = parts[parts.length-1];
        parts.pop();
        g.last_name_first = l+', '+parts.join(' ');
        g.event_count = this.getEventsForGuest(g.guest_id).length;
        return g;
      });

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

  _fetchSettings() {
    return new Promise((resolve, reject) => {
      AsyncStorage.getItem('settings')
        .then(resp => {
          let settings = {};
          try {
            settings = JSON.parse(resp);
          } catch(e) {
            console.error(e);
          }
          resolve(settings);
        })
        .catch(e => {
          global.makeToast("Error fetching settings", "error");
          resolve(false);
        })
        .done();
    });
  }

  _fetchTodos() {
    return new Promise((resolve, reject) => {
      AsyncStorage.getItem('todo')
        .then(resp => {
          let todos = [];
          try {
            todos = JSON.parse(resp);
          } catch(e) {
            console.error(e);
          }
          resolve(todos);
        })
        .catch(e => {
          global.makeToast("Error fetching to-do list", "error");
          resolve(false);
        })
        .done();
    });
  }

  _saveSettings() {
    let settings = this._data.settings;
    AsyncStorage.setItem('settings', JSON.stringify(settings))
      .then(resp => {
        console.log("saving settings");
      })
      .catch(e => {
        global.makeToast("Error saving settings", "error");
      })
      .done();
  }

  _saveTodos() {
    let todos = this._data.todos;
    AsyncStorage.setItem('todo', JSON.stringify(todos))
      .then(resp => {
        console.log("saving "+todos.length+" todos");
      })
      .catch(e => {
        global.makeToast("Error saving to-do list", "error");
      })
      .done();
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

  addCustomTodo(custom) {
    custom.event_id = guid();
    custom.custom = true;
    this.addTodo(custom);
  }

  addTodo(item) {
    this._data.todos.push(item);
    this._saveTodos();
  }

  changeTodo(item) {
    this._data.todos = this._data.todos.map(todo => {
      if (todo.event_id === item.event_id) {
        Object.assign(todo, item);
      }
      return todo;
    });
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

  getSortedContentItems() {
    return _.sortBy(this._data.more_content, 'sort_priority');
  }

  getContentByLabel(label) {
    const content = this._data.more_content.filter(page => page.label === label);
    if (content.length === 1) {
      return content[0];
    } else {
      return { content_sections: ['<p>Error</p>'] };
    }
  }

  getContentPages() {
    return this._data.more_content;
  }

  /**
   *  Returns an array of Moment days corresponding to the dates the
   *  convention operates.
   *  offsetByOne: Return an extra day
   *  either side of the start/end dates.
   *  Used for to-do lists
   */
  getConDays(offsetByOne) {
    let currentDay = null;
    let dayArray = [];
    let conDays = this._data.sortedEvents.forEach(e => {
      if (e.day !== currentDay) {
        dayArray.push(e.day);
      }
      currentDay = e.day;
    });
    if (offsetByOne) {
      let prev = moment(dayArray[0]).subtract(1, 'day').format('YYYY-MM-DD');
      dayArray.unshift(prev);
      let next = moment(dayArray[dayArray.length-1]).add(1, 'day').format('YYYY-MM-DD');
      dayArray.push(next);
    }
    return dayArray;
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

  /**
   *  Find and return the first valid event, whether it's from the calendar
   *  or the custom list.
   */
  getEventById(event_id) {
    let foundEvent = _.find(this.getAllEvents(), e => e.event_id === event_id);
    // Do not use getTodosArray here, as that uses getEventById
    let foundTodo  = _.find(this._data.todos, e => e.event_id === event_id);

    let ev = null;

    if (foundEvent && foundTodo) {
      // a calendar event with custom fields
      ev = Object.assign({}, foundEvent, foundTodo);
      // console.log("getEventById found a customized calendar event.", ev);
    } else if (foundEvent && !foundTodo) {
      // just a plain calendar event
      ev = foundEvent;
      // console.log("getEventById found a regular calendar event.", ev);
    } else if (!foundEvent && foundTodo) {
      // it's custom event
      ev = foundTodo;
      // console.log("getEventById found a todo.", ev);
    } else {
      console.warn("Event ["+event_id+"] not found!");
    }
    return this._hydrateEvent(ev);
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

  getGuests(sortField) {
    let guests = _.sortBy(this._data.guests, sortField || 'name');
    return guests;
  }

  getGuestById(guest_id) {
    let guest = this._data.guests.filter(g => (g.guest_id === guest_id))[0];
    if (!guest) {
      throw new Error("Guest not found");
    }
    return guest;
  }

  getHeaderPhotos() {
    return this._data.header_photos;
  }
  
  getImage(key) {
    return this._data.images[key];
  }

  getSettings() {
    return this._data.settings;
  }

  getTodosArray() {
    let arr = this._data.todos
      .map(todo => this.getEventById(todo.event_id))
      .filter(todo => !!todo.event_id);
    return arr;
  }

  getTrackNames() {
    return _.sortBy(this._data.tracks.map(ev => ev.name));
  }

  isTodo(event_id) {
    return !!_.find(this._data.todos, ev => event_id === ev.event_id);
  }

  removeTodo(event_id) {
    _.pullAllBy(this._data.todos, [{ event_id: event_id }], 'event_id');
    this._saveTodos();
  }

  searchEvents(text) {
    const results = this._data.sortedEvents.filter(e => {
      return e.title.toLowerCase().indexOf(text.toLowerCase()) > -1;
    });
    return results;
  }

  updateSettings(obj) {
    Object.assign(this._data.settings, obj);
    this._saveSettings();
  }
}
