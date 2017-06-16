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
  newComment: string;
  key:string;
  permissons:Array<string>;

  /**
   * Constructor
   * @param viewCtrl 
   * @param navCtrl 
   * @param navParams 
   * @param contactsProvider 
   * @param af 
   * @param translate 
   * @param taskProvider 
   */
  constructor(public viewCtrl: ViewController, public navCtrl: NavController, public navParams: NavParams, public contactsProvider: ContactsProvider,
    public af: AngularFire, public translate: TranslateService, public taskProvider: TaskProvider) {
    this.translate.setDefaultLang('es');
    this.key = navParams.get("key");
    this.permissons = navParams.get("permissons")
    this.newComment = "";
    this.task = taskProvider.getTask(navParams.get("key"));
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TaskDetailPage');
  }

  /**
   * Add user comment
   * @param responsable 
   * @param oldComment 
   */
  addComment(responsable, oldComment) {

    this.taskProvider.editTask(this.key, this.permissons, responsable, "comments", (oldComment + " \n  ->R: " + this.newComment), "delegatedTasks");
    this.newComment = "";

  }

}
