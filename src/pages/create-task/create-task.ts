import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TranslateService } from 'ng2-translate';
import { TypesProvider } from '../../providers/types-provider';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { NewContactPage } from '../new-contact/new-contact';
import { ModalController } from 'ionic-angular';
import { ContactListPage } from '../contact-list/contact-list';


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




  constructor(public navCtrl: NavController, public navParams: NavParams, public typesProvider: TypesProvider,
    public af: AngularFire, public translate: TranslateService, public modalCtrl: ModalController) {

    this.types = typesProvider.getTypesRef();
    this.translate.setDefaultLang('es');
    this.users = [];
    this.permissons = [];
  }

  loadSubtypes(selectedType) {
    this.type = selectedType;
    this.subtypes = this.typesProvider.getSubtypesRef(selectedType);

  }

  selectSubtype(selectedSubtype) {
    this.subtype = selectedSubtype;
  }

  selectRecurrence(selectedRecurrence) {
    this.recurrence = selectedRecurrence;
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad CreateTask');
  }


  newUser() {
    this.navCtrl.push(NewContactPage,
      {
        callback: this.getData
      });
  }

  addUser() {
    let chooseModal = this.modalCtrl.create(ContactListPage);
    chooseModal.onDidDismiss(data => {
      this.addUserToList(data);
    });
    chooseModal.present();
  }

  getData = (data) => {
    return new Promise((resolve, reject) => {
      this.data = data;
      this.addUserToList(data);
      resolve();
    });
  };


  quitUser(i) {
    this.users.splice(i, 1);

  }

  addUserToList(name) {
    this.users.push(name);
  }




  newUserPermissons() {
    this.navCtrl.push(NewContactPage,
      {
        callback: this.getDataPermissons
      });
  }

  addUserPermissons() {
    let chooseModal = this.modalCtrl.create(ContactListPage);
    chooseModal.onDidDismiss(data => {
      this.addPermissonsToList(data);
    });
    chooseModal.present();
  }

  getDataPermissons = (data) => {
    return new Promise((resolve, reject) => {
      this.data = data;
      this.addPermissonsToList(data);
      resolve();
    });
  };


  quitUserPermissons(i) {
    this.permissons.splice(i, 1);

  }


  addPermissonsToList(name) {
    this.permissons.push(name);
  }


}
