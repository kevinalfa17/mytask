import { Injectable, OnInit, Component } from '@angular/core';
import firebase from 'firebase';

import { ProfileData } from '../providers/profile-data';

@Injectable()
export class NotificationsProvider {
    //public currentUser: firebase.User;
    public notificationsList: firebase.database.Reference;
    // public currentUser: string;
    public currentUser: firebase.User;
    public currenUserUid: string;
    

    constructor() {
        this.currentUser = firebase.auth().currentUser;
        this.notificationsList = firebase.database().ref(`userProfile/${this.currentUser.uid}/notifications`);
        
        //this.notificationsList = firebase.database().ref(`userProfile/${this.currenUserUid}/notifications`);
    }

    getNotificationList(): firebase.database.Reference {
        return this.notificationsList;
    }

    goToNotificationDetail(eventId): firebase.database.Reference {
        return this.notificationsList.child(eventId);
    }
}