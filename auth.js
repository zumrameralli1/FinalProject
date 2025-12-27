// Authentication Functions

// Check auth state and update UI
function checkAuthState() {
    if (typeof firebase === 'undefined' || !firebase.auth) {
        console.warn('Firebase not initialized yet');
        return;
    }

    firebase.auth().onAuthStateChanged((user) => {
        updateAuthUI(user);
        
        if (user) {
            // User is signed in
            const userData = {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL
            };
            localStorage.setItem('currentUser', JSON.stringify(userData));
        } else {
            // User is signed out
            localStorage.removeItem('currentUser');
        }
    });
}

// Update UI based on auth state
function updateAuthUI(user) {
    const authButton = document.getElementById('authButton');
    const heroTitle = document.getElementById('heroTitle');
    
    if (user) {
        // User is logged in
        if (authButton) {
            const displayName = user.displayName || user.email.split('@')[0];
            authButton.innerHTML = `
                <a href="#" onclick="showUserMenu(event)">
                    <i class="fas fa-user"></i> ${displayName}
                </a>
            `;
        }
        
        if (heroTitle && window.location.pathname.includes('index.html')) {
            const displayName = user.displayName || user.email.split('@')[0];
            heroTitle.textContent = `Hoş Geldin, ${displayName}!`;
        }
    } else {
        // User is not logged in
        if (authButton) {
            authButton.innerHTML = '<a href="login.html">Giriş Yap</a>';
        }
        
        if (heroTitle && window.location.pathname.includes('index.html')) {
            heroTitle.textContent = 'Teknoloji Dünyasına Hoş Geldiniz';
        }
    }
}

// Show user menu dropdown
function showUserMenu(event) {
    event.preventDefault();
    
    const menu = document.createElement('div');
    menu.className = 'user-dropdown';
    menu.innerHTML = `
        <div class="dropdown-item" onclick="window.location.href='profile.html'">
            <i class="fas fa-user"></i> Profilim
        </div>
        <div class="dropdown-item" onclick="signOut()">
            <i class="fas fa-sign-out-alt"></i> Çıkış Yap
        </div>
    `;
    
    // Remove existing dropdown if any
    const existingDropdown = document.querySelector('.user-dropdown');
    if (existingDropdown) {
        existingDropdown.remove();
    }
    
    document.body.appendChild(menu);
    
    // Position dropdown
    const rect = event.target.getBoundingClientRect();
    menu.style.top = `${rect.bottom + 5}px`;
    menu.style.left = `${rect.left}px`;
    
    // Close dropdown when clicking outside
    setTimeout(() => {
        document.addEventListener('click', function closeDropdown() {
            menu.remove();
            document.removeEventListener('click', closeDropdown);
        });
    }, 100);
}

// Sign out function
function signOut() {
    if (typeof firebase === 'undefined' || !firebase.auth) {
        console.error('Firebase not initialized');
        return;
    }

    firebase.auth().signOut().then(() => {
        localStorage.removeItem('currentUser');
        showNotification('Çıkış yapıldı', 'success');
        window.location.href = 'index.html';
    }).catch((error) => {
        console.error('Sign out error:', error);
        showNotification('Çıkış yapılırken hata oluştu', 'error');
    });
}

// Google Sign In
function signInWithGoogle() {
    if (typeof firebase === 'undefined' || !firebase.auth) {
        showNotification('Firebase henüz yüklenmedi. Lütfen bekleyin.', 'error');
        return;
    }

    const provider = new firebase.auth.GoogleAuthProvider();
    
    firebase.auth().signInWithPopup(provider)
        .then((result) => {
            const user = result.user;
            showNotification(`Hoş geldin, ${user.displayName}!`, 'success');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
        })
        .catch((error) => {
            console.error('Google sign in error:', error);
            showNotification('Google ile giriş yapılırken hata oluştu', 'error');
        });
}

// Email/Password Registration
function registerWithEmail(email, password, displayName) {
    if (typeof firebase === 'undefined' || !firebase.auth) {
        showNotification('Firebase henüz yüklenmedi. Lütfen bekleyin.', 'error');
        return;
    }

    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            
            // Update profile with display name
            return user.updateProfile({
                displayName: displayName
            });
        })
        .then(() => {
            showNotification('Kayıt başarılı! Hoş geldiniz.', 'success');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
        })
        .catch((error) => {
            console.error('Registration error:', error);
            let errorMessage = 'Kayıt olurken hata oluştu';
            
            if (error.code === 'auth/email-already-in-use') {
                errorMessage = 'Bu e-posta adresi zaten kullanılıyor';
            } else if (error.code === 'auth/weak-password') {
                errorMessage = 'Şifre en az 6 karakter olmalıdır';
            } else if (error.code === 'auth/invalid-email') {
                errorMessage = 'Geçersiz e-posta adresi';
            }
            
            showNotification(errorMessage, 'error');
        });
}

// Email/Password Sign In
function signInWithEmail(email, password) {
    if (typeof firebase === 'undefined' || !firebase.auth) {
        showNotification('Firebase henüz yüklenmedi. Lütfen bekleyin.', 'error');
        return;
    }

    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            showNotification(`Hoş geldin, ${user.displayName || user.email}!`, 'success');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
        })
        .catch((error) => {
            console.error('Sign in error:', error);
            let errorMessage = 'Giriş yapılırken hata oluştu';
            
            if (error.code === 'auth/user-not-found') {
                errorMessage = 'Kullanıcı bulunamadı';
            } else if (error.code === 'auth/wrong-password') {
                errorMessage = 'Hatalı şifre';
            } else if (error.code === 'auth/invalid-email') {
                errorMessage = 'Geçersiz e-posta adresi';
            }
            
            showNotification(errorMessage, 'error');
        });
}

// Initialize auth on page load
document.addEventListener('DOMContentLoaded', function() {
    // Wait a bit for Firebase to load
    setTimeout(() => {
        checkAuthState();
    }, 500);
});