# Infotech Quiz Portal (IQP)

A modern, responsive quiz application built with React, TypeScript, and Firebase. Features user authentication, topic-based quizzes, real-time leaderboards, and feedback collection.

## 🚀 Features

- **User Authentication**: Email/password signup and login with Firebase Auth
- **Topic Selection**: Multiple quiz subjects (JavaScript, React, TypeScript)
- **Dynamic Quizzes**: Questions fetched from Firestore database
- **Real-time Leaderboards**: Topic-specific rankings with top 5 display
- **Feedback System**: Optional user feedback collection
- **Responsive Design**: Works on desktop and mobile devices
- **Protected Routes**: Authentication required for quiz access
- **Timer Functionality**: 5-minute quiz timer with auto-submit

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **UI Components**: Shadcn/ui, Tailwind CSS
- **Backend**: Firebase (Authentication, Firestore)
- **Routing**: React Router v6
- **State Management**: React Context API
- **Icons**: Lucide React
- **Deployment**: Firebase Hosting

## 📁 Project Structure

```
quiz-app/
├── src/
│   ├── components/
│   │   ├── ui/                 # Shadcn UI components
│   │   ├── Navbar.tsx          # Navigation component
│   │   ├── QuizTimer.tsx       # Timer component
│   │   └── PrivateRoute.tsx    # Route protection
│   ├── contexts/
│   │   └── AuthContext.tsx     # Authentication context
│   ├── pages/
│   │   ├── Home.tsx           # Landing page
│   │   ├── Login.tsx          # Login/Signup page
│   │   ├── Topics.tsx         # Topic selection page
│   │   ├── Quiz.tsx           # Quiz interface
│   │   └── Results.tsx        # Results and leaderboard
│   ├── utils/
│   │   └── setupFirestore.ts  # Database setup script
│   └── lib/
│       └── utils.ts           # Utility functions
├── firebase.js                # Firebase configuration
└── README.md
```

## 🔧 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Firebase account

### 1. Clone Repository
```bash
git clone <repository-url>
cd quiz-app
npm install
```

### 2. Firebase Setup

#### Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Create a project"
3. Enter project name: `infotech-quiz`
4. Enable Google Analytics (optional)

#### Enable Authentication
1. Go to Authentication → Sign-in method
2. Enable "Email/Password" provider
3. Save changes

#### Enable Firestore Database
1. Go to Firestore Database
2. Click "Create database"
3. Choose "Start in test mode"
4. Select location and create

#### Get Firebase Config
1. Go to Project Settings → General
2. Scroll to "Your apps" → Web app
3. Copy configuration object
4. Update `firebase.js` with your config

### 3. Configure Firebase Rules

Go to Firestore Database → Rules and paste:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /topics/{topicId} {
      allow read: if true;
    }
    match /topics/{topicId}/questions/{questionId} {
      allow read: if true;
    }
    match /leaderboards/{topicId}/scores/{scoreId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /feedback/{feedbackId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
  }
}
```

### 4. Setup Sample Data

#### Option A: Browser Console (Recommended)
1. Start the app: `npm run dev`
2. Login to the application
3. Open browser console (F12)
4. Copy and paste content from `setup-console.js`
5. Press Enter to execute

#### Option B: Manual Setup
Create collections in Firestore Console:

**Topics Collection:**
```
topics/
├── javascript/
│   ├── name: "JavaScript"
│   ├── description: "Test your JavaScript knowledge"
│   ├── questionCount: 5
│   └── icon: "🟨"
├── react/
│   ├── name: "React"
│   ├── description: "React framework fundamentals"
│   ├── questionCount: 5
│   └── icon: "⚛️"
└── typescript/
    ├── name: "TypeScript"
    ├── description: "TypeScript language features"
    ├── questionCount: 5
    └── icon: "🔷"
```

Add questions as subcollections under each topic.

## 🚀 Running the Application

### Development
```bash
npm run dev
```
Access at: `http://localhost:5173`

### Build for Production
```bash
npm run build
```

### Deploy to Firebase Hosting
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

## 📱 Application Flow

