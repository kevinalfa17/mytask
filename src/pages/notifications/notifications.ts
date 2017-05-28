import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { EventDetailPage } from '../event-detail/event-detail';
import { EventData } from '../../providers/event-data';
import firebase from 'firebase'
import moment from 'moment';
import { ProfileData } from '../../providers/profile-data';
import { LocalNotifications } from '@ionic-native/local-notifications';

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
    public varNew = 0;

    public localNotificationsList = [];


    constructor(public navCtrl: NavController, public profilData: ProfileData, public localNotifications: LocalNotifications) { }
    //, public localNotifications: LocalNotifications
    ionViewDidEnter() {
        this.profilData.getNotifications();
        this.notificationsList = this.profilData.ListNotifications;
        this.varNew = this.profilData.numberNewNotifications;
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

    addLocalnoti() {
        var localNoti ={
            id: moment.now(),
            title:"SIRVAA",
            text: 'Single ILocalNotification',
            sound: null,//'file://audio/notification.wav',
            at: moment.now() + 100,
            every: "minute",
            smallIcon: "http://static.tumblr.com/5c90a92aa8597626a00a0845eea82ca3/e5nd402/pEdn4g1vc/tumblr_static_kvycde7padscokkwgs8k88oc.png",
            led: 'FF0000'
        };

        alert(moment.now().toString() + "gjhm");

        this.localNotificationsList.push(localNoti);
        this.localNotifications.schedule(localNoti);

    }

    cancellLocalNotification(){

    }

}