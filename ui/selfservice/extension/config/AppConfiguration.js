"use strict";

/*
 * Copyright 2011-2017 ForgeRock AS. All Rights Reserved
 *
 * Use of this code requires a commercial software license with ForgeRock AS.
 * or with one of its affiliates. All use shall be exclusively subject
 * to such license between the licensee and ForgeRock AS.
 */

define(["org/forgerock/openidm/ui/common/util/Constants", "org/forgerock/commons/ui/common/main/EventManager"], function (constants, eventManager) {
    var obj = {
        moduleDefinition: [{
            moduleClass: "org/forgerock/commons/ui/common/main/SessionManager",
            configuration: {
                loginHelperClass: "org/forgerock/openidm/ui/common/login/InternalLoginHelper"
            }
        }, {
            moduleClass: "org/forgerock/commons/ui/common/SiteConfigurator",
            configuration: {
                remoteConfig: true,
                delegate: "org/forgerock/openidm/ui/util/delegates/SiteConfigurationDelegate"
            }
        }, {
            moduleClass: "org/forgerock/commons/ui/common/main/ProcessConfiguration",
            configuration: {
                processConfigurationFiles: ["config/process/IDMConfig", "config/process/CommonIDMConfig", "config/process/CommonConfig"]
            }
        }, {
            moduleClass: "org/forgerock/commons/ui/common/main/Router",
            configuration: {
                routes: {},
                loader: [{ "routes": "config/routes/CommonRoutesConfig" }, { "routes": "config/routes/CommonIDMRoutesConfig" }, { "routes": "config/routes/SelfServiceRoutesConfig" }, { "routes": "config/routes/UserRoutesConfig" }]
            }
        }, {
            moduleClass: "org/forgerock/commons/ui/common/main/ServiceInvoker",
            configuration: {
                defaultHeaders: {}
            }
        }, {
            moduleClass: "org/forgerock/commons/ui/common/main/ErrorsHandler",
            configuration: {
                defaultHandlers: {},
                loader: [{ "defaultHandlers": "config/errorhandlers/CommonErrorHandlers" }]
            }
        }, {
            moduleClass: "org/forgerock/commons/ui/common/components/Navigation",
            configuration: {
                username: {
                    "isLink": true,
                    "href": "#profile/",
                    "secondaryLabel": "config.AppConfiguration.Navigation.links.viewProfile"
                },
                userBar: [{
                    "id": "change_password",
                    "href": "#profile/password",
                    "i18nKey": "common.user.changePassword"
                }, {
                    "id": "logout_link",
                    "href": "#logout/",
                    "i18nKey": "common.form.logout"
                }],
                links: {
                    "user": {
                        "urls": {
                            "dashboard": {
                                "url": "#dashboard/",
                                "name": "config.AppConfiguration.Navigation.links.dashboard",
                                "icon": "fa fa-dashboard",
                                "inactive": false
                            },
                            "profile": {
                                "url": "#profile/",
                                "name": "common.user.profile",
                                "icon": "fa fa-user",
                                "inactive": false
                            }
                        }
                    }
                }
            }
        }, {
            moduleClass: "org/forgerock/openidm/ui/common/workflow/FormManager",
            configuration: {
                forms: {// Workflow User Task to View mapping
                }
            }
        }, {
            moduleClass: "org/forgerock/commons/ui/common/util/UIUtils",
            configuration: {
                templateUrls: []
            }
        }, {
            moduleClass: "org/forgerock/commons/ui/common/components/Messages",
            configuration: {
                messages: {},
                loader: [{ "messages": "config/messages/CommonMessages" }, { "messages": "config/messages/CommonIDMMessages" }, { "messages": "config/messages/SelfServiceMessages" }, { "messages": "config/messages/UserMessages" }]
            }
        }, {
            moduleClass: "org/forgerock/commons/ui/common/main/ValidatorsManager",
            configuration: {
                validators: {},
                loader: [{ "validators": "config/validators/SelfServiceValidators" }, { "validators": "config/validators/CommonValidators" }]
            }
        }],
        loggerLevel: 'debug'
    };

    return obj;
});
