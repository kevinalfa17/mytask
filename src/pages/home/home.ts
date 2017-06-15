// Import modules
import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { TranslateService } from 'ng2-translate';
import { ViewChild } from '@angular/core';
import { Slides } from 'ionic-angular';
import { ActionSheetController } from 'ionic-angular';
// Providers used
import { NotificationData } from '../../providers/notification-provider';
import { ProfileData } from '../../providers/profile-data';
// Some pages
import { Notifications } from '../notifications/notifications';
import { GoogleCalendar } from '../googleCalendar/googleCalendar';
import { CreateTaskPage } from '../create-task/create-task';
import { EditTaskPage } from '../edit-task-page/edit-task-page';
import { CreateOwnTaskPage } from '../create-own-task-page/create-own-task-page';

import { TaskDetailPage } from '../task-detail-page/task-detail-page';
import { TaskProvider } from '../../providers/task-provider';
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
import * as moment from 'moment';



declare var window;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  @ViewChild(Slides) slides: Slides;
  @ViewChild(Slides) slides2: Slides;
  taskOwner: string;
  days: number;
  currentIndex: number;
  currentIndex2: number;
  firstSlide: boolean;
  lastSlide: boolean;
  firstSlide2: boolean;
  lastSlide2: boolean;
  enableSearch: boolean;
  taskList: FirebaseListObservable<any[]>;
  delegatedTaskList: FirebaseListObservable<any[]>;
  datesList: Array<string>;
  datesList2: Array<number>;
  title: string;
  actualSlide: number;
  actualSlide2: number;
  taskSegment: boolean;
  searchTerm: string;

  public Noti = "notifications-off"; // The image to put in the notification buttom 
  public currentUser: any; // The uid of the current user

  constructor(public nav: NavController, public translate: TranslateService,
    public actionSheetCtrl: ActionSheetController, public alertCtrl: AlertController,
    public notificationData: NotificationData, public taskProvider: TaskProvider, public profileData: ProfileData) {

    this.translate.setDefaultLang('es');

    this.enableSearch = false;
    this.taskOwner = "me";

    this.days = 3; //Change to task.length in data base
    this.currentIndex = 0;
    this.currentIndex2 = 0;
    this.firstSlide = true;
    this.lastSlide = false;
    this.firstSlide2 = true;
    this.lastSlide2 = false;

    this.taskList = taskProvider.getTasks();
    this.delegatedTaskList = taskProvider.getDelegatedTasks();
    this.datesList = [];
    this.datesList2 = [0, 1, 2];
    this.searchTerm = "";

    if(this.taskOwner == "me"){
      this.taskSegment = true;
    }
    


    this.taskList.map(list => list.length).subscribe(length => {
      if (length > 0) {
        this.getDates(this.taskList).then((dates: Array<Date>) => {

          var maxDate = new Date(Math.max.apply(null, dates));
          var minDate = new Date(Math.min.apply(null, dates));


          this.datesList = [];
          this.datesList = this.getDateRange(new Date(moment().format("YYYY-MM-DD")), maxDate);

          if (this.datesList.length == 1) {
            this.lastSlide = true;
          }


          this.actualSlide = 0;
          this.actualSlide2 = 0;
          if (this.datesList.length > 0 && this.taskSegment == true) {
            this.title = this.getDateTitle(this.datesList[this.actualSlide]);
          }

        });
      }
      else {
        this.lastSlide = true;
      }

    });

  }

  /**
   * Function used to refresh the information 
   */
  ionViewDidLoad() {
    this.currentUser = this.profileData.currentUser.uid;
    this.notificationData.getNotifications(this.currentUser);
    if ((this.notificationData.numberNewNotifications != 0)) {
      this.Noti = "notifications";
      this.notificationData.addLocalNotification("Cambios", "Nueva notificacion", "now", 0, "", "");
      this.Noti = "notifications-off";
    }
  }


  toggleSearchBar() {
    this.enableSearch = !this.enableSearch;
  }

  nextDay() {
    if (this.taskSegment) {


      this.actualSlide = this.actualSlide + 1;
      this.title = this.getDateTitle(this.datesList[this.actualSlide]);

      this.slides.slideTo(this.currentIndex + 1, 500);
      this.slideChanged();
    }
    else {
      this.actualSlide2 = this.actualSlide2 + 1;
      this.title = this.getDateTitle2(this.actualSlide2);

      this.slides2.slideTo(this.currentIndex2 + 1, 500);
      this.slideChanged2();
    }
  }

  previousDay() {

    if (this.taskSegment) {
      this.actualSlide = this.actualSlide - 1;
      this.title = this.getDateTitle(this.datesList[this.actualSlide]);

      this.slides.slideTo(this.currentIndex - 1, 500);
      this.slideChanged();
    }
    else {
      this.actualSlide2 = this.actualSlide2 - 1;
      this.title = this.getDateTitle2(this.actualSlide2);

      this.slides2.slideTo(this.currentIndex2 - 1, 500);
      this.slideChanged2();

    }
  }

  slideChanged() {
    this.currentIndex = this.slides.getActiveIndex();

    //Check if its first slide
    if (this.actualSlide == 0) {
      this.firstSlide = true;
    }
    else {
      this.firstSlide = false;
    }

    //Check if its last slide
    if (this.actualSlide == (this.datesList.length - 1)) {
      this.lastSlide = true;
    }
    else {
      this.lastSlide = false;

    }

  }

  slideChanged2() {
    this.currentIndex2 = this.slides2.getActiveIndex();

    //Check if its first slide
    if (this.actualSlide2 == 0) {
      this.firstSlide2 = true;
    }
    else {
      this.firstSlide2 = false;
    }

    //Check if its last slide
    if (this.actualSlide2 == 2) {
      this.lastSlide2 = true;
    }
    else {
      this.lastSlide2 = false;

    }

  }

  newTaskActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: '',
      buttons: [
        {
          text: 'Create own task',
          handler: () => {
            this.nav.push(CreateOwnTaskPage);
          }
        },
        {
          text: 'Assign task',
          handler: () => {
            this.nav.push(CreateTaskPage);
          }
        },

        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {

          }
        }
      ]
    });
    actionSheet.present();
  }


  call(passedNumber) {
    passedNumber = encodeURIComponent(passedNumber);
    window.location = "tel:" + passedNumber;
  }

  /**
   * This function is to go to the notification page, but if not be new 
   * notifications a message can alert the user and don't pass to the next page
   */
  goToNotifications() {
    this.notificationData.getNotifications(this.currentUser);
    if (this.notificationData.numberNewNotifications != 0) {
      this.nav.push(Notifications);
    } else {
      this.translate.get('NONEWNOTIF').subscribe((text: string) => {
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
   * Function used to refresh the home page
   * @param refresher Param of the html
   */
  doRefresh(refresher) {
    this.nav.setRoot(this.nav.getActive().component);

    setTimeout(() => {

      refresher.complete();
    }, 2000);
  }


  getDates(list: FirebaseListObservable<any>) {

    var promise = new Promise(function (resolve, reject) {
      list.subscribe(snapshots => {
        var dates = [];
        snapshots.forEach(snapshot => {
          dates.push(new Date(snapshot.endTime));
        });
        resolve(dates);
      })
    });

    return promise;
  }

  getDateRange(startDate, endDate) {

    var dates = [],
      currentDate: Date = startDate,
      addDays = function (days) {
        var date = new Date(this.valueOf());
        date.setDate(date.getDate() + days);
        return date;
      };

    if (moment(currentDate).format('YYYY-MM-DD') == moment(endDate).format('YYYY-MM-DD')) {
      dates.push(moment.utc(endDate).format('YYYY-MM-DD'));
    }
    else {
      while (currentDate <= endDate) {
        dates.push(moment.utc(currentDate).format('YYYY-MM-DD'));
        currentDate = addDays.call(currentDate, 1);
      }

    }

    return dates;
  };

  getDateTitle(date: string) {


    var dateTitle = date.split("-");
    var month = "";
    var year = dateTitle[0];
    var day = dateTitle[2];

    switch (dateTitle[1]) {
      case "01":
        month = "Enero";
        break;
      case "02":
        month = "Febrero"
        break;
      case "03":
        month = "Marzo"
        break;
      case "04":
        month = "Abril"
        break;
      case "05":
        month = "Mayo"
        break;
      case "06":
        month = "Junio"
        break;
      case "07":
        month = "Julio"
        break;
      case "08":
        month = "Agosto"
        break;
      case "09":
        month = "Setiembre"
        break;
      case "10":
        month = "Octubre"
        break;
      case "11":
        month = "Noviembre"
        break;
      case "12":
        month = "Diciembre"
        break;
      default:
        month = "error"
    }

    return (month + " " + day);
  }

  getDateTitle2(slideNumber) {
    var title;
    switch (slideNumber) {
      case 0:
        title = "Yesterday";
        break;
      case 1:
        title = "Today"
        break;
      case 2:
        title = "Tomorrow"
        break;
    }

    return title;
  }

  validateDates(day, startDay, endTime, repeat, recurrence, taskName) {

    if (this.searchTerm !== "") {
      return this.searchOwnTask(taskName);
    }

    var result;
    var minDate = moment(startDay, 'YYYY-MM-DD');
    var maxDate = moment(endTime, 'YYYY-MM-DD');
    var currentDate = moment(day, 'YYYY-MM-DD');

    if (repeat && currentDate >= minDate) {
      switch (recurrence) {
        case "daily":
          result = true
          break;
        case "weekly":
          if (minDate.day() == currentDate.day()) {
            result = true;
          }
          else {
            result = false;
          }
          break;
        case "monthly":

          if (minDate.date() == currentDate.date()) {
            result = true;
          }
          else {
            result = false;
          }
          break;
      }
    }
    else {

      if (currentDate >= minDate && currentDate <= maxDate) {

        result = true;
      }
      else {
        result = false;
      }
    }

    return result;
  }


  validateDates2(day, startDay, endTime, repeat, recurrence, taskName, responsable) {



    if (this.searchTerm !== "") {
      return this.searchDelegatedTask(taskName, responsable);
    }

    var result;
    var currentDate;
    var minDate = moment(startDay, 'YYYY-MM-DD');
    var maxDate = moment(endTime, 'YYYY-MM-DD');
    switch (day) {
      case 0:
        currentDate = moment().subtract(1, "days");
        break;
      case 1:
        currentDate = moment();
        break;
      case 2:
        currentDate = moment().add(1, "days");
        break;
    }

    if (repeat && currentDate >= minDate) {
      switch (recurrence) {
        case "daily":
          result = true
          break;
        case "weekly":
          if (minDate.day() == currentDate.day()) {
            result = true;
          }
          else {
            result = false;
          }
          break;
        case "monthly":

          if (minDate.date() == currentDate.date()) {
            result = true;
          }
          else {
            result = false;
          }
          break;
      }
    }
    else {

      if (currentDate.format('YYYY-MM-DD') == maxDate.format('YYYY-MM-DD')) {

        result = true;
      }
      else {
        result = false;
      }
    }

    return result;
  }

  complete(key, status, permissons) {

    if (status == 0) {
      this.taskProvider.updateStatus(key, 1, permissons);
    }
    else {
      this.taskProvider.updateStatus(key, 4, permissons);
    }

  }

  update(key, status, permissons) {

    if (status == 0) {
      let actionSheet = this.actionSheetCtrl.create({
        title: '',
        buttons: [
          {
            text: 'Accept',
            handler: () => {
              this.taskProvider.updateStatus(key, 1, permissons);
            }
          },
          {
            text: 'Back',
            role: 'cancel',
          }
        ]
      });
      actionSheet.present();


    } else {
      var name;
      if (status == 3) {
        name = "In Progress";
      }
      else {
        name = "On Hold";
      }
      let actionSheet = this.actionSheetCtrl.create({
        title: '',
        buttons: [
          {
            text: "Complete",
            handler: () => {
              this.taskProvider.updateStatus(key, 4, permissons);
            }
          },
          {
            text: name,
            handler: () => {
              if (status == 3) {
                this.taskProvider.updateStatus(key, 1, permissons);
              }
              else {
                this.taskProvider.updateStatus(key, 3, permissons);
              }
            }
          },
          {
            text: 'Cancel Task',
            handler: () => {
              this.taskProvider.updateStatus(key, 2, permissons);
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

  view(key,permissons) {
    this.nav.push(TaskDetailPage, {
     key: key,
     permissons:permissons
    })
  }

  edit(key,permissons) {
    this.nav.push(EditTaskPage, {
      key: key,
      permissons:permissons
    })
  }

  end(key,permissons,responsable){
    this.taskProvider.endTask(key,permissons,responsable);
  }

  showOwnTasks() {
    this.taskSegment = true;
    if (this.datesList.length > 0) {
      this.title = this.getDateTitle(this.datesList[this.actualSlide]);
    }
    else{
      this.title = "";
    }
  }

  showOtherTasks() {
    this.taskSegment = false;
    this.title = this.getDateTitle2(this.actualSlide2);
  }

  searchOwnTask(taskName) {
    return (taskName.indexOf(this.searchTerm) !== -1);

  }

  searchDelegatedTask(taskName, responsable) {
    return ((taskName.indexOf(this.searchTerm) !== -1) || (responsable.indexOf(this.searchTerm) !== -1));

  }

  chooseColor(endTime, status, recurrence) {


    var maxDate = moment(endTime, 'YYYY-MM-DD');
    var currentDate = moment().subtract(1, "days");

    if ((currentDate.format('YYYY-MM-DD') == maxDate.format('YYYY-MM-DD')) && status !== 4) {
      return "incomplete";
    }
    else {
      currentDate = moment();
      if ((currentDate.format('YYYY-MM-DD') == maxDate.format('YYYY-MM-DD')) && status == 0) {
        return "warning";
      }
      else {
        return "white";
      }
    }

  }




   postpone(key, permissons, responsable,alarm) {

    var alarmAux = alarm.split(":");
    var newAlarm = moment();
    newAlarm.hours(alarmAux[0]);
    newAlarm.minutes(alarmAux[1]);



      let actionSheet = this.actionSheetCtrl.create({
        title: '',
        buttons: [
          {
            text: '1 H.',
            handler: () => {
              newAlarm = newAlarm.add(1,"hours");
              this.taskProvider.editTask(key,permissons,responsable,"alarm",newAlarm.format("HH:mm"),"delegatedTasks")
            }
          },
          {
            text: '30 M.',
            handler: () => {
              newAlarm = newAlarm.add(30,"minutes");
              this.taskProvider.editTask(key,permissons,responsable,"alarm",newAlarm.format("HH:mm"),"delegatedTasks")
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
