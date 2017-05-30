import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { NotificationDetailPage } from '../notification-detail/notification-detail';
import { EventData } from '../../providers/event-data';
import firebase from 'firebase'
import moment from 'moment';
import { NotificationData } from '../../providers/notification-provider';
import { ProfileData } from '../../providers/profile-data';
import { LocalNotifications } from '@ionic-native/local-notifications';

@Component({
    selector: 'notifications',
    templateUrl: 'notifications.html',
})
export class Notifications {
    public notificationsList: any;
    public notificationlistview: any;
    public notificationsReference: firebase.database.Reference;
    public currentUser: any;
    public localNotificationsList = [];


    constructor(public navCtrl: NavController, public profiledata: ProfileData, public notificationData: NotificationData, public localNotifications: LocalNotifications) {
        this.notificationsList = [];
    }
    ionViewWillEnter() {
        this.currentUser = this.profiledata.currentUser.uid;
        //this.notificationData.getNotifications(this.currentUser);
        console.log('aqui');
        console.log(this.currentUser);
        this.notificationsList = this.notificationData.getNotificationsList(this.currentUser);
    }

    goToNotificationDetail(notificationId) {
        this.navCtrl.push(NotificationDetailPage, { notificationId: notificationId, currentUser: this.currentUser });
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
        this.localNotificationsList.push(localNoti);
        this.localNotifications.schedule(localNoti);

    }

    cancellLocalNotification() {

    }

    delete(notiID) {
        this.notificationData.deleteNotificationTemp(notiID, this.currentUser);
    }
}