/* Mayes Maths & More — the last thing play.html runs (kept out of the page so the Content Security Policy can forbid
   inline scripts). Opened from a web address: save everything on the device so it keeps working offline (sw.js), and
   once a child has been added, ask the browser to keep their progress even when the device is short of space. */
OM.offline.register();
if (OM.Store.profiles().length) OM.offline.keepProgress();
