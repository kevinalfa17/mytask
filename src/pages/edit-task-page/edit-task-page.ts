import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { TranslateService } from 'ng2-translate';
import { ContactsProvider } from '../../providers/contacts-provider';
import { AngularFire, FirebaseObjectObservable } from 'angularfire2';
import { TaskProvider } from '../../providers/task-provider';
import { NotificationData } from '../../providers/notification-provider';
import { ProfileData } from '../../providers/profile-data';




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
  name:string;

  /**
   * Constructor
   * @param viewCtrl 
   * @param navCtrl 
   * @param navParams 
   * @param contactsProvider 
   * @param af 
   * @param translate 
   * @param taskProvider 
   * @param notificationData 
   * @param profileData 
   */
  constructor(public viewCtrl: ViewController, public navCtrl: NavController,
    public navParams: NavParams, public contactsProvider: ContactsProvider,
    public af: AngularFire, public translate: TranslateService, public taskProvider: TaskProvider,
    public notificationData: NotificationData, public profileData: ProfileData) {

    this.translate.setDefaultLang('es');
    this.key = navParams.get("key");
    this.name= navParams.get("name");
    this.permissons = navParams.get("permissons");
    this.task = taskProvider.getTask(navParams.get("key"));
    this.newComment = "";
    this.oldComment = "";
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TaskDetailPage');
  }

  /*setMin(min, time) {

    this.endDate = min;
    this.endTime = time;
    return min;

  }*/

  /**
   * Change a date in task
   * @param responsable 
   */
  changeDate(responsable) {

    if (this.endTime !== "") {
      this.taskProvider.editTask(this.key, this.permissons, responsable, "alarm", this.endTime, "delegatedTasks");
    }
    if (this.endDate !== "") {
      this.taskProvider.editTask(this.key, this.permissons, responsable, "endTime", this.endDate, "delegatedTasks");
    }
      if (responsable !== this.profileData.currentUser.email) {
        this.profileData.insertNotification(responsable, "Date Changed", this.name, "CambioData",
          this.profileData.currentUser.uid, this.key, "");
      }

  }

  /**
   * Add new admin comment
   * @param responsable 
   * @param oldComment 
   */
  addComment(responsable, oldComment) {

    this.taskProvider.editTask(this.key, this.permissons, responsable, "comments", (oldComment + " \n  ->A: " + this.newComment), "delegatedTasks");
    this.newComment = "";

  }




}
