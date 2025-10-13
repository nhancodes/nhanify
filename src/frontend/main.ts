/* eslint-disable */
export function confirmSubmit(event: Event, message: string) {
  event.preventDefault();
  if (confirm(message) && event.target) {
    (event.target as HTMLFormElement).submit();
  }
}
