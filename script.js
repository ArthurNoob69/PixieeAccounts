document.addEventListener('DOMContentLoaded', () => {
    // Check if questionsData is loaded
    if (typeof questionsData === 'undefined' || questionsData.length === 0) {
        document.getElementById('question-text').textContent = "Error: Could not load questions data.";
        return;
    }

    let currentIndex = 0;
    const totalQuestions = questionsData.length;

    // DOM Elements
    const questionText = document.getElementById('question-text');
    const answerText = document.getElementById('answer-text');
    const answerBody = document.getElementById('answer-body');
    const toggleAnswerBtn = document.getElementById('toggleAnswerBtn') || document.getElementById('toggle-answer-btn');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const randomBtn = document.getElementById('random-btn');
    const questionCounter = document.getElementById('question-counter');
    const progressBar = document.getElementById('progress');
    const clearBtn = document.getElementById('clear-practice');

    const tabs = document.querySelectorAll('.btn-tab');
    const formatContainers = document.querySelectorAll('.format-container');

    const journalBody = document.getElementById('journal-body');
    const ledgerBody = document.getElementById('ledger-body');
    const addJournalRowBtn = document.getElementById('add-journal-row');
    const addLedgerRowBtn = document.getElementById('add-ledger-row');

    // Initialize UI
    function init() {
        loadQuestion(currentIndex);
        initPracticeAreas();
        setupEventListeners();
    }

    // Load Question
    function loadQuestion(index) {
        const q = questionsData[index];
        questionText.textContent = q.question;
        answerText.textContent = q.answer;
        
        // Reset answer visibility
        answerBody.style.display = 'none';
        toggleAnswerBtn.innerHTML = '<i class="fa-solid fa-eye"></i> Show Answer';
        
        // Update Navigation & Progress
        questionCounter.textContent = `Question ${index + 1} / ${totalQuestions}`;
        const progressPercentage = ((index + 1) / totalQuestions) * 100;
        progressBar.style.width = `${progressPercentage}%`;

        prevBtn.disabled = index === 0;
        nextBtn.disabled = index === totalQuestions - 1;
    }

    // Practice Area Init
    function initPracticeAreas() {
        // Add 5 default rows to journal
        journalBody.innerHTML = '';
        for (let i = 0; i < 5; i++) addJournalRow();

        // Add 5 default rows to ledger
        ledgerBody.innerHTML = '';
        for (let i = 0; i < 5; i++) addLedgerRow();
    }

    function addJournalRow() {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><input type="text" placeholder="Date"></td>
            <td><input type="text" placeholder="Particulars"></td>
            <td><input type="text" placeholder="L.F."></td>
            <td><input type="text" placeholder="₹"></td>
            <td><input type="text" placeholder="₹"></td>
        `;
        journalBody.appendChild(tr);
    }

    function addLedgerRow() {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><input type="text" placeholder="Date"></td>
            <td><input type="text" placeholder="Particulars"></td>
            <td><input type="text" placeholder="J.F."></td>
            <td><input type="text" placeholder="₹"></td>
            <td><input type="text" placeholder="Date"></td>
            <td><input type="text" placeholder="Particulars"></td>
            <td><input type="text" placeholder="J.F."></td>
            <td><input type="text" placeholder="₹"></td>
        `;
        ledgerBody.appendChild(tr);
    }

    function clearPracticeInputs() {
        const inputs = document.querySelectorAll('.practice-card input');
        inputs.forEach(input => input.value = '');
    }

    // Event Listeners
    function setupEventListeners() {
        // Navigation
        prevBtn.addEventListener('click', () => {
            if (currentIndex > 0) {
                currentIndex--;
                loadQuestion(currentIndex);
            }
        });

        nextBtn.addEventListener('click', () => {
            if (currentIndex < totalQuestions - 1) {
                currentIndex++;
                loadQuestion(currentIndex);
            }
        });

        randomBtn.addEventListener('click', () => {
            currentIndex = Math.floor(Math.random() * totalQuestions);
            loadQuestion(currentIndex);
        });

        // Toggle Answer
        toggleAnswerBtn.addEventListener('click', () => {
            if (answerBody.style.display === 'none') {
                answerBody.style.display = 'block';
                toggleAnswerBtn.innerHTML = '<i class="fa-solid fa-eye-slash"></i> Hide Answer';
            } else {
                answerBody.style.display = 'none';
                toggleAnswerBtn.innerHTML = '<i class="fa-solid fa-eye"></i> Show Answer';
            }
        });

        // Tabs
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                formatContainers.forEach(c => c.classList.remove('active'));

                tab.classList.add('active');
                const target = document.getElementById(tab.dataset.target);
                target.classList.add('active');
            });
        });

        // Add Rows
        addJournalRowBtn.addEventListener('click', addJournalRow);
        addLedgerRowBtn.addEventListener('click', addLedgerRow);

        // Clear button
        clearBtn.addEventListener('click', clearPracticeInputs);
    }

    // Start App
    init();
});
