"use strict";

/*
 * Copyright 2016-2017 ForgeRock AS. All Rights Reserved
 *
 * Use of this code requires a commercial software license with ForgeRock AS.
 * or with one of its affiliates. All use shall be exclusively subject
 * to such license between the licensee and ForgeRock AS.
 */

define(["jquery", "underscore", "handlebars", "org/forgerock/commons/ui/common/components/BootstrapDialog", "org/forgerock/openidm/ui/common/delegates/SocialDelegate", "org/forgerock/commons/ui/common/main/Router", "org/forgerock/commons/ui/common/util/OAuth", "org/forgerock/openidm/ui/common/util/oAuthUtils", "org/forgerock/commons/ui/common/util/UIUtils", "org/forgerock/commons/ui/common/main/Configuration", "org/forgerock/commons/ui/common/util/Constants", "org/forgerock/commons/ui/common/main/EventManager", "org/forgerock/commons/ui/common/main/AbstractView"], function ($, _, Handlebars, BootstrapDialog, SocialDelegate, Router, OAuth, OAuthUtils, UIUtils, Configuration, Constants, EventManager, AbstractView) {
    var ProviderLoginDialog = AbstractView.extend({
        template: "templates/login/ProviderLoginDialog.html",
        element: "#dialogs",
        events: {
            "click [data-oauth=button]": "oauthHandler"
        },
        model: {},
        render: function render(options, userDetails, configuredProviders) {
            this.model.authenticatedCallback = options.authenticatedCallback;

            UIUtils.preloadPartial("partials/login/_loginButtons.html");
            UIUtils.preloadPartial("partials/providers/_providerButton.html");

            var type = {
                "action": $.t("templates.socialIdentities.signIn")
            };

            if (!_.isUndefined(userDetails.provider) && !_.isNull(userDetails.provider)) {
                this.model.currentProviders = _.filter(configuredProviders.providers, function (obj) {
                    return obj.name === userDetails.provider;
                });
            } else {
                this.model.currentProviders = configuredProviders.providers;
            }

            _.each(configuredProviders.providers, function (provider) {
                provider.scope = provider.scope.join(" ");

                provider.icon = Handlebars.compile(provider.icon)(type);
            });

            this.data.providers = configuredProviders.providers;

            var dialogBody = $('<div id="providerLoginDialog"></div>');

            this.$el.find('#dialogs').append(dialogBody);

            this.setElement(dialogBody);

            this.model.bootstrapDialog = BootstrapDialog.show({
                closable: false,
                title: $.t("common.form.sessionExpired"),
                type: BootstrapDialog.TYPE_DEFAULT,
                message: dialogBody,
                onshown: _.bind(function () {
                    UIUtils.renderTemplate(this.template, this.$el, _.extend({}, Configuration.globalData, this.data), _.noop, "replace");
                }, this)
            });
        },

        oauthHandler: function oauthHandler(event) {
            var _this = this;

            var handler = $(event.currentTarget),
                providerName = handler.prop("title"),
                currentProvider = _.filter(this.model.currentProviders, function (obj) {
                return obj.name === providerName;
            })[0],
                state = "login/&provider=" + providerName + "&redirect_uri=" + OAuth.getRedirectURI() + "&gotoURL=#openerHandler/loginDialog",
                url = OAuthUtils.getUrl(currentProvider, state),
                options = {
                "redirect_uri": OAuth.getRedirectURI(),
                "windowName": providerName,
                "path": url + "&display=popup",
                "callback": function callback() {
                    _this.model.bootstrapDialog.close();
                }
            };

            OAuthUtils.oauthPopup(options);
        },

        oauthReturn: function oauthReturn() {
            EventManager.sendEvent(Constants.EVENT_AUTHENTICATION_DATA_CHANGED, {
                anonymousMode: false
            });

            EventManager.sendEvent(Constants.EVENT_DISPLAY_MESSAGE_REQUEST, "loggedIn");

            this.model.bootstrapDialog.close();

            if (this.model.authenticatedCallback) {
                this.model.authenticatedCallback();
            }
        }
    });

    return new ProviderLoginDialog();
});
