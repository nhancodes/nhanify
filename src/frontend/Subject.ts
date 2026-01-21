import { Observer } from "./Observer.js";
import { GenericEvent } from "./types/apiRouterTypes.js";

export class Subject<TEvent extends GenericEvent> {
  private observers: Observer[] = [];

  addObserver(observer: Observer) {
    this.observers.push(observer);
  }

  notify(event: TEvent) {
    console.log("Observers: ", this.observers);
    console.log("Subject notifying observers:", event);
    this.observers.forEach((o) => o.update(event));
  }
}
