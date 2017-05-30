import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { NotificationData } from '../../providers/notification-provider';
import { Camera } from '@ionic-native/camera';

@Component({
  selector: 'notification-detail',
  templateUrl: 'notification-detail.html',
})
export class NotificationDetailPage {
  currentNotification: any;

  constructor(public nav: NavController, public navParams: NavParams,
    public notificationData: NotificationData, public cameraPlugin: Camera) { }

  ionViewDidLoad() {
    alert(this.navParams.get('notificationId'));
    
    this.notificationData.getNotificationDetail(this.navParams.get('notificationId')).on('value', snapshot => {
      this.currentNotification = snapshot.val();
      this.currentNotification.id = snapshot.key;
    });
  }

  delete() {
    this.nav.pop();
    this.notificationData.deleteNotificationTemp(this.currentNotification.id);
  }

  accept() {
    if (this.currentNotification.Name == "null") {

    } else {
      this.notificationData.acceptNotification(this.currentNotification);
      this.nav.pop();
    }
  }

  reject() {
    if (this.currentNotification.Name == "null") {

    } else {
      this.notificationData.rejectNotification(this.currentNotification);
      this.nav.pop();
    }
  }

}
