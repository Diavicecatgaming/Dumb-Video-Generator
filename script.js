// Elements
const generateBtn = document.getElementById("generateBtn");
const promptInput = document.getElementById("prompt");
const videoTypeSelect = document.getElementById("videoType");
const progressLog = document.getElementById("progressLog");
const settingsBtn = document.getElementById("settingsBtn");
const settingsModal = document.getElementById("settingsModal");
const saveSettings = document.getElementById("saveSettings");
const closeSettings = document.getElementById("closeSettings");

// API Key inputs
const sdxlKeyInput = document.getElementById("sdxlKey");
const runwayKeyInput = document.getElementById("runwayKey");
const gptKeyInput = document.getElementById("gptKey");
const ttsKeyInput = document.getElementById("ttsKey");

// Show settings modal
settingsBtn.addEventListener("click", () => {
  settingsModal.classList.remove("hidden");
});

// Hide settings modal
closeSettings.addEventListener("click", () => {
  settingsModal.classList.add("hidden");
});

// Save API keys to local storage
saveSettings.addEventListener("click", () => {
  localStorage.setItem("sdxlKey", sdxlKeyInput.value);
  localStorage.setItem("runwayKey", runwayKeyInput.value);
  localStorage.setItem("gptKey", gptKeyInput.value);
  localStorage.setItem("ttsKey", ttsKeyInput.value);
  logProgress("✅ API Keys saved.");
  settingsModal.classList.add("hidden");
});

// Load stored API keys
window.addEventListener("load", () => {
  sdxlKeyInput.value = localStorage.getItem("sdxlKey") || "";
  runwayKeyInput.value = localStorage.getItem("runwayKey") || "";
  gptKeyInput.value = localStorage.getItem("gptKey") || "";
  ttsKeyInput.value = localStorage.getItem("ttsKey") || "";
});

// Progress logger
function logProgress(msg) {
  const time = new Date().toLocaleTimeString();
  progressLog.innerHTML += `[${time}] ${msg}<br>`;
  progressLog.scrollTop = progressLog.scrollHeight;
}

// Generate video
generateBtn.addEventListener("click", async () => {
  const prompt = promptInput.value;
  const videoType = videoTypeSelect.value;

  if (!prompt) {
    logProgress("❌ Please enter a prompt.");
    return;
  }

  logProgress(`🚀 Sending request for "${videoType}" video...`);

  try {
    const res = await fetch("/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        prompt,
        videoType,
        sdxlKey: localStorage.getItem("sdxlKey"),
        runwayKey: localStorage.getItem("runwayKey"),
        gptKey: localStorage.getItem("gptKey"),
        ttsKey: localStorage.getItem("ttsKey")
      })
    });

    const data = await res.json();
    if (data.status === "ok") {
      logProgress("✅ Video generated successfully!");
      logProgress(`📹 Download: ${data.videoUrl}`);
    } else {
      logProgress(`❌ Error: ${data.error}`);
    }
  } catch (err) {
    logProgress(`❌ Request failed: ${err.message}`);
  }
});
