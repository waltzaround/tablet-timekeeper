# Tablet Timekeeper 🕒

A modern, responsive interval timer application designed for presentations, workouts, and time management. Built with React, TypeScript, and Shadcn UI components, Tablet Timekeeper offers an intuitive interface for creating and managing custom timed intervals with a clean, professional design.


## ✨ Features

- **Custom Interval Creation**: Easily add, edit, and remove timed intervals
- **Responsive Design**: Works seamlessly on tablets, desktops, and mobile devices
- **Visual Feedback**: Clear countdown display with progress indicators
- **Pause/Resume**: Full control over your timing sessions
- **Custom Branding**: Upload your own logo for a personalized experience
- **Keyboard Navigation**: Efficient controls for power users
- **Persistent Storage**: Saves your intervals between sessions

## 🚀 Tech Stack

- **Frontend**: React 18 with TypeScript
- **UI**: Shadcn UI + Tailwind CSS
- **State Management**: React Hooks
- **Build Tool**: Vite
- **Icons**: Lucide React

## 🛠️ Getting Started

### Prerequisites

- Node.js 16+ and npm/pnpm
- Modern web browser

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/tablet-timekeeper.git
   cd tablet-timekeeper
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   pnpm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

4. Open your browser at [http://localhost:5173](http://localhost:5173)

## 📝 Usage

1. **Create Intervals**:
   - Click "Add Interval" to create a new timing segment
   - Name your interval and set the duration in minutes
   - Reorder intervals using drag handles

2. **Control Playback**:
   - Use the play/pause button to control the timer
   - Navigate between intervals with the arrow buttons
   - Reset the timer at any time

3. **Customize Appearance**:
   - Upload your organization's logo
   - The interface automatically adapts to light/dark mode

## 📦 Build & Deploy

Build the application for production:

```bash
npm run build
# or
pnpm build
```

Preview the production build locally:
```bash
npm run preview
# or
pnpm preview
```


## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## ✨ Design Philosophy

Tablet Timekeeper was designed with a focus on:
- **Simplicity**: Clean, intuitive interface for all users
- **Accessibility**: Keyboard navigation and clear visual feedback
- **Flexibility**: Adaptable to various timing needs and workflows
- **Performance**: Smooth animations and efficient state management


## 🛠️ Development Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview the production build
- `npm run test` - Run test suite
