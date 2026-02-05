# 🎯 pAIrImprover CLI (Beta)

**Privacy-first AI code quality analysis for React Native developers.**

Analyze your AI coding sessions and get actionable feedback on patterns, testing discipline, and architecture decisions.

---

## ✨ What You Get

```bash
$ npm run analyze -- session.md

📊 Results: 7.8/10 (Good)

💪 What you're doing well:
   Strong BDD testing approach, focusing on user experience
   Good library-first thinking with battle-tested solutions
   Performance-conscious decisions throughout

🎯 Top 3 Quick Wins:

1. Add React Native error boundaries in main App component
   ⏱ 15 min  💪 High impact

2. Simplify test architecture by separating business logic
   ⏱ 15 min  💪 High impact

3. Add performance monitoring for FlashList rendering
   ⏱ 15 min  💪 High impact
```

**Analysis based on:**
- ✅ Critical thinking patterns
- ✅ Library-first mindset
- ✅ Test discipline (BDD, coverage, edge cases)
- ✅ Architectural decisions
- ✅ React Native best practices

---

## 🚀 Quick Start

### Installation

```bash
# Clone the repo
git clone https://github.com/daddyj/pairimprover-cli.git
cd pairimprover-cli

# Install dependencies
npm install

# Analyze a transcript
npm run analyze -- ~/path/to/session.md
```

### Requirements

- **Node.js 18+**
- **Internet connection** (analysis runs on our backend)
- **AI coding transcript** (.md or .txt file from Cursor, GitHub Copilot, ChatGPT, or similar)

---

## 📖 Usage

### Basic Analysis

```bash
npm run analyze -- ./my-session.md
```

**What happens:**
1. 🔒 Your transcript is sent to our backend API
2. 🤖 AI analyzes your patterns (20-60 seconds)
3. 📊 You get results in your terminal
4. 🗑️ Transcript is immediately deleted (not stored)

### Options

```bash
# Open web dashboard after analysis (coming soon)
npm run analyze -- session.md --open

# Override framework detection
npm run analyze -- session.md --framework react-native
```

---

## 📁 How to Export Your AI Coding Transcript

### Cursor
**Option 1:** Export from chat
1. Open the chat → `...` menu → "Export chat" → Save as `.md`

**Option 2:** Find in folder
```bash
~/.cursor/User/workspaceStorage/.../chats/
```

### GitHub Copilot
1. Open Copilot chat panel
2. Copy conversation to text file
3. Save as `.md` or `.txt`

### ChatGPT / Claude / Other
1. Copy the conversation from browser
2. Save as `.txt` or `.md` file
3. Ensure it includes both your prompts and AI responses

**Supported formats:**
- Any conversation with user/AI exchanges
- Code blocks in markdown format (```language)
- Plain text conversations

---

## 🔒 How It Works (Transparency)

**We believe in full transparency about how your code is handled.**

### Architecture

```
Your Machine              Our Backend (Private)
────────────              ─────────────────────

1. CLI reads file         
   [session.md]           

2. POST to API        ──→  3. Parse transcript
   (via HTTPS)             4. Detect framework
                           5. Apply pattern library
3. Wait for result         6. AI analysis (Claude)
                           7. Generate insights
                           
4. Display results   ←───  8. Return JSON
                           9. Delete transcript
```

### Privacy Guarantees

| Data | Stored? | Used for Training? | Shared? |
|------|---------|-------------------|---------|
| Transcript | ❌ No | ❌ No | ❌ No |
| Analysis Results | ❌ No | ❌ No | ❌ No |
| Usage Stats | ✅ Yes (anonymous) | ❌ No | ❌ No |

**In Beta (Current):**
- No authentication required
- No rate limiting
- Free for all testers
- We cover API costs

### Why Not Fully Local?

**Good question!** We chose a backend API for two reasons:

1. **Keep pattern libraries private** - Our React Native & Next.js pattern knowledge is proprietary
2. **Continuous improvement** - We can update patterns without you updating the CLI

---

## 🤝 Feedback Welcome!

This is a **beta release**. We'd love your honest feedback:

- ✅ Was the analysis helpful?
- ✅ Were the action items implementable?
- ✅ Did the score feel accurate?
- ✅ Was finding/exporting the transcript annoying?
- ✅ What's missing?
- ✅ Would you pay for this?

**Report issues:** [GitHub Issues](https://github.com/daddyj/pairimprover-cli/issues)  
**General feedback:** Open a discussion or contact us

---

## ❓ FAQ

### What AI tools are supported?

- ✅ Cursor
- ✅ GitHub Copilot
- ✅ ChatGPT
- ✅ Claude
- ✅ Any AI coding tool that exports conversation transcripts

### Is my code safe?

Yes! Your transcript is:
- Sent over HTTPS (encrypted)
- Analyzed and immediately deleted
- Never stored or shared
- Never used for AI training

### Why does it need internet?

The analysis runs on our backend to keep our pattern libraries private. We're working on a `--local` mode for offline use.

### What frameworks are supported?

Currently:
- ✅ React Native + Expo (best support)
- ✅ Next.js (good support)
- ⏳ More coming (Python, Vue, etc.)

### How accurate is the scoring?

Pretty good! We've tested on 100+ real sessions. Scores align with peer reviews ~80% of the time. Still in beta though - give us feedback!

---

## 🛠️ Troubleshooting

### "npm: command not found"
**Solution:** Install Node.js from https://nodejs.org

### "Analysis failed" Error
**Possible causes:**
- Backend is temporarily down
- Internet connection issue
- File is corrupted or not a valid transcript

**Try:**
```bash
# Check if file exists and is readable
cat your-file.md | head -10

# Try a smaller test file
echo "I built a React Native app" > test.md
npm run analyze -- test.md
```

---

## 📜 License

MIT License - see [LICENSE](LICENSE) file for details.

---

## 🙏 Credits

Built by [Acun Guersoy](https://github.com/daddyj) - React Native developer passionate about code quality in the AI era.

**Powered by:**
- [Claude AI](https://anthropic.com) for analysis
- Our proprietary React Native pattern library
- Works with transcripts from Cursor, GitHub Copilot, ChatGPT, and more

---

**Questions?** Open an issue or start a discussion! 🚀
