import { Injectable } from '@angular/core';
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
import { ProfileData } from "./profile-data";
import 'rxjs/add/operator/map';
import moment from 'moment';

declare const gapi: any;

@Injectable()
export class TaskProvider {

  calendarEvent: any = {};
  // attendees = [{ email: "" }];
  attendees = [];

  CLIENT_ID = '919226115038-i4pn4k2avmqfkt4kkecm30oq54b0rbfp.apps.googleusercontent.com';
  CLIENT_ID_AN = '919226115038-f93ctscn6nfr50b1b58ad4e34lbsfcsm.apps.googleusercontent.com';
  SCOPES = ["https://www.googleapis.com/auth/calendar"];
  APIKEY = "AIzaSyBJhYl15v4K2fy99k-m9Q-kQbxjx4bsIxU";
  REDIRECTURL = "http://localhost/callback";

  contactsList: FirebaseListObservable<any[]>;

  constructor(public af: AngularFire, public up: ProfileData) {
    console.log('Hello TaskProvider Provider');
  }


  getTasks() {
    let tasks = this.af.database.list(`/userProfile/${this.up.currentUser.uid}/tasks`, {
      query: {
        orderByChild: 'reversePriority',
      }
    });
    return tasks;
  }


  getTask(key) {
    let task = this.af.database.object(`/userProfile/${this.up.currentUser.uid}/tasks/${key}`);
    return task
  }

  getDelegatedTasks() {

    let delegatedTasks = this.af.database.list(`/userProfile/${this.up.currentUser.uid}/delegatedTasks`, );
    return delegatedTasks;
  }


  addNewTask(responsable, taskname, type, subtype, startDate, startTime, repeat,
    recurrence, endTime, priority, notifications, files, comments, permissons, haveImage, alarm) {
    permissons.push(this.up.currentUser.email);
    let task = {
      creatorid: this.up.currentUser.uid,
      responsable: "",
      taskName: taskname,
      type: type,
      subtype: subtype,
      startDay: startDate,
      startTime: startTime,
      repeat: repeat,
      recurrence: recurrence,
      endTime: endTime,
      priority: priority,
      reversePriority: (6 - priority),
      notifications: notifications,
      files: files,
      comments: comments,
      permissons: permissons,
      status: 0,
      haveImage: haveImage,
      alarm: alarm,
      phone: 0

    };

    let delegatedTask = {
      creatorid: this.up.currentUser.uid,
      responsable: "",
      taskName: taskname,
      type: type,
      startDay: startDate,
      startTime: startTime,
      repeat: repeat,
      recurrence: recurrence,
      endTime: endTime,
      status: 0,
      alarm: alarm,
      phone: 0
    };

    responsable.forEach((user) => {

      task.responsable = user;
      var key = this.af.database.list(`/tasks`).push(task).key;
      this.up.insertTask(user, key, "tasks", task);
      this.up.insertNotification(user, comments, taskname, type, this.up.currentUser.uid, key, "");

      delegatedTask.responsable = user;
      //this.up.insertTask(this.up.currentUser.email, key, "delegatedTasks", delegatedTask);
      permissons.forEach((user2) => {
        this.up.insertTask(user2, key, "delegatedTasks", task);
      });

    });

  };
  /**
   * This function it's used to send a invitation and create a new event in Google Calendar
   * @param Name The name of the event
   * @param location The location of the event
   * @param description The description of the event
   * @param startDate The start date of the event
   * @param endDate The end date of the event
   * @param attendeesR The attendees of the event
   */
  sendInvite(Name: string, location: string, description: string, startDate: string, endDate: string, attendeesR: any) {
    this.addListAttendees(attendeesR);

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
              // 'recurrence': [
              //   'RRULE:FREQ=' +repetirFreq + ';' + 'COUNT='+repetirCount //DAILY;COUNT=2'
              // ],
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

  /**
   * It's used to put in the correct form all the attendees
   * @param attendeesR The list of emails to put in structure
   */
  addListAttendees(attendeesR: any) {
    let tem = [];
    var ltem = attendeesR.length;
    var i = 0;
    while (i < ltem) {
      var newAttendee = { email: attendeesR[i] };
      this.attendees.push(newAttendee);

      i = i + 1;
    }
  }

  /**
   * Check if one of the values ir empty
   * @param value The value to check
   */
  validate(value: string) {
    return this.isStringValid(value);
  }
  /**
   * Check if one of the values ir empty
   * @param str The string to check
   */
  isStringValid(str) {
    if (typeof str != 'undefined' && str) {
      return true;
    };
    return false;
  }

  /**
   * Check if one of the values ir empty
   * @param attendees The value to check
   */
  areAttendeesValid(attendees) {
    if (attendees.length == 1 && !this.isStringValid(attendees[0]["email"])) {
      return false;
    }
    return true;
  }
  updateStatus(key, newStatus, permissons) {

    this.af.database.list(`/userProfile/${this.up.currentUser.uid}/tasks`).update(key, { status: newStatus });

    permissons.forEach((user2) => {
      this.up.updateStatus(user2, key, newStatus)
    });
  };


  endTask(key, permissons, responsable) {

    this.up.endTask(responsable, key, "tasks");

    permissons.forEach((user) => {
      this.up.endTask(user, key, "delegatedTasks");
    });
  };


  editTask(key, permissons, responsable, field, value ,subnode) {

   // this.af.database.list(`/userProfile/${this.up.currentUser.uid}/tasks`).update(key, { comments: value });
    this.up.updateComment(responsable,key,value,field,"tasks");
    permissons.forEach((user2) => {
      this.up.updateComment(user2,key,value,field,subnode);
    });

  };


}
