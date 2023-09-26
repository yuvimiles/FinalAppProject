document.addEventListener('DOMContentLoaded', function() {
    const signupNowButton = document.getElementById('signupNowButton');
    const errorDisplay = document.getElementById('errorDisplay');

    if (signupNowButton && errorDisplay) {
        signupNowButton.addEventListener('click', function() {
            // Reset the error content
            errorDisplay.textContent = '';
        });
    }
});
