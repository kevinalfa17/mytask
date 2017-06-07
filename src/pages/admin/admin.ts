//Some imports of diferent modules
import { Component } from '@angular/core';
import { IonicPage, NavController, AlertController } from 'ionic-angular';
import firebase from 'firebase'
import { TranslateService } from 'ng2-translate';
// Providers
import { ProfileData } from '../../providers/profile-data';
//Pages
import { TaskTypesPage } from '../task-types/task-types';
import { Notifications } from '../notifications/notifications';
import { Tasksinteractions } from '../tasksinterations/tasksinteractions';

/**
 * This page it's used to manage diferent activities, like see notifications,
 * see the accepted o rejected, also the activities of an administrator user
 */
@IonicPage()
@Component({
  selector: 'page-admin',
  templateUrl: 'admin.html',
})
export class AdminPage {
  public currentUseruid: any; // The current user information
  public currentUserType: string; // The type of the current user

  constructor(public nav: NavController, public alertCtrl: AlertController, public translate: TranslateService, public profilData: ProfileData) {
    this.translate.setDefaultLang('es');

  }

  /**
    * Function used to reload and see the changing data and refresh the diferent lists
    */
  ionViewDidLoad() {
    this.currentUseruid = this.profilData.currentUser.uid;

    firebase.database().ref("/userProfile").child(this.currentUseruid).on("value", (data) => {
      this.currentUserType = data.val().type;
    });

  }

  /**
   * This function goes to the task types to manage diferent types
   */
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

  /**
   * This function goes to the task interactions
   */
  goToTaskInteractions() {
    this.nav.push(Tasksinteractions);
  }

  /**
   * This function goes to the notifications page
   */
  goToNotifications() {
    this.nav.push(Notifications);
  }

}
