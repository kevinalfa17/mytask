import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { EventDetailPage } from '../event-detail/event-detail';
import { EventData } from '../../providers/event-data';
import firebase from 'firebase'


@Component({
    selector: 'notifications',
    templateUrl: 'notifications.html',
})
export class Notifications {
    public notificationsList: any;
    public notificationsReference: firebase.database.Reference;
    public currentUser: firebase.User;
    public currenUserUid: string;



    constructor(public navCtrl: NavController) { }

    ionViewDidEnter() {

        this.currentUser = firebase.auth().currentUser;
        this.notificationsReference = firebase.database().ref(`userProfile/${this.currentUser.uid}/notifications`);

        this.notificationsReference.orderByChild('Type').on('value', snapshot => {

            let rawList = [];
            snapshot.forEach(snap => {
                rawList.push({
                    id: snap.key,
                    Name: snap.val().Name,
                    Description: snap.val().Description,
                    Type: snap.val().Type,
                });
                return false
            })
            this.notificationsList = rawList;
        });
    }

    goToNotificationDetail(eventId) {
        // this.nav.push(EventDetailPage, { eventId: eventId });
    }

}