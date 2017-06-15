// Import modules
import { Component } from '@angular/core';
import { NavController, AlertController, NavParams } from 'ionic-angular';
import { TranslateService } from 'ng2-translate';
import { ViewChild } from '@angular/core';
import { Slides } from 'ionic-angular';
import { ActionSheetController } from 'ionic-angular';
// Providers used
import { NotificationData } from '../../providers/notification-provider';
import { ProfileData } from '../../providers/profile-data';
// Some pages
import { Notifications } from '../notifications/notifications';
import { GoogleCalendar } from '../googleCalendar/googleCalendar';
import { CreateTaskPage } from '../create-task/create-task';


declare var window;

/**
 * This page is used to give a space where comment
 * where someone accept or reject a task
 */
@Component({
  selector: 'commentNoti',
  templateUrl: 'commentNoti.html'
})
export class CommentNoti {
  currentUser: any; // current user 
  noti: any; // noti object
  type: string; // type of action
  public com: string; // where the comment it's keep
  Event: any = {}; // dates to reprogram

  constructor(public nav: NavController, public navParams: NavParams, public profileData: ProfileData, public translate: TranslateService,
    public actionSheetCtrl: ActionSheetController, public alertCtrl: AlertController, public notificationData: NotificationData) {
    this.com = "";
  }
  /**
  * Function used to reload and see the changing data and refresh the diferent params
  */
  ionViewDidEnter() {
    this.currentUser = this.navParams.get('currentUser');
    this.noti = this.navParams.get('notification');
    this.type = this.navParams.get('type');
  }

  /**
   * Function used to save the comment
   */
  func() {
    let alert = this.alertCtrl.create({
      message: "Comentario",
      inputs: [
        {
          name: 'comment',
          placeholder: 'Comentario',
        }
      ],
      buttons: [
        {
          text: 'Cancel',
        },
        {
          text: 'Save',
          handler: data => {
            console.log("ready");
            console.log(data);
            this.com = data.comment;
          }
        }
      ]
    });
    alert.present();
  }
  /**
   * Used to send the notification to the owner and check the dates
   */
  send() {
    if (this.type == "accept") {
      this.noti.comment = this.com;
      this.notificationData.acceptNotification(this.noti, this.currentUser);

      this.nav.pop();
    } else {
      if (this.Event.startDate == null || this.Event.startTime == null || this.Event.endDate == null || this.Event.endTime == null) {

        this.translate.get('TEXTNOFUNC').subscribe((text: string) => {
          let alert = this.alertCtrl.create({
            message: text,
            buttons: [
              {

                text: 'ok'
              }
            ]
          });
          alert.present();
        });
      } else {
        this.noti.comment = this.com + " Recomienda " + this.Event.startDate + " a las " + this.Event.startTime
          + " terminando el " + this.Event.endDate + " a las " + this.Event.endTime;
        this.notificationData.rejectNotification(this.noti, this.currentUser);
        this.nav.pop();
      }
    }
  }
}
