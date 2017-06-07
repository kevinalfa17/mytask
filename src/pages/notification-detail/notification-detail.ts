// Imports of modules
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
//Providers
import { NotificationData } from '../../providers/notification-provider';
import { ProfileData } from '../../providers/profile-data';

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
    public notificationData: NotificationData, public profileData: ProfileData) { }

  /**
  * Function used to reload and see the changing data and refresh the diferent params
  */
  ionViewDidEnter() {
    this.currentUser = this.navParams.get('currentUser');

    this.notificationData.getNotificationDetail(this.navParams.get('notificationId'), this.currentUser).on('value', snapshot => {
      this.currentNotification = snapshot.val();
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
  accept() {
    if (this.currentNotification.Name == "null") {

    } else {

      this.notificationData.acceptNotification(this.currentNotification, this.currentUser);
      this.nav.pop();
    }
  }
  /**
   * Function used to reject the task of the notification
   */
  reject() {
    if (this.currentNotification.Name == "null") {
    } else {
      this.notificationData.rejectNotification(this.currentNotification, this.currentUser);
      this.nav.pop();
    }
  }

}
