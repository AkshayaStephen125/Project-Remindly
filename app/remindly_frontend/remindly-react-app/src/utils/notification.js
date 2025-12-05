import logo from './r_logo.png';

export const requestNotificationPermission = async () => {
  if (!("Notification" in window)) {
    alert("Browser does not support desktop notifications");
    return;
  }

  let permission = Notification.permission;

  if (permission === "default") {
    permission = await Notification.requestPermission(); // prompts "Allow Notification"
  }

  return permission === "granted";
};

export const showBrowserNotification = (title, body) => {
  if (Notification.permission === "granted") {
    new Notification(title, {
      body: body,
      icon: {logo},
    });
  }
};
