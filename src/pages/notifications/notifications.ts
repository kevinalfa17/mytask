import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { EventDetailPage } from '../event-detail/event-detail';
import { EventData } from '../../providers/event-data';
import firebase from 'firebase'
import moment from 'moment';
import { ProfileData } from '../../providers/profile-data';

@Component({
    selector: 'notifications',
    templateUrl: 'notifications.html',
})
export class Notifications {
    public notificationsList: any;
    public notificationsReference: firebase.database.Reference;
    public currentUser: firebase.User;
    public currenUserUid: string;
    destineUser: any;



    constructor(public navCtrl: NavController, public profilData: ProfileData) { }

    ionViewDidEnter() {

        this.currentUser = this.profilData.currentUser;
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
    sendPushnoti(id: string, text: string) {
        firebase.database().ref(`userProfile/${this.currentUser.uid}/notifications`).child(id).update({
            Description: text,
        });
    }

    sendNotification(destinatario: string, notiID: string, descriptionNoti: string, nameNoti: string, typeNoti: string) {
        firebase.database().ref('userProfile/' + destinatario + '/notifications/' + notiID).update({
            Name: nameNoti,
            Description: descriptionNoti,
            Type: typeNoti,
            From: this.currentUser.email,
            DateSended: moment().format('D/M/YYYY'),
            HourSended: moment().format('h:m:s a'),
            Condition: 'Pending',
            Read: 'false',
        });
    }
}