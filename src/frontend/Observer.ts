import { GenericEvent } from "./types/apiRouterTypes";

export interface Observer<TEvent extends GenericEvent = GenericEvent> {
  update(event: TEvent): void;
}
