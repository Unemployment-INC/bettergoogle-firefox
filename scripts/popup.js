// we need to use async/await on firefox since "browser" is promise based

const toggle = document.getElementById("toggle");

// load saved state
const { hideAiOverview } = await browser.storage.sync.get("hideAiOverview");
toggle.checked = !!hideAiOverview;


// listen for the state to change
toggle.addEventListener("change", async () => {
  const enabled = toggle.checked;
  // save
  await browser.storage.sync.set({ hideAiOverview: enabled });
  // this saves to local storage, then firefox periodically syncs to the cloud
  // should make a toggle for local/cloud sync in the future

  const [tab] = await browser.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
    // send the message only if the page is google.com
    // will probably break on something like ?utm_source=google.com
    if (tab?.url?.includes("google.com")) {
      browser.tabs.sendMessage(tab.id, { hideAiOverview: enabled }).catch(() => {});
    }
  });
});