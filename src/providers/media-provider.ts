//Some important modules
import { Injectable } from '@angular/core';
import firebase from 'firebase';
import { MediaCapture, MediaFile, CaptureError, CaptureImageOptions } from '@ionic-native/media-capture';

/**
 * This class it's used to manage all the activities with media and files
 */
@Injectable()
export class MediaData {
    public audio: any; // Variable to keep a new audio
    public video: any; // Variable to keep a new video
    public image: any; //Variable to keep a new image
    public file: any; // Variable to keep a new file
    public userProfile: firebase.database.Reference; // The reference to the node users in the database

    constructor(public mediaCapture: MediaCapture) {

    }

    /**
     * This function it's used to take and save a new image
     */
    captureImage() {
        var options = { limit: 3 };
        this.mediaCapture.captureAudio(options).then(function (imageData) {
            this.image.name = imageData[0];
            this.image.url = imageData[1].fullpath;
        }, function (err) {
            alert("Error al capturar audio");
        });
        return this.image;
    }

    /**
     * This function it's used to take and save a new audio
     */
    captureAudio() {
        var options = { limit: 1, duration: 10 };
        this.mediaCapture.captureAudio(options).then(function (audioData) {

            alert(audioData);
            this.audio.name = audioData[0];
            this.audio.url = audioData[1].fullpath;
        }, function (err) {
            alert("Error al capturar audio");
        });
        return this.audio;
    }

    /**
     * This function it's used to take and save a new video
     */
    captureVideo() {
        var options = { limit: 3, duration: 10, quality: 95 };

        this.mediaCapture.captureVideo(options).then(function (videoData) {
            this.video.name = videoData[0];
            this.video = videoData[1].fullpath;
        }, function (err) {
            alert("Error al capturar video");
        });
        return this.video;
    }

    /**
     * This function it's used to take and save a new file
     */
    captureFile() {

    }

    /**
     * This function it's used to delete the info in the diferent variables
     */
    deletedatas() {
        this.video = null;
        this.audio = null;
        this.image = null;
        this.file = null;
    }

    /**
     * This function it's used to save in the storage of firebase a new file
     * @param currentUser The user uid to name the folder and keep the file
     * @param data The data to save
     * @param type The type of data to distribute in diferent folders
     */
    savedInStorage(currentUser, data, type) {
        if (type == "image") {
            firebase.storage().ref('/Images').child(currentUser).child(data.Name).putString(data, 'base64', { contentType: 'image/png' }).then((savedPicture) => {
                firebase.database().ref("/userProfile").child(currentUser).child('images').child("NAME").set(savedPicture.downloadURL);
            });
        } else if (type == "audio") {
            firebase.storage().ref('/Audios').child(currentUser).child(data.Name).putString(data.url, 'base64', { contentType: 'audio/mpeg' }).then((save) => {
                firebase.database().ref("/userProfile").child(currentUser).child('audios').child(data.name).set(save.downloadURL);
            });
        } else if (type == "video") {
            firebase.storage().ref('/Videos').child(currentUser).child(data.Name).putString(data, 'base64', { contentType: 'video/mp4' }).then((save) => {
                firebase.database().ref("/userProfile").child(currentUser).child('videos').child("NAME").set(save.downloadURL);

            });
        } else {
            firebase.storage().ref('/Files').child(currentUser).child(data.Name).put(data).then((save) => {
                firebase.database().ref("/userProfile").child(currentUser).child('files').child("NAME").set(save.downloadURL);

            });
        }
    }
    /**
     * It's used to get the file
     * @param currentUser The user uid to reference the correct folder where is the file
     * @param dataKey The key of the file
     * @param type The type of file
     */
    downloadFile(currentUser, dataKey, type) {
        if (type == "image") {

        } else if (type == "audio") {

        } else if (type == "video") {

        } else {

        }
    }
}