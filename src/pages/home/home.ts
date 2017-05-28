import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { TranslateService } from 'ng2-translate';
import { HomePage2 } from '../home2/home';
import { Notifications } from '../notifications/notifications';
import { ProfileData } from '../../providers/profile-data';
///////////////////////////////////////////////
declare var window;
import { GoogleCalendar } from '../googleCalendar/googleCalendar';
//////////////////////////////////////////////
import { ViewChild } from '@angular/core';
import { Slides } from 'ionic-angular';
import { ActionSheetController } from 'ionic-angular';
import { CreateTaskPage } from '../create-task/create-task';


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

  public Noti = "notifications-off";
  public notiInChange = false;

  constructor(public nav: NavController, public translate: TranslateService, public actionSheetCtrl: ActionSheetController, public alertCtrl: AlertController, public profileData: ProfileData) {

    this.translate.setDefaultLang('es');
    this.profileData.getNotifications();
    this.enableSearch = false;
    this.taskOwner = "me";

    this.days = 3; //Change to task.length in data base
    this.currentIndex = 0;
    this.firstSlide = true;
    this.lastSlide = false;
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


  //Gabo functions

  ionViewDidLoad() {
    this.profileData.getNotifications();
    if ((this.profileData.numberNewNotifications != 0)) {
      this.Noti = "notifications";
    } else {
      this.Noti = "notifications-off";
    }
  }
  goToHomePage2(): void {
    this.nav.push(HomePage2);
  }

  call(passedNumber) {
    passedNumber = encodeURIComponent(passedNumber);
    window.location = "tel:" + passedNumber;
  }
  goToNotifications() {
    this.profileData.getNotifications();
    if (this.profileData.numberNewNotifications != 0) {
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

  doRefresh(refresher) {
    this.nav.setRoot(this.nav.getActive().component);

    setTimeout(() => {

      refresher.complete();
    }, 2000);
  }

}
