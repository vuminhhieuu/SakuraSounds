document.addEventListener('DOMContentLoaded', function() {
    // Form validation
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(event) {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }
            form.classList.add('was-validated');
        });
    });

    // Password confirmation validation
    const changePasswordForm = document.getElementById('changePasswordForm');
    if (changePasswordForm) {
        changePasswordForm.addEventListener('submit', function(event) {
            const newPassword = document.getElementById('newPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;

            if (newPassword !== confirmPassword) {
                event.preventDefault();
                alert('Passwords do not match!');
            }
        });
    }

    // Avatar preview
    const avatarInput = document.getElementById('avatar');
    const avatarPreview = document.getElementById('avatarPreview');
    if (avatarInput && avatarPreview) {
        avatarInput.addEventListener('change', function() {
            const file = this.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    avatarPreview.src = e.target.result;
                    avatarPreview.style.display = 'block';
                }
                reader.readAsDataURL(file);
            }
        });
    }

    // Remove favorite song
    const removeFavoriteButtons = document.querySelectorAll('.remove-favorite');
    removeFavoriteButtons.forEach(button => {
        button.addEventListener('click', async function() {
            const songId = this.dataset.songId;
            try {
                const response = await fetch(`/api/users/favorites/${songId}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    this.closest('.list-group-item').remove();
                    // Show success message
                    showAlert('Song removed from favorites', 'success');
                } else {
                    throw new Error('Failed to remove song from favorites');
                }
            } catch (error) {
                console.error('Error:', error);
                showAlert('Failed to remove song from favorites', 'danger');
            }
        });
    });

    // Form submission handlers
    const profileForm = document.getElementById('profileForm');
    if (profileForm) {
        profileForm.addEventListener('submit', async function(event) {
            event.preventDefault();
            try {
                const formData = new FormData(this);
                const response = await fetch(this.action, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(Object.fromEntries(formData))
                });

                if (response.ok) {
                    showAlert('Profile updated successfully', 'success');
                } else {
                    throw new Error('Failed to update profile');
                }
            } catch (error) {
                console.error('Error:', error);
                showAlert('Failed to update profile', 'danger');
            }
        });
    }

    const avatarForm = document.getElementById('avatarForm');
    if (avatarForm) {
        avatarForm.addEventListener('submit', async function(event) {
            event.preventDefault();
            try {
                const formData = new FormData(this);
                const response = await fetch(this.action, {
                    method: 'POST',
                    body: formData
                });

                if (response.ok) {
                    const data = await response.json();
                    // Update avatar image
                    document.querySelector('.card-body img').src = data.avatar;
                    // Close modal
                    bootstrap.Modal.getInstance(document.getElementById('changeAvatarModal')).hide();
                    showAlert('Avatar updated successfully', 'success');
                } else {
                    throw new Error('Failed to update avatar');
                }
            } catch (error) {
                console.error('Error:', error);
                showAlert('Failed to update avatar', 'danger');
            }
        });
    }

    const deleteAccountForm = document.getElementById('deleteAccountForm');
    if (deleteAccountForm) {
        deleteAccountForm.addEventListener('submit', async function(event) {
            event.preventDefault();
            if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                try {
                    const formData = new FormData(this);
                    const response = await fetch(this.action, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(Object.fromEntries(formData))
                    });

                    if (response.ok) {
                        window.location.href = '/auth/login';
                    } else {
                        throw new Error('Failed to delete account');
                    }
                } catch (error) {
                    console.error('Error:', error);
                    showAlert('Failed to delete account', 'danger');
                }
            }
        });
    }
});

// Utility function to show alerts
function showAlert(message, type) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed top-0 end-0 m-3`;
    alertDiv.style.zIndex = '1050';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    document.body.appendChild(alertDiv);

    // Auto dismiss after 3 seconds
    setTimeout(() => {
        alertDiv.remove();
    }, 3000);
} 