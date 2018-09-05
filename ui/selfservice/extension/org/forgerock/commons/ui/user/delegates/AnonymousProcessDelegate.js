"use strict";

/*
 * Copyright 2015-2017 ForgeRock AS. All Rights Reserved
 *
 * Use of this code requires a commercial software license with ForgeRock AS.
 * or with one of its affiliates. All use shall be exclusively subject
 * to such license between the licensee and ForgeRock AS.
 */

define(["jquery", "underscore", "org/forgerock/commons/ui/common/main/AbstractDelegate", "org/forgerock/commons/ui/common/util/Constants"], function ($, _, AbstractDelegate, Constants) {

    var AnonymousProcessDelegate = function AnonymousProcessDelegate(path, token, additional) {
        this.token = token;
        this.additional = additional || "";
        return AbstractDelegate.call(this, "/" + Constants.context + "/" + path);
    };

    AnonymousProcessDelegate.prototype = Object.create(AbstractDelegate.prototype);
    AnonymousProcessDelegate.prototype.constructor = AnonymousProcessDelegate;

    AnonymousProcessDelegate.prototype.start = function () {
        if (!this.token || !this.lastResponse) {
            return this.serviceCall({
                "type": "GET",
                "url": ""
            }).done(function (response) {
                this.lastResponse = response;
            });
        } else {
            // the presence of a token means this can be treated as more of a "resume" than a start
            return $.Deferred().resolve(this.lastResponse);
        }
    };

    /**
     * Takes a generic object as input to submit to the process, intended to fulfill the requirements
     * outlined by the previous request.
     * @returns {Object} A promise that is resolved when the backend responses to the provided input
     */
    AnonymousProcessDelegate.prototype.submit = function (input) {
        return this.serviceCall({
            "type": "POST",
            "url": "?_action=submitRequirements" + this.additional,
            "data": JSON.stringify({
                "token": this.token,
                "input": input
            }),
            "errorsHandlers": {
                "failed": {
                    status: "400"
                }
            }
        }).then(_.bind(function (response) {
            if (_.has(response, "token")) {
                this.token = response.token;
            }
            this.lastResponse = response;
            return response;
        }, this), _.bind(function (xhr) {
            delete this.token;
            delete this.lastResponse;
            return {
                "status": {
                    "success": false,
                    "reason": xhr.responseJSON.message
                }
            };
        }, this));
    };

    return AnonymousProcessDelegate;
});
