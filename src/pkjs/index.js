// PebbleKit JS — phone-side code.
// Runs on the connected phone when the watchface launches; use it for
// networking, geolocation, and AppMessage communication with the watch.

Pebble.addEventListener('ready', function (e) {
  console.log('PebbleKit JS ready!');
});

Pebble.addEventListener('appmessage', function (e) {
  console.log('Received message: ' + JSON.stringify(e.payload));
});
