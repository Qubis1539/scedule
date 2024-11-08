import { ControllerAPI, Handler as CoreHandler } from '@brainhub/core-backend';

export class Controller extends ControllerAPI<App> {
  checkAccept() {
    return true;
  }
}

export abstract class Handler<R> extends CoreHandler<Controller, R> {
  declare manager: App;
}
