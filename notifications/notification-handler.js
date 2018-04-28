const queueCreator = require('../priority-queue');

/**
 * A function that creates a new notification handler
 */
module.exports = function createNotificationHandler() {
    return new NotificationHandler();
};

/**
 * A notification handler class to control sending of notifications
 * Allows for reading 
 * 
 * {
 *   id: int
 *   content: string,
 *   group: int,
 *   time: int (unix time),
 *   status: boolean
 * }
 * 
 */
class NotificationHandler {
    constructor() {
        this.queue = queueCreator((a, b) => {
            if (a.time < b.time) return -1;
            if (a.time === b.time) return 0;
            return 1;
        }, 'id');
    }

    /**
     * @function init
     * Inputs a list of notifications, notificationList, and queues everything into a priority queue
     * @param {array} notificationList 
     */
    init(notificationList) {
        if (!Array.isArray(notificationList))
            throw 'Bad argument to NotificationHandler.init()';

        for (let notif of notificationList) {
            this.addNotifcation(notif);
        }
    }

    /**
     * @function canSend
     * 
     * @returns {boolean} Returns weather there is a notification ready to send.
     */
    canSend() {
        var top = this.queue.peek();

        const now = nowUnix();
        // Only send notifications in the past
        if (top &&  top.time <= now) {
            return true;
        }

        return false;
    }

    /**
     * @function getNotification
     * 
     * @returns {boolean} Returns weather there is a notification ready to send.
     */
    getNotification() {
        return this.queue.dequeue();
    }

    /**
     * @function addNotificaion
     * @param {object} Notification
     */
    addNotifcation(notif) {
        // Only allow notifications who haven't been sent in
        if (!notif.status) {
            this.queue.enqueue(notif);
        }
    }

    /**
     * @function updateNotification
     * @param {object} Notification
     */
    updateNotifcation(notif) {
        // If the new notificaion is pending
        if (!notif.status) {
            this.queue.update(notif);
        } else {
            this.deleteNotification(notif);
        }
    }

    /**
     * @function deleteNotification
     * @param {object} Notification 
     */
    deleteNotification(notif) {
        if (notif && notif.hasOwnProperty('id')) {
            this.queue.delete(notif.id);
        } else {
            console.error('Warning: Unable to delete notification from queue');
        }
    }
}

function nowUnix() {
    return Math.round(new Date().getTime() / 1000);
}