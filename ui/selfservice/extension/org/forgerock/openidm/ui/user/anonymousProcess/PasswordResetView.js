"use strict";

/*
 * Copyright 2015-2017 ForgeRock AS. All Rights Reserved
 *
 * Use of this code requires a commercial software license with ForgeRock AS.
 * or with one of its affiliates. All use shall be exclusively subject
 * to such license between the licensee and ForgeRock AS.
 */

define(["jquery", "lodash", "form2js", "handlebars", "org/forgerock/commons/ui/user/anonymousProcess/AnonymousProcessView", "org/forgerock/openidm/ui/common/util/Constants", "org/forgerock/commons/ui/common/main/EventManager", "org/forgerock/commons/ui/user/anonymousProcess/PasswordResetView", "org/forgerock/commons/ui/common/main/ValidatorsManager"], function ($, _, form2js, Handlebars, AnonymousProcessView, Constants, EventManager, CommonPasswordResetView, ValidatorsManager) {

    var PasswordResetView = AnonymousProcessView.extend({
        baseEntity: "selfservice/reset",

        renderProcessState: function renderProcessState(response) {
            if (_.has(response, "requirements.error") && response.requirements.error.message === "Failed policy validation") {
                EventManager.sendEvent(Constants.EVENT_POLICY_FAILURE, {
                    error: {
                        responseObj: response.requirements.error
                    }
                });
            }
            CommonPasswordResetView.renderProcessState.call(this, response);
        }
    });

    PasswordResetView.prototype = _.extend(Object.create(CommonPasswordResetView), PasswordResetView.prototype);

    return new PasswordResetView();
});
