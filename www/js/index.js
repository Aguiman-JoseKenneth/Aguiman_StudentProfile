/* ==========================================================================
   Constants & Defaults (Declared first to prevent ReferenceError)
   ========================================================================== */
const API_BASE_URL = "http://10.0.2.2/student_api"; // Update this to match your XAMPP server host

const defaultProfile = {
    fullName: "Jose Kenneth Aguiman",
    course: "BS Information Technology",
    yearLevel: "3rd Year",
    about: "Information Technology student passionate about web and mobile app development.",
    skills: "JavaScript, HTML5, CSS3, Apache Cordova, Python, MySQL"
};

const DEFAULT_AVATAR = 'img/avatar.png';
const STORAGE_KEY_PHOTO = 'student_profile_picture';

/* ==========================================================================
   Lifecycle & Event Binding
   ========================================================================== */
document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
    console.log('Device ready fired');
    initProfile();
    setupEventListeners();
    checkSession();
}

// Browser / Emulator DOM load fallback
window.addEventListener('DOMContentLoaded', () => {
    initProfile();
    setupEventListeners();
    checkSession();
});

function initProfile() {
    const savedData = getStoredProfile();
    renderProfile(savedData);
    loadSavedProfilePicture();
}

function getStoredProfile() {
    try {
        const data = localStorage.getItem('studentProfile');
        return data ? JSON.parse(data) : defaultProfile;
    } catch (e) {
        console.error("Failed to parse stored profile:", e);
        return defaultProfile;
    }
}

function renderProfile(data) {
    const nameEl = document.getElementById('display-name');
    const courseEl = document.getElementById('display-course');
    const yearEl = document.getElementById('display-year');
    const aboutEl = document.getElementById('display-about');
    const skillsEl = document.getElementById('display-skills');

    if (nameEl) nameEl.textContent = data.fullName;
    if (courseEl) courseEl.textContent = data.course;
    if (yearEl) yearEl.textContent = data.yearLevel;
    if (aboutEl) aboutEl.textContent = data.about;
    if (skillsEl) skillsEl.textContent = data.skills;
}

function setupEventListeners() {
    const editBtn = document.getElementById('edit-profile-btn');
    const saveBtn = document.getElementById('save-btn');
    const cancelBtn = document.getElementById('cancel-btn');
    const loginBtn = document.getElementById('login-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const deleteBtn = document.getElementById('delete-account-btn');

    if (editBtn) editBtn.onclick = openEditInterface;
    if (saveBtn) saveBtn.onclick = saveProfile;
    if (cancelBtn) cancelBtn.onclick = closeEditInterface;
    if (loginBtn) loginBtn.onclick = handleLogin;
    if (logoutBtn) logoutBtn.onclick = handleLogout;

    // Delete Account Event Listener
    if (deleteBtn) {
        deleteBtn.onclick = function () {
            const userId = localStorage.getItem("user_id");

            if (!userId) {
                alert("No active user session found.");
                return;
            }

            if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
                deleteAccount(userId);
            }
        };
    }

    // Camera Triggers
    const profileImg = document.getElementById('profile-picture');
    const changeBtn = document.getElementById('btn-change-photo');

    if (profileImg) profileImg.onclick = captureProfilePicture;
    if (changeBtn) changeBtn.onclick = captureProfilePicture;
}

/* ==========================================================================
   Authentication & Session Control
   ========================================================================== */

function checkSession() {
    const userId = localStorage.getItem("user_id");

    const loginOverlay = document.getElementById("login-overlay");
    const appView = document.getElementById("app-view");

    if (userId) {
        // Logged in: Hide overlay, reveal top navbar & profile interface
        if (loginOverlay) loginOverlay.classList.add("hidden");
        if (appView) appView.classList.remove("hidden");
    } else {
        // Logged out: Hide full interface, reveal login screen
        if (loginOverlay) loginOverlay.classList.remove("hidden");
        if (appView) appView.classList.add("hidden");
    }
}

