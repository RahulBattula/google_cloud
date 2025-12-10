document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const categorySelection = document.getElementById('category-selection');
    const quizInterface = document.getElementById('quiz-interface');
    const summaryScreen = document.getElementById('summary-screen');
    const questionText = document.getElementById('question-text');
    const userAnswerInput = document.getElementById('user-answer');
    const submitBtn = document.getElementById('submit-btn');
    const nextQuestionBtn = document.getElementById('next-question-btn');
    const skipQuestionBtn = document.getElementById('skip-question-btn');
    const endSessionBtn = document.getElementById('end-session-btn');
    const scoreDisplay = document.getElementById('score-display');
    const currentCorrectSpan = document.getElementById('current-correct');
    const currentTotalSpan = document.getElementById('current-total');
    const currentCategoryTitle = document.getElementById('current-category-title');
    const startSessionBtn = document.getElementById('start-session-btn');
    const restartAppBtn = document.getElementById('restart-app-btn');
    const errorMessage = document.getElementById('error-message');
    const resultMessage = document.getElementById('result-message');
    const skippedSummaryDiv = document.getElementById('skipped-summary');
    const skippedCountSpan = document.getElementById('skipped-count');
    const skippedListUl = document.getElementById('skipped-list');
    
    // Timer Elements
    const timeDisplay = document.getElementById('time-display');
    const averageTimeDisplay = document.getElementById('average-time-display');
    
    const categoryCheckboxes = document.querySelectorAll('.category-checkbox');
    const rangeInputs = document.querySelectorAll('.range-input');

    // --- State Variables ---
    let selectedCategories = []; 
    let currentQuestionText = '';
    let currentCategory = ''; 
    let correctAnswer = null;
    let score = { correct: 0, total: 0 };
    let questionActive = false;
    let skippedQuestions = []; 
    
    // Timer Variables
    let startTime = null;
    let timerInterval = null;
    let totalTimeTaken = 0; // Cumulative time in milliseconds for all attempted questions
    
    // Fixed data
    const categoryTitlesMap = {
        squares: 'Squares', squareRoots: 'Square Roots', cubes: 'Cubes', 
        cubeRoots: 'Cube Roots', conversions: 'FDP Conversions', percentages: 'Quick Percentages',
    };
    const commonFractions = [
        [1, 2], [1, 3], [2, 3], [1, 4], [3, 4], [1, 5], [2, 5], [3, 5], [4, 5], 
        [1, 8], [3, 8], [5, 8], [7, 8], [1, 10], [3, 10], [7, 10], [9, 10], 
        [1, 20], [3, 20], [7, 20], [9, 20]
    ];
    
    // --- Timer Functions ---

    /** Formats milliseconds into MM:SS.ms string */
    const formatTime = (ms) => {
        const minutes = Math.floor(ms / 60000);
        const seconds = Math.floor((ms % 60000) / 1000);
        const milliseconds = Math.floor((ms % 1000) / 10);
        
        const formattedMinutes = String(minutes).padStart(2, '0');
        const formattedSeconds = String(seconds).padStart(2, '0');
        const formattedMilliseconds = String(milliseconds).padStart(2, '0');
        
        return `${formattedMinutes}:${formattedSeconds}.${formattedMilliseconds}`;
    };

    /** Starts the stopwatch for the current question */
    const startTimer = () => {
        if (timerInterval) clearInterval(timerInterval);
        
        startTime = Date.now();
        timeDisplay.textContent = '00:00.00';
        
        timerInterval = setInterval(() => {
            const elapsedTime = Date.now() - startTime;
            timeDisplay.textContent = formatTime(elapsedTime);
        }, 10); // Update every 10 milliseconds
    };

    /** Stops the stopwatch and returns the elapsed time in milliseconds */
    const stopTimer = () => {
        if (timerInterval) clearInterval(timerInterval);
        timerInterval = null;
        if (startTime) {
            return Date.now() - startTime;
        }
        return 0;
    };
    
    // --- Utility Functions ---
    
    const getRandomInt = (min, max) => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    const normalizeAnswer = (answer, type) => {
        let normalized = String(answer).trim();

        if (type === 'conversions') {
            normalized = normalized.replace(/%$/, '');
            normalized = normalized.replace(/\s/g, '');
        }

        if (normalized.includes('.')) {
            normalized = normalized.replace(/(\.0+|0+)$/, '');
        }
        
        return normalized.toLowerCase();
    };

    /** CORE VALIDATION LOGIC REFINEMENT **/
    const collectSelectedCategories = () => {
        const categories = [];
        let validRanges = true;
        errorMessage.classList.add('hidden'); 

        categoryCheckboxes.forEach(checkbox => {
            if (checkbox.checked) {
                const name = checkbox.dataset.category;
                const minInput = document.querySelector(`[data-range-min="${name}"]`);
                const maxInput = document.querySelector(`[data-range-max="${name}"]`);

                let min = 1;
                let max = 100;
                
                // Only check range inputs if they exist (i.e., not FDP or Percentages)
                if (minInput && maxInput) {
                    const minVal = parseInt(minInput.value);
                    const maxVal = parseInt(maxInput.value);
                    
                    // Check if they are valid numbers and if the range is logical
                    if (isNaN(minVal) || isNaN(maxVal) || minVal < 1 || minVal > maxVal) {
                        validRanges = false;
                        return; // Stop checking further categories
                    }
                    
                    min = minVal;
                    max = maxVal;
                }
                
                categories.push({ name, min, max });
            }
        });
        
        if (!validRanges) {
            errorMessage.textContent = "Please ensure all custom range inputs are filled with valid numbers and min ≤ max.";
            errorMessage.classList.remove('hidden');
            return null;
        }
        
        if (categories.length === 0) {
            return null; 
        }
        
        return categories;
    };

    const updateStartButtonState = () => {
        const categories = collectSelectedCategories();
        
        // This check is now the single source of truth for button state
        if (categories) {
            startSessionBtn.textContent = `Start Practice Session (${categories.length} categories selected)`;
            startSessionBtn.disabled = false;
            startSessionBtn.classList.remove('bg-gray-400', 'cursor-not-allowed');
            startSessionBtn.classList.add('bg-indigo-600', 'hover:bg-indigo-700');
        } else {
            startSessionBtn.textContent = "Select at least one category to Start";
            startSessionBtn.disabled = true;
            startSessionBtn.classList.add('bg-gray-400', 'cursor-not-allowed');
            startSessionBtn.classList.remove('bg-indigo-600', 'hover:bg-indigo-700');
        }
    };
    
    const generateQuestion = () => {
        const categoryConfig = selectedCategories[getRandomInt(0, selectedCategories.length - 1)];
        currentCategory = categoryConfig.name;

        let question = '';
        let answer = '';

        const toFixedIfNecessary = (num, dp) => {
            const str = num.toFixed(dp);
            return str.replace(/(\.0+|0+)$/, '');
        };

        const min = categoryConfig.min;
        const max = categoryConfig.max;

        switch (currentCategory) {
            case 'squares':
                const N_sq = getRandomInt(min, max);
                question = `${N_sq}² = ?`;
                answer = (N_sq ** 2).toString();
                break;
            
            case 'squareRoots':
                const N_sqrt = getRandomInt(min, max); 
                const square = N_sqrt ** 2;
                question = `√${square} = ?`;
                answer = N_sqrt.toString();
                break;

            case 'cubes':
                const N_cub = getRandomInt(min, max);
                question = `${N_cub}³ = ?`;
                answer = (N_cub ** 3).toString();
                break;
            
            case 'cubeRoots':
                const N_cbrt = getRandomInt(min, max); 
                const cube = N_cbrt ** 3;
                question = `\u221b${cube} = ?`; 
                answer = N_cbrt.toString();
                break;

            case 'conversions':
                const subType = getRandomInt(0, 3); 
                const [numerator, denominator] = commonFractions[getRandomInt(0, commonFractions.length - 1)];
                const decimalValue = numerator / denominator;
                const percentValue = decimalValue * 100;

                if (subType === 0) { // F -> D
                    question = `Convert ${numerator}/${denominator} to a decimal.`;
                    answer = toFixedIfNecessary(decimalValue, 5); 
                } else if (subType === 1) { // D -> F
                    question = `Convert ${toFixedIfNecessary(decimalValue, 5)} to a reduced fraction (e.g., 1/2).`;
                    answer = `${numerator}/${denominator}`;
                } else if (subType === 2) { // F -> %
                    question = `Convert ${numerator}/${denominator} to a percentage (e.g., 50%).`;
                    answer = toFixedIfNecessary(percentValue, 5) + '%';
                } else { // % -> F
                    question = `Convert ${toFixedIfNecessary(percentValue, 5)}% to a reduced fraction (e.g., 1/2).`;
                    answer = `${numerator}/${denominator}`;
                }
                break;

            case 'percentages':
                const percentageRate = getRandomInt(5, 95); 
                let baseNumber = getRandomInt(50, 500);
                
                // Ensure the result is an integer or simple decimal for nicer quick math questions
                const factor = 100 / percentageRate;
                if (factor % 1 === 0) {
                    baseNumber = baseNumber - (baseNumber % factor);
                    if (baseNumber === 0) baseNumber = factor;
                }

                const result = (percentageRate / 100) * baseNumber;
                question = `Find ${percentageRate}% of ${baseNumber}.`;
                answer = toFixedIfNecessary(result, 2);
                break;
        }

        correctAnswer = normalizeAnswer(answer, currentCategory);
        currentQuestionText = question; 
        questionText.textContent = question;
        questionActive = true;
    };


    // --- Quiz Flow Functions ---
    
    const startQuiz = () => {
        const categories = collectSelectedCategories();
        if (!categories) return; 
        
        selectedCategories = categories;
        score = { correct: 0, total: 0 };
        skippedQuestions = [];
        totalTimeTaken = 0; // Reset cumulative time
        
        categorySelection.classList.add('hidden');
        quizInterface.classList.remove('hidden');
        summaryScreen.classList.add('hidden');
        scoreDisplay.classList.remove('hidden');

        const titles = selectedCategories.map(c => categoryTitlesMap[c.name]);
        currentCategoryTitle.textContent = `Practice Mix: ${titles.join(' / ')}`;
        
        updateScoreDisplay();
        nextQuestion();
    };

    const nextQuestion = () => {
        userAnswerInput.value = '';
        resultMessage.textContent = '';
        resultMessage.className = 'text-center font-bold text-2xl h-8'; 
        userAnswerInput.disabled = false;
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit Answer';
        
        submitBtn.classList.remove('bg-green-500', 'hover:bg-green-600', 'bg-red-500', 'hover:bg-red-600');
        submitBtn.classList.add('bg-indigo-600', 'hover:bg-indigo-700');
        
        nextQuestionBtn.disabled = true;
        nextQuestionBtn.className = 'py-2 px-6 text-sm sm:text-base bg-green-500 text-white font-semibold rounded-lg opacity-50 cursor-not-allowed hover:bg-green-600 transition duration-150';
        skipQuestionBtn.disabled = false;

        generateQuestion();
        startTimer(); // START TIMER for the new question
        userAnswerInput.focus();
    };

    const updateScoreDisplay = () => {
        currentCorrectSpan.textContent = score.correct;
        currentTotalSpan.textContent = score.total;
    };

    const showSummary = () => {
        // Stop any running timer before showing summary
        stopTimer(); 
        
        quizInterface.classList.add('hidden');
        scoreDisplay.classList.add('hidden');
        summaryScreen.classList.remove('hidden');

        document.getElementById('summary-category').textContent = currentCategoryTitle.textContent;
        document.getElementById('summary-correct').textContent = score.correct;
        document.getElementById('summary-total').textContent = score.total;

        const percentage = score.total > 0 
            ? ((score.correct / score.total) * 100).toFixed(1)
            : 0;
            
        const percentageText = `(${percentage}%)`;
        const summaryPercentageSpan = document.getElementById('summary-percentage');
        summaryPercentageSpan.textContent = percentageText;
        summaryPercentageSpan.className = `text-xl sm:text-2xl font-bold ${percentage >= 80 ? 'text-green-600' : percentage >= 50 ? 'text-yellow-600' : 'text-red-600'}`;
        
        // CALCULATE AND DISPLAY AVERAGE TIME
        // Only count questions that were actually submitted (score.total)
        const attemptedQuestions = score.total;
        let averageTime = 0;
        if (attemptedQuestions > 0) {
            // totalTimeTaken is in milliseconds
            averageTime = (totalTimeTaken / attemptedQuestions) / 1000; // Convert to seconds
        }
        averageTimeDisplay.textContent = `${averageTime.toFixed(2)}s`;
        
        // DISPLAY SKIPPED QUESTIONS
        skippedListUl.innerHTML = '';
        if (skippedQuestions.length > 0) {
            skippedCountSpan.textContent = skippedQuestions.length;
            skippedQuestions.forEach(item => {
                const li = document.createElement('li');
                li.innerHTML = `<strong>${item.question}</strong> = ${item.answer.toUpperCase()}`;
                li.className = 'border-b border-gray-100 pb-1';
                skippedListUl.appendChild(li);
            });
            skippedSummaryDiv.classList.remove('hidden');
        } else {
            skippedSummaryDiv.classList.add('hidden');
        }
    };
    
    // --- Event Listeners ---
    
    // Start Session button click
    startSessionBtn.addEventListener('click', startQuiz);

    // Skip Question Button Click
    skipQuestionBtn.addEventListener('click', () => {
        if (!questionActive) return;
        
        // Stop the timer, but DO NOT add time to totalTimeTaken since it was skipped
        stopTimer(); 

        skippedQuestions.push({
            question: currentQuestionText,
            answer: correctAnswer
        });

        skipQuestionBtn.disabled = true;
        userAnswerInput.disabled = true;
        submitBtn.disabled = true;
        
        resultMessage.textContent = '⏭️ Question Skipped!';
        resultMessage.className = 'text-center font-bold text-xl sm:text-2xl h-8 text-yellow-600';
        
        setTimeout(nextQuestion, 500); 
    });

    // Quiz form submission (Submit button click or Enter key)
    document.getElementById('quiz-form').addEventListener('submit', (e) => {
        e.preventDefault();
        
        if (!questionActive) return;

        const userAnswer = normalizeAnswer(userAnswerInput.value, currentCategory);
        
        if (userAnswer === '') return;
        
        // STOP TIMER and RECORD TIME
        const elapsed = stopTimer();
        totalTimeTaken += elapsed; // Add time to the cumulative total

        questionActive = false;
        score.total++;
        userAnswerInput.disabled = true;
        submitBtn.disabled = true;
        skipQuestionBtn.disabled = true;

        const isCorrect = userAnswer === correctAnswer;

        if (isCorrect) {
            score.correct++;
            resultMessage.textContent = '✅ Correct!';
            resultMessage.className = 'text-center font-bold text-xl sm:text-2xl h-8 text-green-600';
        } else {
            resultMessage.innerHTML = `❌ Incorrect. The answer was: **${correctAnswer.toUpperCase()}**`;
            resultMessage.className = 'text-center font-bold text-xl sm:text-2xl h-8 text-red-600';
        }

        // Display the time taken for this question in the message area
        resultMessage.innerHTML += ` <span class="text-xs sm:text-base text-gray-500 font-normal">(${(elapsed / 1000).toFixed(2)}s)</span>`;

        // Change submit button appearance
        submitBtn.textContent = isCorrect ? 'Correct!' : 'Incorrect!';
        submitBtn.classList.remove('bg-indigo-600', 'hover:bg-indigo-700');
        submitBtn.classList.add(isCorrect ? 'bg-green-500' : 'bg-red-500', isCorrect ? 'hover:bg-green-600' : 'hover:bg-red-600');
        
        // Enable Next button
        nextQuestionBtn.disabled = false;
        nextQuestionBtn.className = 'py-2 px-4 sm:px-6 text-sm sm:text-base bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition duration-150';
        updateScoreDisplay();
    });
    
    // Next Question button click
    nextQuestionBtn.addEventListener('click', nextQuestion);

    // End Session button click
    endSessionBtn.addEventListener('click', showSummary);

    // Restart App button click (goes back to configuration screen)
    restartAppBtn.addEventListener('click', () => {
        categorySelection.classList.remove('hidden');
        summaryScreen.classList.add('hidden');
        scoreDisplay.classList.add('hidden');
        selectedCategories = [];
        currentCategoryTitle.textContent = '';
        updateStartButtonState(); 
    });

    // LISTENERS FOR CONFIGURATION (Critical for fixing the Start button bug)
    // Listen to changes on *all* checkboxes and range inputs to update button state
    categoryCheckboxes.forEach(checkbox => {
        // Toggle the disabled state of associated range inputs
        checkbox.addEventListener('change', (e) => {
            const category = e.target.dataset.category;
            const minInput = document.querySelector(`[data-range-min="${category}"]`);
            const maxInput = document.querySelector(`[data-range-max="${category}"]`);
            const isChecked = e.target.checked;
            
            if (minInput) minInput.disabled = !isChecked;
            if (maxInput) maxInput.disabled = !isChecked;
            
            // Re-evaluate button state immediately
            updateStartButtonState();
        });
    });
    
    rangeInputs.forEach(input => {
        // Any change in a range input needs to re-evaluate button state
        input.addEventListener('input', updateStartButtonState);
    });

    
    // Initial setup
    updateStartButtonState();
});