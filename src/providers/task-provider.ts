import { Injectable } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { ProfileData } from "./profile-data";
import 'rxjs/add/operator/map';


@Injectable()
export class TaskProvider {

  contactsList: FirebaseListObservable<any[]>;

  constructor(public af: AngularFire, public up: ProfileData) {
    console.log('Hello TaskProvider Provider');
  }



  /*getTaskRef() {
    return this.af.database.list('contacts', {
      query: {
        orderByChild: 'responsable',
        equalTo: this.up.currentUser.uid
      }
    });

  }*/



  addNewTask(responsable, taskname, type, subtype, startDate, startTime, repeat,
    recurrence, endTime, priority, notifications, files, comments, permissons) {

    let task = {
      creatorid: this.up.currentUser.uid,
      responsable: [responsable],
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
      files: [files],
      comments: comments,
      permissons: permissons

    };
    this.af.database.list(`/tasks`).push(task);
  };


}
