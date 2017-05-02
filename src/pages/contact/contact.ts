import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { FirebaseListObservable } from 'angularfire2';
import { ProfileData } from '../../providers/profile-data';
import { ChatViewPage } from '../chat-view/chat-view';

@Component({
    templateUrl: 'contact.html'
})
export class ContactPage {
    users:FirebaseListObservable<any[]>;
    uid:string;

    constructor(public nav: NavController, public profileData: ProfileData) {}

    ngOnInit() {
            this.uid = this.profileData.currentUser.uid;
            this.users = this.profileData.getAllUsers();
    };
    
    openChat(key) {
        let param = {uid:this.uid, interlocutor: key};
        this.nav.push(ChatViewPage,param);
    }
}
