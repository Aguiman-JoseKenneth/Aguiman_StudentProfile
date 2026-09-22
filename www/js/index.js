/* ==========================================================================
   Constants & Defaults (Declared first to prevent ReferenceError)
   ========================================================================== */
const defaultProfile = {
    fullName: "Jose Kenneth Aguiman",
    course: "BS Computer Science",
    yearLevel: "3rd Year",
    about: "Computer science student passionate about web and mobile app development.",
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
}

// Browser / Emulator DOM load fallback
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

    if (editBtn) editBtn.onclick = openEditInterface;
    if (saveBtn) saveBtn.onclick = saveProfile;
    if (cancelBtn) cancelBtn.onclick = closeEditInterface;

    // Camera Triggers
    const profileImg = document.getElementById('profile-picture');
    const changeBtn = document.getElementById('btn-change-photo');

    if (profileImg) profileImg.onclick = captureProfilePicture;
    if (changeBtn) changeBtn.onclick = captureProfilePicture;
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