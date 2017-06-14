import { Platform } from 'ionic-angular';
import { Component, NgZone } from '@angular/core';
//import { InAppBrowser } from '@ionic-native/in-app-browser';
import firebase from 'firebase'

declare const gapi: any;


@Component({
  selector: 'googleCalendar',
  templateUrl: 'googleCalendar.html',
})

export class GoogleCalendar {
  calendarEvent: any = {};
  attendees = [{email: ""}];

  CLIENT_ID = '919226115038-i4pn4k2avmqfkt4kkecm30oq54b0rbfp.apps.googleusercontent.com';
  CLIENT_ID_AN = '919226115038-f93ctscn6nfr50b1b58ad4e34lbsfcsm.apps.googleusercontent.com';
  SCOPES = ["https://www.googleapis.com/auth/calendar"];
  APIKEY = "AIzaSyBJhYl15v4K2fy99k-m9Q-kQbxjx4bsIxU";
  REDIRECTURL = "http://localhost/callback";

  constructor(public platform: Platform) { }


  sendInvite(Name: string, location: string, description: string, startDate: string, endDate: string, attendeesR: any) {
    this.attendees.push(attendeesR);
    this.popLastAttendeeIfEmpty(this.attendees);

    if (this.validate(Name) && this.validate(location) && this.validate(description) && this.validate(startDate) && this.validate(endDate)) {

      var browserRef = window.open('https://accounts.google.com/o/oauth2/auth?client_id=' + this.CLIENT_ID + '&redirect_uri=' + this.REDIRECTURL + '&scope=https://www.googleapis.com/auth/calendar&approval_prompt=force&response_type=token', '_blank', 'location=no');
      browserRef.addEventListener("loadstart", (event) => {

        if ((event["url"]).indexOf(this.REDIRECTURL) === 0) {
          var url = event["url"];
          var token = url.split('access_token=')[1].split('&token_type')[0];
          browserRef.removeEventListener("exit", (event) => { });
          browserRef.close();
          //Sending the google calendar invite from the google api
          gapi.client.setApiKey(this.APIKEY);
          var request = gapi.client.request({
            'path': '/calendar/v3/calendars/primary/events',
            'method': 'POST',
            'headers': {
              'Authorization': 'Bearer ' + token
            },
            'body': JSON.stringify({
              'summary': Name,
              'location': location,
              'description': description,
              'start': {
                'dateTime': startDate,//'2017-07-28T09:00:00-07:00',
                'timeZone': 'America/Los_Angeles',
              },
              'end': {
                'dateTime': endDate, //'2017-07-28T17:00:00-07:00',
                'timeZone': 'America/Los_Angeles',
              },
              'recurrence': [
                'RRULE:FREQ=DAILY;COUNT=2'
              ],
              'attendees': this.attendees, //[{ 'email': 'jgon.peralta@gmail.com' }],
              'reminders': {
                'useDefault': false,
                'overrides': [
                  { 'method': 'email', 'minutes': 24 * 60 },
                  { 'method': 'popup', 'minutes': 10 },
                ],
              },
            }),

            'callback': function (jsonR, rawR) {
              if (jsonR.id) {
                console.log("Invitation sent successfully");
                alert("Invitation sent successfully");
              } else {
                alert("Failed to sent invite.");
              }
              console.log(jsonR);
            }
          });
        }
      });
    } else {
      alert("Posee una variable invalida para el request");
    }
  }
  addAttendees(Nuevo:string) {
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

  validate(value: string) {
    return this.isStringValid(value);
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