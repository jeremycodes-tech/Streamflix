# Streamflix 🎬

Streamflix is a premium, high-performance streaming platform built with React, TypeScript, and Vite. It features a modern, cinematic UI inspired by industry leaders, offering a seamless experience for browsing and managing your favorite content.

## ✨ Features

- **Cinematic UI/UX**: Ultra-responsive design with premium animations and smooth transitions.
- **Content Library**: Browse a rich catalog of Movies, TV Shows, and New & Popular titles.
- **Smart Search**: Find your favorite content instantly with a dedicated search interface.
- **Personalized "My List"**: Create and manage your own watchlist, persisted in the cloud (Firebase).
- **Authentication**: Secure sign-in/sign-up powered by Firebase (Email & Google).
- **Infinite Scrolling & Carousels**: Enjoy a fluid browsing experience across all categories.

## 🚀 Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **Runtime/Build Tool**: [Vite](https://vitejs.dev/) & [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [Framer Motion](https://www.framer.com/motion/)
- **Database/Auth**: [Firebase](https://firebase.google.com/) (Firestore & Auth)
- **Deployment**: [Vercel](https://vercel.com/)

## 🛠️ Getting Started

### Prerequisites

- Node.js (Latest LTS recommended)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/Streamflix.git
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file and add your Firebase credentials:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## 📦 Deployment

The project is optimized for deployment on **Vercel**. Simply connect your repository to Vercel, and it will handle the build process automatically using the `npm run build` command.

---

Built with ❤️ by Streamflix Team.
