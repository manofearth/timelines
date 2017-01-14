import { Injectable } from '@angular/core';

@Injectable()
export class Logger {

  //noinspection JSMethodCanBeStatic
  error(message: string) {
    console.error(message);
  }
}