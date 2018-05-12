const stateFile = process.env.STATE_FILE;
const deviceKey = process.env.DEVICE_KEY;
const mqttUrl = process.env.MQTT_URL;
const hwInterface = process.env.INTERFACE || 'console';
const ctrlPin = process.env.CONTROL_PIN;
const zoneCount = process.env.ZONES;
const zones = [];

if (!stateFile) {
  throw new Error('need to specify a STATE_FILE env variable');
}

if (!deviceKey) {
  throw new Error('need to specify a DEVICE_KEY env variable');
}

if (!mqttUrl) {
  throw new Error('need to specify a MQTT_URL env variable');
}

if (!zoneCount) {
  throw new Error('need to specify a ZONES env variable');
}

function zoneData(n, v) {
  const varname = `ZONE_${n}_${v}`;
  const val = process.env[varname];

  if (!val.length) {
    throw new Error(`need to specify ${varname} env variable`);
  }

  return val;
}

let i;

for (i = 1; i <= zoneCount; i++) {
  const name = zoneData(i, 'NAME');
  const flow = parseFloat(zoneData(i, 'FLOW'));
  const pin = zoneData(i, 'PIN');

  zones.push({ name, flow, pin });
}


module.exports = {
  stateFile,
  deviceKey,
  mqttUrl,
  zones,
  hwInterface,
  ctrlPin,
};
