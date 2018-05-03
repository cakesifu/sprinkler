
function minutes(v) {
  if (!v) { return '0 seconds' };

  if ( v > 60000) {
    return `${Math.round(v / 6000) / 10} minutes`;
  }

  return `${v/1000} seconds`;
}


module.exports = {
  minutes,
};
