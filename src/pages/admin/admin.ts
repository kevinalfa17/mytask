import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TaskTypesPage } from '../task-types/task-types';
import { TranslateService } from 'ng2-translate';
import { ProfileData } from '../../providers/profile-data';

@IonicPage()
@Component({
  selector: 'page-admin',
  templateUrl: 'admin.html',
})
export class AdminPage {
  public currentUseruid: any;
  public currentUserType: string;

  constructor(public nav: NavController, public navParams: NavParams, public translate: TranslateService, public profilData: ProfileData) {
    this.translate.setDefaultLang('es');

}
  ionViewDidLoad() {
    this.currentUseruid = this.profilData.currentUser.uid;

    firebase.database().ref("/userProfile").child(this.currentUseruid).on("value", (data)=>{
      this.currentUserType = data.val().type;
    });

  }

   goToTaskTypesPage(): void {
    this.nav.push(TaskTypesPage);
  }
}
