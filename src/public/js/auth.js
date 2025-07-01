document.addEventListener('DOMContentLoaded', function() {
  // Get all forms
  const forms = document.querySelectorAll('form');
  
  forms.forEach(form => {
    // Add submit event listener
    form.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      // Remove previous error messages
      clearErrors(form);
      
      // Validate form
      if (!validateForm(form)) {
        return;
      }
      
      // Disable submit button
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Loading...';
      
      try {
        // Get form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        // Send request
        const response = await fetch(form.action, {
          method: form.method,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
          credentials: 'include'
        });
        
        const result = await response.json();
        
        if (!response.ok) {
          // Handle validation errors
          if (result.errors) {
            Object.keys(result.errors).forEach(field => {
              showError(form, field, result.errors[field]);
            });
          } else {
            showError(form, 'general', result.message || 'An error occurred');
          }
        } else {
          // Handle success
          if (result.redirect) {
            window.location.href = result.redirect;
          } else {
            showSuccess(form, result.message || 'Operation successful');
          }
        }
      } catch (error) {
        showError(form, 'general', 'Network error occurred');
      } finally {
        // Re-enable submit button
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
      }
    });
  });
  
  // Form validation
  function validateForm(form) {
    let isValid = true;
    
    // Required fields
    form.querySelectorAll('[required]').forEach(field => {
      if (!field.value.trim()) {
        showError(form, field.name, 'This field is required');
        isValid = false;
      }
    });
    
    // Email validation
    const emailField = form.querySelector('input[type="email"]');
    if (emailField && emailField.value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailField.value)) {
        showError(form, emailField.name, 'Please enter a valid email address');
        isValid = false;
      }
    }
    
    // Password validation
    const passwordField = form.querySelector('input[name="password"]');
    if (passwordField && passwordField.value) {
      if (passwordField.value.length < 6) {
        showError(form, passwordField.name, 'Password must be at least 6 characters long');
        isValid = false;
      }
    }
    
    // Password confirmation
    const confirmPasswordField = form.querySelector('input[name="confirmPassword"]');
    if (confirmPasswordField && confirmPasswordField.value) {
      if (confirmPasswordField.value !== passwordField.value) {
        showError(form, confirmPasswordField.name, 'Passwords do not match');
        isValid = false;
      }
    }
    
    return isValid;
  }
  
  // Show error message
  function showError(form, fieldName, message) {
    const field = form.querySelector(`[name="${fieldName}"]`);
    if (field) {
      field.classList.add('is-invalid');
      const errorDiv = document.createElement('div');
      errorDiv.className = 'invalid-feedback';
      errorDiv.textContent = message;
      field.parentNode.appendChild(errorDiv);
    } else {
      // General error message
      const errorDiv = document.createElement('div');
      errorDiv.className = 'alert alert-danger mt-3';
      errorDiv.textContent = message;
      form.insertBefore(errorDiv, form.firstChild);
    }
  }
  
  // Show success message
  function showSuccess(form, message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'alert alert-success mt-3';
    successDiv.textContent = message;
    form.insertBefore(successDiv, form.firstChild);
  }
  
  // Clear all error messages
  function clearErrors(form) {
    // Remove error classes
    form.querySelectorAll('.is-invalid').forEach(field => {
      field.classList.remove('is-invalid');
    });
    
    // Remove error messages
    form.querySelectorAll('.invalid-feedback').forEach(error => {
      error.remove();
    });
    
    // Remove general error/success messages
    form.querySelectorAll('.alert').forEach(alert => {
      alert.remove();
    });
  }
  
  // Password visibility toggle
  const togglePassword = document.querySelector('.toggle-password');
  if (togglePassword) {
    togglePassword.addEventListener('click', function() {
      const passwordField = document.querySelector('input[name="password"]');
      const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
      passwordField.setAttribute('type', type);
      this.querySelector('i').classList.toggle('bi-eye');
      this.querySelector('i').classList.toggle('bi-eye-slash');
    });
  }
}); 