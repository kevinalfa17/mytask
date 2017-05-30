import { Injectable } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { ProfileData } from "./profile-data";
import 'rxjs/add/operator/map';
import moment from 'moment';

@Injectable()
export class TaskProvider {

  contactsList: FirebaseListObservable<any[]>;

  constructor(public af: AngularFire, public up: ProfileData) {
    console.log('Hello TaskProvider Provider');
  }


  getTaskRef() {

    let tasksId = this.af.database.list(`/userProfile/${this.up.currentUser.uid}/tasks`);
    //Get task for each id
    return tasksId;
  }

  getDelegatedTaskRef() {

    let delegatedTasksId = this.af.database.list(`/userProfile/${this.up.currentUser.uid}/delegatedTasks`);
    //Get task for each id
    return delegatedTasksId;
  }



  addNewTask(responsable, taskname, type, subtype, startDate, startTime, repeat,
    recurrence, endTime, priority, notifications, files, comments, permissons) {

    let task = {
      Creatorid: this.up.currentUser.uid,
      responsable: responsable,
      taskName: taskname,
      type: type,
      subtype: subtype,
      startDay: startDate,
      startTime: startTime,
      repeat: repeat,
      recurrence: recurrence,
      endTime: endTime,
      priority: priority,
      notifications: notifications,
      files: files,
      comments: comments,
      permissons: permissons,
      state: 0

    };
    var key = this.af.database.list(`/tasks`).push(task).key;

    let noti = {
      Name: taskname,
      Condition: 'Pending',
      From: this.up.currentUser.email,
      Description: comments,
      Creatorid: this.up.currentUser.uid,
      responsable: responsable,
      Type: type,
      DateSended: moment().format('D/M/YYYY'),
      HourSended: moment().format('h:mm:s a'),
      Read: 'false',
      taskid: key,
    };
    var key2 = this.af.database.list(`/notifications`).push(noti).key;

    responsable.forEach((user) => {
      this.up.insertTask(user, key, "tasks");
      this.up.insertNotification(user, comments, taskname, type, this.up.currentUser.uid, key2, key)
    });

    permissons.forEach((user) => {
      this.up.insertTask(user, key, "delegatedTasks");
    });


  };


}
