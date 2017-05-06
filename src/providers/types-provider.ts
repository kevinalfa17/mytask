import { Injectable } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2';

@Injectable()
export class TypesProvider {

  types:FirebaseListObservable<any[]>; 
  subtypes:FirebaseListObservable<any[]>; 
  totalSubtypes:FirebaseListObservable<any[]>; 

  constructor(public af: AngularFire) {
    this.types = af.database.list('/types');
    this.totalSubtypes = af.database.list('/subtypes');

  }

  getTypesRef() {
    return this.types;
  }

  getSubtypesRef(typeName: string){
    this.subtypes = this.af.database.list('subtypes', {
      query: {
        orderByChild: 'typeName',
        equalTo: typeName
      }
    });
    return this.subtypes;
  }


  addNewType(name) {

    let type = {
      typeName: name,
    };

    this.types.push(type);
  };

  addNewSubtype(name,subName) {

    let subtype = {
          typeName: name,
          subtypeName:subName
    };

        this.totalSubtypes.push(subtype);
  };

  editType(key,newName) {
    this.types.update(key,{typeName: newName });
  };

  editSubtype(key,newName) {
    this.subtypes.update(key,{subtypeName: newName });
  };

  removeType(key) {
    this.types.remove(key);
  };
   
  removeSubtype(key) {
    this.subtypes.remove(key);
  };

}
