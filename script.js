const chatBox = document.getElementById("chat");
const userInput = document.getElementById("userInput");

function appendMessage(sender, text) {
  const div = document.createElement("div");
  div.innerHTML = `<strong>${sender}:</strong> ${text}`;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

async function sendMessage() {
  const text = userInput.value.trim();
  if (!text) return;
  appendMessage("Ти", text);
  userInput.value = "";
  appendMessage("AI", "Обработвам...");
  try {
    const res = await fetch("https://voice-backend.onrender.com/api/voice", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text })
    });
    const data = await res.json();
    document.querySelector("#chat").lastChild.remove();
    appendMessage("AI", data.reply);
    speak(data.reply);
  } catch (err) {
    document.querySelector("#chat").lastChild.remove();
    appendMessage("AI", "Грешка при свързване със сървъра.");
  }
}

function startListening() {
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = "bg-BG";
  recognition.onresult = (event) => {
    userInput.value = event.results[0][0].transcript;
    sendMessage();
  };
  recognition.start();
}

function speak(text) {
  const synth = window.speechSynthesis;
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = "bg-BG";
  synth.speak(utter);
}
