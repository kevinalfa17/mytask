import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { TranslateService } from 'ng2-translate';
import { HomePage2 } from '../home2/home';
import { Notifications } from '../notifications/notifications';
import { NotificationData } from '../../providers/notification-provider';
///////////////////////////////////////////////
declare var window;
import { GoogleCalendar } from '../googleCalendar/googleCalendar';
//////////////////////////////////////////////
import { ViewChild } from '@angular/core';
import { Slides } from 'ionic-angular';
import { ActionSheetController } from 'ionic-angular';
import { CreateTaskPage } from '../create-task/create-task';
import { TaskDetailPage } from '../task-detail-page/task-detail-page';
import { TaskProvider } from '../../providers/task-provider';
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
import * as moment from 'moment';



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
  searchTerm:string;

  public Noti = "notifications-off";
  public notiInChange = false;



  constructor(public nav: NavController, public translate: TranslateService,
    public actionSheetCtrl: ActionSheetController, public alertCtrl: AlertController,
    public notificationData: NotificationData, public taskProvider: TaskProvider) {

    this.translate.setDefaultLang('es');
    this.notificationData.getNotifications();
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
    this.datesList = ["null"];
    this.datesList2 = [0, 1, 2];
    this.taskSegment = true;
    this.searchTerm = "";


    this.taskList.map(list => list.length).subscribe(length => {
      console.log(length);
      if (length > 0) {
        this.getDates(this.taskList).then((dates: Array<Date>) => {

          var maxDate = new Date(Math.max.apply(null, dates));
          var minDate = new Date(Math.min.apply(null, dates));

          this.datesList = [];
          this.datesList = this.getDateRange(new Date(), maxDate);

          this.actualSlide = 0;
          this.actualSlide2 = 0;
          this.title = this.getDateTitle(this.datesList[this.actualSlide]);

        });
      }

    });

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
            console.log('Own task clicked');
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
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }

  //Gabo functions

  ionViewDidLoad() {
    this.notificationData.getNotifications();
    if ((this.notificationData.numberNewNotifications != 0)) {
      this.Noti = "notifications";
    } else {
      this.Noti = "notifications-off";
    }
  }

  goToHomePage2(): void {
    this.nav.push(HomePage2);
  }

  call(passedNumber) {
    passedNumber = encodeURIComponent(passedNumber);
    window.location = "tel:" + passedNumber;
  }

  goToNotifications() {
    this.notificationData.getNotifications();
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
    while (currentDate <= endDate) {
      dates.push(moment(currentDate).format('YYYY-MM-DD'));
      currentDate = addDays.call(currentDate, 1);
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

  validateDates(day, startDay, endTime, repeat, recurrence,taskName) {

    if(this.searchTerm !== ""){
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


  validateDates2(day, startDay, endTime, repeat, recurrence,taskName,responsable) {

    

    if(this.searchTerm !== ""){
      return this.searchDelegatedTask(taskName,responsable);
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

      console.log("currentDate");
      console.log(currentDate);
      console.log(maxDate);

      if (currentDate.format('YYYY-MM-DD') == maxDate.format('YYYY-MM-DD')) {

        result = true;
      }
      else {
        result = false;
      }
    }

    return result;
  }

  complete(key, status) {
    console.log(key);
    if (status == 0) {
      this.taskProvider.updateStatus(key, 1);
    }
    else {
      this.taskProvider.updateStatus(key, 4);
    }

  }

  update(key, status) {

    if (status == 0) {
      let actionSheet = this.actionSheetCtrl.create({
        title: '',
        buttons: [
          {
            text: 'Accept',
            handler: () => {
              this.taskProvider.updateStatus(key, 1);
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
              this.taskProvider.updateStatus(key, 4);
            }
          },
          {
            text: name,
            handler: () => {
              if (status == 3) {
                this.taskProvider.updateStatus(key, 1);
              }
              else {
                this.taskProvider.updateStatus(key, 3);
              }
            }
          },
          {
            text: 'Cancel Task',
            handler: () => {
              this.taskProvider.updateStatus(key, 2);
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

  view(key) {
    this.nav.push(TaskDetailPage, {
      key: key
    })
  }

  showOwnTasks() {
    this.taskSegment = true;
    this.title = this.getDateTitle(this.datesList[this.actualSlide]);
  }

  showOtherTasks() {
    this.taskSegment = false;
    this.title = this.getDateTitle2(this.actualSlide2);
  }

  searchOwnTask(taskName){
    return (taskName.indexOf(this.searchTerm) !== -1);

  }

   searchDelegatedTask(taskName,responsable){
    return ((taskName.indexOf(this.searchTerm) !== -1) || (responsable.indexOf(this.searchTerm) !== -1));

  }

}
