
import React, { useEffect, useState } from 'react';

const useMessengerSDK = () => {
  const [loaded, setLoad] = useState(false)
  const [queue, setQueue] = useState([])
  const loadsScript = (d, s, id) => {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) { return; }
    js = d.createElement(s); js.id = id;
    js.onload = handleLoad
    js.onreadystatechange = () => handleReadyStateChange(js)
    js.src = "//connect.facebook.net/en_US/messenger.Extensions.js";
    fjs.parentNode.insertBefore(js, fjs);
  }
  useEffect(() => {
    loadsScript(document, 'script', 'Messenger')
  }, [])
  const handleLoad = () => {
    if (!loaded) {
      setLoad(true)
      queue.forEach(cb => sdk(cb))
      setQueue([])
    }
  }
  const handleReadyStateChange = (scr) => {
    // console.log(scr)
    if (scr && scr.readyState === "complete") {
      handleLoad()
    }
  }
  const sdk = (cb) => {
    if (!loaded) {
      console.log('not loaded')
      setQueue([...queue, cb])
    } else {
      cb(window.MessengerExtensions)
    }
  }
  return sdk
}

export default useMessengerSDK