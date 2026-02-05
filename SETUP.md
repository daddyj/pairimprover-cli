# Setup Guide for Beta Testers

**Thanks for testing pAIrImprover!** 🙏

This guide will get you up and running in 5 minutes.

---

## 📋 Prerequisites

- **Node.js 18+** (Check: `node --version`)
- **npm** (Comes with Node.js)
- **Internet connection**
- **An AI coding transcript** (.md or .txt from Cursor, Copilot, ChatGPT, etc.)

---

## 🚀 Installation

### Step 1: Clone the Repository

```bash
git clone https://github.com/daddyj/pairimprover-cli.git
cd pairimprover-cli
```

### Step 2: Install Dependencies

```bash
npm install
```

That's it! No API keys needed. No configuration files.

---

## 🧪 Test It

### Quick Test

```bash
# Create a test file
echo "I built a React Native app with FlatList" > test.md

# Analyze it
npm run analyze -- test.md
```

You should see:

- ✅ Analysis starting
- ✅ Results in your terminal
- ✅ Score and recommendations

### Analyze a Real Session

```bash
# Export a chat from your AI tool first, then:
npm run analyze -- ~/path/to/your-session.md
```

**What to expect:**

- Takes 20-60 seconds (depending on size)
- Shows progress spinner
- Displays results in terminal

---

## 🎯 Usage Examples

### Basic Analysis

```bash
npm run analyze -- session.md
```

### Open Web Dashboard (Coming Soon)

```bash
npm run analyze -- session.md --open
```

### Override Framework Detection

```bash
npm run analyze -- session.md --framework react-native
```

---

## 📁 How to Get Your AI Coding Transcript

### Cursor

1. Open chat → `...` menu → "Export chat" → Save as `.md`
2. Or find in: `~/.cursor/User/workspaceStorage/.../chats/`

### GitHub Copilot

1. Copy conversation from chat panel → Save as `.txt` or `.md`

### ChatGPT / Claude / Other

1. Copy conversation from browser → Save as `.txt` or `.md`

**Any format works** as long as it includes the conversation!

---

## 🐛 Troubleshooting

### "npm: command not found"

**Solution:** Install Node.js from https://nodejs.org

### "Analysis failed" Error

**Possible causes:**

- Backend is temporarily down
- Internet connection issue
- File is corrupted or not a valid transcript

**Try:**

```bash
# Check internet connection
curl https://pairimprover.vercel.app/api/analyze
# Should return a 400 error (expected - means API is up)

# Try a smaller file first
npm run analyze -- test.md
```

### "Cannot find module" Errors

**Solution:**

```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### File Path Issues

```bash
# Use full path if relative doesn't work:
npm run analyze -- /Users/yourname/Desktop/session.md

# Or navigate to the file first:
cd ~/Desktop
npm run analyze -- session.md
```

---

## 💬 Giving Feedback

### Quick Feedback (2 minutes)

After testing, please share:

1. **Did it work?** (Y/N)
2. **Was the analysis helpful?** (1-5 scale)
3. **Did you implement any suggestions?** (Y/N)
4. **Would you pay $29/month for this?** (Y/N/Maybe)
5. **What's the #1 thing that would make it more valuable?** (open)

**Send to:** acun@pairimprover.com

### Detailed Feedback (15-30 min)

Want to do a quick call? I'd love to hear your thoughts in detail!

---

## 🎁 Thank You!

Your feedback is invaluable. You're helping me shape a tool that will improve code quality for thousands of developers.

**As a thank you:**

- 🎟️ Free Pro tier for life (when I launch it)
- 🏆 Listed as beta tester (if you want)
- ☕ Virtual coffee chat with me

---

## ✉️ Contact

**Questions?** Reach out anytime:

- GitHub Issues: https://github.com/daddyj/pairimprover-cli/issues
- Email: acun@pairimprover.com
- LinkedIn: www.linkedin.com/in/acun-guersoy

---

**Happy analyzing!** 🚀
