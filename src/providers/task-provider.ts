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


  getTasks() {
    let tasks = this.af.database.list(`/userProfile/${this.up.currentUser.uid}/tasks`, {
      query: {
        orderByChild: 'reversePriority',
      }
    });
    return tasks;
  }

  getTask(key){
        let task = this.af.database.object(`/userProfile/${this.up.currentUser.uid}/tasks/${key}`);
        return task
  }

  getDelegatedTasks() {

    let delegatedTasks = this.af.database.list(`/userProfile/${this.up.currentUser.uid}/delegatedTasks`, );
    return delegatedTasks;
  }


  addNewTask(responsable, taskname, type, subtype, startDate, startTime, repeat,
    recurrence, endTime, priority, notifications, files, comments, permissons,haveImage, alarm) {

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
      haveImage: haveImage,
      alarm:alarm,
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
      alarm:alarm,
      phone: 0
    };



    var key = this.af.database.list(`/tasks`).push(task).key;

    responsable.forEach((user) => {
      this.up.insertTask(user, key, "tasks", task);
      this.up.insertNotification(user, comments, taskname, type, this.up.currentUser.uid, key)

      console.log("1111");
      console.log(this.up.currentUser.email);
      delegatedTask.responsable = user;
      this.up.insertTask(this.up.currentUser.email, key, "delegatedTasks", delegatedTask);
      permissons.forEach((user2) => {
        console.log("2222");
        this.up.insertTask(user2, key, "delegatedTasks", task);
      });

    });



  };

   updateStatus(key,newStatus) {
    this.af.database.list(`/userProfile/${this.up.currentUser.uid}/tasks`).update(key,{status: newStatus });
  };


}
