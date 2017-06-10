import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

export class DatabaseFirebaseServiceStub extends AngularFireDatabase {

  private data: any;

  constructor(data: any = {}) {
    super(null, null);
    this.data = data;
  }

  list(url: string): FirebaseListObservable<any[]> {
    return null;
  }

  object(url: string): FirebaseObjectObservable<any> {
    const objectPathAsArray: string[] = url.split('/').slice(1);
    const objectData: any = objectPathAsArray.reduce((data, key) => data[key], this.data);
    return Observable.of({
      '$key': objectPathAsArray[objectPathAsArray.length - 1],
      ...objectData
    }) as any;
  }
}

