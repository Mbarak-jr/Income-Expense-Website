document.addEventListener('DOMContentLoaded', function () {
    const usernameField = document.querySelector('#usernameField');
    const emailField = document.querySelector('#emailField');
    const passwordField = document.querySelector('#passwordField');
    const submitBtn = document.querySelector('.submit-btn');

    // Initially disable the submit button
    submitBtn.disabled = true;

    // Function to check if all fields are valid and enable/disable the submit button
    function validateForm() {
        const isUsernameValid = usernameField.value.trim() !== '' && !usernameField.classList.contains('is-invalid');
        const isEmailValid = emailField.value.trim() !== '' && !emailField.classList.contains('is-invalid');
        const isPasswordValid = passwordField.value.trim() !== '';

        if (isUsernameValid && isEmailValid && isPasswordValid) {
            submitBtn.disabled = false;
        } else {
            submitBtn.disabled = true;
        }
    }

    // Create error message for invalid username input
    const invalidUsernameMessage = document.createElement('div');
    invalidUsernameMessage.classList.add('invalid-feedback');
    invalidUsernameMessage.id = 'invalid_username';
    invalidUsernameMessage.textContent = 'Error: Only alphanumeric characters allowed';
    invalidUsernameMessage.style.display = 'none';
    usernameField.parentNode.appendChild(invalidUsernameMessage);

    usernameField.addEventListener('keyup', (e) => {
        const usernameVal = e.target.value.trim();
        usernameField.classList.remove('is-invalid');
        invalidUsernameMessage.style.display = 'none';

        // Check if the username contains only alphanumeric characters
        const alphanumericRegex = /^[a-zA-Z0-9]*$/;
        if (!alphanumericRegex.test(usernameVal)) {
            usernameField.classList.add('is-invalid');
            invalidUsernameMessage.style.display = 'block';
        } else if (usernameVal.length > 0) {
            fetch('/authentication/validate-username', {
                body: JSON.stringify({ username: usernameVal }),
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            })
            .then((res) => res.json())
            .then((data) => {
                if (data.username_error) {
                    usernameField.classList.add('is-invalid');
                    invalidUsernameMessage.textContent = data.username_error;
                    invalidUsernameMessage.style.display = 'block';
                }
            });
        }

        validateForm();
    });

    // Create error message for invalid email input
    const invalidEmailMessage = document.createElement('div');
    invalidEmailMessage.classList.add('invalid-feedback');
    invalidEmailMessage.id = 'invalid_email';
    invalidEmailMessage.textContent = 'Error: Enter a valid email address';
    invalidEmailMessage.style.display = 'none';
    emailField.parentNode.appendChild(invalidEmailMessage);

    emailField.addEventListener('keyup', (e) => {
        const emailVal = e.target.value.trim();
        emailField.classList.remove('is-invalid');
        invalidEmailMessage.style.display = 'none';

        // If email field is empty, remove the error message
        if (emailVal.length === 0) {
            validateForm();
            return;
        }

        // Check if email format is valid
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailVal)) {
            emailField.classList.add('is-invalid');
            invalidEmailMessage.style.display = 'block';
        } else {
            fetch('/authentication/validate-email', {
                body: JSON.stringify({ email: emailVal }),
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            })
            .then((res) => res.json())
            .then((data) => {
                if (data.email_error) {
                    emailField.classList.add('is-invalid');
                    invalidEmailMessage.textContent = data.email_error;
                    invalidEmailMessage.style.display = 'block';
                }
            });
        }

        validateForm();
    });

    // Attach keyup event listener to password field
    passwordField.addEventListener('keyup', validateForm);

    // Run validateForm once on load to ensure button is initially disabled
    validateForm();
});
