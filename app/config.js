const stateFile = process.env.STATE_FILE;
const deviceKey = process.env.DEVICE_KEY;
const mqttUrl = process.env.MQTT_URL;

if (!stateFile) {
  throw new Error('need to specify a STATE_FILE env variable');
}

if (!deviceKey) {
  throw new Error('need to specify a DEVICE_KEY env variable');
}

if (!mqttUrl) {
  throw new Error('need to specify a MQTT_URL env variable');
}

module.exports = {
  stateFile,
  deviceKey,
  mqttUrl,
};
