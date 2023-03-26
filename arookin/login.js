// Get login form elements
const loginForm = document.querySelector('form');
const loginButton = document.getElementById('login-btn');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');

// Add event listener for login button
loginButton.addEventListener('click', function(e) {
  e.preventDefault();
  const username = usernameInput.value;
  const password = passwordInput.value;
  // Here you would typically validate the username and password
  // against a database or other source of user credentials
  if (username === 'money_man' && password === 'money_password') {
    alert('Login successful!');
    // Redirect user to homepage or other appropriate page
  } else {
    alert('Login failed. Please check your username and password.');
  }
});

// Get create account link and form elements
const createAccountLink = document.getElementById('create-account-link');
const createAccountForm = document.getElementById('create-account-form');
const newUsernameInput = document.getElementById('new-username');
const newPasswordInput = document.getElementById('new-password');
const confirmPasswordInput = document.getElementById('confirm-password');
const createAccountButton = document.getElementById('create-account-btn');

// Add event listener for create account link
createAccountLink.addEventListener('click', function(e) {
  e.preventDefault();
  createAccountForm.style.display = 'block';
});

// Add event listener for create account button
createAccountButton.addEventListener('click', function(e) {
  e.preventDefault();
  const newUsername = newUsernameInput.value;
  const newPassword = newPasswordInput.value;
  const confirmPassword = confirmPasswordInput.value;
  // Here you would typically validate the new username and password
  // against your database or other source of user credentials
  if (newPassword !== confirmPassword) {
    alert('Passwords do not match. Please try again.');
  } else {
    alert('Account created successfully!');
    // Add code here to save new username and password to database
    // Redirect user to homepage or other appropriate page
  }
});
