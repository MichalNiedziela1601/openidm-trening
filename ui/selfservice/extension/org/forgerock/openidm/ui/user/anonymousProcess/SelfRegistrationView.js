"use strict";

/*
 * Copyright 2015-2017 ForgeRock AS. All Rights Reserved
 *
 * Use of this code requires a commercial software license with ForgeRock AS.
 * or with one of its affiliates. All use shall be exclusively subject
 * to such license between the licensee and ForgeRock AS.
 */

define(["jquery", "lodash", "form2js", "handlebars", "org/forgerock/commons/ui/user/anonymousProcess/AnonymousProcessView", "org/forgerock/commons/ui/common/util/OAuth", "org/forgerock/commons/ui/common/main/Router", "org/forgerock/commons/ui/user/anonymousProcess/SelfRegistrationView", "org/forgerock/commons/ui/common/main/ValidatorsManager", "org/forgerock/commons/ui/common/util/UIUtils"], function ($, _, form2js, Handlebars, AnonymousProcessView, OAuth, Router, CommonSelfRegistrationView, ValidatorsManager, UIUtils) {

    var SelfRegistrationView = AnonymousProcessView.extend({
        baseEntity: "selfservice/registration",
        partials: ["partials/process/_coreProfileDetails.html", "partials/profile/_multiValueFormFields.html", "partials/profile/_emailEntry.html", "partials/profile/_preferences.html", "partials/providers/_providerButton.html"],
        events: _.extend({
            "click [data-oauth=button]": "oauthHandler",
            "focus .float-label input": "addFloatLabelStyles",
            "blur .float-label": "removeFloatLabelStyles"
        }, CommonSelfRegistrationView.events),
        oauthHandler: function oauthHandler(e) {
            e.preventDefault();
            window.location.href = OAuth.getRequestURL($(e.target).parents("[data-oauth=button]").attr("authorization_endpoint"), $(e.target).parents("[data-oauth=button]").attr("client_id"), $(e.target).parents("[data-oauth=button]").attr("scope"), Router.getLink(Router.currentRoute, ["/continue" + (this.delegate.token ? "&token=" + this.delegate.token : "") + "&provider=" + $(e.target).parents("[data-oauth=button]").attr("value") + "&redirect_uri=" + OAuth.getRedirectURI()]));
        },

        /**
         Intercept the request to the backend to inject the nonce taken from session storage,
         when appropriate
         */
        submitDelegate: function submitDelegate(params, onSubmit) {
            if (params.provider && params.code && params.redirect_uri) {
                params = _.extend({
                    nonce: OAuth.getCurrentNonce()
                }, params);
            }
            CommonSelfRegistrationView.submitDelegate.call(this, params, onSubmit);
        },

        addFloatLabelStyles: function addFloatLabelStyles(e) {
            if (!$(e.target).attr("readonly")) {
                $(e.target).removeClass("input-lg");
                $(e.target).prev().removeClass("sr-only");
                $(e.target).parent().addClass("float-label-with-focus");
            }
        },

        removeFloatLabelStyles: function removeFloatLabelStyles(e) {
            if (!$(e.target).val()) {
                $(e.target).addClass("input-lg");
                $(e.target).prev().addClass("sr-only");
                $(e.target).parent().removeClass("float-label-with-focus");
            }
        },

        attemptCustomTemplate: function attemptCustomTemplate(stateData, baseTemplateUrl, response, processStatePromise) {
            var templateUrl = baseTemplateUrl + this.processType + "/" + response.type + "-" + response.tag + ".html",
                type = {
                "action": $.t("templates.socialIdentities.register")
            };

            if (_.has(stateData, "requirements.definitions.providers.items.oneOf")) {
                _.each(stateData.requirements.definitions.providers.items.oneOf, function (provider) {
                    provider.icon = Handlebars.compile(provider.icon)(type);
                });
            }

            UIUtils.compileTemplate(templateUrl, stateData).then(function (renderedTemplate) {
                processStatePromise.resolve(renderedTemplate);
            }, _.bind(function () {
                this.loadGenericTemplate(stateData, baseTemplateUrl, response, processStatePromise);
            }, this));
        }
    });

    SelfRegistrationView.prototype = _.extend(Object.create(CommonSelfRegistrationView), SelfRegistrationView.prototype);

    return new SelfRegistrationView();
});
