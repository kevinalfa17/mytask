import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { TaskTypesPage } from '../task-types/task-types';
import { Notifications } from '../notifications/notifications';
import { Tasksinteractions } from '../tasksinterations/tasksinteractions';
import { ProfileData } from '../../providers/profile-data';
import firebase from 'firebase'
import { TranslateService } from 'ng2-translate';

@Component({
  selector: 'page-admin',
  templateUrl: 'admin.html',
})
export class AdminPage {

  
  public currentUseruid: any;
  public currentUserType: string;

  constructor(public nav: NavController, public navParams: NavParams, public profilData: ProfileData, public alertCtrl: AlertController, public translate: TranslateService,) {
    this.translate.setDefaultLang('es');
}
  ionViewDidLoad() {
    this.currentUseruid = this.profilData.currentUser.uid;

    firebase.database().ref("/userProfile").child(this.currentUseruid).on("value", (data)=>{
      this.currentUserType = data.val().type;
    });



  }

  goToTaskTypesPage(val1, val2): void {
    
    if ((this.currentUserType) == "admin"){
      this.nav.push(TaskTypesPage);
    } else {
      let coolAlert = this.alertCtrl.create({
      title: "Notifications",
      message:" You are not an administrator",
      buttons: [
        {
          text: "OK"
        }
      ]
    });
    coolAlert.present();
    }
  }

  goToTaskInteractions() {
    this.nav.push(Tasksinteractions);
  }

  goToNotifications() {
    this.nav.push(Notifications);
  }
}
