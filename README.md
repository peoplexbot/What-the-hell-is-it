
# 🧩 What The Hell Is It? (Mobile Puzzle Game)

**What The Hell Is It?** is a daily image-based puzzle game where players guess what an object is from a zoomed-in photo. Each wrong guess zooms the image out slightly until the full object is revealed. Think *Wordle*, but for your eyes.

---

## ✅ What’s Been Built So Far

### 🎮 Core Puzzle Gameplay
- Players are shown a zoomed-in image and a hint.
- They have **3 guesses** to identify the object.
- Answer is revealed after 3 incorrect attempts.

### 🔍 Progressive Zoom Logic
- Initial zoom scale starts at **4–5x**.
- Image zooms out slightly after each incorrect guess.
- Built using React Native’s `Animated.Value`.

### 💡 Hint Button
- One-time-use **Hint** button reveals an additional clue.
- Using it costs **1 guess** out of the 3.

### 🔥 Streak Tracking
- Tracks how many puzzles a user gets right **in a row**.
- Data is stored locally via `AsyncStorage`.

### ♾️ Endless Mode
- Choose a category and play unlimited puzzles.
- Puzzle data is pulled dynamically from a **Google Sheet backend** via Apps Script.

### 📱 Puzzle Screens
- All gameplay logic is contained in `puzzle.tsx`.
- Uses **Expo Router** for navigation and parameter passing.

---

## 🚧 In Progress / Planned Features

- 📅 **Daily Puzzle Mode**: Shared puzzle of the day with streak tracking.
- 🏆 **Leaderboard**: Store and display top streaks using Supabase.
- 🤪 **Funny Reactions**: GPT-powered responses to wrong answers and playful hints.
- 🔬 **Zoom Customization**: Tighter starting zoom and smoother scaling.
- 🧩 **Puzzle Library Expansion**: More puzzles, categories, and difficulty levels.

---

## 🧰 Technical Stack

| Feature         | Tech                          |
|----------------|-------------------------------|
| **Frontend**    | React Native via Expo          |
| **Styling**     | NativeWind (Tailwind for RN)   |
| **Navigation**  | Expo Router                    |
| **Local Storage**| AsyncStorage                  |
| **Cloud Storage**| Supabase (planned)           |
| **Data Source** | Google Sheets + Apps Script    |
| **Zoom Logic**  | React Native Animated API      |
| **Dev Tools**   | VS Code + PowerShell           |

---

## 🛠 Setup Instructions

```bash
git clone https://github.com/YOUR_USERNAME/what-the-hell-is-it.git
cd what-the-hell-is-it
npm install
npx expo start
```

> Make sure to add your environment variables (e.g. Google Sheets URL or Supabase credentials) to a `.env` file in the root directory.

---

## 🔗 Helpful Links

- 📊 **Google Sheets Puzzle Dataset**  
  https://docs.google.com/spreadsheets/d/1VL5RzUJzqcrGUlBM9v2WmYpIHFEPD5upO1o2oLRjYtM/edit?usp=sharing

- ⚙️ **Apps Script Backend**  
  https://script.google.com/macros/s/AKfycbwC0Koz-Backend-Example-URL/exec

- 🖼 **Pexels API** (image sourcing)  
  https://www.pexels.com/api/

- ☁️ **Supabase Project**  
  https://supabase.com/dashboard/project/your-project-id

- 🤖 **OpenAI GPT API** (for hints/funny feedback)  
  https://platform.openai.com/

---

## 🧙‍♂️ Contributions

This is an early-stage project and open to contributors!  
Designers, puzzle creators, and React Native devs are all welcome 🙌  
Feel free to open an issue or submit a PR.

---

## 📸 Image Credits

Images sourced from [Pexels](https://www.pexels.com/) and [Unsplash](https://unsplash.com/), credited via API metadata.

---

## 🚀 Stay in the Loop

New features like daily puzzles, GPT-powered clues, and global leaderboards are on the roadmap.  
Follow the repo, contribute ideas, or just try to beat your high score.

---
