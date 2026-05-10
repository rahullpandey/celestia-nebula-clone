const signs = [
  "Aries",
  "Taurus",
  "Gemini",
  "Cancer",
  "Leo",
  "Virgo",
  "Libra",
  "Scorpio",
  "Sagittarius",
  "Capricorn",
  "Aquarius",
  "Pisces",
];

const periods = {
  daily: {
    kicker: "Today, May 10",
    title: "Let the useful truth be beautiful.",
    body: "A practical Moon sharpens your intuition around routines, money, and the people who keep showing up. Say yes to one grounded conversation, then protect the quiet that helps you hear yourself.",
    scores: [86, 72, 64],
  },
  weekly: {
    kicker: "May 10 - May 16",
    title: "The week rewards honest calibration.",
    body: "Your chart is asking for a cleaner boundary around emotional labor. Romance grows through specificity, work improves when you name the next step, and luck arrives through a friend-of-a-friend door.",
    scores: [79, 81, 70],
  },
  monthly: {
    kicker: "May 2026",
    title: "A private reset becomes public momentum.",
    body: "This month begins with inner repair and ends with visible movement. Track dreams, recurring conversations, and the tiny moments where your body relaxes. They are your map.",
    scores: [83, 76, 88],
  },
};

const houses = [
  ["1st House", "Identity", "Libra rising makes charm a strategy, not a mask."],
  ["2nd House", "Resources", "Scorpio here asks for honest money rituals."],
  ["3rd House", "Voice", "Sagittarius brings blunt, healing conversations."],
  ["4th House", "Roots", "Capricorn wants a steadier emotional home base."],
  ["5th House", "Joy", "Aquarius needs playful room to experiment."],
  ["6th House", "Rituals", "Pisces says your nervous system is sacred data."],
];

const planetGlyphs = ["☉", "☽", "☿", "♀", "♂", "♃", "♄", "♅"];

function signFromDate(dateValue) {
  const date = new Date(dateValue || "1997-03-21");
  const seed = date.getUTCMonth() * 31 + date.getUTCDate();
  return signs[seed % signs.length];
}

function deriveChart() {
  const date = document.querySelector("#birthDate").value;
  const time = document.querySelector("#birthTime").value || "06:42";
  const place = document.querySelector("#birthPlace").value || "Mumbai";
  const sunIndex = signs.indexOf(signFromDate(date));
  const hour = Number(time.split(":")[0] || 0);
  const placeSeed = place.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const moonIndex = (sunIndex + hour + 3) % signs.length;
  const risingIndex = (sunIndex + placeSeed) % signs.length;

  return {
    sun: signs[sunIndex],
    moon: signs[moonIndex],
    rising: signs[risingIndex],
    offset: (hour + placeSeed) % 30,
  };
}

function renderChart() {
  const chart = deriveChart();
  document.querySelector("#sunSign").textContent = chart.sun;
  document.querySelector("#moonSign").textContent = chart.moon;
  document.querySelector("#risingSign").textContent = chart.rising;
  document.querySelector("#profileTitle").textContent = `${chart.sun} Sun, ${chart.moon} Moon, ${chart.rising} Rising`;
  document.querySelector("#youSigns").textContent = `${chart.sun} / ${chart.moon} / ${chart.rising}`;

  const houseLines = document.querySelector("#houseLines");
  const planetMarks = document.querySelector("#planetMarks");
  houseLines.innerHTML = "";
  planetMarks.innerHTML = "";

  for (let i = 0; i < 12; i += 1) {
    const angle = ((i * 30 - 90 + chart.offset) * Math.PI) / 180;
    const x = 150 + Math.cos(angle) * 138;
    const y = 150 + Math.sin(angle) * 138;
    houseLines.insertAdjacentHTML(
      "beforeend",
      `<line x1="150" y1="150" x2="${x.toFixed(2)}" y2="${y.toFixed(2)}" stroke="white" stroke-opacity=".18" />`
    );
  }

  planetGlyphs.forEach((glyph, index) => {
    const angle = (((index * 43 + chart.offset) % 360 - 90) * Math.PI) / 180;
    const radius = index % 2 === 0 ? 83 : 116;
    const x = 150 + Math.cos(angle) * radius;
    const y = 150 + Math.sin(angle) * radius;
    planetMarks.insertAdjacentHTML(
      "beforeend",
      `<circle cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" r="13" fill="#070914" stroke="#f5d36a" />
       <text x="${x.toFixed(2)}" y="${(y + 5).toFixed(2)}" text-anchor="middle" fill="#f7f1e3" font-size="16">${glyph}</text>`
    );
  });

  const houseList = document.querySelector("#houseList");
  houseList.innerHTML = houses
    .map(([house, theme, insight]) => `<article><span>${house}</span><strong>${theme}</strong><span>${insight}</span></article>`)
    .join("");
}

