"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/*
 * Copyright 2014-2017 ForgeRock AS. All Rights Reserved
 *
 * Use of this code requires a commercial software license with ForgeRock AS.
 * or with one of its affiliates. All use shall be exclusively subject
 * to such license between the licensee and ForgeRock AS.
 */

define(["jquery", "underscore", "org/forgerock/openidm/ui/common/util/Constants", "org/forgerock/commons/ui/common/main/EventManager"], function ($, _, constants, eventManager) {
    var ignorePassword = false,
        obj = [{
        startEvent: constants.EVENT_POLICY_FAILURE,
        description: "Failure to save record due to policy validation",
        dependencies: [],
        processDescription: function processDescription(event) {
            var response = event.error.responseObj,
                failedProperties,
                errors = "Unknown";

            if ((typeof response === "undefined" ? "undefined" : _typeof(response)) === "object" && response !== null && _typeof(response.detail) === "object" && (response.message === "Failed policy validation" || response.message === "Policy validation failed")) {

                errors = _.chain(response.detail.failedPolicyRequirements).groupBy('property').pairs().map(function (a) {
                    return " - " + a[0] + ": " + _.chain(a[1]).pluck('policyRequirements').map(function (pr) {
                        return _.map(pr, function (p) {
                            return $.t("common.form.validation." + p.policyRequirement, p.params);
                        });
                    }).value().join(", ");
                }).value().join(" ");
            }

            eventManager.sendEvent(constants.EVENT_DISPLAY_MESSAGE_REQUEST, { key: "resourceValidationError", validationErrors: errors });
        }
    }];

    return obj;
});
