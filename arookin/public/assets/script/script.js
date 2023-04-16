//REQUESTING NOTIFICATION PERMISSION
const notify = document.getElementById("notify");
const notifyText = document.getElementById("notifyText");
const notifyBtn = document.getElementById("notifyButton");
const dontNotifyBtn = document.getElementById("dontNotifyButton");
const notifForm = document.getElementById("notifForm");
const notifDuration = document.getElementById("notifDuration");
const notifTimeInterval = document.getElementById("notifTime");


if (!localStorage.getItem("notifShown")) {
  notify.style.display = "block";

  
  dontNotifyBtn.addEventListener("click", (e) => {
    notify.style.display = "none";
    localStorage.setItem("notifShown", true);
  });

  notifyBtn.addEventListener("click", (e) => {
    Notification.requestPermission().then((result) => {
      if (result === "granted") {
        getNotifDuration();
      } else {
        alert("You will NOT be receiving task notifications");
        notify.style.display = "none";
        localStorage.setItem("notifShown", true);
      }
    });
  });

  function getNotifDuration() {
    notifyText.style.display = "none"
    notifyBtn.style.display = "none"
    dontNotifyBtn.style.display = "none"

    notifDuration.style.display = "block"
    notifForm.addEventListener('submit', e => {
        e.preventDefault()
        const notificationTime = notifTimeInterval.value;
        alert('You will be receiving Task Notifications every ' + notificationTime + ' hours')
        notify.style.display = "none"
                      
        // hide notification element and save state to local storage
        localStorage.setItem("notifShown", true);
        notify.style.display = "none"

        //Create Message object
        let msg = {
          type: 'notification-interval',
          interval: notificationTime
        };
        sendMessageToServiceWorker(msg);
    });
  };
}else {
  notify.style.display = "none";
}

function sendMessageToServiceWorker(msg) {
  // send message to service worker with notification interval
  if (navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage(msg);
    // console.log('Message sent',msg);
  }
  
}
