"use strict";

/*
 * Copyright 2016-2017 ForgeRock AS. All Rights Reserved
 *
 * Use of this code requires a commercial software license with ForgeRock AS.
 * or with one of its affiliates. All use shall be exclusively subject
 * to such license between the licensee and ForgeRock AS.
 */

define(["jquery", "underscore", "handlebars", "org/forgerock/commons/ui/common/main/Router", "org/forgerock/commons/ui/common/util/OAuth"], function ($, _, Handlebars, Router, OAuth) {

    var obj = {};

    /**
     *
     * @param options - Object containing parameters used to generate the session in window
     *      path - URL to be used for the new window
     *      windowName - Name of the new window
     *      windowOptions - height and width of the window
     *
     *      Generates a new window
     */
    obj.oauthPopup = function (options) {
        var width = "";
        var height = "";

        width = screen.width * (2 / 3);
        height = screen.height * (2 / 3);

        options.windowName = options.windowName || 'ConnectWithOAuth';
        options.windowOptions = options.windowOptions || 'location=0,status=0,width=' + width + ',height=' + height;
        options.callback = options.callback || function () {
            window.location.reload();
        };

        window.open(options.path, options.windowName, options.windowOptions);
    };

    /**
     *
     * @param provider - IDM provider object
     * @param state - The URL state used for the oAuth return
     * @returns - Built out url for oAuth use
     */
    obj.getUrl = function (provider, state) {
        var scopes = void 0;

        if (_.isArray(provider.scope)) {
            scopes = provider.scope.join(" ");
        } else {
            scopes = provider.scope;
        }

        return OAuth.getRequestURL(provider.authorization_endpoint, provider.client_id, scopes, state);
    };

    /**
     * Iterates over
     * @param name
     */
    obj.setDisplayIcons = function (providers) {
        _.each(providers, function (provider) {
            switch (provider.name) {
                case "google":
                    provider.displayIcon = "google";
                    break;
                case "facebook":
                    provider.displayIcon = "facebook";
                    break;
                case "linkedIn":
                    provider.displayIcon = "linkedin";
                    break;
                default:
                    provider.displayIcon = "cloud";
                    break;
            }
        });

        return providers;
    };

    return obj;
});
