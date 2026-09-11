# Aguiman Student Profile - Multi-Page Application (Activity 4)

## 1. Project Description
The Aguiman Student Profile is a multi-page mobile and web application built using Apache Cordova. It showcases personal details, academic history, technical skills, projects, and contact information through a clean, responsive, and unified user interface.

---

## 2. Application Pages
The application is structured into five distinct HTML pages:
* **Profile (`index.html`):** The primary landing page featuring an introduction, personal avatar, and main profile highlights.
* **About (`about.html`):** Background details, academic goals, and educational overview.
* **Skills (`skills.html`):** An itemized breakdown of technical proficiencies, tools, and capabilities.
* **Projects (`projects.html`):** Highlights of completed and ongoing development projects.
* **Contact (`contact.html`):** Contact channels, social links, and a communication form layout.

---

## 3. Navigation
Navigation across all five pages is implemented strictly using standard HTML relative anchor links (`<a href="...">`) embedded within a shared header navigation bar (`<nav>`). Users can seamlessly transition between `index.html`, `about.html`, `skills.html`, `projects.html`, and `contact.html`. No JavaScript, dynamic page loaders, or Single-Page Application (SPA) routing frameworks were used, strictly adhering to core multi-page web structure principles.

---

## 4. Responsive Design
The application retains full responsiveness across all screen dimensions by using a single shared stylesheet (`www/css/index.css`) built with flexible layouts (Flexbox and CSS Grid), fluid image dimensions, relative unit sizing, and CSS media queries.
* **Desktop:** Displays wide multi-column card grids, full-width headers, and side-by-side content containers.
* **Tablet:** Dynamically scales grid columns and adjusts element padding to optimize space on medium viewports.
* **Mobile:** Reorganizes all elements into a clean, single-column stack with touch-friendly navigation targets, preventing horizontal scrolling, overlapping text, or distorted media.

---

## 5. UI/UX Principles Applied
The Module 4 UI/UX design principles are consistently maintained across every page:
* **Consistency:** All five pages utilize identical color palettes, typography, spacing, navigation bars, and visual styles.
* **Visual Hierarchy:** Distinct heading scales (`<h1>`, `<h2>`), card containers, and font weights clearly separate primary content from secondary details.
* **Usability:** Users can easily identify their current location in the app via visual active state highlights (`class="nav-item active"`) on the navigation bar.
* **Readability & Contrast:** Clean font styling and strong color contrast between background elements and foreground text ensure high legibility.
* **Accessibility:** Built using semantic HTML tags, readable text scaling, and descriptive `alt` tags for image assets.

---

## 6. How to Run
To run and test this application locally using Apache Cordova:

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/Aguiman-JoseKenneth/Aguiman_StudentProfile.git](https://github.com/Aguiman-JoseKenneth/Aguiman_StudentProfile.git)
   cd Aguiman_StudentProfile
