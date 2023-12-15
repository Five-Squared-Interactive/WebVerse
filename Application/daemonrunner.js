const { spawn } = require('child_process');
const ps = require('ps-node');

module.exports = function(daemonProcessName, daemonExecutable) {
    this.DoesDaemonExist = function(onComplete) {
        var result = false;
        ps.lookup({
            command: daemonProcessName,
            psargs: ''
            }, function(err, resultList) {
            if (err) {
                throw new Error(err);
            }
         
            resultList.forEach(function(process) {
                if (process) {
                    result = true;
                }
            });
            onComplete(result);
        });
    }

    this.StartDaemon = function() {
        daemon = spawn(daemonExecutable, [  ],
            { shell: false, detached: true, stdio: ['ignore', 'ignore', 'ignore']});
        daemon.unref();
    }
}