# Student Profile Mobile Application — Activity 7: Database & Authentication Sync

## 1. Project Description

The **Student Profile Application** is a cross-platform mobile app built using **Apache Cordova**, HTML5, CSS3, and modern JavaScript (ES6+), connected to a PHP/MySQL (XAMPP) backend API. Originally developed as a client-side interface with local storage and camera integration, the project has evolved into a fully dynamic, database-driven application. It authenticates users against a MySQL database, retrieves user-specific profile records via JSON APIs, updates persistent records in real time, and supports full CRUD capabilities and secure account management.

---

## 2. Application Pages
The application features a single-page architecture with smooth tabbed navigation across five distinct views:
*   **Login Page:** The primary entry point enforcing student authentication before granting access to protected profile functionality.
*   **Profile Page:** The primary dashboard presenting the user's interactive profile picture, full name, academic program/specialization, short bio, and quick-action buttons (**Edit Profile, Delete Account**).
*   **About Page:** Outlines the student's background, educational history, career objectives, and personal statement.
*   **Skills Page:** Categorizes technical proficiencies (such as programming languages, web development frameworks, database systems, and mobile toolchains) with visual proficiency meters.
*   **Projects Page:** Highlights featured software development projects (e.g., web apps, game development, mobile utilities) with tech stack tags and repository links.
*   **Contact Page:** Displays direct communication channels including email, mobile phone number, GitHub portfolio, and social media handles.

---

## 3. Authentication & Session Flow
The application restricts access to protected views until valid credentials are provided and verified against the backend database.
**Authentication Workflow:**
[ User Inputs Student ID & Password on Login Screen ]
↓
[ Asynchronous POST Request (XMLHttpRequest) Sent to login.php ]
↓
[ MySQL Query Checks Credentials (SELECT ... WHERE student_id = ?) ]
↓
[ Server Returns JSON Response (status: "success" or status: "error") ]
↓
[ If Valid: Save Session (user_id), Hide Login Overlay, Render Profile ]
[ If Invalid: Display Accessible Login Error Message ]
---

## 4. Student Profile Management & CRUD Operations
Authenticated students can manage their complete profile lifecycle through fundamental CRUD operations synced with MySQL:
* **Create**: Student account records are seeded or registered directly in the MySQL database table.
* **Read (View Profile):** Upon successful login, the app issues a request to fetch the student's data record from MySQL and dynamically renders it across the DOM.
* **Update (Edit Profile):** Tapping Edit Profile opens an overlay modal. Saving changes sends an HTTP POST request to update_profile.php, updating the database record and re-rendering the UI immediately.
* **Delete (Delete Account):** Tapping Delete Account executes a request to delete_profile.php, **executing** DELETE FROM students WHERE student_id = ?, purging the record from **MySQL**, clearing local session cache, and returning the user to the Login screen.

---

## 5. API & Backend Architecture
The client application communicates with the server through RESTful JSON endpoints over HTTP without exposing internal infrastructure credentials.
**System Architecture:**
[ Cordova Mobile App (HTML/JS) ]
$\rightleftarrows$ [ Asynchronous JSON Requests (XMLHttpRequest) ]
$\rightleftarrows$ [ PHP Backend API (student_api/) ]
$\rightleftarrows$ [ MySQL Database (student_db) ]

* **Client WebView Layer:** The Cordova application runs inside an Android WebView, targeting [http://10.0.2.2/student_api/](http://10.0.2.2/student_api/) (the Android emulator loopback host) to communicate with local server endpoints.
* **PHP API Layer:** Backend scripts (login.php, update_profile.php, delete_profile.php) process incoming JSON payloads, execute parameterized SQL queries, and return standardized JSON responses.
* **Database Layer:** A relational MySQL database (student_db) hosting the students table to maintain persistent records.

---

**6. Camera Integration & Image Handling**
Retained from Activity 6, native camera and media storage access are integrated alongside backend state management via the cordova-plugin-camera plugin.

* **Capture Workflow:** Tapping **Change Profile Picture** allows the student to capture a photo via camera or select one from the photo library.

* **Base64 Encoding:** Captured images are converted into Base64-encoded strings (data:image/jpeg;base64,...) and assigned directly to the profile avatar DOM element (img#profile-picture).

* **Local Image Caching:** Base64 image strings are stored in localStorage under student_profile_picture, preserving high-resolution custom avatars locally without inflating server payload limits.

---

## 7. Data Persistence
Data persistence is handled using a dual-layer strategy combining client storage and relational database storage:

* **Database Persistence:** Profile field updates (Name, Course, Year Level, Bio, Skills) are saved directly to MySQL. Changes remain permanent across emulator restarts, app re-installs, and account logouts.
* **Session Persistence:** Active session tokens (user_id) and cached profile images persist in localStorage until the student explicitly taps Logout or deletes the account.
---

## 8. Error Handling & Validation
The application contains robust validation safeguards and error handling logic to ensure stability:
* **Input Validation:** Login fields enforce non-empty Student ID and Password entries before dispatching requests. Profile editing validates required text fields before executing database saves.
* **Authentication Errors:** Displays intuitive error notifications (e.g., "Invalid Student ID or password") without crashing application execution.
* **Server & Network Failures:** Handled through try-catch blocks and xhr.onerror event listeners. If the server connection drops during account deletion, local session cache is purged safely so the client interface can return cleanly to the login screen.
* **PHP Error Shielding:** ini_set('display_errors', '0') in backend PHP scripts suppresses HTML warnings, guaranteeing clean JSON returns.

---

## 9. Security Measures
The application adheres to practical web and mobile security practices:
* **Credential Isolation:** No database host passwords or connection secrets are embedded inside the client-side JavaScript bundle.
* **SQL Injection Prevention:** All server-side PHP endpoints utilize prepared statements ($stmt->prepare) and parameterized binding (bind_param).
* **Password Verification:** Supports password_verify() hash validation in PHP, ensuring sensitive account passwords are never exposed in plain text API responses.
* **Git Repository Protection:** A .gitignore file excludes sensitive .env files, build output folders (platforms/, plugins/, node_modules/), and compiled APK packages from version control.

## 10. Responsive Design
The interface is designed mobile-first and maintains full responsive integrity across viewports:
* **Mobile Devices (320px - 480px):** Single-column vertical layout with touch-optimized action buttons (minimum 44px tap targets) and modal overlays.
* **Tablets (481px - 768px):** Flexible multi-column card grids for profile data and project displays.
* **Desktop Viewports (769px+):** Centered application shell with constrained maximum width (800px), elevation shadows, and clean framing.

### Installation & Execution Steps

1. **Clone the Repository:**
   ```bash
   git clone [https://github.com/Aguiman-JoseKenneth/Aguiman_StudentProfile.git](https://github.com/Aguiman-JoseKenneth/Aguiman_StudentProfile.git)
   cd Aguiman_StudentProfile
