import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TranslateService } from 'ng2-translate';
import { TypesProvider } from '../../providers/types-provider';
import { TaskProvider } from '../../providers/task-provider';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { NewContactPage } from '../new-contact/new-contact';
import { ModalController } from 'ionic-angular';
import { ContactListPage } from '../contact-list/contact-list';
import * as moment from 'moment';


@IonicPage()
@Component({
  selector: 'page-create-task',
  templateUrl: 'create-task.html',
})
export class CreateTaskPage {

  types: FirebaseListObservable<any[]>;
  subtypes: FirebaseListObservable<any[]>;
  taskName: string;
  data: string;
  users: Array<string>;
  permissons: Array<string>;
  type: string;
  subtype: string;
  recurrence: string;
  priority: string;
  newComment: string;
  repeatToggle: boolean;
  notificationsToggle: boolean;
  advanced: boolean;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  minDate: string;
  haveImage: boolean;


    
  /**
   * Constructor
   * @param navCtrl 
   * @param navParams 
   * @param typesProvider 
   * @param af 
   * @param translate 
   * @param modalCtrl 
   * @param taskProvider 
   */
  constructor(public navCtrl: NavController, public navParams: NavParams, public typesProvider: TypesProvider,
    public af: AngularFire, public translate: TranslateService, public modalCtrl: ModalController,
    public taskProvider: TaskProvider) {

    this.types = typesProvider.getTypesRef();
    this.translate.setDefaultLang('es');
    this.users = [];
    this.permissons = [];
    this.data = "";
    this.type = "";
    this.subtype = "";
    this.recurrence = "";
    this.newComment = "";
    this.priority = "1";
    this.startDate = "";
    this.endDate = "";
    this.endTime = "";
    this.startTime = "";
    this.taskName = "";
    this.repeatToggle = false;
    this.notificationsToggle = false;
    this.haveImage = true;
    this.minDate = moment().format("YYYY-MM-DD");
  }

  /**
   * 
   * @param selectedType 
   */
  loadSubtypes(selectedType) {
    this.type = selectedType;
    this.subtypes = this.typesProvider.getSubtypesRef(selectedType);

  }

  /**
   * 
   * @param selectedSubtype 
   */
  selectSubtype(selectedSubtype) {
    this.subtype = selectedSubtype;
  }

  /**
   * 
   * @param selectedRecurrence 
   */
  selectRecurrence(selectedRecurrence) {
    this.recurrence = selectedRecurrence;
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad CreateTask');
  }

  /**
   * Add new user responsable to the task
   */
  newUser() {
    this.navCtrl.push(NewContactPage,
      {
        callback: this.getData
      });
  }

  /**
   * Add existing user to be responsable to the task
   */
  addUser() {
    let chooseModal = this.modalCtrl.create(ContactListPage);
    chooseModal.onDidDismiss(data => {
      if (typeof data !== "undefined") {
        this.addUserToList(data);

      }

    });
    chooseModal.present();
  }

  /**
   *Get new user data 
   */
  getData = (data) => {
    return new Promise((resolve, reject) => {
      this.data = data;
      this.addUserToList(data);
      resolve();
    });
  };

  /**
   * remove user from responsable list
   * @param i 
   */
  quitUser(i) {
    this.users.splice(i, 1);

  }


  /**
   * Push the user into the array
   * @param name user name
   */
  addUserToList(name) {
    this.users.push(name);
  }

  /**
   * Add new user to delegated user
   */
  newUserPermissons() {
    this.navCtrl.push(NewContactPage,
      {
        callback: this.getDataPermissons
      });
  }

  /**
   * Add existing user to delegated user
   */
  addUserPermissons() {
    let chooseModal = this.modalCtrl.create(ContactListPage);
    chooseModal.onDidDismiss(data => {
      this.addPermissonsToList(data);
    });
    chooseModal.present();
  }

  /**
   * Get data of user to added to delegated user
   */
  getDataPermissons = (data) => {
    return new Promise((resolve, reject) => {
      this.data = data;
      this.addPermissonsToList(data);
      resolve();
    });
  };

  /**
   * Remove user from delegated users
   * @param i 
   */
  quitUserPermissons(i) {
    this.permissons.splice(i, 1);

  }

  /**
   * Add user to delegated list
   * @param name 
   */
  addPermissonsToList(name) {
    this.permissons.push(name);
  }

  /**
   * Create a new task in data base
   */
  addTask() {

     if(typeof this.subtype == 'undefined') {
        this.subtype = "";
    }
    

    if (this.startDate == "") {

      this.startDate = moment().format('YYYY-MM-DD').toString();

    }

    if (this.endDate == "") {

      this.endDate = moment().format('YYYY-MM-DD').toString();

    }

    if (this.repeatToggle) {
      var startAux = moment(this.startDate, 'YYYY-MM-DD');
      switch (this.recurrence) {
        case "daily":
          this.endDate = startAux.add(30, 'days').format('YYYY-MM-DD').toString();
          break;
        case "weekly":
          this.endDate = startAux.add(60, 'days').format('YYYY-MM-DD').toString();
          break;

        case "monthly":
          this.endDate = startAux.add(90, 'days').format('YYYY-MM-DD').toString();

          break;
      }
    }

    this.taskProvider.addNewTask(this.users, this.taskName, this.type, this.subtype, this.startDate, this.startTime, this.repeatToggle,
      this.recurrence, this.endDate, parseInt(this.priority), this.notificationsToggle, [], this.newComment, this.permissons, this.haveImage, this.endTime)

    this.navCtrl.pop();
  }


}
