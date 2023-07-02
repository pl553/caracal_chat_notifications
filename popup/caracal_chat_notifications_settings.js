function sendRestoreOptionsMessage(tabs) {
    for (tab of tabs) {
        browser.tabs.sendMessage(tab.id, {
            command: "caracal_chat_notifications_restore_settings"
        });
    }
}

function saveOptions(e) {
  e.preventDefault();
  browser.storage.sync.set({
    tab_flash: document.querySelector("#tab_flash").checked,
    desktop_notification: document.querySelector("#desktop_notification").checked
  });
  
  browser.tabs.query({ url: "*://*.caracal.club/*" })
    .then(sendRestoreOptionsMessage)
    .catch(reportError);
}

function restoreOptions() {
  function setCurrentChoice(result) {
    document.querySelector("#tab_flash").checked = result.tab_flash
    document.querySelector("#desktop_notification").checked = result.desktop_notification
  }
  
  function onError(error) {
    console.log(`Error: ${error}`);
  }

  let getting = browser.storage.sync.get();
  getting.then(setCurrentChoice, onError);
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("#tab_flash").addEventListener("change", saveOptions);
document.querySelector("#desktop_notification").addEventListener("change", saveOptions);
