import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { NotificationDetailPage } from '../notification-detail/notification-detail';
import { EventData } from '../../providers/event-data';
import firebase from 'firebase'
import moment from 'moment';
import { NotificationData } from '../../providers/notification-provider';
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
    public localNotificationsList = [];


    constructor(public navCtrl: NavController, public notificationData: NotificationData, public localNotifications: LocalNotifications) { }
    //, public localNotifications: LocalNotifications
    ionViewDidEnter() {
        this.notificationData.getNotifications();
        this.notificationsList = this.notificationData.ListNotifications;
    }

    goToNotificationDetail(notificationId) {
        this.navCtrl.push(NotificationDetailPage, { notificationId: notificationId });
    }
    sendPushnoti(id: string, text: string) {
        firebase.database().ref(`userProfile/${this.currentUser.uid}/notifications`).child(id).update({
            Description: text,
        });
    }

    sendNotification(destinatario: string, notiID: string, descriptionNoti: string, nameNoti: string, typeNoti: string) {
        this.notificationData.createNotification("2EGLQk5MerSIIcfVLigyGrhFSxO2", "gggg iziziz", "SIRVE", "cita", "2EGLQk5MerSIIcfVLigyGrhFSxO2");
    }

    addLocalnoti() {
        var localNoti = {
            id: moment.now(),
            title: "SIRVAA",
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

    cancellLocalNotification() {

    }

    delete(notiID) {
        this.notificationData.deleteNotification(notiID);
    }
}