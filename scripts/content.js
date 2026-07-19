// we need to use async/await on firefox since "browser" is promise based

let observer = null;
let savedDiv = null;
let savedParent = null;
let savedNextSibling = null;

function startHiding() {
  //  thank you google for obfuscating everything
  const existing = document.querySelector('[jsname="E6JrNd"]')
  if (existing) {
    // save the div before pruning
    savedDiv = existing;
    savedParent = existing.parentNode;
    savedNextSibling = existing.nextSibling;
    existing.remove();
  }

  observer = new MutationObserver(() => {
    const targetDiv = document.querySelector('[jsname="E6JrNd"]')
    if (targetDiv) {
      savedDiv = targetDiv;
      savedParent = targetDiv.parentNode;
      savedNextSibling = targetDiv.nextSibling;
      targetDiv.remove();
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

function stopHiding() {
  observer?.disconnect();
  observer = null;

  // restore the div as is (as it was)
  if (savedDiv && savedParent) {
    savedParent.insertBefore(savedDiv, savedNextSibling);
    savedDiv = null;
    savedParent = null;
    savedNextSibling = null;
  }
}

// load state
// same story on firefox, storage.sync syncs to the local storage first, then lets firefox handle cloud sync
// there's caching on sync.get so we arent hammering any apis
(async () => {
  const { hideAiOverview } = await browser.storage.sync.get("hideAiOverview");
  if (hideAiOverview) startHiding();
})();

browser.runtime.onMessage.addListener(({ hideAiOverview }) => {
  hideAiOverview ? startHiding() : stopHiding();
});