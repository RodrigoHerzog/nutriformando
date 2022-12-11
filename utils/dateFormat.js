export function dateFormat(timestamp) {
  if (timestamp) {
    const date = new Date(timestamp.toDate());

    const temp_day = date.toLocaleDateString("pt-br");
    const day =
      temp_day.substring(3, 5) +
      "/" +
      temp_day.substring(0, 2) +
      temp_day.substring(5);
    const hour = date.toLocaleTimeString("pt-br");

    return `${day} às ${hour}`;
  }
}
