document.addEventListener('deviceready', onDeviceReady, false);

const defaultProfile = {
    fullName: "Jose Kenneth Aguiman",
    course: "BS Computer Science",
    yearLevel: "3rd Year",
    about: "Computer science student passionate about web and mobile app development.",
    skills: "JavaScript, HTML5, CSS3, Apache Cordova, Python, MySQL"
};

const DEFAULT_AVATAR = 'img/avatar.png';
const STORAGE_KEY_PHOTO = 'student_profile_picture';

function onDeviceReady() {
    initProfile();
    setupEventListeners();
}

window.addEventListener('DOMContentLoaded', () => {
    initProfile();
    setupEventListeners();
});

function initProfile() {
    const savedData = getStoredProfile();
    renderProfile(savedData);
    loadSavedProfilePicture();
}

function getStoredProfile() {
    const data = localStorage.getItem('studentProfile');
    return data ? JSON.parse(data) : defaultProfile;
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

    if (editBtn) editBtn.onclick = openEditInterface;
    if (saveBtn) saveBtn.onclick = saveProfile;
    if (cancelBtn) cancelBtn.onclick = closeEditInterface;

    // Activity 6: Camera Triggers (Tapping Image or Change Button)
    const profileImg = document.getElementById('profile-picture');
    const changeBtn = document.getElementById('btn-change-photo');

    if (profileImg) profileImg.onclick = captureProfilePicture;
    if (changeBtn) changeBtn.onclick = captureProfilePicture;
}

/* ==========================================================================
   Activity 6: Camera & Image Persistence Implementation
   ========================================================================== */

/**
 * Loads profile picture from localStorage on app launch (Requirement 8)
 */
function loadSavedProfilePicture() {
    const savedPhoto = localStorage.getItem(STORAGE_KEY_PHOTO);
    const profileImg = document.getElementById('profile-picture');

    if (profileImg) {
        profileImg.src = savedPhoto ? savedPhoto : DEFAULT_AVATAR;
    }
}

/**
 * Prompts user to choose between Camera or Device Gallery
 */
function captureProfilePicture(event) {
    if (event) event.stopPropagation();

    // Check if Cordova Camera API is available
    if (!navigator.camera) {
        showCameraError("Unable to access the camera API. Please run on a mobile device or emulator.");
        return;
    }

    // Standard JavaScript confirm dialog selection
    const takePhoto = confirm("Select Photo Source:\n\n• Click OK to open Camera\n• Click Cancel to open Device Gallery");

    if (takePhoto) {
        openImagePicker(Camera.PictureSourceType.CAMERA);
    } else {
        openImagePicker(Camera.PictureSourceType.PHOTOLIBRARY);
    }
}

/**
 * Invokes Cordova Camera plugin with the selected source type
 */
function openImagePicker(sourceType) {
    const cameraOptions = {
        quality: 50,                                       // Moderate compression for localStorage efficiency
        destinationType: Camera.DestinationType.DATA_URL, // Returns base64 string
        sourceType: sourceType,                            // CAMERA or PHOTOLIBRARY
        allowEdit: true,                                   // Allows cropping photo
        encodingType: Camera.EncodingType.JPEG,
        mediaType: Camera.MediaType.PICTURE,
        targetWidth: 400,
        targetHeight: 400,
        correctOrientation: true,                          // Fixes rotated photos
        saveToPhotoAlbum: false
    };

    navigator.camera.getPicture(onCameraSuccess, onCameraError, cameraOptions);
}

/**
 * Handles successful photo capture (Requirements 4, 5, 8)
 */
function onCameraSuccess(imageData) {
    const base64Image = "data:image/jpeg;base64," + imageData;

    // Update image element preview
    const profileImg = document.getElementById('profile-picture');
    if (profileImg) {
        profileImg.src = base64Image;
    }

    // Persist in localStorage
    try {
        localStorage.setItem(STORAGE_KEY_PHOTO, base64Image);
        hideCameraError();
    } catch (e) {
        console.error("LocalStorage error:", e);
        showCameraError("Failed to save image. Storage quota exceeded.");
    }
}

/**
 * Handles camera errors and user cancellations (Requirements 6, 7)
 */
function onCameraError(message) {
    if (!message) return;

    const lowerMsg = message.toLowerCase();

    // Requirement 6: Handle user cancellation without crashing
    if (lowerMsg.includes("cancelled") || lowerMsg.includes("canceled") || lowerMsg.includes("no image selected")) {
        console.log("Operation cancelled by user. Existing picture preserved.");
        return;
    }

    // Requirement 7: Show user-friendly error banner if camera access fails
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
   Activity 5: Profile Editing & Data Management
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

    const updatedProfile = {
        fullName: name,
        course: course,
        yearLevel: year,
        about: about,
        skills: skills
    };

    localStorage.setItem('studentProfile', JSON.stringify(updatedProfile));
    renderProfile(updatedProfile);
    closeEditInterface();
}