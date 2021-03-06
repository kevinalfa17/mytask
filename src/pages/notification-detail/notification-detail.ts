// Imports of modules
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
//Providers
import { NotificationData } from '../../providers/notification-provider';
import { ProfileData } from '../../providers/profile-data';
import { TaskProvider } from '../../providers/task-provider';
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';



//Pages
import { CommentNoti } from '../commentNoti/commentNoti';


/**
 * This page it's used to show the information of one notification
 */
@Component({
  selector: 'notification-detail',
  templateUrl: 'notification-detail.html',
})
export class NotificationDetailPage {
  currentNotification: any; // The key of the notification to show
  public currentUser: any; // The current user to take the reference

  constructor(public nav: NavController, public navParams: NavParams,
    public notificationData: NotificationData, public profileData: ProfileData,
    public taskProvider: TaskProvider, public af: AngularFire) { }

  /**
  * Function used to reload and see the changing data and refresh the diferent params
  */
  ionViewDidEnter() {
    this.currentUser = this.navParams.get('currentUser'); //uid

    this.notificationData.getNotificationDetail(this.navParams.get('notificationId'), this.currentUser).on('value', snapshot => {
      this.currentNotification = snapshot.val(); //object notif
      this.currentNotification.id = snapshot.key;
    });
  }

  /**
   * Function used to delete the notification from the database
   */
  delete() {
    this.nav.pop();
    this.notificationData.deleteNotificationTemp(this.currentNotification.id, this.currentUser);
  }

  /**
   * Function used to accept the task of the notification
   */
  accept(taskid, comment) {
    if (this.currentNotification.Name == "null") {

    } if (this.currentNotification.type == "Rejected") {

      console.log(comment)
      var aux = comment.split(" ");
      console.log(aux[2])
      console.log(aux[11])
      console.log(aux[5])
      console.log(aux[8])

      var newStartDay = aux[2];
      let task = this.af.database.object(`/userProfile/${this.profileData.currentUser.uid}/delegatedTasks/${taskid}`)
        .subscribe(snapshot => {
          //snapshot.permissons.forEach((user) => {

          this.taskProvider.editTask(taskid, snapshot.permissons, snapshot.responsable, "startDay", aux[2], "delegatedTasks")
          this.taskProvider.editTask(taskid, snapshot.permissons, snapshot.responsable, "startTime", aux[5], "delegatedTasks")
          this.taskProvider.editTask(taskid, snapshot.permissons, snapshot.responsable, "endTime", aux[8], "delegatedTasks")
          this.taskProvider.editTask(taskid, snapshot.permissons, snapshot.responsable, "alarm", aux[11], "delegatedTasks")
          this.taskProvider.updateStatus2(taskid,0,snapshot.permissons,snapshot.responsable);

          //let task2 = this.af.database.object(`/userProfile/${user}/delegatedTasks/${taskid}`)
          //task2.update({startDay:newStartDay});
          /*task2 = this.af.database.object(`/userProfile/${user}/delegatedTasks/${taskid}`)
          .update({endTime:aux[8]});*/

          //.update({startDay:aux[1],endTime:aux[8],startTime:aux[4],alarm:aux[9]});

          //});
          //task.unsubscribe();

        });
      this.notificationData.deleteNotificationTemp(this.currentNotification.id, this.currentUser);
      this.nav.pop();
    } else {

      let task = this.af.database.object(`/userProfile/${this.profileData.currentUser.uid}/tasks/${taskid}`)
        .subscribe(snapshot => {

          this.taskProvider.updateStatus(taskid, 1, snapshot.permissons);

          snapshot.permissons.forEach((user) => {
            if (user !== this.profileData.currentUser.email) {
              this.profileData.insertNotification(user, "Accepted task", snapshot.taskName, "Accepted",
                this.profileData.currentUser.uid, taskid, "");
            }
          });
          //task.unsubscribe();

        });


      //this.nav.push(CommentNoti, { notification: this.currentNotification, currentUser: this.currentUser, type: "accept" });
      //this.nav.pop();
    }

    this.delete();
  }

  /**
   * Function used to reject the task of the notification
   */
  reject(taskid) {
    if (this.currentNotification.Name == "null") {
    }
    if (this.currentNotification.type == "Rejected") {
      let task = this.af.database.object(`/userProfile/${this.profileData.currentUser.uid}/tasks/${taskid}`).remove();
      this.notificationData.deleteNotificationTemp(this.currentNotification.id, this.currentUser);
      this.nav.pop();
    } else {
      let task = this.af.database.object(`/userProfile/${this.profileData.currentUser.uid}/tasks/${taskid}`)
        .subscribe(snapshot => {
          this.taskProvider.updateStatus(taskid, 1, snapshot.permissons);
        });

      this.nav.push(CommentNoti, { notification: this.currentNotification, currentUser: this.currentUser, type: "reject" });
      this.nav.pop();
    }
  }

}
