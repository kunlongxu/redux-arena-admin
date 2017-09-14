import { delay, eventChannel, END } from "redux-saga";

export function uploadChan(url, formData) {
  return eventChannel(emitter => {
    const xhr = new XMLHttpRequest();
    let loaded = 0, total = 0;
    xhr.upload.addEventListener(
      "progress",
      function(e) {
        if (e.lengthComputable) {
          var percentage = Math.round(e.loaded * 100 / e.total);
          loaded = e.loaded;
          total = e.total;
          emitter({ loaded, total });
        }
      },
      false
    );
    xhr.open("POST", url);
    xhr.setRequestHeader("x-token", sessionStorage.getItem("X-Session-Token"));
    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4 && xhr.status == 200) {
        emitter({ loaded, total, response: JSON.parse(this.responseText) });
        emitter(END);
      }
    };
    xhr.send(formData);
    return () => {};
  });
}

export function readBinFileChan(file) {
  return eventChannel(emitter => {
    const reader = new FileReader();
    reader.onload = function(evt) {
      emitter(evt);
      emitter(END);
    };
    reader.readAsBinaryString(file);
    return () => {};
  });
}
