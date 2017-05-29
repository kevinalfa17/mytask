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

  ionViewDidEnter() {
    if (this.navParams.get('notificationId') == null){

    } else {
      this.notificationData.getNotificationDetail(this.navParams.get('notificationId')).on('value', snapshot => {
        this.currentNotification = snapshot.val();
        this.currentNotification.id = snapshot.key;
      });
    }
  }

  accept() {
    this.notificationData.acceptNotification(this.currentNotification);
    this.nav.pop();
  }

  reject() {
    this.notificationData.acceptNotification(this.currentNotification);
    this.nav.pop();
  }

}
