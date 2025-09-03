# 🍽️ ProMeals AI - Smart Nutrition Analysis

An AI-powered mobile-first web application that analyzes food photos and provides instant nutrition information using computer vision and machine learning.

![ProMeals AI](https://img.shields.io/badge/ProMeals-AI-orange?style=for-the-badge&logo=next.js)
![Next.js](https://img.shields.io/badge/Next.js-15.2.4-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1.9-38B2AC?style=flat-square&logo=tailwind-css)

## 💻 Development

### VS Code Setup

The project includes optimized VS Code settings and recommended extensions:

**Recommended Extensions:**
- **Prettier**: Code formatting
- **ESLint**: Code linting
- **Tailwind CSS IntelliSense**: CSS class suggestions
- **TypeScript Importer**: Auto-import TypeScript modules
- **Auto Rename Tag**: HTML/JSX tag synchronization

**Workspace Features:**
- ✅ Auto-formatting on save
- ✅ TypeScript auto-imports
- ✅ Tailwind CSS class completion
- ✅ ESLint integration
- ✅ Path intellisense

- 📸 **Camera Integration**: Take photos or upload images of meals
- 🤖 **AI-Powered Analysis**: Instant nutrition facts using computer vision
- 📊 **Nutrition Tracking**: Track calories, protein, carbs, and fat
- 📱 **Mobile-First Design**: Optimized for mobile devices
- 🎯 **Goal Setting**: Set and track daily nutrition targets
- 📈 **Progress Monitoring**: Visual progress bars and statistics
- 💾 **Local Storage**: Save meal history and goals locally
- 🌙 **Dark Theme**: Modern dark UI with orange accents

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and **pnpm** package manager
- **Git** for version control
- Modern web browser with camera support

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Kingbyno/promeals-ai.git
   cd promeals-ai
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` and update the webhook URL if needed.

   **Note**: Never commit `.env.local` to version control as it may contain sensitive information.

4. **Start the development server**
   ```bash
   pnpm dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### VS Code Setup (Recommended)

If you're using VS Code, the project includes recommended extensions and settings:

1. Install recommended extensions when prompted, or manually install:
   - Prettier
   - ESLint
   - Tailwind CSS IntelliSense
   - TypeScript Importer

2. The workspace settings will automatically configure:
   - Auto-formatting on save
   - TypeScript auto-imports
   - Tailwind CSS class suggestions

## 🛠️ Tech Stack

### Frontend
- **Framework**: [Next.js 15](https://nextjs.org/) with App Router
- **Language**: [TypeScript 5](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/) (Radix UI primitives)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Forms**: [React Hook Form](https://react-hook-form.com/) with [Zod](https://zod.dev/) validation

### Key Dependencies
- **Charts**: [Recharts](https://recharts.org/)
- **Themes**: [next-themes](https://github.com/pacocoursey/next-themes)
- **Analytics**: [Vercel Analytics](https://vercel.com/analytics)
- **Fonts**: [Geist](https://vercel.com/font) font family

## � Development

### VS Code Setup

The project includes optimized VS Code settings and recommended extensions:

**Recommended Extensions:**
- **Prettier**: Code formatting
- **ESLint**: Code linting
- **Tailwind CSS IntelliSense**: CSS class suggestions
- **TypeScript Importer**: Auto-import TypeScript modules
- **Auto Rename Tag**: HTML/JSX tag synchronization

**Workspace Features:**
- ✅ Auto-formatting on save
- ✅ TypeScript auto-imports
- ✅ Tailwind CSS class completion
- ✅ ESLint integration
- ✅ Path intellisense

## �📁 Project Structure

```
promeals-calories-ai/
├── app/                    # Next.js App Router
│   ├── api/analyze/       # Food analysis API endpoint
│   ├── globals.css        # Global styles and CSS variables
│   ├── layout.tsx         # Root layout component
│   └── page.tsx           # Main application page
├── components/            # Reusable UI components
│   ├── ui/               # shadcn/ui components
│   └── theme-provider.tsx
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions
├── public/               # Static assets
└── styles/               # Additional stylesheets
```

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# N8N Webhook URL for food analysis
NEXT_PUBLIC_FOOD_AI_WEBHOOK_URL=https://kingpromise007.app.n8n.cloud/webhook/food-ai
```

**Important**: 
- Copy from `.env.example` to get started
- Never commit `.env.local` to version control
- Update the webhook URL if you have your own N8N instance

### Build Commands

```bash
# Development
pnpm dev

# Production build
pnpm build

# Start production server
pnpm start

# Preview production build
pnpm preview

# Type checking
pnpm type-check

# Lint code
pnpm lint

# Clean build files
pnpm clean
```

## 📱 Usage

### Taking Photos
1. Click the **"Take Photo"** button
2. Grant camera permissions when prompted
3. Position your meal in the camera view
4. Click **"Capture"** to take the photo

### Uploading Photos
1. Click the **"Upload Photo"** button
2. Select an image from your device
3. The app will automatically analyze the image

### Viewing Results
- **Nutrition Facts**: See detailed breakdown of calories, protein, carbs, and fat
- **Food Items**: Individual food items detected in the meal
- **Meal Type**: Categorize as breakfast, lunch, dinner, or snack

### Tracking Progress
- **History Tab**: View all saved meals with timestamps
- **Goals Tab**: Set daily nutrition targets
- **Progress Bars**: Visual representation of goal achievement

## 🔒 Security & Privacy

- **Local Storage**: All data is stored locally in your browser
- **No Account Required**: Use without creating an account
- **Camera Permissions**: Only accessed when explicitly granted
- **HTTPS Required**: Camera access requires secure connection

## 🌐 Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect your repository** to [Vercel](https://vercel.com)
2. **Add environment variables** in Vercel dashboard:
   - `NEXT_PUBLIC_FOOD_AI_WEBHOOK_URL`
3. **Deploy automatically** on every push to main branch

### Other Platforms

The app can be deployed to any platform supporting Next.js:

```bash
# Build for production
pnpm build

# Start production server
pnpm start
```

### Environment Setup

Make sure to set the webhook URL in your deployment environment:

```env
NEXT_PUBLIC_FOOD_AI_WEBHOOK_URL=https://your-webhook-url.com/webhook/food-ai
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **N8N** for providing the webhook infrastructure
- **shadcn/ui** for the beautiful component library
- **Vercel** for hosting and analytics
- **Next.js** team for the amazing framework

## 📞 Support

If you encounter any issues:

1. Check the browser console for error messages
2. Ensure camera permissions are granted
3. Try refreshing the page
4. Clear browser cache and cookies

For additional help, please open an issue on GitHub.

---

**Made with ❤️ for healthier eating habits**
