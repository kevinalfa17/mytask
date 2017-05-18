import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { TaskTypesPage } from '../task-types/task-types';
import { TranslateService } from 'ng2-translate';
import { ProfileData } from '../../providers/profile-data';
import { Notifications } from '../notifications/notifications';
import { Tasksinteractions } from '../tasksinterations/tasksinteractions';
import firebase from 'firebase'

@IonicPage()
@Component({
  selector: 'page-admin',
  templateUrl: 'admin.html',
})
export class AdminPage {
  public currentUseruid: any;
  public currentUserType: string;

  constructor(public nav: NavController, public navParams: NavParams, public alertCtrl: AlertController, public translate: TranslateService, public profilData: ProfileData) {
    this.translate.setDefaultLang('es');

  }
  ionViewDidLoad() {
    this.currentUseruid = this.profilData.currentUser.uid;

    firebase.database().ref("/userProfile").child(this.currentUseruid).on("value", (data) => {
      this.currentUserType = data.val().type;
    });

  }

  goToTaskTypesPage(): void {
    if ((this.currentUserType) == "Admin") {
      this.nav.push(TaskTypesPage);
    } else {
      this.translate.get('TEXTNOADMIN').subscribe((text: string) => {
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

  goToTaskInteractions() {
    this.nav.push(Tasksinteractions);
  }

  goToNotifications() {
    this.nav.push(Notifications);
  }

}
