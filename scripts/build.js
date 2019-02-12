const { exec } = require('child_process');

function build(deferral) {
  exec('npm run build', (error, stdout, stderr) => {
    if (error) {
      console.log(stderr);
      deferral.reject(error);
    }
    else {
      console.log(stdout);
      deferral.resolve();
    }
  });
}

module.exports = function(ctx) {
  const deferral = ctx.requireCordovaModule('q').defer();
  build(deferral);
  return deferral.promise;
};
