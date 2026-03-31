import axios from "axios";
import simpleGitModule from "simple-git";
import { z } from "zod";
import path from "path";

const simpleGit = (simpleGitModule as any).default || simpleGitModule;

export const createPRSchema = {
  message: z.string().describe("Commit message"),
  baseBranch: z.string().optional().describe("Base branch (defaults to 'dev' or 'main')")
};

export const executeCreatePR = async (args: any) => {
  try {
    const { message, baseBranch } = args;
    
    // ✅ 1. Validate Project Path
    const rawPath = process.env.PROJECT_PATH;
    if (!rawPath) throw new Error("PROJECT_PATH is not defined in .env");
    
    // Normalize path to fix Windows/Unix slash issues
    const projectPath = path.resolve(rawPath);
    console.error("📂 Accessing Repository at:", projectPath);

    const git = simpleGit(projectPath);

    // ✅ 2. Verify it is a valid Git Repo
    const isRepo = await git.checkIsRepo();
    if (!isRepo) {
      throw new Error(`The directory ${projectPath} is not a Git repository. Did you run 'git init'?`);
    }

    // ✅ 3. Git Operations
    const branchInfo = await git.branch();
    const currentBranch = branchInfo.current;
    if (!currentBranch) throw new Error("Could not determine current branch.");

    console.error("🌿 Current Branch:", currentBranch);

    const status = await git.status();
    if (status.files.length === 0) {
      throw new Error("No changes detected. Add files to the project before creating a PR.");
    }

    await git.add(".");
    await git.commit(message);
    await git.push("origin", currentBranch);

    // ✅ 4. GitHub API Logic
    const { GITHUB_OWNER, GITHUB_REPO, GITHUB_TOKEN, BASE_BRANCH } = process.env;

    if (!GITHUB_OWNER || !GITHUB_REPO || !GITHUB_TOKEN) {
      throw new Error("Missing GitHub Auth variables in .env");
    }

    const targetBase = baseBranch || BASE_BRANCH || "main";

    const response = await axios.post(
      `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/pulls`,
      {
        title: message,
        head: currentBranch,
        base: targetBase,
        body: "Automated PR via MCP Tool 🚀"
      },
      {
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`, // Use 'token' for PATs
          Accept: "application/vnd.github.v3+json"
        }
      }
    );

    return {
      content: [{ type: "text", text: `✅ Success! PR created: ${response.data.html_url}` }]
    };

  } catch (error: any) {
    const errorMessage = error?.response?.data?.message || error.message || "Unknown error";
    console.error("❌ Git/GitHub Error:", errorMessage);
    return {
      content: [{ type: "text", text: `❌ Failed: ${errorMessage}` }],
      isError: true
    };
  }
};

export const createPRTool = {
  name: "createPR",
  description: "Commits changes, pushes to origin, and creates a GitHub Pull Request.",
  inputSchema: createPRSchema,
  execute: executeCreatePR
};