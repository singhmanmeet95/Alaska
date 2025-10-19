# Authentication Page Components

This directory contains modularized components for the authentication page.

## Component Structure

### 1. **AuthBackground.tsx**

- **Purpose**: Renders the background image with blur effect and dark overlay
- **Props**:
  - `imageUrl`: string - URL of the background image

### 2. **LoginForm.tsx**

- **Purpose**: Desktop login form component
- **Props**:
  - `email`: string - Email input value
  - `password`: string - Password input value
  - `isSubmitting`: boolean - Loading state
  - `onEmailChange`: function - Email change handler
  - `onPasswordChange`: function - Password change handler
  - `onSubmit`: function - Form submission handler
  - `onSignUpClick`: function - Handler to switch to signup

### 3. **SignupForm.tsx**

- **Purpose**: Desktop signup form component
- **Props**:
  - `name`: string - Name input value
  - `email`: string - Email input value
  - `password`: string - Password input value
  - `about`: string (optional) - About textarea value
  - `imageUrl`: string (optional) - Profile image URL
  - `isSubmitting`: boolean - Loading state
  - `onNameChange`: function - Name change handler
  - `onEmailChange`: function - Email change handler
  - `onPasswordChange`: function - Password change handler
  - `onAboutChange`: function - About change handler
  - `onImageUpload`: async function - Image upload handler
  - `onSubmit`: function - Form submission handler
  - `onLoginClick`: function - Handler to switch to login

### 4. **ImageUploader.tsx**

- **Purpose**: Reusable image upload component with drag-and-drop
- **Props**:
  - `imageUrl`: string (optional) - Current image URL
  - `onImageUpload`: async function - Handler for image upload
  - `className`: string (optional) - Additional CSS classes

### 5. **AuthOverlay.tsx**

- **Purpose**: Animated sliding overlay panel for desktop view
- **Props**:
  - `isSignUp`: boolean - Current auth mode
  - `onToggle`: function - Handler to toggle between login/signup

### 6. **MobileAuthForm.tsx**

- **Purpose**: Mobile-responsive authentication form (both login and signup)
- **Props**:
  - `isSignUp`: boolean - Current auth mode
  - `signupData`: object - Signup form data
  - `loginData`: object - Login form data
  - `isSubmitting`: boolean - Loading state
  - `onSignupChange`: function - Signup form change handler
  - `onLoginChange`: function - Login form change handler
  - `onSignupSubmit`: function - Signup submission handler
  - `onLoginSubmit`: function - Login submission handler
  - `onToggleAuth`: function - Handler to toggle between login/signup
  - `onImageUpload`: async function - Image upload handler

## Usage

```tsx
import {
  AuthBackground,
  LoginForm,
  SignupForm,
  AuthOverlay,
  MobileAuthForm,
  ImageUploader,
} from "./components";

// Or import individually
import AuthBackground from "./components/AuthBackground";
```

## Benefits of Modularization

1. **Separation of Concerns**: Each component has a single responsibility
2. **Reusability**: Components can be reused in different contexts
3. **Maintainability**: Easier to update and fix individual components
4. **Testing**: Components can be tested in isolation
5. **Code Organization**: Cleaner and more organized codebase
6. **Readability**: Smaller components are easier to understand
