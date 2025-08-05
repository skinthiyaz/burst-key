document.addEventListener('DOMContentLoaded', function() {
    const gameForm = document.getElementById('gameForm');
    const startButton = document.getElementById('startBtn');
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');

    let intervalId = null;
    let progress = 0;

    gameForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Get selected values
        const difficulty = document.getElementById('difficulty').value;
        const timeLimit = document.getElementById('timeLimit').value;

        // Save to localStorage
        localStorage.setItem('difficulty', difficulty);
        localStorage.setItem('timeLimit', timeLimit);

        // Start loading simulation
        progress = 0;
        progressFill.style.width = "0%";
        progressText.textContent = "0%";
        startButton.textContent = "Starting...";

        intervalId = setInterval(() => {
            if (progress >= 100) {
                clearInterval(intervalId);
                startButton.textContent = "Starting...";
                const gameUrl = `../main game/index.html?difficulty=${difficulty}&timeLimit=${timeLimit}`;
                setTimeout(() => {
                    window.location.href = gameUrl;
                }, 500);
            } else {
                progress++;
                progressFill.style.width = progress + "%";
                progressText.textContent = progress + "%";
            }
        }, 30);
    });

    startButton.addEventListener('click', function(e) {
        // Only cancel if already in progress
        if (this.textContent === "Cancel") {
            clearInterval(intervalId);
            progress = 0;
            progressFill.style.width = "0%";
            progressText.textContent = "0%";
            this.textContent = "Start Typing Test";
        }
    });
});
