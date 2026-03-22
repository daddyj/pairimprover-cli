# pAIrImprover CLI (Beta)

**Privacy-first AI code quality analysis for React Native developers.**

Analyze your AI coding sessions and get actionable feedback on patterns, testing discipline, and architecture decisions.

Works best with React Native. Also supports Next.js.

---

## ✨ What You Get

```bash
$ pairimprover analyze session.md

📊 Session Quality: 7.8/10 (Good)

ℹ️  Analysis based on this session only, not your entire codebase.

💪 What worked well in this session:
   Strong BDD testing approach, focusing on user experience
   Good library-first thinking with battle-tested solutions
   Performance-conscious decisions throughout

🎯 Opportunities you might have missed:
   No error boundaries implemented for production-ready apps
   Testing setup could be simplified with better patterns

💡 Quick Wins (based on what was discussed):

1. Example: tighten test discipline before the next feature
   ⏱ 5 min  💪 High impact

2. Example: harden UI for failure modes (e.g. errors, empty states)
   ⏱ 15 min  💪 High impact

3. Example: simplify structure where it reduces future change cost
   ⏱ 15 min  💪 High impact
```

**What we analyze (from your session):**

- Collaboration quality, testing discipline, and architectural choices discussed in the transcript
- Framework-aware feedback (strongest for React Native / Expo; Next.js supported)

---

## 🚀 Quick Start

> **👉 First time here?** Follow our [step-by-step setup guide (SETUP.md)](SETUP.md) for detailed instructions and troubleshooting.

### Installation (TL;DR)

**Recommended for MCP users (no clone):** sign in from any terminal — tokens are stored in `~/.pairimprover/config.json`, not in AI chat:

```bash
npx -y pairimprover-cli login --github
```

Then use the same machine with the [pAIrImprover MCP server](https://www.pairimprover.com/setup) in your IDE.

**From source / global CLI:**

```bash
# Clone the repo
git clone https://github.com/daddyj/pairimprover-cli.git
cd pairimprover-cli

# Install dependencies and link globally
npm install
npm link

# Authenticate with GitHub (free tier: 5 analyses/month)
pairimprover login --github

# Analyze a transcript
pairimprover analyze ~/path/to/session.md
```

**Need help?** See [SETUP.md](SETUP.md) for troubleshooting and detailed walkthrough.

### Publishing to npm (maintainers)

Package name on npm: **`pairimprover-cli`**. Before publish:

```bash
npm run build
npm publish --access public
```

Ensure `files` in `package.json` includes `dist` and `bin` (already set). Binaries: `pairimprover` and `pairimprover-cli` (same entry).

### Requirements

- **Node.js 18+**
- **GitHub account** (for authentication)
- **Internet connection** (analysis runs on our backend)
- **AI coding transcript** (.md or .txt file from Cursor, GitHub Copilot, ChatGPT, or similar)

---

## 📖 Usage

### Authentication

```bash
# Login with GitHub (recommended)
pairimprover login --github

# Check your status and usage
pairimprover status

# Logout
pairimprover logout
```

**Free Tier (Public Beta):**
- 5 analyses per month
- Full pattern detection
- All frameworks supported

### Basic Analysis

```bash
pairimprover analyze ./my-session.md
```

**What happens:**

1. 🔒 Your transcript is sent to our backend API (authenticated)
2. 🤖 AI analyzes your patterns (20-60 seconds)
3. 📊 You get results in your terminal
4. 🗑️ Transcript is immediately deleted (not stored)

### Options

```bash
# Override framework detection
pairimprover analyze session.md --framework react-native
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

**Full transparency about how your code is handled.**

### Architecture

```
Your Machine              Our Backend
────────────              ────────────

1. CLI reads transcript
2. POST over HTTPS   ──→  Parse, analyze, return results
3. Show output       ←──  Transcript deleted after processing
```

### Privacy Guarantees

| Data             | Stored?            | Used for Training? | Shared? |
| ---------------- | ------------------ | ------------------ | ------- |
| Transcript       | ❌ No              | ❌ No              | ❌ No   |
| Analysis Results | ❌ No              | ❌ No              | ❌ No   |
| GitHub Username  | ✅ Yes (for auth)  | ❌ No              | ❌ No   |
| Usage Stats      | ✅ Yes (per user)  | ❌ No              | ❌ No   |

**Public Beta (Current):**

- GitHub authentication required
- Free tier: 5 analyses/month
- Pro tier: Unlimited analyses (pricing TBD)
- Your authentication token stored locally at `~/.pairimprover/config.json` (with 600 permissions)

### Why Not Fully Local?

Analysis runs on pAIrImprover’s servers so the product can improve continuously without you reinstalling the CLI, and so sensitive scoring logic stays server-side.

---

## 🤝 Feedback Welcome!

This is a **beta release**. I'd love your honest feedback:

- ✅ **Which AI IDE are you using?** (Cursor, Copilot, Antigravity, Windsurf, ChatGPT, etc.)
- ✅ Was the session analysis helpful?
- ✅ Were the quick wins actually implementable?
- ✅ Did the session quality score feel fair?
- ✅ Was the disclaimer clear (session vs. codebase)?
- ✅ Was finding/exporting the transcript annoying?
- ✅ What's missing?
- ✅ Would you pay for this?

**Report issues:** [GitHub Issues](https://github.com/daddyj/pairimprover-cli/issues)  
**General feedback:** hello@pairimprover.com

---

## ❓ FAQ

### What AI tools are supported?

**Tested & Verified:**
- ✅ **Cursor** - Markdown export (fully tested)
- ✅ **GitHub Copilot** - JSON export via `Chat: Export Session...`
- ✅ **ChatGPT** - JSON/Markdown export via browser extensions

**Should Work (Text-based):**
- 🟡 **Claude.ai** - Copy/paste conversations
- 🟡 **Google Antigravity** - If transcript export becomes available
- 🟡 **Windsurf (Codeium)** - If chat export is added
- 🟡 **Any tool** that exports plain text conversations

**Note:** As long as your AI tool can export the conversation as text (Markdown, JSON, or plain text), pAIrImprover can analyze it. We're actively collecting examples from beta testers to expand verified support.

### Is my code safe?

Yes! Your transcript is:

- Sent over HTTPS (encrypted)
- Analyzed and immediately deleted
- Never stored or shared
- Never used for AI training

### Why does it need internet?

Session analysis runs on pAIrImprover’s backend over HTTPS.

### What frameworks are supported?

- ✅ React Native + Expo (deep pattern library, best results)
- ✅ Next.js (good pattern coverage)
- ⏳ Other frameworks (generic analysis available, improving based on demand)

### How accurate is the session scoring?

The score reflects the quality of your AI collaboration in that specific session, not your overall code quality. pAIrImprover analyzes conversation patterns, decision-making, and best practices discussed. Since it doesn't see your full codebase, think of it as "session coaching" rather than "code review."

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

- [Claude](https://anthropic.com) (analysis)
- Works with transcripts from Cursor, GitHub Copilot, ChatGPT, and similar tools

---

**Questions?** Open an issue or start a discussion! 🚀
