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

  constructor(public viewCtrl: ViewController,public navCtrl: NavController, public navParams: NavParams, public contactsProvider: ContactsProvider,
    public af: AngularFire, public translate: TranslateService) {
    this.translate.setDefaultLang('es');
    this.users = this.contactsProvider.getContactsRef();
  }

  userSelected(username) {
    this.viewCtrl.dismiss(username);
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad ContactList');
  }

}
