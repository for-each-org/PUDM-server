const queueCreator = require('../priority-queue');

/**
 * A function that creates a new notification handler
 */
module.exports = function createNotificationHandler() {
  return new NotificationHandler();
}

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
   * @function isValidNotification
   * @param {object} notif 
   * @returns {boolean} Weather or not notif is a properly formatted notification
   */
  isValidNotification(notif) {
    if (!notif) return false;
    if (notif.hasOwnProperty('id') || typeof notif.id !== 'number') return false;
    if (notif.hasOwnProperty('content') || typeof notif.content !== 'string') return false;
    if (notif.hasOwnProperty('group') || typeof notif.group !== 'string') return false;
    if (notif.hasOwnProperty('status') || typeof notif.status !== 'boolean') return false;
    if (notif.hasOwnProperty('time') || typeof notif.time !== 'number') return false;
    return true;
  }

  /**
   * @function init
   * Inputs a list of notifications, notificationList, and queues everything into a priority queue
   * @param {array} notificationList 
   */
  init(notificationList) {
    if (!Array.isArray(notificationList))
      throw 'Bad argument to NotificationHandler.init()';

    const now = Date.now();
    for (let notif of notificationList) {
      // Only allow valid, future dated notificaitons in
      if (this.isValidNotification(notif) && notif.time > now) {
        this.queue.enqueue(notif);
      }
    }
  }

  /**
   * @function canSend
   * 
   * @returns {boolean} Returns weather there is a notification ready to send.
   */
  canSend() {
    var top = this.queue.peek()

    if (top && top.time <= Date.now()) {
      return true;
    }

    return false;
  }

  /**
   * @function peek
   * 
   * @returns {object} The next notification to be sent
   */
  peek() {
    return this.queue.peek();
  }

  /**
   * @function addNotificaion
   * @param {object} Notification
   */
  addNotifcation(notif) {
    if (this.isValidNotification(notif) && notif.time > Date.now()) {
      this.queue.enqueue(notif);
    } else {
      console.error('Warning: unable to add notification to queue');
    }
  }

  /**
   * @function updateNotification
   * @param {object} Notification
   */
  updateNotifcation(notif) {
    const now = Date.now();
    if (this.isValidNotification(notif)) {
      // If the new notificaion is in the past, remove it
      if (notif.time > now) {
        this.queue.update(notif);
      } else {
        this.queue.delete(notif.id);
      }
    } else {
      console.error('Warning: unable to update notification in queue');
    }
  }

  /**
   * @function deleteNotification
   * @param {object} Notification 
   */
  deleteNotification(notif) {
    if (notif && notif.hasOwnProperty('id') && typeof notif.id === 'number') {
      this.queue.delete(notif.id);
    } else {
      console.error('Warning: Unable to delete notification from queue');
    }
  }
}