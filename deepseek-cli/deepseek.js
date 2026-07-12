#!/usr/bin/env node
import OpenAI from "openai";
import readline from "readline";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
dotenv.config();

const client = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: "https://api.deepseek.com"
});

// ------------------------------
// Utility: Load a single file
// ------------------------------
function loadFile(filePath) {
  try {
    return fs.readFileSync(filePath, "utf8");
  } catch (err) {
    return `Error: Cannot read file at ${filePath}`;
  }
}

// ------------------------------
// Utility: Load all files in folder
// ------------------------------
function loadFolder(folderPath) {
  let output = "";

  function scan(dir) {
    const items = fs.readdirSync(dir);
    for (const item of items) {
      const full = path.join(dir, item);
      const stat = fs.statSync(full);

      if (stat.isDirectory()) {
        scan(full);
      } else if (stat.isFile()) {
        const ext = path.extname(full).toLowerCase();
        if ([".js", ".ts", ".java", ".py", ".json", ".md"].includes(ext)) {
          output += `\n\n===== FILE: ${full} =====\n\n`;
          output += fs.readFileSync(full, "utf8");
        }
      }
    }
  }

  try {
    scan(folderPath);
    return output || "No readable code files found.";
  } catch (err) {
    return `Error: Cannot scan folder at ${folderPath}`;
  }
}

// ------------------------------
// Ask DeepSeek
// ------------------------------
async function ask(prompt) {
  const response = await client.chat.completions.create({
    model: "deepseek-v4-flash",
    messages: [
      { role: "system", content: "Respond only in English." },
      { role: "user", content: prompt }
    ]
  });

  console.log("\nDeepSeek:\n" + response.choices[0].message.content + "\n");
}

// ------------------------------
// Modes: chat / file / folder
// ------------------------------
const args = process.argv.slice(2);

if (args[0] === "file") {
  const filePath = args[1];
  const code = loadFile(filePath);

  await ask(`Analyze this file:\n\n${code}`);
  process.exit(0);
}

if (args[0] === "folder") {
  const folderPath = args[1];
  const code = loadFolder(folderPath);

  await ask(`Analyze this folder's code:\n\n${code}`);
  process.exit(0);
}

// ------------------------------
// Interactive Chat Mode
// ------------------------------
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function loop() {
  rl.question("You: ", async (input) => {
    await ask(input);
    loop();
  });
}

loop();
