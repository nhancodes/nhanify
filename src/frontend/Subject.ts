import { Observer } from "./Observer.js";

export class Subject<TEvent> {
  private observers: Observer<TEvent>[] = [];

  addObserver(observer: Observer<TEvent>) {
    this.observers.push(observer);
  }

  notify(event: TEvent) {
    console.log("Observers: ", this.observers);
    console.log("Subject notifying observers:", event);
    this.observers.forEach((o) => o.update(event));
  }
}
