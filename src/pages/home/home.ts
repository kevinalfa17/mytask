// Import modules
import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
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

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  @ViewChild(Slides) slides: Slides;
  taskOwner: string;
  days: number;
  currentIndex: number;
  firstSlide: boolean;
  lastSlide: boolean;
  enableSearch: boolean;

  public Noti = "notifications-off"; // The image to put in the notification buttom 
  public currentUser: any; // The uid of the current user

  constructor(public nav: NavController, public profileData: ProfileData, public translate: TranslateService,
    public actionSheetCtrl: ActionSheetController, public alertCtrl: AlertController, public notificationData: NotificationData) {

    this.translate.setDefaultLang('es');

    this.enableSearch = false;
    this.taskOwner = "me";

    this.days = 3; //Change to task.length in data base
    this.currentIndex = 0;
    this.firstSlide = true;
    this.lastSlide = false;
  }

  /**
   * Function used to refresh the information 
   */
  ionViewDidLoad() {
    this.currentUser = this.profileData.currentUser.uid;
    this.notificationData.getNotifications(this.currentUser);
    if ((this.notificationData.numberNewNotifications != 0)) {
      this.Noti = "notifications";
      this.notificationData.addLocalNotification("Cambios", "Nueva notificacion", "now", 0, "", "");
      this.Noti = "notifications-off";
    }
  }

  toggleSearchBar() {
    this.enableSearch = !this.enableSearch;
  }

  nextDay() {
    this.slides.slideTo(this.currentIndex + 1, 500);
    this.slideChanged();
  }

  previousDay() {
    this.slides.slideTo(this.currentIndex - 1, 500);
    this.slideChanged();
  }

  slideChanged() {
    this.currentIndex = this.slides.getActiveIndex();

    //Check if its first slide
    if (this.slides.isBeginning()) {
      this.firstSlide = true;
    }
    else {
      this.firstSlide = false;
    }

    //Check if its last slide
    if (this.slides.isEnd()) {
      this.lastSlide = true;
    }
    else {
      this.lastSlide = false;
    }

  }

  complete() {

  }

  newTaskActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: '',
      buttons: [
        {
          text: 'Create own task',
          handler: () => {
            console.log('Own task clicked');
          }
        },
        {
          text: 'Assign task',
          handler: () => {
            this.nav.push(CreateTaskPage);
          }
        },

        {
          text: 'Call (Provisional)',
          handler: () => {
            this.call(+50687362890);
          }
        },

        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }


  call(passedNumber) {
    passedNumber = encodeURIComponent(passedNumber);
    window.location = "tel:" + passedNumber;
  }

  /**
   * This function is to go to the notification page, but if not be new 
   * notifications a message can alert the user and don't pass to the next page
   */
  goToNotifications() {
    this.notificationData.getNotifications(this.currentUser);
    if (this.notificationData.numberNewNotifications != 0) {
      this.nav.push(Notifications);
    } else {
      this.translate.get('NONEWNOTIF').subscribe((text: string) => {
        let alert = this.alertCtrl.create({
          message: text,
          buttons: [
            {
              text: 'ok',
            }
          ]
        });
        alert.present();
      })
    }
  }

  /**
   * Function used to refresh the home page
   * @param refresher Param of the html
   */
  doRefresh(refresher) {
    this.nav.setRoot(this.nav.getActive().component);

    setTimeout(() => {

      refresher.complete();
    }, 2000);
  }

  //DELETE
  gotocalendar() {
    this.nav.setRoot(GoogleCalendar);
  }

}
