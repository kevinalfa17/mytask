import { Platform } from 'ionic-angular';
import { Component, NgZone } from '@angular/core';
//import { InAppBrowser } from '@ionic-native/in-app-browser';
import { ProfilePage } from '../profile/profile'
import { ProfileData } from '../../providers/profile-data';
import firebase from 'firebase'
import { GooglePlus } from '@ionic-native/google-plus';

declare const gapi: any;


@Component({
  selector: 'googleCalendar',
  templateUrl: 'googleCalendar.html',
})

export class GoogleCalendar {
  calendarEvent: any = {};

  attendees = [{
    email: ""
  }];

  validation: any = {};

  tok: string;

  //<script src="https://apis.google.com/js/client.js?onload=init"></script>
  googleAuth = 'https://accounts.google.com/o/oauth2/device/code';

  CLIENT_ID = '919226115038-i4pn4k2avmqfkt4kkecm30oq54b0rbfp.apps.googleusercontent.com';
  CLIENT_ID_AN = '919226115038-f93ctscn6nfr50b1b58ad4e34lbsfcsm.apps.googleusercontent.com';
  SCOPES = ["https://www.googleapis.com/auth/calendar"];
  APIKEY = "AIzaSyBJhYl15v4K2fy99k-m9Q-kQbxjx4bsIxU";
  REDIRECTURL = "https://project-10af2.firebaseapp.com/__/auth/handler";

  constructor( public platform: Platform, public profileData: ProfileData, public google: GooglePlus) { }


  sendInvite() {
    ///////////////////////////////////////////////////////////////////////////////////////////////////////
    if (!this.validate()) {
      alert("Please fill all fields for sending invite.");
      return;
    }
    this.validation.failure = false;
    var startDateTimeISO = this.buildISODate(this.calendarEvent.startDate, this.calendarEvent.startTime);
    var enddateTimeISO = this.buildISODate(this.calendarEvent.endDate, this.calendarEvent.endTime);
    this.popLastAttendeeIfEmpty(this.attendees);
    if (this.platform.is('android')) {
      var browserRef = window.open('https://accounts.google.com/o/oauth2/auth?client_id=' + this.CLIENT_ID_AN + '&redirect_uri=' + this.REDIRECTURL + '&scope=https://www.googleapis.com/auth/calendar&approval_prompt=force&response_type=token', '_blank', 'location=no');
    } else {
      var browserRef = window.open('https://accounts.google.com/o/oauth2/auth?client_id=' + this.CLIENT_ID + '&redirect_uri=' + this.REDIRECTURL + '&scope=https://www.googleapis.com/auth/calendar&approval_prompt=force&response_type=token', '_blank', 'location=no');
    }
    alert('ggggggggg');

    browserRef.addEventListener("loadstart", (event) => {
      if ((event["url"]).indexOf(this.REDIRECTURL) === 0) {
        var url = event["url"];
        var token = url.split('access_token=')[1].split('&token_type')[0];

        browserRef.removeEventListener("exit", (event) => { });
        browserRef.close();

        //Sending the google calendar invite from the google api
        gapi.client.setApiKey(this.APIKEY);
        var request = gapi.client.request({
          'path': '/calendar/v3/calendars/primary/events?alt=json',
          'method': 'POST',
          'headers': {
            'Authorization': 'Bearer' + token
          },
          'body': JSON.stringify({
            "summary": this.calendarEvent.name,
            "location": this.calendarEvent.location,
            "description": this.calendarEvent.description,
            "start": {
              "dateTime": startDateTimeISO,
              "timeZone": "Asia/Kolkata"
            },
            "end": {
              "dateTime": enddateTimeISO,
              "timeZone": "Asia/Kolkata" // TODO : Parameterize this timezone
            },
            "recurrence": [
              "RRULE:FREQ=DAILY;COUNT=1"
            ],
            "attendees": this.attendees,
            "reminders": {
              "useDefault": false,
              "overrides": [
                {
                  "method": "email",
                  "minutes": 1440
                },
                {
                  "method": "popup",
                  "minutes": 10
                }
              ]
            }
          }),
          'callback': function (jsonR, rawR) {
            if (jsonR.id) {
              alert("Invitation sent successfully");
            } else {
              alert("Failed to sent invite.");
            }
            console.log(jsonR);
          }
        });
      }
    });
    ///////////////////////////////////////////////////////////////////////////////////////////////////////
  }

  temp() {
    // var browserRef = window.open('https://accounts.google.com/o/oauth2/auth?client_id=' + this.CLIENT_ID + '&redirect_uri=' + this.REDIRECTURL + '&scope=https://www.googleapis.com/auth/calendar&approval_prompt=force&response_type=token', '_blank', 'location=no');
    gapi.client.setApiKey(this.APIKEY);

     var provider = new firebase.auth.GoogleAuthProvider();
   firebase.auth().signInWithPopup(provider).then((newUser) => {
      this.tok = newUser.displayName;
       });
   alert(this.tok);



    gapi.client.load('calendar', 'v3', function () {
      var request = gapi.client.calendar.events.insert({
        "calendarId": "primary",
        'Authorization': 'Bearer ' + this.tok,
        resource: {
          "summary": "Appointment",
          "location": "Somewhere",
          "start": {
            "dateTime": "2017-01-01T10:00:00.000-07:00"
          },
          "end": {
            "dateTime": "2017-01-01T10:25:00.000-07:00"
          }
        }
      });
    });

  }

  buildISODate(date, time) {
    var dateArray = date && date.split('-');
    var timeArray = time && time.split(':');
    var normalDate = new Date(parseInt(dateArray[0]), parseInt(dateArray[1]) - 1, parseInt(dateArray[2]), parseInt(timeArray[0]), parseInt(timeArray[1]), 0, 0);
    return normalDate.toISOString();
  }

  addAttendees() {
    if (this.attendees[this.attendees.length - 1].email == '') return;
    var newAttendee = { email: "" };
    this.attendees.unshift(newAttendee);
  }

  removeAttendees(itemIndex) {
    this.attendees.splice(itemIndex, 1);
  }

  popLastAttendeeIfEmpty(itemsList) {
    if (!!itemsList.length) {
      return itemsList[0]["email"] == "" ? itemsList.shift(itemsList[0]) : itemsList;
    }
    return [];
  }

  validate() {
    return this.isStringValid(this.calendarEvent.name) &&
      this.isStringValid(this.calendarEvent.name) &&
      this.isStringValid(this.calendarEvent.location) &&
      this.isStringValid(this.calendarEvent.description) &&
      this.isStringValid(this.calendarEvent.startDate) &&
      this.isStringValid(this.calendarEvent.startTime) &&
      this.isStringValid(this.calendarEvent.endDate) &&
      this.isStringValid(this.calendarEvent.endTime) &&
      this.areAttendeesValid(this.attendees);
  }

  isStringValid(str) {
    if (typeof str != 'undefined' && str) {
      return true;
    };
    return false;
  }

  areAttendeesValid(attendees) {
    if (attendees.length == 1 && !this.isStringValid(attendees[0]["email"])) {
      return false;
    }
    return true;
  }
}