function setPeriod(period) {
  const content = periods[period];
  document.querySelector("#readingKicker").textContent = content.kicker;
  document.querySelector("#readingTitle").textContent = content.title;
  document.querySelector("#readingBody").textContent = content.body;
  document.querySelector("#loveScore").textContent = `${content.scores[0]}%`;
  document.querySelector("#energyScore").textContent = `${content.scores[1]}%`;
  document.querySelector("#luckScore").textContent = `${content.scores[2]}%`;

  document.querySelectorAll(".period-tab").forEach((button) => {
    button.classList.toggle("active", button.dataset.period === period);
  });
}

function recalculateCompatibility() {
  const chart = deriveChart();
  const partner = document.querySelector("#partnerSign").value;
  const score = 62 + ((signs.indexOf(chart.sun) * 7 + signs.indexOf(partner) * 11) % 35);
  const scoreNode = document.querySelector("#compatScore");
  scoreNode.textContent = score;
  scoreNode.style.background = `radial-gradient(circle, #111421 56%, transparent 58%), conic-gradient(var(--green) 0 ${score}%, rgba(255,255,255,.14) ${score}% 100%)`;

  const isHigh = score > 84;
  document.querySelector("#compatTitle").textContent = isHigh ? "High voltage, real tenderness" : "Growth bond with useful friction";
  document.querySelector("#compatBody").textContent = isHigh
    ? `${chart.sun} and ${partner} create fast recognition. The relationship thrives when the spark is backed by clear plans, direct reassurance, and repair after intensity.`
    : `${chart.sun} and ${partner} ask each other to translate love languages. The bond can deepen through patience, shared rituals, and naming needs before resentment gathers.`;
}

function addMessage(text, type) {
  const node = document.createElement("div");
  node.className = `message ${type}`;
  node.textContent = text;
  document.querySelector("#chatWindow").append(node);
  node.scrollIntoView({ behavior: "smooth", block: "end" });
}

function astrologerReply(question) {
  const chart = deriveChart();
  const lower = question.toLowerCase();
  if (lower.includes("relationship") || lower.includes("love")) {
    return `With ${chart.moon} Moon, intimacy improves when care becomes observable. Ask for the exact kind of reassurance you need, then watch who can meet you without making your sensitivity a problem.`;
  }
  if (lower.includes("career") || lower.includes("work")) {
    return `${chart.rising} rising gives you a public style people notice quickly. This week favors visible polish: update the portfolio, send the follow-up, and choose one skill to make unmistakable.`;
  }
  if (lower.includes("today") || lower.includes("energy")) {
    return `Today works best in two movements: one brave action from your ${chart.sun} Sun, then one restorative choice for your ${chart.moon} Moon. Momentum and softness both count.`;
  }
  return `Your ${chart.sun} Sun wants forward motion, your ${chart.moon} Moon wants emotional proof, and your ${chart.rising} rising wants harmony. The insight is to stop treating those needs as contradictory.`;
}

document.querySelectorAll(".period-tab").forEach((button) => {
  button.addEventListener("click", () => setPeriod(button.dataset.period));
});

document.querySelectorAll(".nav-item").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".nav-item").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    document.querySelector(`.${button.dataset.target}`).scrollIntoView({ behavior: "smooth" });
  });
});

document.querySelector("[data-nav='profile']").addEventListener("click", () => {
  document.querySelector(".chart-screen").scrollIntoView({ behavior: "smooth" });
});

document.querySelector("#birthForm").addEventListener("submit", (event) => {
  event.preventDefault();
  renderChart();
  recalculateCompatibility();
});

document.querySelector("#recalculateCompat").addEventListener("click", recalculateCompatibility);

document.querySelector("#chatForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const input = document.querySelector("#chatInput");
  const value = input.value.trim();
  if (!value) return;
  addMessage(value, "user");
  input.value = "";
  setTimeout(() => addMessage(astrologerReply(value), "bot"), 260);
});

document.querySelectorAll(".prompt-chips button").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelector("#chatInput").value = button.dataset.prompt;
    document.querySelector("#chatForm").requestSubmit();
  });
});

document.querySelector("#partnerSign").innerHTML = signs.map((sign) => `<option>${sign}</option>`).join("");
document.querySelector("#partnerSign").value = "Leo";
renderChart();
recalculateCompatibility();
