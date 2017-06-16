import { Injectable } from '@angular/core';
import { AngularFire } from 'angularfire2';
import { ProfileData } from "./profile-data";

@Injectable()
export class ChatProvider {
    constructor(public af: AngularFire, public up: ProfileData) { }
    /**
     * get list of Chats of a Logged In User
     */
    getChats() {
        //return this.up.getUid().then(uid => {
        let chats = this.af.database.list(`/userProfile/${this.up.currentUser.uid}/chats`);
        return chats;
        //});
    }

    
    /**
     * Add Chat References to Both users
     * @param uid 
     * @param interlocutor 
     */
    addChats(uid, interlocutor) {
        // First User
        let endpoint = this.af.database.object(`/userProfile/${uid}/chats/${interlocutor}`);
        endpoint.set(true);

        // Second User
        let endpoint2 = this.af.database.object(`/userProfile/${interlocutor}/chats/${uid}`);
        endpoint2.set(true);
    }

    /**
     * Obtain chat reference  between two users
     * @param uid 
     * @param interlocutor 
     */
    getChatRef(uid, interlocutor) {
        let firstRef = this.af.database.object(`/chats/${uid},${interlocutor}`, { preserveSnapshot: true });
        let promise = new Promise((resolve, reject) => {
            firstRef.subscribe(snapshot => {
                let a = snapshot.exists();
                if (a) {
                    resolve(`/chats/${uid},${interlocutor}`);
                } else {
                    let secondRef = this.af.database.object(`/chats/${interlocutor},${uid}`, { preserveSnapshot: true });
                    secondRef.subscribe(snapshot => {
                        let b = snapshot.exists();
                        if (!b) {
                            this.addChats(uid, interlocutor);
                        }
                    });
                    resolve(`/chats/${interlocutor},${uid}`);
                }
            });
        });

        return promise;
    }

    /**
     * Obtain chat reference for multiple user (task)
     * @param taskid 
     */
    getTaskChatRef(taskid) {
        let firstRef = this.af.database.object(`/tasks/${taskid}/chat`, { preserveSnapshot: true });
        let promise = new Promise((resolve, reject) => {
            firstRef.subscribe(snapshot => {
                //let a = snapshot.exists();
                //if (a) {
                    resolve(`/tasks/${taskid}/chat`);
                //}
            });
        });

        return promise;
    }



}