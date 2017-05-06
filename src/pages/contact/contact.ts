import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { FirebaseListObservable } from 'angularfire2';
import { ProfileData } from '../../providers/profile-data';
import { ChatViewPage } from '../chat-view/chat-view';

import firebase from 'firebase';

@Component({
    templateUrl: 'contact.html'
})
export class ContactPage {
    users: FirebaseListObservable<any[]>;
    uid: string;

    constructor(public nav: NavController, public profileData: ProfileData) { }

    ionViewWillEnter() {
        this.uid = firebase.auth().currentUser.uid.toString();
        this.users = this.profileData.getAllUsers();
    };

    openChat(key) {
        let param = { uid: this.uid, interlocutor: key };
        this.nav.push(ChatViewPage, param);
    }
}
