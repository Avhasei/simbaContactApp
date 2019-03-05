import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { SpinnerDialog } from '@ionic-native/spinner-dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { AlertController} from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
	userInfo: boolean;
	deleteUser: boolean;
  saveUser: boolean;
  updateUser: boolean;
  noContacts: boolean;

  imageUrl : any;
	allContacts: any
	firstName: string;
	lastName: string;
	companyName: string;
	email: string;
	cellPhone: number;
	officePhone: number;
	birthDate: any;
	userID : number;

  constructor(private sqlite: SQLite,public navCtrl: NavController,private spinnerDialog: SpinnerDialog,private sanitizer: DomSanitizer,private camera: Camera,private alertController: AlertController) {

  	this.imageUrl = "assets/imgs/profile.png";
  	this.userInfo = false;
  	this.deleteUser = false;
    this.saveUser = false;
    this.updateUser = false;
    this.noContacts = false;

  }

	ionViewDidLoad() {
		this.getData();
	}

  backFunc = function(){
    this.userInfo = false;
    this.deleteUser = false;
    this.saveUser = false;
    this.updateUser = false;
    this.noContacts = false;
  }

  addNewUser = function(){
    this.imageUrl = "assets/imgs/profile.png";

    this.userInfo = true;
    this.updateUser = false;
    this.deleteUser = false;
    this.saveUser = true;
    this.noContacts = false;

    this.userID = "";
    this.firstName = "";
    this.lastName = "";
    this.companyName = "";
    this.email = "";
    this.cellPhone = "";
    this.officePhone = "";
    this.birthDate = new Date('1990-01-01').toISOString();
  }

  viewContact = function (rowid){
    this.userInfo = true;
    this.updateUser = true;
    this.deleteUser = true;
    this.saveUser = false;
    this.userID = null;

    for(var i=0;i<this.allContacts.length;i++){
      if(rowid == this.allContacts[i].rowid){
        this.userID = this.allContacts[i].rowid;
        this.firstName = this.allContacts[i].firstName;
        this.lastName = this.allContacts[i].lastName;
        this.companyName = this.allContacts[i].companyName;
        this.email = this.allContacts[i].email;
        this.cellPhone = this.allContacts[i].cellPhone;
        this.officePhone = this.allContacts[i].officePhone;
        this.birthDate = new Date(this.allContacts[i].birthDate).toISOString();
        this.imageUrl = this.allContacts[i].imageUrl;
      }
    }
  }

	getData = function () {
    this.userInfo = false;
    this.deleteUser = false;
    this.saveUser = false;
    this.updateUser = false;
    this.noContacts = false;

    this.sqlite.create({
      name: 'myContacts.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('CREATE TABLE IF NOT EXISTS contactList(rowid INTEGER PRIMARY KEY, firstName TEXT, lastName TEXT, companyName TEXT, email TEXT, cellPhone INT, officePhone INT, date TEXT,imageUrl TEXT)',[])
        .then(res => {
          db.executeSql('SELECT * FROM contactList ORDER BY firstName ASC',[])
          .then(res => {
            this.allContacts = [];
            for(var i=0; i<res.rows.length; i++) {
              this.allContacts.push({rowid:res.rows.item(i).rowid,firstName:res.rows.item(i).firstName,lastName:res.rows.item(i).lastName,companyName:res.rows.item(i).companyName,email:res.rows.item(i).email,cellPhone:res.rows.item(i).cellPhone,officePhone:res.rows.item(i).officePhone, date:res.rows.item(i).date, imageUrl:res.rows.item(i).imageUrl})
            }
            console.log(this.allContacts);

            if(this.allContacts.length == 0){
              this.noContacts = true;
            }
          })
          .catch(e => console.log(e));
        })
        .catch(e => {
          console.log(e);
        });
    }).catch(e => {
      console.log(e);
    });
	}

	saveData = function () {
    this.sqlite.create({
      name: 'myContacts.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('INSERT INTO contactList VALUES(NULL,?,?,?,?,?,?,?,?)',[this.firstName,this.lastName,this.companyName,this.email,this.cellPhone,this.officePhone,this.birthDate,this.imageUrl])
        .then(res => {
          console.log(res);
          
          this.getData();

        })
        .catch(e => {
          console.log(e);
          
        });
    }).catch(e => {
      console.log(e);
      
    });
  }

	updateData = function () {
	    this.sqlite.create({
	      name: 'myContacts.db',
	      location: 'default'
	    }).then((db: SQLiteObject) => {
	      db.executeSql('UPDATE contactList SET firstName=?,lastName=?,companyName=?,email=?,cellPhone=?,officePhone=?,date=?,imageUrl=? WHERE rowid=?',[this.firstName,this.lastName,this.companyName,this.email,this.cellPhone,this.officePhone,this.birthDate,this.imageUrl,this.userID])
	        .then(res => {
	          console.log(res);

	          this.getData();

	        })
	        .catch(e => {
	          console.log(e);
	          
	        });
	    }).catch(e => {
	      console.log(e);
	      
	    });
	  }

	deleteData = function () {
	  this.sqlite.create({
	    name: 'myContacts.db',
	    location: 'default'
	  }).then((db: SQLiteObject) => {
  	    db.executeSql('DELETE FROM contactList WHERE rowid=?', [this.userID])
  	    .then(res => {
  	      console.log(res);

  	      this.getData();
      
  	    })
  	    .catch(e => {
          console.log(e);
        });
	  }).catch(e => {
        console.log(e);
      });
	}

  setOptions(srcType) {
    var options = {
        // Some common settings are 20, 50, and 100
        quality: 100,
        destinationType: this.camera.DestinationType.DATA_URL,
        // In this app, dynamically set the picture source, Camera or photo gallery
        sourceType: srcType,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE,
        allowEdit: true,
        correctOrientation: true,
        targetWidth: 150,
        targetHeight: 150,
    }
    return options;
  }

  setProfilePicture = function () {
    let alert = this.alertController.create();
    alert.setTitle('Confirm!');
    // alert.setMessage('Message <strong>text</strong>!!!');
    alert.addButton({
      text: 'Camera',
      cssClass: 'btnCenter',
      handler: () => {
        console.log('Camera');
        var imageType = this.camera.PictureSourceType.CAMERA;
        var options = this.setOptions(imageType);

        this.camera.getPicture(options).then((imageData) => {
         // imageData is either a base64 encoded string or a file URI
         // If it's base64:
         let base64Image = 'data:image/jpeg;base64,' + imageData;
         this.imageUrl = base64Image;
        }, (err) => {
         this.imageUrl = "assets/imgs/default_profile.png";
        });
      }
    });
    alert.addButton({
      text: 'Gallery',
      cssClass: 'btnCenter',
      handler: () => {
        console.log('Gallery');
        var imageType = this.camera.PictureSourceType.PHOTOLIBRARY;
        var options = this.setOptions(imageType);

        this.camera.getPicture(options).then((imageData) => {
         // imageData is either a base64 encoded string or a file URI
         // If it's base64:
         let base64Image = 'data:image/jpeg;base64,' + imageData;
         this.imageUrl = base64Image;
        }, (err) => {
         this.imageUrl = "assets/imgs/profile.png";
        });
      }
    });

    alert.present(alert).then(() => {
      console.log("ok it works");
    });
  }
}
