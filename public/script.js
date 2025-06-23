document.addEventListener('DOMContentLoaded', () => {
    const loginContainer = document.getElementById('login-container');
    const registerContainer = document.getElementById('register-container');
    const showRegister = document.getElementById('show-register');
    const showLogin = document.getElementById('show-login');

    if (showRegister) {
        showRegister.addEventListener('click', (e) => {
            e.preventDefault();
            loginContainer.style.display = 'none';
            registerContainer.style.display = 'block';
        });
    }

    if (showLogin) {
        showLogin.addEventListener('click', (e) => {
            e.preventDefault();
            loginContainer.style.display = 'block';
            registerContainer.style.display = 'none';
        });
    }

    const loginBtn = document.getElementById('login-btn');
    const registerBtn = document.getElementById('register-btn');

    if(registerBtn) {
        registerBtn.addEventListener('click', async () => {
            const username = document.getElementById('register-username').value;
            const password = document.getElementById('register-password').value;
    
            const response = await fetch('/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
    
            const result = await response.json();
            alert(result.message);
            if (response.ok) {
                window.location.reload();
            }
        });
    }

    if(loginBtn) {
        loginBtn.addEventListener('click', async () => {
            const username = document.getElementById('login-username').value;
            const password = document.getElementById('login-password').value;
    
            const response = await fetch('/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
    
            const result = await response.json();
            if (response.ok) {
                alert(result.message);
                window.location.href = 'test.html';
            } else {
                alert(result.message);
            }
        });
    }

    // Logic for test page
    if (window.location.pathname.endsWith('test.html')) {
        const quizContainer = document.getElementById('quiz-container');
        const submitBtn = document.getElementById('submit-btn');

        async function loadQuestions() {
            const response = await fetch('/questions');
            const questions = await response.json();

            questions.forEach((q, index) => {
                const questionElement = document.createElement('div');
                questionElement.className = 'question';
                questionElement.innerHTML = `<p>${index + 1}. ${q.question}</p>`;
                
                const optionsElement = document.createElement('ul');
                optionsElement.className = 'options';

                q.options.forEach(option => {
                    const optionElement = document.createElement('li');
                    optionElement.innerHTML = `<input type="radio" name="question${index}" value="${option}"> ${option}`;
                    optionsElement.appendChild(optionElement);
                });

                questionElement.appendChild(optionsElement);
                quizContainer.appendChild(questionElement);
            });
        }

        submitBtn.addEventListener('click', async () => {
            const answers = [];
            const questions = document.querySelectorAll('.question');
            questions.forEach((question, index) => {
                const selectedOption = question.querySelector(`input[name="question${index}"]:checked`);
                answers.push(selectedOption ? selectedOption.value : null);
            });

            const response = await fetch('/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ answers })
            });

            const result = await response.json();
            localStorage.setItem('testResult', JSON.stringify(result));
            window.location.href = 'results.html';
        });

        loadQuestions();
    }

    // Logic for results page
    if (window.location.pathname.endsWith('results.html')) {
        const resultsContainer = document.getElementById('results-container');
        const result = JSON.parse(localStorage.getItem('testResult'));

        if (result) {
            resultsContainer.innerHTML = `<p>You scored ${result.score} out of ${result.total}.</p>`;
        } else {
            resultsContainer.innerHTML = '<p>No results found.</p>';
        }
    }
}); 