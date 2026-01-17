export interface Observer<TEvent> {
  update(event: TEvent): void;
}
