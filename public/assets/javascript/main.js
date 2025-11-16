/* eslint-disable */
export function confirmSubmit(event, message) {
    event.preventDefault();
    if (confirm(message) && event.target) {
        event.target.submit();
    }
}
//# sourceMappingURL=main.js.map