### 1. User Registration/Login
- Users can create accounts with email/password
- Existing users can login
- Authentication required for quiz access

### 2. Topic Selection
- After login, users see available quiz topics
- Each topic shows description and question count
- Click to start quiz for selected topic

### 3. Quiz Interface
- 5-minute timer with auto-submit
- Multiple choice questions
- Real-time leaderboard sidebar
- Submit button (requires all answers)

### 4. Results & Feedback
- Score display with current rank
- Optional name and feedback form
- Full leaderboard after submission
- User's entry highlighted in rankings

## 🗄️ Database Schema

### Collections Structure

```
Firestore Database
├── topics/
│   ├── {topicId}/
│   │   ├── name: string
│   │   ├── description: string
│   │   ├── questionCount: number
│   │   ├── icon: string
│   │   └── questions/ (subcollection)
│   │       └── {questionId}/
│   │           ├── question: string
│   │           ├── options: string[]
│   │           └── correctAnswer: number
├── leaderboards/
│   └── {topicId}/
│       └── scores/ (subcollection)
│           └── {scoreId}/
│               ├── userName: string
│               ├── score: number
│               └── timestamp: timestamp
└── feedback/
    └── {feedbackId}/
        ├── topicId: string
        ├── topicName: string
        ├── userName: string
        ├── userEmail: string
        ├── feedback: string
        ├── score: number
        └── timestamp: timestamp
```

## 🎨 UI Components

### Key Components
- **Navbar**: Navigation with user info and logout
- **Topics**: Grid layout of available quiz subjects
- **Quiz**: Question interface with timer and leaderboard
- **Results**: Feedback form and full leaderboard display
- **PrivateRoute**: Authentication protection wrapper

### Styling
- Tailwind CSS for utility-first styling
- Shadcn/ui for consistent component design
- Responsive design for all screen sizes
- Dark/light theme support

## 🔐 Security Features

- **Authentication Required**: Protected routes for quiz access
- **Firestore Rules**: Controlled read/write permissions
- **Input Validation**: Form validation on client side
- **XSS Protection**: Sanitized user inputs

## 📊 Leaderboard System

### Features
- Topic-specific rankings
- Real-time score updates
- Top 5 preview during quiz
- Full leaderboard after completion
- User highlighting with rank display
- Trophy icons for top 3 positions

### Ranking Logic
- Scores sorted in descending order
- Ties handled by timestamp (earlier submission wins)
- User's current position calculated dynamically

## 🔧 Configuration

### Environment Variables
Create `.env` file (optional):
```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
# ... other Firebase config
```

### Firebase Configuration
Update `firebase.js` with your project credentials:
```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  // ... other config
};
```

## 🚀 Deployment

### Firebase Hosting
1. Build the project: `npm run build`
2. Install Firebase CLI: `npm install -g firebase-tools`
3. Login: `firebase login`
4. Initialize: `firebase init hosting`
5. Deploy: `firebase deploy`

### Other Platforms
- **Vercel**: Connect GitHub repo for auto-deployment
- **Netlify**: Drag and drop `dist` folder
- **GitHub Pages**: Use GitHub Actions for deployment

## 🐛 Troubleshooting

### Common Issues

**Authentication Errors:**
- Verify Firebase Auth is enabled
- Check API keys in firebase.js
- Ensure authorized domains include localhost

**Firestore Permission Errors:**
- Update Firestore rules as specified
- Verify user is authenticated
- Check collection names match code

**Build Errors:**
- Clear node_modules: `rm -rf node_modules && npm install`
- Update dependencies: `npm update`
- Check TypeScript errors: `npm run type-check`

## 📈 Future Enhancements

- [ ] Question categories and difficulty levels
- [ ] Time-based scoring system
- [ ] User profiles and statistics
- [ ] Admin panel for content management
- [ ] Social sharing features
- [ ] Mobile app version
- [ ] Offline quiz capability
- [ ] Multi-language support

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Support

For support and questions:
- Create an issue on GitHub
- Email: support@example.com
- Documentation: [Project Wiki]

---

**Built with ❤️ using React, TypeScript, and Firebase**