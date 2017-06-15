import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { TranslateService } from 'ng2-translate';
import { ContactsProvider } from '../../providers/contacts-provider';
import { AngularFire, FirebaseObjectObservable } from 'angularfire2';
import { TaskProvider } from '../../providers/task-provider';


@IonicPage()
@Component({
  selector: 'page-edit-task-page',
  templateUrl: 'edit-task-page.html',
})
export class EditTaskPage {
  task: FirebaseObjectObservable<any>;

  endDate: string;
  endTime: string;
  newComment: string;
  oldComment: string;
  key: string;
  permissons: Array<string>;

  constructor(public viewCtrl: ViewController, public navCtrl: NavController, public navParams: NavParams, public contactsProvider: ContactsProvider,
    public af: AngularFire, public translate: TranslateService, public taskProvider: TaskProvider) {
    this.translate.setDefaultLang('es');
    this.key = navParams.get("key");
    this.permissons = navParams.get("permissons");
    this.task = taskProvider.getTask(navParams.get("key"));
    this.newComment = "";
    this.oldComment = "";
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TaskDetailPage');
  }

  setMin(min, time) {

    this.endDate = min;
    this.endTime = time;
    return min;

  }

  addComment(responsable,oldComment) {

    console.log("comment");
    console.log(responsable);
    console.log(this.newComment);

    this.taskProvider.editTask(this.key,this.permissons,responsable,"comments",(oldComment + "\n" + this.newComment));
    this.newComment = "";

  }




}
