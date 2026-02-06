# Setup Guide for Beta Testers

**Thanks for testing pAIrImprover!** 🙏

This guide will get you up and running in 5 minutes.

> **📖 New here?** Read the [README](README.md) first for an overview of what pAIrImprover does. Then come back here for installation steps.

---

## 📋 Prerequisites

- **Node.js 18+** (Check: `node --version`)
- **npm** (Comes with Node.js)
- **GitHub account** (for authentication)
- **Internet connection**
- **An AI coding transcript** (.md or .txt from Cursor, Copilot, ChatGPT, etc.)

---

## 🚀 Installation

### Step 1: Clone the Repository

```bash
git clone https://github.com/daddyj/pairimprover-cli.git
cd pairimprover-cli
```

### Step 2: Install Dependencies & Link Globally

```bash
npm install
npm link
```

**What `npm link` does:** Creates a global symlink so you can use `pairimprover` command from anywhere in your terminal.

### Step 3: Authenticate with GitHub

```bash
pairimprover login --github
```

**What happens:**
1. Opens your browser to GitHub OAuth
2. You authorize the app
3. Copy the JWT token from the success page
4. Paste it into the CLI prompt
5. Done! Your token is saved locally at `~/.pairimprover/config.json`

**Free tier:** 5 analyses per month

---

## 🧪 Test It

### Check Authentication Status

```bash
pairimprover status
```

You should see:
- ✅ Your GitHub username
- ✅ Tier: public-beta
- ✅ Usage: 0/5 this month (5 remaining)

### Quick Test

```bash
# Create a test file
echo "I built a React Native app with FlatList" > test.md

# Analyze it
pairimprover analyze test.md
```

You should see:

- ✅ Analysis starting
- ✅ Results in your terminal
- ✅ Score and recommendations

### Analyze a Real Session

```bash
# Export a chat from your AI tool first, then:
pairimprover analyze ~/path/to/your-session.md
```

**What to expect:**

- Takes 20-60 seconds (depending on size)
- Shows progress spinner
- Displays results in terminal
- Usage counter increments

---

## 🎯 Usage Examples

### Basic Analysis

```bash
pairimprover analyze session.md
```

### Check Your Usage

```bash
pairimprover status
```

### Logout & Login Again

```bash
pairimprover logout
pairimprover login --github
```

### Override Framework Detection

```bash
pairimprover analyze session.md --framework react-native
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

### "command not found: pairimprover"

**Solution:** Run `npm link` in the CLI directory

```bash
cd pairimprover-cli
npm link
```

### "npm: command not found"

**Solution:** Install Node.js from https://nodejs.org

### "Authentication Required" Error

**Possible causes:**

- Not logged in yet
- Token expired (30 days)
- Token file corrupted

**Solution:**

```bash
# Login again
pairimprover login --github
```

### "Monthly Limit Reached" Error

**Solution:**

You've used all 5 analyses for this month. Options:

1. Wait until next month (free tier resets)
2. Contact acun@pairimprover.com for beta access options

### "Analysis failed" Error

**Possible causes:**

- Backend is temporarily down
- Internet connection issue
- File is corrupted or not a valid transcript

**Try:**

```bash
# Check your authentication
pairimprover status

# Check internet connection
curl https://www.pairimprover.com/api/auth/verify
# Should return an error about authorization (expected)

# Try a smaller file first
echo "test" > test.md
pairimprover analyze test.md
```

### "Cannot find module" Errors

**Solution:**

```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
npm link
```

### File Path Issues

```bash
# Use full path if relative doesn't work:
pairimprover analyze /Users/yourname/Desktop/session.md

# Or navigate to the file first:
cd ~/Desktop
pairimprover analyze session.md
```

---

## 💬 Giving Feedback

### Quick Feedback (2 minutes)

After testing, please share:

1. **Did it work?** (Y/N)
2. **Was the analysis helpful?** (1-5 scale)
3. **Did you implement any suggestions?** (Y/N)
4. **Would you pay for unlimited analyses?** (Y/N/Maybe - any price point?)
5. **What's the #1 thing that would make it more valuable?** (open)

**Send to:** acun@pairimprover.com

### Detailed Feedback (15-30 min)

Want to do a quick call? I'd love to hear your thoughts in detail!

---

## 🎁 Thank You!

Your feedback is invaluable. You're helping shape a tool that improves code quality for developers working with AI.

**Beta tester benefits will be communicated personally** - reach out to discuss!

---

## ✉️ Contact

**Questions?** Reach out anytime:

- GitHub Issues: https://github.com/daddyj/pairimprover-cli/issues
- Email: acun@pairimprover.com
- LinkedIn: https://www.linkedin.com/in/acun-guersoy

---

## 💡 Help Improve Pattern Detection (Optional)

After using the tool a few times, you might notice patterns we're missing or detect incorrectly. If you'd like to contribute:

**Share anonymized sessions:**

- Code snippets removed
- Project names removed
- Only conversation patterns used
- Helps improve detection for everyone

**Reward:** Additional 3 months Pro per accepted pattern contribution

Want to contribute? Email me and we'll chat about it.

---

**Happy analyzing!** 🚀
