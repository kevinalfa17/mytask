import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TranslateService } from 'ng2-translate';
import { ContactsProvider } from '../../providers/contacts-provider';
import { AngularFire, FirebaseListObservable } from 'angularfire2';

@IonicPage()
@Component({
  selector: 'page-new-contact',
  templateUrl: 'new-contact.html',
})
export class NewContactPage {

  contactName:string;
  contactPhone:string;
  contactEmail:string;
  callback:any;

  /**
   * Constructor
   * @param navCtrl 
   * @param navParams 
   * @param contactsProvider 
   * @param af 
   * @param translate 
   */
  constructor(public navCtrl: NavController, public navParams: NavParams, public contactsProvider: ContactsProvider,
    public af: AngularFire, public translate: TranslateService) {
      this.translate.setDefaultLang('es');
      this.callback    = this.navParams.get('callback');
  }

  /**
   * Add new contact to contact list and data base
   */
  addContact(){
    this.contactsProvider.addNewContact(this.contactName,this.contactEmail,this.contactPhone);
    /* let contact = {
          name: this.contactName,
          email:this.contactEmail,
          phone:this.contactPhone
    };*/
    this.callback(this.contactEmail).then(()=>{ this.navCtrl.pop() });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NewContact');
  }

}
