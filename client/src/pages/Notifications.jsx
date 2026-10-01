import { useEffect, useState } from "react";

import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} from "../services/notificationService";

const Notifications = () => {
  const [
    notifications,
    setNotifications,
  ] = useState([]);

  const loadNotifications =
    async () => {
      try {
        const response =
          await getNotifications();

        setNotifications(
          response?.data
            ?.notifications || []
        );
      } catch (error) {
        console.error(error);
      }
    };

  useEffect(() => {
    loadNotifications();
  }, []);

  const handleRead = async (id) => {
    try {
      await markAsRead(id);

      loadNotifications();
    } catch (error) {
      console.error(error);
    }
  };

  const handleReadAll = async () => {
    try {
      await markAllAsRead();

      loadNotifications();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteNotification(id);

      loadNotifications();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Notifications</h1>

        <button onClick={handleReadAll}>
          Mark All Read
        </button>
      </div>

      {notifications.length === 0 ? (
        <p>No notifications.</p>
      ) : (
        <div className="list">
          {notifications.map(
            (notification) => (
              <div
                className={`notification ${
                  notification.isRead
                    ? "read"
                    : "unread"
                }`}
                key={notification._id}
              >
                <h3>
                  {notification.title}
                </h3>

                <p>
                  {notification.message}
                </p>

                <small>
                  {new Date(
                    notification.createdAt
                  ).toLocaleString()}
                </small>

                <div className="actions">
                  {!notification.isRead && (
                    <button
                      onClick={() =>
                        handleRead(
                          notification._id
                        )
                      }
                    >
                      Mark Read
                    </button>
                  )}

                  <button
                    onClick={() =>
                      handleDelete(
                        notification._id
                      )
                    }
                  >
                    Delete
                  </button>
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default Notifications;