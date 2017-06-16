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
import { ProfileData } from '../../providers/profile-data';
import { ActionSheetController } from 'ionic-angular';
import { MediaData } from '../../providers/media-provider';




@IonicPage()
@Component({
  selector: 'page-create-own-task',
  templateUrl: 'create-own-task-page.html',
})
export class CreateOwnTaskPage {

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
  haveImage: boolean;
  minDate: string;
  files: Array<any>;

  constructor(public navCtrl: NavController, public navParams: NavParams, public typesProvider: TypesProvider,
    public af: AngularFire, public translate: TranslateService, public modalCtrl: ModalController,
    public taskProvider: TaskProvider, public up: ProfileData, public actionSheetCtrl: ActionSheetController,
    public mediaProvider: MediaData) {

    this.types = typesProvider.getTypesRef();
    this.translate.setDefaultLang('es');
    this.users = [up.currentUser.email];
    this.permissons = [];
    this.files = [];
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

  quitFile(i) {
    this.files.splice(i, 1);

  }


  addPermissonsToList(name) {
    this.permissons.push(name);
  }


  addTask() {

    if (typeof this.subtype == 'undefined') {
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


  showFilesOptionsSheet() {
    console.log("Option sheet");
    let actionSheet = this.actionSheetCtrl.create({
      title: '',
      buttons: [
        {
          text: 'Photo',
          handler: () => {
            console.log("photo");
            var link;
            link = this.mediaProvider.captureImage(this.up.currentUser.uid);
            console.log(link);
            var aux = link.split("/");
            let file = {
              link: link,
              name: aux[aux.length - 1],
              type: "photo"
            }
            console.log(file);
            this.files.push(file);
            console.log(this.files);
          }
        },
        {
          text: 'Video',
          handler: () => {
            var link: string;
            link = this.mediaProvider.captureVideo(this.up.currentUser.uid);
            var aux = link.split("/");
            let file = {
              link: link,
              name: aux[aux.length - 1],
              type: "video"
            }
            this.files.push(file);
          }
        },
        {
          text: 'File',
          handler: () => {
            console.log("file");
            var link: string = "";
            link = this.mediaProvider.captureFile(this.up.currentUser.uid);
            console.log("reeeeesult out")
            console.log(link);
            var aux = link.split("/");
            let file = {
              link: link,
              name: aux[aux.length - 1],
              type: "file"
            }
            console.log(file);
            this.files.push(file);
            console.log(this.files);

          }
        },
        {
          text: 'Audio',
          handler: () => {
            var link: string;
            link = this.mediaProvider.captureAudio(this.up.currentUser.uid);
            var aux = link.split("/");
            let file = {
              link: link,
              name: aux[aux.length - 1],
              type: "audio"
            }
            this.files.push(file);
          }
        },
        {
          text: 'Back',
          role: 'cancel',
        }
      ]
    });
    actionSheet.present();
  }


}