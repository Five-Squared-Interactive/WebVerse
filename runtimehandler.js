// Copyright (c) 2019-2025 Five Squared Interactive. All rights reserved.

const { spawn } = require('child_process');

/**
 * @class Class that handles the runtime process.
 * @param {*} runtimePath Path to the runtime executable.
 */
module.exports = function(runtimePath) {

    /**
     * @method LoadRuntime Loads the runtime.
     */
    this.LoadRuntime = function() {
        var runtime = spawn(runtimePath, [  ],
            { shell: false, detached: true, stdio: ['ignore', 'ignore', 'ignore']});
        runtime.unref();
    }
};