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
    focus: "Direct asks",
    transits: [
      ["Moon sextile Venus", "Repair conversations land softer after sunset."],
      ["Mercury in Taurus", "Use fewer words and make the practical offer."],
      ["Mars trine Pluto", "A small brave action changes the emotional weather."],
    ],
  },
  weekly: {
    kicker: "May 10 - May 16",
    title: "The week rewards honest calibration.",
    body: "Your chart is asking for a cleaner boundary around emotional labor. Romance grows through specificity, work improves when you name the next step, and luck arrives through a friend-of-a-friend door.",
    scores: [79, 81, 70],
    focus: "Boundary reset",
    transits: [
      ["Venus square Saturn", "Love gets stronger when expectations are explicit."],
      ["Sun conjunct Jupiter", "Visibility helps; send the pitch or plan the reveal."],
      ["Moon node activation", "Old habits show up so you can choose differently."],
    ],
  },
  monthly: {
    kicker: "May 2026",
    title: "A private reset becomes public momentum.",
    body: "This month begins with inner repair and ends with visible movement. Track dreams, recurring conversations, and the tiny moments where your body relaxes. They are your map.",
    scores: [83, 76, 88],
    focus: "Private reset",
    transits: [
      ["New Moon portal", "Set one intention that can survive real life."],
      ["Jupiter house shift", "Growth comes through teaching, sharing, and being seen."],
      ["Venus renewal", "Choose the relationship pattern your future self respects."],
    ],
  },
};

const rituals = [
  "Ritual: send the message you keep rewriting.",
  "Ritual: name one need before you explain it away.",
  "Ritual: take a ten minute walk before answering emotionally.",
  "Ritual: write the decision, then circle the part that feels calm.",
  "Ritual: clean one corner of your space to clear one corner of your mind.",
];

const locationRecommendations = [
  "Mumbai, India",
  "New Delhi, India",
  "Bengaluru, India",
  "Hyderabad, India",
  "Chennai, India",
  "Kolkata, India",
  "Pune, India",
  "Ahmedabad, India",
  "Jaipur, India",
  "Los Angeles, USA",
  "New York, USA",
  "London, UK",
  "Dubai, UAE",
  "Singapore",
  "Toronto, Canada",
];

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
  document.querySelector("#aiMemory").textContent = `Reading ${chart.sun} Sun, ${chart.moon} Moon, ${chart.rising} Rising with live partner context.`;

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
  document.querySelector(".zodiac-wheel").classList.remove("chart-pulse");
  requestAnimationFrame(() => document.querySelector(".zodiac-wheel").classList.add("chart-pulse"));

  const houseList = document.querySelector("#houseList");
  houseList.innerHTML = houses
    .map(([house, theme, insight]) => `<article><span>${house}</span><strong>${theme}</strong><span>${insight}</span></article>`)
    .join("");

  const insightTitle = `${chart.sun} instinct, ${chart.moon} weather`;
  const insightBody = `${chart.rising} rising shapes the first impression, while your ${chart.moon} Moon shows what your nervous system needs before it can trust the next step.`;
  document.querySelector("#chartInsightTitle").textContent = insightTitle;
  document.querySelector("#chartInsightBody").textContent = insightBody;
}

function setPeriod(period) {
  const content = periods[period];
  document.querySelector("#readingKicker").textContent = content.kicker;
  document.querySelector("#readingTitle").textContent = content.title;
  document.querySelector("#readingBody").textContent = content.body;
  document.querySelector("#loveScore").textContent = `${content.scores[0]}%`;
  document.querySelector("#energyScore").textContent = `${content.scores[1]}%`;
  document.querySelector("#luckScore").textContent = `${content.scores[2]}%`;
  document.querySelector("#focusTheme").textContent = content.focus;
  document.querySelector("#transitList").innerHTML = content.transits
    .map(([title, body]) => `<article><strong>${title}</strong><span>${body}</span></article>`)
    .join("");

  document.querySelectorAll(".period-tab").forEach((button) => {
    button.classList.toggle("active", button.dataset.period === period);
  });
  document.querySelector(".reading-panel").classList.remove("panel-refresh");
  requestAnimationFrame(() => document.querySelector(".reading-panel").classList.add("panel-refresh"));
}

