"use strict";

/*
 * Copyright 2011-2017 ForgeRock AS. All Rights Reserved
 *
 * Use of this code requires a commercial software license with ForgeRock AS.
 * or with one of its affiliates. All use shall be exclusively subject
 * to such license between the licensee and ForgeRock AS.
 */

define(["jquery", "underscore", "org/forgerock/commons/ui/common/main/AbstractView", "org/forgerock/openidm/ui/common/notifications/NotificationDelegate", "org/forgerock/commons/ui/common/main/EventManager", "org/forgerock/commons/ui/common/util/Constants", "org/forgerock/commons/ui/common/main/Configuration", "org/forgerock/commons/ui/common/util/DateUtil"], function ($, _, AbstractView, notificationDelegate, eventManager, constants, conf, DateUtil) {
    var NotificationsView = AbstractView.extend({
        events: {
            "click .list-item-close": "deleteLink"
        },
        element: "#notifications",
        template: "templates/notifications/NotificationMessageTemplate.html",
        noBaseTemplate: true,
        data: {},

        render: function render(args, callback) {
            this.element = args.el;
            this.data.notifications = args.items;

            _.each(this.data.notifications, function (notification) {
                notification.createDate = DateUtil.formatDate(notification.createDate, "MMMM dd, yyyy HH:mm");
            });

            this.parentRender(_.bind(function () {
                if (callback) {
                    callback();
                }
            }));
        },

        deleteLink: function deleteLink(event) {
            var notificationId,
                self = this;

            event.preventDefault();

            notificationId = $(event.target).parents(".list-group-item").find("input[name=id]").val();

            notificationDelegate.deleteEntity(notificationId, _.bind(function () {
                $(event.target).parents(".list-group-item").remove();

                if (this.$el.find(".list-group-item").length === 0) {
                    this.$el.find(".list-group").html('<li class="list-group-item"><h5 class="text-center">' + $.t("openidm.ui.apps.dashboard.NotificationsView.noNotifications") + "</h5></li>");
                }
            }, this), function () {
                eventManager.sendEvent(constants.EVENT_NOTIFICATION_DELETE_FAILED);

                notificationDelegate.getNotificationsForUser(function (notificationList) {
                    self.render({
                        "el": self.$el,
                        "notifications": notificationList.notifications
                    });
                }, function () {
                    eventManager.sendEvent(constants.EVENT_GET_NOTIFICATION_FOR_USER_ERROR);
                });
            });
        }
    });

    return new NotificationsView();
});