function handleLogin() {
    const studentIdInput = document.getElementById("input-student-id");
    const passwordInput = document.getElementById("input-password");

    const studentId = studentIdInput ? studentIdInput.value.trim() : "";
    const password = passwordInput ? passwordInput.value.trim() : "";

    if (!studentId || !password) {
        showLoginError("Please enter both Username/Student ID and Password.");
        return;
    }

    const targetUrl = `${API_BASE_URL}/login.php`;

    // Create XMLHttpRequest to avoid WebView fetch restrictions
    const xhr = new XMLHttpRequest();
    xhr.open("POST", targetUrl, true);
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                try {
                    const response = JSON.parse(xhr.responseText);
                    if (response.status === "success") {
                        const userId = response.data ? response.data.student_id : studentId;
                        localStorage.setItem("user_id", userId);

                        // If user profile data is returned from MySQL, populate application view
                        if (response.data) {
                            const userProfile = {
                                fullName: response.data.full_name || defaultProfile.fullName,
                                course: response.data.course || defaultProfile.course,
                                yearLevel: response.data.year_level || defaultProfile.yearLevel,
                                about: response.data.about_me || defaultProfile.about,
                                skills: response.data.skills || defaultProfile.skills
                            };
                            localStorage.setItem('studentProfile', JSON.stringify(userProfile));
                            renderProfile(userProfile);
                        }

                        checkSession();
                    } else {
                        showLoginError(response.message || "Invalid Student ID or Password.");
                    }
                } catch (e) {
                    showLoginError("Invalid JSON response from server.");
                }
            } else {
                showLoginError(`Server Error (${xhr.status}): Unable to reach ${targetUrl}`);
            }
        }
    };

    xhr.onerror = function () {
        showLoginError(`Network Error: Connection refused at ${targetUrl}`);
    };

    xhr.send(JSON.stringify({
        student_id: studentId,
        password: password
    }));
}

function handleLogout() {
    localStorage.removeItem("user_id");
    checkSession();
}

function showLoginError(msg) {
    const errorMsg = document.getElementById("login-error-message");
    if (errorMsg) {
        errorMsg.textContent = msg;
        errorMsg.classList.remove("hidden");
    } else {
        alert(msg);
    }
}

/* ==========================================================================
   Activity 6: Camera & Image Persistence Implementation
   ========================================================================== */

function loadSavedProfilePicture() {
    const savedPhoto = localStorage.getItem(STORAGE_KEY_PHOTO);
    const profileImg = document.getElementById('profile-picture');

    if (profileImg) {
        profileImg.src = savedPhoto ? savedPhoto : DEFAULT_AVATAR;
    }
}

function captureProfilePicture(event) {
    if (event) event.stopPropagation();

    if (!navigator.camera) {
        showCameraError("Unable to access the camera API. Please run on a mobile device or emulator.");
        return;
    }

    const takePhoto = confirm("Select Photo Source:\n\n• Click OK to open Camera\n• Click Cancel to open Device Gallery");

    if (takePhoto) {
        openImagePicker(Camera.PictureSourceType.CAMERA);
    } else {
        openImagePicker(Camera.PictureSourceType.PHOTOLIBRARY);
    }
}

function openImagePicker(sourceType) {
    if (navigator.camera && navigator.camera.cleanup) {
        navigator.camera.cleanup();
    }

    const cameraOptions = {
        quality: 40,
        destinationType: Camera.DestinationType.DATA_URL,
        sourceType: sourceType,
        allowEdit: false,
        encodingType: Camera.EncodingType.JPEG,
        mediaType: Camera.MediaType.PICTURE,
        targetWidth: 300,
        targetHeight: 300,
        correctOrientation: true,
        saveToPhotoAlbum: false
    };

    navigator.camera.getPicture(onCameraSuccess, onCameraError, cameraOptions);
}

function onCameraSuccess(imageData) {
    const base64Image = imageData.startsWith('data:image')
        ? imageData
        : 'data:image/jpeg;base64,' + imageData;

    const profileImg = document.getElementById('profile-picture');
    if (profileImg) {
        profileImg.src = base64Image;
    }

    try {
        localStorage.setItem(STORAGE_KEY_PHOTO, base64Image);
        hideCameraError();
    } catch (e) {
        console.error("LocalStorage error:", e);
    }
}

function onCameraError(message) {
    if (!message) return;
    const lowerMsg = message.toLowerCase();

    if (lowerMsg.includes("cancelled") || lowerMsg.includes("canceled") || lowerMsg.includes("no image selected")) {
        console.log("Operation cancelled by user.");
        return;
    }

    console.error("Camera Error: " + message);
    showCameraError("Unable to access camera or gallery. Please check your device permissions.");
}

function showCameraError(msg) {
    const errorBox = document.getElementById('camera-error-message');
    if (errorBox) {
        errorBox.textContent = msg;
        errorBox.classList.remove('hidden');
        setTimeout(() => {
            errorBox.classList.add('hidden');
        }, 5000);
    } else {
        alert(msg);
    }
}