function recalculateCompatibility() {
  const chart = deriveChart();
  const partner = document.querySelector("#partnerSign").value;
  const score = 62 + ((signs.indexOf(chart.sun) * 7 + signs.indexOf(partner) * 11) % 35);
  const scoreNode = document.querySelector("#compatScore");
  scoreNode.textContent = score;
  scoreNode.style.setProperty("--score", `${score}%`);

  const isHigh = score > 84;
  document.querySelector("#compatTitle").textContent = isHigh ? "High voltage, real tenderness" : "Growth bond with useful friction";
  document.querySelector("#compatBody").textContent = isHigh
    ? `${chart.sun} and ${partner} create fast recognition. The relationship thrives when the spark is backed by clear plans, direct reassurance, and repair after intensity.`
    : `${chart.sun} and ${partner} ask each other to translate love languages. The bond can deepen through patience, shared rituals, and naming needs before resentment gathers.`;
  const chemistry = Math.min(98, score + 7);
  const trust = Math.max(52, score - 9);
  const growth = Math.min(96, score + (isHigh ? 2 : 11));
  updateBar("#chemistryBar", chemistry, "Chemistry");
  updateBar("#trustBar", trust, "Trust");
  updateBar("#growthBar", growth, "Growth");
  document.querySelector("#matchNotes").innerHTML = [
    ["Spark", isHigh ? "Fast recognition and playful confidence." : "Attraction grows through curiosity."],
    ["Repair", "Use direct language before guessing motives."],
    ["Date idea", `${chart.moon} Moon likes a plan with emotional room to breathe.`],
  ]
    .map(([label, body]) => `<article><span>${label}</span><strong>${body}</strong></article>`)
    .join("");
  scoreNode.classList.remove("score-pop");
  requestAnimationFrame(() => scoreNode.classList.add("score-pop"));
}

function updateBar(selector, value, label) {
  const node = document.querySelector(selector);
  node.style.setProperty("--value", `${value}%`);
  node.textContent = `${label} ${value}%`;
}

function renderLocationSuggestions(query = "") {
  const normalizedQuery = query.trim().toLowerCase();
  const matches = locationRecommendations
    .filter((place) => !normalizedQuery || place.toLowerCase().includes(normalizedQuery))
    .slice(0, 5);
  const suggestions = document.querySelector("#locationSuggestions");
  suggestions.innerHTML = matches
    .map((place) => `<button type="button" data-place="${place}">${place}</button>`)
    .join("");
  suggestions.hidden = matches.length === 0;
}

function addMessage(text, type) {
  const node = document.createElement("div");
  node.className = `message ${type}`;
  node.textContent = text;
  document.querySelector("#chatWindow").append(node);
  node.scrollIntoView({ behavior: "smooth", block: "end" });
}

function showTyping() {
  const node = document.createElement("div");
  node.className = "message bot typing";
  node.setAttribute("aria-label", "AI astrologer is typing");
  node.innerHTML = "<i></i><i></i><i></i>";
  document.querySelector("#chatWindow").append(node);
  node.scrollIntoView({ behavior: "smooth", block: "end" });
  return node;
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

document.querySelector("#birthPlace").addEventListener("focus", (event) => {
  renderLocationSuggestions(event.target.value);
});

document.querySelector("#birthPlace").addEventListener("input", (event) => {
  renderLocationSuggestions(event.target.value);
});

document.querySelector("#locationSuggestions").addEventListener("click", (event) => {
  const button = event.target.closest("button[data-place]");
  if (!button) return;
  document.querySelector("#birthPlace").value = button.dataset.place;
  document.querySelector("#locationSuggestions").hidden = true;
  renderChart();
  recalculateCompatibility();
});

document.addEventListener("click", (event) => {
  if (event.target.closest(".location-field")) return;
  document.querySelector("#locationSuggestions").hidden = true;
});

document.querySelector("#chatForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const input = document.querySelector("#chatInput");
  const value = input.value.trim();
  if (!value) return;
  addMessage(value, "user");
  input.value = "";
  const typing = showTyping();
  setTimeout(() => {
    typing.remove();
    addMessage(astrologerReply(value), "bot");
  }, 620);
});

document.querySelectorAll(".prompt-chips button").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelector("#chatInput").value = button.dataset.prompt;
    document.querySelector("#chatForm").requestSubmit();
  });
});

document.querySelector("#partnerSign").innerHTML = signs.map((sign) => `<option>${sign}</option>`).join("");
document.querySelector("#partnerSign").value = "Leo";
renderLocationSuggestions(document.querySelector("#birthPlace").value);
document.querySelector("#shuffleRitual").addEventListener("click", () => {
  const current = document.querySelector("#ritualText").textContent;
  const next = rituals.find((ritual) => ritual !== current) || rituals[0];
  rituals.push(rituals.shift());
  document.querySelector("#ritualText").textContent = next;
});
renderChart();
setPeriod("daily");
recalculateCompatibility();
