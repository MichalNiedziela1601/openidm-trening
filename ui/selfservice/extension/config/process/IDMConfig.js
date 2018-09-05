"use strict";

/*
 * Copyright 2011-2017 ForgeRock AS. All Rights Reserved
 *
 * Use of this code requires a commercial software license with ForgeRock AS.
 * or with one of its affiliates. All use shall be exclusively subject
 * to such license between the licensee and ForgeRock AS.
 */

define(["underscore", "org/forgerock/openidm/ui/common/util/Constants", "org/forgerock/commons/ui/common/main/EventManager"], function (_, constants, eventManager) {
    var obj = [{
        startEvent: constants.EVENT_HANDLE_DEFAULT_ROUTE,
        description: "",
        override: true,
        dependencies: ["org/forgerock/commons/ui/common/main/Configuration", "org/forgerock/commons/ui/common/main/Router"],
        processDescription: function processDescription(event, Configuration, router) {
            if (Configuration.loggedUser) {
                eventManager.sendEvent(constants.EVENT_CHANGE_VIEW, { route: router.configuration.routes.landingPage });
            } else {
                eventManager.sendEvent(constants.EVENT_CHANGE_VIEW, { route: router.configuration.routes.login });
            }
        }
    }, {
        startEvent: constants.EVENT_NOTIFICATION_DELETE_FAILED,
        description: "Error in deleting notification",
        dependencies: [],
        processDescription: function processDescription(event) {
            eventManager.sendEvent(constants.EVENT_DISPLAY_MESSAGE_REQUEST, "errorDeletingNotification");
        }
    }, {
        startEvent: constants.EVENT_GET_NOTIFICATION_FOR_USER_ERROR,
        description: "Error in getting notifications",
        dependencies: [],
        processDescription: function processDescription(event) {
            eventManager.sendEvent(constants.EVENT_DISPLAY_MESSAGE_REQUEST, "errorFetchingNotifications");
        }
    }];

    return obj;
});
