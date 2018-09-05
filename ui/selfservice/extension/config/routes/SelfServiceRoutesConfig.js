"use strict";

/*
 * Copyright 2011-2017 ForgeRock AS. All Rights Reserved
 *
 * Use of this code requires a commercial software license with ForgeRock AS.
 * or with one of its affiliates. All use shall be exclusively subject
 * to such license between the licensee and ForgeRock AS.
 */

define([], function () {

    var obj = {
        "dashboard": {
            view: "org/forgerock/openidm/ui/dashboard/Dashboard",
            role: "ui-user",
            url: "dashboard/",
            forceUpdate: true
        }
    };

    obj.landingPage = obj.dashboard;

    return obj;
});
