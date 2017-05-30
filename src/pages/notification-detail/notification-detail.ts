import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { NotificationData } from '../../providers/notification-provider';
import { ProfileData} from '../../providers/profile-data';
import { Camera } from '@ionic-native/camera';

@Component({
  selector: 'notification-detail',
  templateUrl: 'notification-detail.html',
})
export class NotificationDetailPage {
  currentNotification: any;
  public currentUser:any;

  constructor(public nav: NavController, public navParams: NavParams,
    public notificationData: NotificationData, public cameraPlugin: Camera, public profileData: ProfileData) { }

  ionViewDidLoad() {
    //alert(this.navParams.get('notificationId'));
    this.currentUser = this.profileData.currentUser;
    
    this.notificationData.getNotificationDetail(this.navParams.get('notificationId'), this.currentUser).on('value', snapshot => {
      this.currentNotification = snapshot.val();
      this.currentNotification.id = snapshot.key;
    });
  }

  delete() {
    this.nav.pop();
    this.notificationData.deleteNotificationTemp(this.currentNotification.id, this.currentUser);
  }

  accept() {
    if (this.currentNotification.Name == "null") {

    } else {
      
      this.notificationData.acceptNotification(this.currentNotification, this.currentUser);
      this.nav.pop();
    }
  }

  reject() {
    if (this.currentNotification.Name == "null") {

    } else {
      this.notificationData.rejectNotification(this.currentNotification, this.currentUser);
      this.nav.pop();
    }
  }

}
