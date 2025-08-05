// ...existing code...

class KeyBubbleGame {
  constructor() {
    this.gameArea = document.getElementById("gameArea");
    this.gameOverScreen = document.getElementById("gameOverScreen");
    this.scoreElement = document.getElementById("score");
    this.timerElement = document.getElementById("timer");
    this.levelElement = document.getElementById("level");
    this.finalScoreElement = document.getElementById("finalScore");
    this.finalLevelElement = document.getElementById("finalLevel");

    this.score = 0;
    this.timeLeft = 60;
    this.gameActive = false;
    this.gameTimer = null;
    this.bubbleTimer = null;
    this.currentBubble = null;
    this.startTimestamp = null;
    this.level = "Easy";
    this.bubbleSpeed = 2000; // Default speed for easy level

    this.initializeEventListeners();
    this.loadGameSettings();
    this.startGame();
  }

  // ...existing code...
  initializeEventListeners() {
    // Restart game button
    document.getElementById("restartBtn").addEventListener("click", () => {
      this.restartGame();
    });

    // Back to menu button
    document.getElementById("menuBtn").addEventListener("click", () => {
      this.goToMenu();
    });

    // Keyboard event listener
    document.addEventListener("keydown", (e) => {
      if (this.gameActive) {
        this.handleKeyPress(e.key);
      }
    });
  }
  // ...existing code...

  loadGameSettings() {
    // Get settings from URL parameters or localStorage
    const urlParams = new URLSearchParams(window.location.search);
    const difficulty =
      urlParams.get("difficulty") ||
      localStorage.getItem("difficulty") ||
      "easy";
    const timeLimit =
      parseInt(urlParams.get("timeLimit")) ||
      parseInt(localStorage.getItem("timeLimit")) ||
      60;

    this.level = this.capitalizeFirst(difficulty);
    this.timeLeft = timeLimit;
    this.timerElement.textContent = this.timeLeft;
    this.levelElement.textContent = this.level;

    // Set bubble speed based on difficulty
    switch (difficulty) {
      case "easy":
        this.bubbleSpeed = 2000;
        break;
      case "medium":
        this.bubbleSpeed = 2500;
        break;
      case "hard":
        this.bubbleSpeed = 3000;
        break;
    }
  }

  capitalizeFirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  // ...existing code...
  startGame() {
    this.gameActive = true;
    this.score = 0;
    this.timeLeft = parseInt(this.timerElement.textContent);

    // Record start time
    this.startTimestamp = Date.now();

    // Hide start screen
    this.gameOverScreen.style.display = "none";

    // Update UI
    this.updateScore();
    this.gameArea.classList.add("game-active");

    // Start timers
    this.startGameTimer();
    this.createBubble();
  }
  // ...existing code...

  startGameTimer() {
    this.gameTimer = setInterval(() => {
      this.timeLeft--;
      this.timerElement.textContent = this.timeLeft;

      if (this.timeLeft <= 0) {
        this.endGame();
      }
    }, 1000);
  }

  // ...existing code...
createBubble() {
    if (!this.gameActive) return;

    const bubblesCount =
      this.level.toLowerCase() === "easy"
        ? 3
        : this.level.toLowerCase() === "medium"
        ? 2
        : 1; // Adjust for hard level

    for (let i = 0; i < bubblesCount; i++) {
        setTimeout(() => {
        const keys = this.getKeysForLevel();
        const randomKey = keys[Math.floor(Math.random() * keys.length)];

        const bubble = document.createElement("div");
        bubble.className = "bubble";
        bubble.textContent = randomKey;
        bubble.dataset.key = randomKey;

        // Bubble size
        const bubbleWidth = 80;
        const bubbleHeight = 80;
        const maxX = this.gameArea.clientWidth - bubbleWidth;

        // Try to find a non-overlapping position
        let x, y = -bubbleHeight;
        let tries = 0;
        do {
            x = Math.random() * maxX;
            tries++;
        } while (
            this.isOverlapping(x, y, bubbleWidth, bubbleHeight) && tries < 20
        );

        bubble.style.left = `${x}px`;
        bubble.style.top = `${y}px`;

        // Add fall duration based on level
        let fallDuration =
          this.level.toLowerCase() === "easy"
            ? 7
            : this.level.toLowerCase() === "medium"
            ? 7
            : 7;
        bubble.style.animationDuration = `${fallDuration}s`;

        // Add bubble to game area
        this.gameArea.appendChild(bubble);

        // Remove bubble after it falls
        bubble.addEventListener("animationend", () => {
            if (bubble.parentNode) {
                bubble.remove();
            }
        });
    }, i * 300)
}

    // Continue creating bubbles every X seconds
    this.bubbleTimer = setTimeout(() => this.createBubble(), this.bubbleSpeed);
}

// Helper function to check overlap
isOverlapping(x, y, width, height) {
    const bubbles = Array.from(this.gameArea.querySelectorAll(".bubble"));
    for (const b of bubbles) {
        const bx = parseFloat(b.style.left);
        const by = parseFloat(b.style.top);
        if (
            Math.abs(bx - x) < width &&
            Math.abs(by - y) < height
        ) {
            return true;
        }
    }
    return false;
}
// ...existing code...
  getKeysForLevel() {
    const easyKeys = [
      "A",
      "S",
      "D",
      "F",
      "G",
      "H",
      "J",
      "K",
      "L",
      "Q",
      "W",
      "E",
      "R",
      "T",
      "Y",
      "U",
      "I",
      "O",
      "P",
      "Z",
      "X",
      "C",
      "V",
      "B",
      "N",
      "M",
    ];
    const mediumWords = [
      "hi",
      "ok",
      "hey",
      "yo",
      "sup",
      "no",
      "go",
      "up",
      "on",
      "by",
      "do",
      "if",
      "it",
      "my",
      "we",
      "run",
      "fun",
      "sun",
      "dog",
      "cat",
      "bat",
      "hat",
    ];
    const hardWords = [
      "world",
      "hello",
      "there",
      "quick",
      "brown",
      "foxes",
      "crazy",
      "great",
      "super",
      "brave",
      "smart",
      "happy",
      "eager",
      "proud",
      "clear",
      "start",
      "drive",
      "build",
    ];

    switch (this.level.toLowerCase()) {
      case "easy":
        return easyKeys;
      case "medium":
        return mediumWords;
      case "hard":
        return hardWords;
      default:
        return easyKeys;
    }
  }

