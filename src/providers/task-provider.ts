import { Injectable } from '@angular/core';
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
import { ProfileData } from "./profile-data";
import 'rxjs/add/operator/map';


@Injectable()
export class TaskProvider {

  contactsList: FirebaseListObservable<any[]>;

  constructor(public af: AngularFire, public up: ProfileData) {
    console.log('Hello TaskProvider Provider');
  }


  getTask() {
    let tasks = this.af.database.list(`/userProfile/${this.up.currentUser.uid}/tasks`, {
      query: {
        orderByChild: 'reversePriority',
      }
    });
    return tasks;

  }

  getDelegatedTaskRef() {

    let delegatedTasksId = this.af.database.list(`/userProfile/${this.up.currentUser.uid}/delegatedTasks`, );
    //Get task for each id
    return delegatedTasksId;
  }



  addNewTask(responsable, taskname, type, subtype, startDate, startTime, repeat,
    recurrence, endTime, priority, notifications, files, comments, permissons,haveImage) {

    let task = {
      creatorid: this.up.currentUser.uid,
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
      reversePriority: (6 - priority),
      notifications: notifications,
      files: files,
      comments: comments,
      permissons: permissons,
      status: 0,
      haveImage: haveImage

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
      status: 0
    };



    var key = this.af.database.list(`/tasks`).push(task).key;

    responsable.forEach((user) => {
      this.up.insertTask(user, key, "tasks", task);
      this.up.insertNotification(user, comments, taskname, type, this.up.currentUser.uid, key)

      delegatedTask.responsable = user;
      this.up.insertTask(this.up.currentUser.email, key, "delegatedTasks", delegatedTask);
      permissons.forEach((user) => {
        this.up.insertTask(user, key, "delegatedTasks", task);
      });

    });



  };

   updateStatus(key,newStatus) {
    this.af.database.list(`/userProfile/${this.up.currentUser.uid}/tasks`).update(key,{status: newStatus });
  };


}
