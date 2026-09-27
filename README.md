# Student Profile Mobile Application — Activity 6: Camera Integration

## 1. Project Description
The **Student Profile Application** is a cross-platform mobile app built using **Apache Cordova**, HTML5, CSS3, and modern JavaScript (ES6+). Designed as an interactive digital portfolio and profile manager, the application showcases student credentials, academic skills, featured software projects, and contact channels. With Activity 6, the application incorporates native mobile hardware access via the Cordova Camera Plugin, allowing users to capture or upload personal profile photos dynamically with client-side persistence.

---

## 2. Application Pages
The application features a single-page architecture with smooth tabbed navigation across five distinct views:

*   **Profile Page:** The primary dashboard presenting the user's interactive profile picture, full name, academic program/specialization, short bio, and quick-action buttons.
*   **About Page:** Outlines the student's background, educational history, career objectives, and personal statement.
*   **Skills Page:** Categorizes technical proficiencies (such as programming languages, web development frameworks, database systems, and mobile toolchains) with visual proficiency meters.
*   **Projects Page:** Highlights featured software development projects (e.g., web apps, game development, mobile utilities) with tech stack tags and repository links.
*   **Contact Page:** Displays direct communication channels including email, mobile phone number, GitHub portfolio, and social media handles.

---

## 3. Profile Editing & Local Data Storage
The application includes a real-time **Edit Profile** modal overlay:
*   Users can update key profile information such as Full Name, Title/Program, and Short Bio.
*   **Save Action:** Writes updated form fields directly to the browser/webview `localStorage` engine under structured key-value pairs (e.g., `student_name`, `student_title`, `student_bio`) and updates the DOM dynamically without page reloads.
*   **Cancel Action:** Reverts uncommitted changes and closes the overlay without altering stored state.
*   **Persistence:** Saved profile details automatically populate across application restarts.

---

## 4. Camera Integration
Activity 6 extends the profile interface by enabling native camera and photo library access via the `cordova-plugin-camera` plugin.

### Profile Picture Update Workflow:
[ User Taps "Change Profile Picture" or Avatar ]
↓
[ Action Sheet / Source Selection (Camera vs. Gallery) ]
↓
[ Native Device Camera / Photo Picker Opens ]
↓
[ User Captures / Selects Photo ]
↓
[ Base64 DATA_URL Stream Generated ]
↓
[ Application DOM Updated & Image Saved to localStorage ]

---

## 5. Device Feature Integration
Standard web applications running in standard browsers cannot directly interface with native smartphone hardware due to sandbox security constraints. Apache Cordova bridges this gap by embedding a native bridge layer:
* It exposes standard JavaScript APIs (`navigator.camera.getPicture`) that translate web calls into native Android Java calls.
* This grants direct access to hardware components like the primary/secondary device camera lens, hardware flash, and local photo media stores.
* It provides a native mobile experience while maintaining a unified web technology codebase.

---

## 6. Image Handling & Persistence
To ensure seamless performance without requiring external cloud media servers:
* **Image Rendering:** Captured photos are returned as Base64-encoded strings (`DATA_URL` format: `data:image/jpeg;base64,...`). The string is directly assigned to the `src` attribute of the `img#profile-picture` element for instant rendering.
* **Data Persistence:** Upon successful acquisition, the Base64 image string is stored in client-side `localStorage` under the key `profilePicture`.
* **Lifecycle Reload:** During the `deviceready` lifecycle event upon application launch, `index.js` checks for `localStorage.getItem('profilePicture')`. If present, it replaces the default avatar placeholder automatically.

---

## 7. Error Handling
The application protects against runtime failures and provides intuitive user feedback:

* **Camera Permission Denial:** If a user denies runtime camera or storage permissions, the `onCameraError` callback catches the exception, logging the failure and displaying an accessible warning banner (`#camera-error-message`) without breaking web view execution.
* **Camera Cancellation:** If the user opens the camera interface but dismisses or cancels it without capturing a photo, the failure handler detects the cancellation signal, suppresses error alerts, leaves the existing profile photo untouched, and cleanly returns control to the Profile view.
* **Camera Errors / Hardware Unavailability:** In cases of missing hardware or emulator limitations, execution falls back gracefully to default avatar state and alerts the user with an actionable message: *"Unable to access the camera. Please check your device permissions."*

---

## 8. Responsive Design
The user interface is built mobile-first and maintains responsive fidelity across devices:
* **Mobile Devices (320px - 480px):** Single-column layout with fixed bottom or sticky top navigation tab bars, touch-friendly tap targets (minimum 44px height), and optimized card padding.
* **Tablets (481px - 768px):** Two-column card grid adaptations with flexible flexbox/grid containers for balanced spatial distribution.
* **Desktop Viewports (769px+):** Centered application container with constrained max-width (`800px`), refined shadows, subtle border framing, and hover state interactions.

---

## 9. How to Run & Deploy

### Prerequisites
* [Node.js](https://nodejs.org/) (v18+ recommended)
* [Apache Cordova CLI](https://cordova.apache.org/) (`npm install -g cordova`)
* [Android Studio](https://developer.android.com/studio) with Android SDK platform tools (for Android builds)

### Installation & Execution Steps

1. **Clone the Repository:**
   ```bash
   git clone [https://github.com/Aguiman-JoseKenneth/Aguiman_StudentProfile.git](https://github.com/Aguiman-JoseKenneth/Aguiman_StudentProfile.git)
   cd Aguiman_StudentProfile