  handleKeyPress(key) {
    key = key.toLowerCase();
    const bubbles = Array.from(document.querySelectorAll(".bubble"));

    let matched = false;
    bubbles.forEach((bubble) => {
      const bubbleText = bubble.dataset.key.toLowerCase();

      if (bubbleText.startsWith(key) && !bubble.classList.contains("correct")) {
        matched = true;

        // Remove first character
        const updatedText = bubbleText.slice(1);
        bubble.dataset.key = updatedText;

        if (updatedText === "") {
          // Full word typed → Bubble pops!
          bubble.classList.add("correct");
          this.score += this.getScoreForLevel();
          this.updateScore();

          // Remove bubble after animation
          setTimeout(() => {
            if (bubble.parentNode) bubble.remove();
          }, 500);
        } else {
          // Partial word → Change color for feedback
          bubble.textContent = updatedText;
          bubble.style.background = "linear-gradient(135deg, #48bb78, #38a169)";
        }
      }
    });

    if (!matched) {
      bubble.style.background = "red"; // Optional: Add shake effect for wrong key
    }
  }

  getScoreForLevel() {
    switch (this.level.toLowerCase()) {
      case "easy":
        return 10;
      case "medium":
        return 20;
      case "hard":
        return 30;
      default:
        return 10;
    }
  }

  updateScore() {
    this.scoreElement.textContent = this.score;
  }

 // ...existing code...
endGame() {
    this.gameActive = false;

    clearInterval(this.gameTimer);
    clearTimeout(this.bubbleTimer);

    const totalWordsTyped = this.score / this.getScoreForLevel();

    // Calculate time spent in minutes
    let timeSpent = 0;
    if (this.startTimestamp) {
      timeSpent = (Date.now() - this.startTimestamp) / 1000 / 60; // minutes
    }
    let wpm = 0;
    if (timeSpent > 0) {
      wpm = Math.round(totalWordsTyped / timeSpent);
    }

    // Update Final Score & WPM
    this.finalScoreElement.textContent = this.score;
    this.finalLevelElement.textContent = this.level;

    // Clear previous WPM result
    const finalScoreContainer = document.querySelector(".final-score");
    if (finalScoreContainer) {
      finalScoreContainer.innerHTML = "";
      const wpmElement = document.createElement("p");
      wpmElement.textContent = `Typing Speed: ${wpm} WPM`;
      finalScoreContainer.appendChild(wpmElement);
    }

    this.gameOverScreen.style.display = "block";
    this.gameArea.classList.remove("game-active");
}
// ...existing code...
restartGame() {
    // Clear all bubbles
    this.gameArea.innerHTML = "";

    // Clear timers
    clearInterval(this.gameTimer);
    clearTimeout(this.bubbleTimer);

    // Reload game settings (reset timer and level)
    this.loadGameSettings();

    // Hide game over screen
    this.gameOverScreen.style.display = "none";

    // Start a new game
    this.startGame();
}
// ...existing code...

  goToMenu() {
    // Navigate back to start page
    window.location.href = "./index.html";
  }
}

// Initialize game when page loads
document.addEventListener("DOMContentLoaded", () => {
  new KeyBubbleGame();
});

// Prevent context menu on right click
document.addEventListener("contextmenu", (e) => {
  e.preventDefault();
});

// Prevent text selection
document.addEventListener("selectstart", (e) => {
  e.preventDefault();
});
