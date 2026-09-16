# Student Profile Application - Activity 5 (Profile Editing)

---

## 1. Project Description
The **Student Profile Application** is a dynamic, multi-page mobile application built with **Apache Cordova**, **HTML5**, **CSS3**, and **JavaScript**. Designed for mobile and web viewports, it enables users to view academic profile information, explore portfolio sections, and dynamically edit profile details with real-time persistent local storage.

---

## 2. Application Pages

- **Profile:** Serves as the main dashboard displaying core student details including profile photo, full name, course/program, year level, bio, and quick contact action buttons.
- **About:** Displays background information, personal statement, academic goals, and educational history.
- **Skills:** Categorizes and showcases technical skills, programming languages, software tools, and competency levels.
- **Projects:** Lists highlight academic and personal software projects, along with descriptions, tech stacks, and repository links.
- **Contact:** Provides a structured contact form and social media / direct messaging links to reach the student.

---

## 3. Profile Editing

The **Edit Profile** functionality provides a seamless inline transition from view mode to form input mode:
- **How it works:** Clicking the "Edit Profile" button toggles the view to render editable input controls pre-populated with current profile data.
- **Modifiable Information:**
  - Full Name
  - Course / Program
  - Year Level
  - Short Bio / About Summary
  - Skills List & Contact Details

---

## 4. JavaScript Functionality

JavaScript (ES6) drives all dynamic interactions and client-side logic across the application:
- **Form Handling:** Captures submit/click events on the edit profile form and extracts current input values cleanly.
- **Validation:** Performs checks to ensure required fields (such as Name and Program) are non-empty and formatted correctly prior to saving.
- **Profile Updates:** Mutates DOM elements dynamically upon submission to display updated values across the app without requiring a full page refresh.
- **Save:** Writes verified form data to `localStorage` and transitions the UI back to the static profile view.
- **Cancel:** Reverts input fields to their original state and exits edit mode without modifying stored data.

---

## 5. Local Data Storage

The application leverages the browser's `localStorage` API for client-side state persistence:
- **Storing Data:** Form inputs are serialized into a JSON object and saved via `localStorage.setItem('studentProfile', JSON.stringify(profileData))`.
- **Retrieving Data:** On page load / device ready (`deviceready`), `localStorage.getItem('studentProfile')` is fetched, parsed with `JSON.parse()`, and injected into the DOM.
- **Fallback:** If no custom data exists in `localStorage`, default student profile values are loaded automatically.

---

## 6. Responsive Design

The application uses flexible CSS layouts (Flexbox & CSS Grid) along with responsive viewport meta tags and media queries to deliver a seamless user experience across devices:
- **Desktop:** Multi-column layouts with expanded sidebars and wide navigation bars.
- **Tablet:** Two-column grid layouts with scalable card widths and touch-friendly targets.
- **Mobile:** Single-column stacked layouts, collapsible menus, and full-width touch UI controls optimized for handheld devices.

---

## 7. How to Run

Follow these steps to build and run the Apache Cordova application locally:

### Prerequisites
- Node.js & npm installed
- Apache Cordova CLI (`npm install -g cordova`)
- Android Studio & Android SDK (for mobile emulator/device execution)

### Execution Steps
1. **Clone the repository:**
   ```powershell
   git clone [https://github.com/Aguiman-JoseKenneth/Aguiman_StudentProfile.git](https://github.com/Aguiman-JoseKenneth/Aguiman_StudentProfile.git)
   cd Aguiman_StudentProfile

## 8. Application Screenshots

| Student Profile | Edit Profile |
| :---: | :---: |
| ![Student Profile](www/screenshot%20act%204/profile-act5.png) | ![Edit Profile](www/screenshot%20act%204/edit-act5.png) |

| Updated Profile | Contact |
| :---: | :---: |
| ![Updated Profile](www/screenshot%20act%204/updated-act5.png) | ![Contact](www/screenshot%20act%204/contact-act5.png) |
