// Copyright (c) 2019-2023 Five Squared Interactive. All rights reserved.

const Logging = require('./logging');

module.exports = {
    /**
     * @function IdentificationRequest Identification request.
     * @param {*} connectionID Connection ID.
     * @returns An Identification Request.
     */
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

    /**
     * @function IdentificationResponse Identification Response.
     * @param {*} request Request.
     * @param {*} type Type of client.
     * @param {*} windowID Window ID.
     * @param {*} tabID Tab ID.
     * @returns An Identification Response.
     */
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

    /**
     * @function Heartbeat Heartbeat Message.
     * @param {*} connectionID Connection ID.
     * @returns A Heartbeat Message.
     */
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

    /**
     * @function NewTabRequest New Tab Request.
     * @param {*} connectionID Connection ID.
     * @param {*} type Type of tab.
     * @returns A New Tab Request.
     */
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

    /**
     * @function FocusedTabRequest Focused Tab Request.
     * @param {*} connectionID Connection ID.
     * @param {*} type Type of tab.
     * @param {*} url Tab URL.
     * @returns A Focused Tab Request.
     */
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

    /**
     * @function CloseRequest Close Request.
     * @param {*} connectionID Connection ID.
     * @returns A Close Request.
     */
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

    /**
     * @function NewTabCommand New Tab Command.
     * @param {*} connectionID Connection ID.
     * @param {*} type Tab Type.
     * @returns A New Tab Command.
     */
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

    /**
     * @function FocusedTabCommand Focused Tab Command.
     * @param {*} connectionID Connection ID.
     * @param {*} type Tab Type.
     * @param {*} url Tab URL.
     * @returns A Focused Tab Command.
     */
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

    /**
     * @function CloseCommand Close Command.
     * @param {*} connectionID Connection ID.
     * @param {*} windowID Window ID.
     * @returns A Close Command.
     */
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