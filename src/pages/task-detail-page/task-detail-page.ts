import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ViewController } from 'ionic-angular';
import { TranslateService } from 'ng2-translate';
import { ContactsProvider } from '../../providers/contacts-provider';
import { AngularFire, FirebaseObjectObservable } from 'angularfire2';
import { TaskProvider } from '../../providers/task-provider';



@IonicPage()
@Component({
  selector: 'page-task-detail-page',
  templateUrl: 'task-detail-page.html',
})
export class TaskDetailPage {
  task: FirebaseObjectObservable<any[]>;

  constructor(public viewCtrl: ViewController, public navCtrl: NavController, public navParams: NavParams, public contactsProvider: ContactsProvider,
    public af: AngularFire, public translate: TranslateService, public taskProvider: TaskProvider) {
    this.translate.setDefaultLang('es');
    this.task = taskProvider.getTask(navParams.get("key"));
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TaskDetailPage');
  }

}
