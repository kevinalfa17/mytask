import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { FirebaseListObservable } from 'angularfire2';
import { ProfileData } from '../../providers/profile-data';
import { ChatViewPage } from '../chat-view/chat-view';
import { ContactsProvider } from '../../providers/contacts-provider';


import firebase from 'firebase';

@Component({
    templateUrl: 'contact.html'
})
export class ContactPage {
    users: FirebaseListObservable<any[]>;
    uid: string;
    contactEmails: Array<string>;


    /**
     * Constructor
     * @param nav 
     * @param profileData 
     * @param contactsProvider 
     */
    constructor(public nav: NavController, public profileData: ProfileData, public contactsProvider: ContactsProvider) {
        this.contactEmails = [];
        contactsProvider.getContactsEmail().then((result: Array<string>) => {
            if (typeof result != 'undefined') {
                this.contactEmails = result;
            };
            
        })

    }

    ionViewWillEnter() {
        this.uid = this.profileData.currentUser.uid;
        this.users = this.profileData.getAllUsers();
    };

    openChat(key) {
        let param = { uid: this.uid, interlocutor: key };
        this.nav.push(ChatViewPage, param);
    }

    validateContacts(key, email) {
        if (key !== this.uid && this.contactEmails.indexOf(email) > -1) {
            return true;
        } else {
            return false;
        }

    }
}
