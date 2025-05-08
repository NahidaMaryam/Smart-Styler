**DEEP LEARNING DRIVEN SMART STYLER FOR PERSONALIZED ASSISSTANCE**.


**Smart Styler** is a smart fashion companion that uses artificial intelligence to provide users with personalized outfit suggestions, color palette recommendations based on facial analysis, and intelligent wardrobe management. The app also supports user onboarding, subscription handling via Razorpay, and secure authentication features.

 Features

- **Face Color Analysis:** AI-powered color matching based on user's skin tone and undertone.
- **Wardrobe Management:** Upload and organize clothing items for smarter outfit suggestions.
- **AI Stylist:** Suggests outfits using wardrobe data, preferences, and season.
- **User History:** View past outfits and recommendations.
- **Authentication System:**
  - Sign up, login, and password recovery
- **Onboarding:** Step-by-step user onboarding flow for first-time users.
- **Subscription Handling:** Integrated Razorpay payment system.
- **Real-time Notifications:** Toast alerts for user feedback and error handling.

Pages & Routes

| Path | Component | Description |
|------|-----------|-------------|
| `/` | `HomePage` | Main landing page |
| `/color-analysis` | `ColorAnalysis` | Face color-based palette analysis |
| `/wardrobe` | `Wardrobe` | Manage user's wardrobe |
| `/ai-stylist` | `AIStylist` | Outfit suggestions |
| `/profile` | `Profile` | User profile page |
| `/history` | `History` | Past outfits and activity |
| `/login` | `Login` | User login |
| `/signup` | `Signup` | User registration |
| `/forgot-password` | `ForgotPassword` | Password reset page |
| `/onboarding` | `OnboardingContainer` | Onboarding for new users |
| `/subscription` | `Subscription` | Razorpay-powered subscription page |
| `*` | `NotFound` | Fallback for undefined routes |

Tech Stack

- **Frontend Framework:** React + TypeScript
- **Routing:** React Router DOM
- **State Management:** React Hooks
- **UI & UX:** Tailwind CSS + Custom UI Components
- **Notifications:** Custom Toast (ShadCN's `use-toast`)
- **Payment Integration:** Razorpay (with auto-script loading based on route)
- **Authentication:** Email/password-based login/signup with onboarding

Razorpay Integration

The `RazorPayScript` component dynamically loads the Razorpay script only when necessary (`/subscription`, `/checkout`, or `?payment` in URL). It includes:
- Auto-retry mechanism
- Toast alert on load failure
- Fallback handling with query params

Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/NahidaMaryam/style-savvy-ai-match.git
cd style-savvy-ai-match
````

### 2. Install Dependencies

```bash
npm install
```

### 3. Run Development Server

```bash
npm run dev
```

### 4. Build for Production

```bash
npm run build
```

## Project Structure (Simplified)

```
src/
├── components/
│   └── ui/                   # Toasts, buttons, and shared UI
├── pages/
│   ├── Auth/                 # Login, Signup, ForgotPassword
│   ├── Onboarding/           # OnboardingContainer
│   └── (Other Pages)         # HomePage, AIStylist, etc.
├── App.tsx                   # Routes and main layout
└── main.tsx                  # App entry point
```

## License

This project is licensed under the [MIT License](LICENSE).



