"use strict";

/*
 * Copyright 2011-2017 ForgeRock AS. All Rights Reserved
 *
 * Use of this code requires a commercial software license with ForgeRock AS.
 * or with one of its affiliates. All use shall be exclusively subject
 * to such license between the licensee and ForgeRock AS.
 */

define(["jquery", "underscore", "org/forgerock/commons/ui/common/main/Configuration", "org/forgerock/openidm/ui/common/delegates/SiteConfigurationDelegate", "org/forgerock/commons/ui/common/components/Navigation", "org/forgerock/openidm/ui/common/delegates/SocialDelegate", "UserProfileView"], function ($, _, conf, commonSiteConfigurationDelegate, nav, SocialDelegate, UserProfileView) {

    var obj = Object.create(commonSiteConfigurationDelegate),
        hasKba = false,
        hasSocialProviders = false,
        cachedUserComponent = null;

    obj.adminCheck = false;

    obj.getConfiguration = function (successCallback, errorCallback) {
        return commonSiteConfigurationDelegate.getConfiguration().then(function (configuration) {
            if (configuration.kbaEnabled === true) {
                hasKba = true;
            }
            return obj.checkForDifferences().then(function () {
                if (successCallback) {
                    successCallback(configuration);
                }
                return configuration;
            });
        }, errorCallback);
    };

    obj.checkForDifferences = function () {
        if (conf.loggedUser && _.contains(conf.loggedUser.uiroles, "ui-admin") && !obj.adminCheck) {
            nav.configuration.userBar.unshift({
                "id": "admin_link",
                "href": "/admin",
                "i18nKey": "openidm.admin.label"
            });

            obj.adminCheck = true;
        }

        nav.reload();

        // every time the logged-in user component changes, reregister appropriate profile tabs
        if (conf.loggedUser && conf.loggedUser.component !== cachedUserComponent) {
            cachedUserComponent = conf.loggedUser.component;
            UserProfileView.resetTabs();
            // repo/internal/user records don't support "fancy" tabs like kba and social providers
            if (conf.loggedUser.component !== "repo/internal/user") {
                return SocialDelegate.providerList().then(function (socialProviders) {
                    var tabList = [],
                        promise = $.Deferred();
                    tabList.push("org/forgerock/openidm/ui/user/profile/PreferencesTab");
                    if (socialProviders.providers.length > 0) {
                        tabList.push("org/forgerock/openidm/ui/user/profile/SocialIdentitiesTab");
                    }
                    if (hasKba) {
                        tabList.push("org/forgerock/commons/ui/user/profile/UserProfileKBATab");
                    }
                    if (tabList.length) {
                        require(tabList, function () {
                            _.each(_.toArray(arguments), UserProfileView.registerTab, UserProfileView);
                            promise.resolve();
                        });
                    } else {
                        promise.resolve();
                    }
                    return promise;
                });
            }
        }

        return $.Deferred().resolve();
    };

    return obj;
});
