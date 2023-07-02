window.caracal_notification_settings = Object()

var PageTitleNotification = {
  Vars: {
    OriginalTitle: document.title,
    Interval: null
  },
  On: function (notification, intervalSpeed) {
    if (this.Vars.Interval != null) {
      return;
    }
    var _this = this;
    _this.Vars.Interval = setInterval(function () {
      document.title = (_this.Vars.OriginalTitle == document.title)
        ? notification
        : _this.Vars.OriginalTitle;
    }, (intervalSpeed) ? intervalSpeed : 1000);
  },
  Off: function () {
    clearInterval(this.Vars.Interval);
    document.title = this.Vars.OriginalTitle;
    this.Vars.Interval = null;
  }
}

var observerConfig = { childList: true };

var latestMessageObserver = null

var last_notification_time = Date.now() - 10000;

function onNewMessage(mutations) {
  for (mutation of mutations) {
    for (node of mutation.addedNodes) {
      for (child of node.childNodes) {
        if (child.className == "chatmsg") {
          if (latestMessageObserver) {
            latestMessageObserver.disconnect()
          }
          var obs = new MutationObserver(onNewMessage);
          obs.observe(child, observerConfig)
          latestMessageObserver = obs
        }
      }
    }
  }
  if (window.caracal_notification_settings.tab_flash && document.hidden) {
    PageTitleNotification.On("!!! New message !!!")
  }
  if (window.caracal_notification_settings.desktop_notification && document.hidden && Date.now() - last_notification_time >= 10000) {
    browser.notifications.create("caracal_notification", {
      type: "basic",
      iconUrl: browser.extension.getURL("icons/caracal-48.png"),
      title: "New message",
      message: "New message"
    });
    last_notification_time = Date.now()
  }
}

var chatMessagesObserver = new MutationObserver(onNewMessage);

var chatMessages = document.querySelector("#chatmessages");

chatMessagesObserver.observe(chatMessages, observerConfig);

function restoreOptions() {
  function setCurrentChoice(result) {
    window.caracal_notification_settings.tab_flash = result.tab_flash;
    window.caracal_notification_settings.desktop_notification = result.desktop_notification;
  }
  
  function onError(error) {
    console.log(`Error: ${error}`);
  }

  let getting = browser.storage.sync.get();
  getting.then(setCurrentChoice, onError);
}

restoreOptions()

browser.runtime.onMessage.addListener((message) => {
    
    if (message.command === "caracal_chat_notifications_restore_settings") {
      restoreOptions()
    }
  });

document.addEventListener("visibilitychange", function handleVisibilityChange() {
  if (!document.hidden) {
    PageTitleNotification.Off();
  }
}, false);