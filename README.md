# GDG OpsHub

GDG OpsHub is a Chapter Management Portal designed for Google Developer Groups (GDG) to manage events, members, and tasks efficiently. It provides a modern dashboard for chapter organizers and members, with role-based access and integrated AI documentation support.

## Features
- **Google Authentication**: Secure sign-in with Google accounts.
- **Dashboard**: Overview of chapter stats, recent events, and top contributors.
- **Event Management**: Create, edit, and track events. Mark events as completed to reward members with XP.
- **Task Management**: Assign and track tasks for members. Completing tasks awards XP.
- **Member Management**: Add and manage chapter members, roles, and skills.
- **Quick Actions**: Admins and core team can quickly create events, add members, or assign tasks from the dashboard.
- **XP & Leaderboard**: Members earn XP for event and task participation, visible in the dashboard.
- **AI Documentation**: Generate event documentation using Gemini AI integration.
- **Chatbot Widget**: (Optional) Embed a chatbot for support or FAQs.

## Tech Stack
- **React** (Vite, TypeScript)
- **Firebase** (Auth, Firestore, Storage)
- **Tailwind CSS**
- **Radix UI** (for dialogs, dropdowns, etc.)
- **Lucide Icons**
- **Gemini AI** (for documentation generation)

## Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/your-org/gdg-hive-ai-hub.git
cd gdg-hive-ai-hub
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Environment Variables
Create a `.env` file in the project root with your Firebase config:
```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```
> **Never commit your `.env` file to version control.**

### 4. Run the Development Server
```bash
npm run dev
```


## Usage Notes
- **Role-based Access**: Only admins and core team members see the Quick Action menu. Volunteers have limited access.
- **XP System**: Members earn XP for event and task completions, tracked in Firestore and shown on the dashboard.
- **Chatbot Widget**: To embed a chatbot, set the iframe `src` to your deployed chatbot URL. The widget cannot embed services that restrict iframe usage via CSP.

## Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License
[MIT](LICENSE)
