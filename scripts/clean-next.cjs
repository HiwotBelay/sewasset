/**
 * Delete `.next` with retries (Windows often locks `.next/trace` while dev or antivirus holds it).
 */
const fs = require("fs");
const path = require("path");

const dir = path.join(process.cwd(), ".next");
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  for (let attempt = 0; attempt < 10; attempt++) {
    try {
      fs.rmSync(dir, { recursive: true, force: true });
    } catch {
      /* EBUSY / EPERM */
    }
    if (!fs.existsSync(dir)) {
      console.log("Removed .next");
      process.exit(0);
    }
    await sleep(600);
  }
  console.error(
    "\nCould not delete .next (files still locked).\n" +
      "1. Stop every `npm run dev` (Ctrl+C) and wait for the prompt.\n" +
      "2. In Task Manager, end Node.js processes tied to this folder (optional).\n" +
      "3. If the project is under OneDrive/Desktop, pause sync or move the repo.\n" +
      "4. Run: npm run clean\n",
  );
  process.exit(1);
})();
