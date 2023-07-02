last_notification_time = Date.now() - 10000

browser.runtime.onMessage.addListener((message, callback) => {
  if (message === "displayNotification" && Date.now() - last_notification_time >= 10000) {
    browser.notifications.create("caracal_notification", {
      type: "basic",
      iconUrl: browser.extension.getURL("icons/caracal-48.png"),
      title: "Caracal",
      message: "New message"
    });
    last_notification_time = Date.now()
  }
});
