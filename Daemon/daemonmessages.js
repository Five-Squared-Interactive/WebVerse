const Logging = require('./logging');

module.exports = {
    IdentificationRequest: function(connectionID) {
        if (connectionID == null) {
            Logging.Log('[DaemonMessages->IdentificationRequest] No connection ID.');
            return null;
        }

        return {
            topic: "IDENTIFICATION-REQ",
            connectionID: connectionID
        }
    },

    IdentificationResponse: function(request, type, windowID, tabID) {
        if (request == null) {
            Logging.Log('[DaemonMessages->IdentificationResponse] Null request.');
            return null;
        }

        if (request.connectionID == null) {
            Logging.Log('[DaemonMessages->IdentificationResponse] No connection ID.');
            return null;
        }

        if (windowID == null) {
            Logging.Log('[DaemonMessages->IdentificationResponse] No window ID.');
            return null;
        }

        return {
            topic: "IDENTIFICATION-RESP",
            clientType: type,
            connectionID: request.connectionID,
            windowID: windowID,
            tabID: tabID
        }
    },

    Heartbeat: function(connectionID) {
        if (connectionID == null) {
            Logging.Log('[DaemonMessages->Heartbeat] No connection ID.');
            return null;
        }

        return {
            topic: "HEARTBEAT",
            connectionID: connectionID
        }
    },

    NewTabRequest: function(connectionID, type) {
        if (connectionID == null) {
            Logging.Log('[DaemonMessages->NewTabRequest] No connection ID.');
            return null;
        }

        if (type == null) {
            Logging.Log('[DaemonMessages->NewTabRequest] No type.');
            return null;
        }

        return {
            topic: "NEW-TAB-REQ",
            connectionID: connectionID,
            tabType: type
        }
    },

    FocusedTabRequest: function(connectionID, type, url) {
        if (connectionID == null) {
            Logging.Log('[DaemonMessages->FocusedTabRequest] No connection ID.');
            return null;
        }

        if (type == null) {
            Logging.Log('[DaemonMessages->FocusedTabRequest] No type.');
            return null;
        }

        return {
            topic: "FOCUSED-TAB-REQ",
            connectionID: connectionID,
            runtimeType: type,
            url: url
        }
    },

    CloseRequest: function(connectionID) {
        if (connectionID == null) {
            Logging.Log('[DaemonMessages->CloseRequest] No connection ID.');
            return null;
        }

        return {
            topic: "CLOSE-REQ",
            connectionID: connectionID
        }
    },

    NewTabCommand: function(connectionID, type) {
        if (connectionID == null) {
            Logging.Log('[DaemonMessages->NewTabCommand] No connection ID.');
            return null;
        }

        if (type == null) {
            Logging.Log('[DaemonMessages->NewTabCommand] No type.');
            return null;
        }

        return {
            topic: "NEW-TAB-CMD",
            connectionID: connectionID,
            tabType: type
        }
    },

    FocusedTabCommand: function(connectionID, type, url) {
        if (connectionID == null) {
            Logging.Log('[DaemonMessages->FocusedTabCommand] No connection ID.');
            return null;
        }

        if (type == null) {
            Logging.Log('[DaemonMessages->FocusedTabCommand] No type.');
            return null;
        }

        if (url == null) {
            Logging.Log('[DaemonMessages->FocusedTabCommand] No url.');
            return null;
        }

        return {
            topic: "FOCUSED-TAB-CMD",
            connectionID: connectionID,
            runtimeType: type,
            url: url
        }
    },

    CloseCommand: function(connectionID, windowID) {
        if (connectionID == null) {
            Logging.Log('[DaemonMessages->CloseCommand] No connection ID.');
            return null;
        }

        if (windowID == null) {
            Logging.Log('[DaemonMessages->CloseCommand] No window ID.');
            return null;
        }

        return {
            topic: "CLOSE-CMD",
            connectionID: connectionID
        }
    }
};