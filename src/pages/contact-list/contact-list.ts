import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ViewController } from 'ionic-angular';
import { TranslateService } from 'ng2-translate';
import { ContactsProvider } from '../../providers/contacts-provider';
import { AngularFire, FirebaseListObservable } from 'angularfire2';

@IonicPage()
@Component({
  selector: 'page-contact-list',
  templateUrl: 'contact-list.html',
})
export class ContactListPage {
  users: FirebaseListObservable<any[]>;

  /**
   * Constructor
   * @param viewCtrl 
   * @param navCtrl 
   * @param navParams 
   * @param contactsProvider 
   * @param af 
   * @param translate 
   */
  constructor(public viewCtrl: ViewController,public navCtrl: NavController, public navParams: NavParams, public contactsProvider: ContactsProvider,
    public af: AngularFire, public translate: TranslateService) {
    this.translate.setDefaultLang('es');
    this.users = this.contactsProvider.getContactsRef();
  }

  /**
   * Catch the selected user
   * @param user 
   */
  userSelected(user) {
    this.viewCtrl.dismiss(user);
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad ContactList');
  }

}
