//Some important modules
import { Injectable } from '@angular/core';
import firebase from 'firebase';
import { MediaCapture, MediaFile, CaptureError, CaptureImageOptions, CaptureAudioOptions } from '@ionic-native/media-capture';
import { NavController, LoadingController, AlertController } from 'ionic-angular';
import { FileChooser } from '@ionic-native/file-chooser';
import { File } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';
import { Platform } from 'ionic-angular';
//Providers
import { Tools } from '../providers/tools'
declare var cordova;
/**
 * This class it's used to manage all the activities with media and files
 */
@Injectable()
export class MediaData {
    public audio: any; // Variable to keep a new audio
    public video: any; // Variable to keep a new video
    public image: any; //Variable to keep a new image
    public file: any; // Variable to keep a new file
    public nativepath: any;

    constructor(public plat: Platform, public mediaCapture: MediaCapture, public f: File, public fp: FilePath, public filecho: FileChooser, public tools: Tools, public loadingCtrl: LoadingController) {

    }

    /**
     * This function it's used to take and save a new image
     */
    captureImage(currentUser) {
        var options = { limit: 1 };
        var dat;

        this.mediaCapture.captureImage(options).then(
            (data: MediaFile[]) => {
                dat = this.savedInStorage(data[0].fullPath, currentUser, "image");
                console.log("dat image");
                console.log(dat);
            },
            (err: CaptureError) => console.error(err)
        );
        return dat;
    }

    /**
     * This function it's used to take and save a new audio
     * @param currentUser The user uid to keep the audio
     */
    captureAudio(currentUser) {
        const options: CaptureAudioOptions = {
            limit: 1, duration: 60
        };
        var dat;
        this.mediaCapture.captureAudio(options).then(
            (data: MediaFile[]) => {
                dat = this.savedInStorage(data[0].fullPath, currentUser, "Audio");
            },
            (err: CaptureError) => console.error(err)
        );
        return dat;
    }

    /**
     * This function it's used to take and save a new video
     * @param currentUser The user uid to keep the video
     */
    captureVideo(currentUser: any) {
        var dat;
        var options = { limit: 1, duration: 10 };
        this.mediaCapture.captureVideo(options).then(
            (data: MediaFile[]) => {
                dat = this.savedInStorage(data[0].fullPath, currentUser, "Video");
            },
            (err: CaptureError) => console.error(err)
        );
        return dat;
    }

    /**
     * This function it's used to take and save a new file
     */
    captureFile(currentUser) {
        var dat;
        this.filecho.open().then((url) => {

            (<any>window).FilePath.resolveNativePath(url, (result) => {

                (<any>window).resolveLocalFileSystemURL(result, (res) => {
                    res.file((resFile) => {
                        dat = this.savedInStorage(result, currentUser, resFile.type);
                        console.log("dat file");
                        console.log(dat);
                    });
                });
            })
        });
        return dat;
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
    savedInStorage(data: any, currentUser: any, type: string) {
        let name = this.tools.getfilename(data);
        let ext = this.tools.getfileext(data);
        let mime = this.tools.getmime(data);
        let allowed = ['jpg', 'jpeg', 'bmp', 'png', 'm4a', 'mp4', 'pdf', 'mp3', 'wav', 'amr'];

        if (allowed.indexOf(ext) < 0) {
            this.tools.presentToast("AQUI111", "bottom");
        } else {
            // let loading = this.loadingCtrl.create({
            //     content: '...'
            // });
            // loading.present();

            this.tools.makeFileIntoBlob(data, ext, mime).then((fileblob) => {
                var newName = this.tools.randomString(10);

                let ref = firebase.storage().ref('/' + type + '/' + newName + '.' + ext);
                ref.put(fileblob, {
                    contentType: mime
                });

                // firebase.database().ref("/userProfile").child(currentUser).child(type).child(newName).set(ref.getDownloadURL()); // Aqui PONER REF A TASK
                return ref.getDownloadURL();

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
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
}