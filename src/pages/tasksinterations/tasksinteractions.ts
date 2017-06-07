//Some imports of modules
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import firebase from 'firebase'
//Providers
import { ProfileData } from '../../providers/profile-data';

/**
 * This page it's used to show the diferent interactions with notifications
 */
@Component({
    selector: 'tasksinteractions',
    templateUrl: 'tasksinteractions.html',
})
export class Tasksinteractions {
    public tasksAcceptList: any; // List of accepted tasks
    public tasksRejectedList: any; // List of rejected task

    public tasksAcceptReference: firebase.database.Reference; // The reference to the node of accepted tasks in the userProfile
    public tasksRejectedReference: firebase.database.Reference; // The reference to the node of rejected tasks in the userProfile
    public currentUser: any; // The information of the current user



    constructor(public navCtrl: NavController, public profilData: ProfileData) { }

    /**
     * Function used to reload and see the changing data and refresh the diferent lists
     */
    ionViewDidEnter() {

        this.currentUser = this.profilData.currentUser;
        this.tasksAcceptReference = firebase.database().ref(`userProfile/${this.currentUser.uid}/taskManage/Accept`);
        this.tasksRejectedReference = firebase.database().ref(`userProfile/${this.currentUser.uid}/taskManage/Rejected`);

        this.tasksAcceptReference.on('value', snapshot => {

            let rawList = [];
            snapshot.forEach(snap => {
                rawList.push({
                    id: snap.key,
                    Name: snap.val().Name,
                    Description: snap.val().Description,
                });
                return false
            })
            if (rawList.length == 0) {
                rawList.push({
                    id: 0,
                    Name: "No hay tareas aceptadas",
                    Description: "Vacio",
                });
                this.tasksAcceptList = rawList;
            } else {
                this.tasksAcceptList = rawList;
            }
        });

        this.tasksRejectedReference.on('value', snapshot => {

            let rawList = [];
            snapshot.forEach(snap => {
                rawList.push({
                    id: snap.key,
                    Name: snap.val().Name,
                    Description: snap.val().Description,
                });
                return false
            })
            if (rawList.length == 0) {
                rawList.push({
                    id: 0,
                    Name: "No hay tareas rechazadas",
                    Description: "Vacio",
                });
                this.tasksRejectedList = rawList;
            } else {
                this.tasksRejectedList = rawList;
            }

        });
    }
    /**
     * Used to see the data of the task accepted
     * @param eventId The id of the event to see
     */
    goTotaskDetail(eventId) {
        // this.nav.push(EventDetailPage, { eventId: eventId });
    }
}