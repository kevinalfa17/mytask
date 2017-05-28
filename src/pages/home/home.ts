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
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public Noti = "notifications-off";
  public notiInChange = false;


  constructor(public nav: NavController, public translate: TranslateService, public alertCtrl: AlertController, public profileData: ProfileData) {
    this.translate.setDefaultLang('es');
    this.profileData.getNotifications();
  }
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
  goToNot(): void {
    this.nav.push(GoogleCalendar);
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
