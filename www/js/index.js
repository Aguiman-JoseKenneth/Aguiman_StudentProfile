document.addEventListener('deviceready', onDeviceReady, false);

const defaultProfile = {
    fullName: "Jose Kenneth Aguiman",
    course: "BS Computer Science",
    yearLevel: "3rd Year",
    about: "Computer science student passionate about web and mobile app development.",
    skills: "JavaScript, HTML5, CSS3, Apache Cordova, Python, MySQL"
};

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
}

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