function hideCameraError() {
    const errorBox = document.getElementById('camera-error-message');
    if (errorBox) {
        errorBox.classList.add('hidden');
        errorBox.textContent = '';
    }
}

/* ==========================================================================
   Activity 5 & 7: Profile Editing & Database Syncing
   ========================================================================== */

function openEditInterface() {
    const currentData = getStoredProfile();

    document.getElementById('input-name').value = currentData.fullName || '';
    document.getElementById('input-course').value = currentData.course || '';
    document.getElementById('input-year').value = currentData.yearLevel || '';
    document.getElementById('input-about').value = currentData.about || '';
    document.getElementById('input-skills').value = currentData.skills || '';

    const errorBanner = document.getElementById('error-message');
    if (errorBanner) {
        errorBanner.classList.add('hidden');
        errorBanner.textContent = '';
    }

    document.getElementById('profile-display').classList.add('hidden');
    document.getElementById('edit-profile-section').classList.remove('hidden');
}

function closeEditInterface() {
    document.getElementById('edit-profile-section').classList.add('hidden');
    document.getElementById('profile-display').classList.remove('hidden');
}

function saveProfile() {
    const name = document.getElementById('input-name').value.trim();
    const course = document.getElementById('input-course').value.trim();
    const year = document.getElementById('input-year').value.trim();
    const about = document.getElementById('input-about').value.trim();
    const skills = document.getElementById('input-skills').value.trim();
    const errorBanner = document.getElementById('error-message');

    if (!name || !course || !year || !about || !skills) {
        if (errorBanner) {
            errorBanner.textContent = "Please complete all required fields.";
            errorBanner.classList.remove('hidden');
        }
        return;
    }

    // Fallback to active user ID or default student record ID
    let userId = localStorage.getItem("user_id");
    if (!userId) {
        userId = "2023-0001";
        localStorage.setItem("user_id", userId);
    }

    const updatedProfile = {
        fullName: name,
        course: course,
        yearLevel: year,
        about: about,
        skills: skills
    };

    // Update Local Storage first so UI reflects instantly
    localStorage.setItem('studentProfile', JSON.stringify(updatedProfile));
    renderProfile(updatedProfile);

    // Send update request to backend database
    const targetUrl = `${API_BASE_URL}/update_profile.php`;
    const xhr = new XMLHttpRequest();
    xhr.open("POST", targetUrl, true);
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                try {
                    const response = JSON.parse(xhr.responseText.trim());
                    if (response.status === "success") {
                        closeEditInterface();
                    } else {
                        alert("Database Notice: " + (response.message || "Failed to sync with MySQL, but saved locally."));
                        closeEditInterface();
                    }
                } catch (e) {
                    console.error("JSON parse error:", xhr.responseText);
                    closeEditInterface();
                }
            } else {
                console.warn("Server unreachable. Data saved locally.");
                closeEditInterface();
            }
        }
    };

    xhr.onerror = function () {
        console.warn("Network error during save. Data saved locally.");
        closeEditInterface();
    };

    xhr.send(JSON.stringify({
        student_id: userId,
        full_name: name,
        course: course,
        year_level: year,
        about_me: about,
        skills: skills
    }));
}

/* ==========================================================================
   Activity 7: Account Deletion (CRUD Delete Operation)
   ========================================================================== */

function deleteAccount(studentId) {
    const targetUrl = `${API_BASE_URL}/delete_profile.php`;

    const xhr = new XMLHttpRequest();
    xhr.open("POST", targetUrl, true);
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            try {
                const response = JSON.parse(xhr.responseText.trim());
                if (response.status === "success") {
                    alert("Account deleted successfully.");
                    localStorage.removeItem("user_id");
                    localStorage.removeItem("studentProfile");
                    localStorage.removeItem(STORAGE_KEY_PHOTO);
                    checkSession();
                } else {
                    alert("Delete failed: " + (response.message || "Could not delete record."));
                }
            } catch (e) {
                // Fallback: If server failed, clear session locally so app proceeds
                alert("Account record removed from local session.");
                localStorage.removeItem("user_id");
                localStorage.removeItem("studentProfile");
                localStorage.removeItem(STORAGE_KEY_PHOTO);
                checkSession();
            }
        }
    };

    xhr.onerror = function () {
        alert("Network Error: Could not reach server, cleared local session.");
        localStorage.removeItem("user_id");
        localStorage.removeItem("studentProfile");
        localStorage.removeItem(STORAGE_KEY_PHOTO);
        checkSession();
    };

    xhr.send(JSON.stringify({
        student_id: studentId
    }));
}