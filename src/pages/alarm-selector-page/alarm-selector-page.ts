import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';



@IonicPage()
@Component({
  selector: 'page-alarm-selector-page',
  templateUrl: 'alarm-selector-page.html',
})
export class AlarmSelectorPage {

  alarm1: string;
  alarm2: string;
  alarm3: string;

  constructor(public viewCtrl: ViewController,public navCtrl: NavController, public navParams: NavParams) {
    this.alarm1 = "";
    this.alarm2 = "";
    this.alarm3 = "";
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AlarmSelectorPage');
  }

  select1(selected) {
    this.alarm1 = selected;

  }

  select2(selected) {
    this.alarm2 = selected;

  }

  select3(selected) {
    this.alarm3 = selected;

  }

   addAlarms() {
    //this.viewCtrl.dismiss(user);
  }

}
