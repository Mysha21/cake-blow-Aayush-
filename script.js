const cake = document.getElementById("cake");
const candleCountElem = document.getElementById("candleCount");
const candlesDiv = document.getElementById("candles");

function addCandle() {
  const candle = document.createElement("div");
  candle.classList.add("candle");
  candlesDiv.appendChild(candle);
  candleCountElem.textContent = document.querySelectorAll(".candle").length;
}

function loadCandlesFromURL() {
  const params = new URLSearchParams(window.location.search);
  const count = parseInt(params.get("candles")) || 0;

  candlesDiv.innerHTML = "";
  for (let i = 0; i < count; i++) {
    const candle = document.createElement("div");
    candle.classList.add("candle");
    candlesDiv.appendChild(candle);
  }
  candleCountElem.textContent = count;
}

function generateLink() {
  const count = document.querySelectorAll(".candle").length;
  const url = `${window.location.origin}${window.location.pathname}?candles=${count}`;
  prompt("Copy this link and share:", url);
}

function blowCandles() {
  const candles = document.querySelectorAll(".candle");
  candles.forEach(candle => candle.classList.add("out"));
}

function initMicrophone() {
  navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {
      const audioContext = new AudioContext();
      const analyser = audioContext.createAnalyser();
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);
      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      function detectBlow() {
        analyser.getByteFrequencyData(dataArray);
        let volume = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
        if (volume > 40) {
          blowCandles();
        }
        requestAnimationFrame(detectBlow);
      }
      detectBlow();
    })
    .catch(err => console.error("Mic error:", err));
}

window.addEventListener("DOMContentLoaded", () => {
  if (window.location.search.includes("candles")) {
    loadCandlesFromURL();
  }
  initMicrophone();
});
