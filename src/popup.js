const storage =
  typeof chrome !== "undefined" && chrome.storage && chrome.storage.local
    ? chrome.storage.local
    : {
        get: (keys, cb) => {
          const result = {};
          keys.forEach((k) => {
            result[k] = localStorage.getItem(k);
          });
          cb(result);
        },
        set: (items, cb) => {
          Object.entries(items).forEach(([k, v]) => {
            localStorage.setItem(k, v);
          });
          cb();
        },
      };

window.addEventListener("DOMContentLoaded", () => {
  const tabGen = document.getElementById("tab-gen");
  const tabSet = document.getElementById("tab-set");
  const genSec = document.getElementById("gen-sec");
  const setSec = document.getElementById("set-sec");
  const activate = (sec) => {
    tabGen.classList.toggle("active", sec === "gen");
    tabSet.classList.toggle("active", sec === "set");
    genSec.classList.toggle("hidden", sec !== "gen");
    setSec.classList.toggle("hidden", sec !== "set");
  };
  tabGen.addEventListener("click", () => activate("gen"));
  tabSet.addEventListener("click", () => activate("set"));

  const genBtn = document.getElementById("genBtn");
  const tweetsDiv = document.getElementById("tweets");
  const apiInput = document.getElementById("apiKey");
  const countInput = document.getElementById("tweetCount");
  const saveBtn = document.getElementById("saveBtn");
  const saveStatus = document.getElementById("saveStatus");

  // Load saved settings
  storage.get(["openaiKey", "tweetCount"], ({ openaiKey, tweetCount }) => {
    if (openaiKey) apiInput.value = openaiKey;
    if (tweetCount) countInput.value = tweetCount;
  });

  // Save settings
  saveBtn.addEventListener("click", () => {
    const key = apiInput.value.trim();
    const count = countInput.value;
    if (!key) return (saveStatus.textContent = "API key cannot be empty");
    if (!count || isNaN(count) || count < 1)
      return (saveStatus.textContent = "Enter a valid tweet count");
    storage.set({ openaiKey: key, tweetCount: count }, () => {
      saveStatus.textContent = "Settings saved!";
      setTimeout(() => (saveStatus.textContent = ""), 2000);
    });
  });

  // Generate tweets
  genBtn.addEventListener("click", () => {
    tweetsDiv.textContent = "Analyzing...";
    storage.get(
      ["openaiKey", "tweetCount"],
      async ({ openaiKey, tweetCount }) => {
        if (!openaiKey)
          return (tweetsDiv.innerHTML =
            '<span style="color:red;">Set API key in Settings.</span>');
        if (!tweetCount) tweetCount = "10";
        try {
          const [tab] = await chrome.tabs.query({
            active: true,
            currentWindow: true,
          });
          const [{ result: content }] = await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: () => document.body.innerText,
          });
          chrome.runtime.sendMessage(
            {
              action: "generateTweets",
              content,
              apiKey: openaiKey,
              tweetCount,
            },
            (response) => {
              if (chrome.runtime.lastError)
                return (tweetsDiv.innerHTML = `<span style=\"color:red;\">${chrome.runtime.lastError.message}</span>`);
              if (response.error)
                return (tweetsDiv.innerHTML = `<span style=\"color:red;\">${response.error}</span>`);
              tweetsDiv.innerHTML = response.tweets
                .map(
                  (t) =>
                    `<div class=\"tweet\"><a href=\"https://twitter.com/intent/tweet?text=${encodeURIComponent(
                      t
                    )}\" target=\"_blank\">${t}</a></div>`
                )
                .join("");
            }
          );
        } catch (e) {
          tweetsDiv.innerHTML = `<span style=\"color:red;\">${e.message}</span>`;
        }
      }
    );
  });
});
