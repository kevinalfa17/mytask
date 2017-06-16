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

  /**
   * Constructor
   * @param viewCtrl 
   * @param navCtrl 
   * @param navParams 
   */
  constructor(public viewCtrl: ViewController, public navCtrl: NavController, public navParams: NavParams) {
    this.alarm1 = "";
    this.alarm2 = "";
    this.alarm3 = "";
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AlarmSelectorPage');
  }

  /**
   * Catch select value
   * @param selected 
   */
  select1(selected) {
    this.alarm1 = selected;

  }

  /**
   * Catch select value
   * @param selected 
   */
  select2(selected) {
    this.alarm2 = selected;

  }

  /**
   * Catch select value
   * @param selected 
   */
  select3(selected) {
    this.alarm3 = selected;

  }

  /**
   * Return an array with the 3 alarms
   */
  addAlarms() {
    var aux = [this.alarm1, this.alarm2, this.alarm3]
    this.viewCtrl.dismiss(aux);
  }

}
