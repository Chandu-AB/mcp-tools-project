import { z } from "zod";
import simpleGitModule from "simple-git";
import path from "path";
import axios from "axios";

const simpleGit = (simpleGitModule as any).default || simpleGitModule;

export const createPRSchema = z.object({
  message: z.string(),
  baseBranch: z.string().default("dev")
});

export const executeCreatePR = async (args: z.infer<typeof createPRSchema>) => {
  try {
    const { message, baseBranch } = args;

    // ✅ Fix: Handle missing PROJECT_PATH
    const projectPath = process.env.PROJECT_PATH || process.cwd();
    if (!projectPath) {
      return {
        content: [{ type: "text", text: "❌ PROJECT_PATH environment variable not set and cannot determine current working directory." }],
        isError: true
      };
    }

    console.error(`Using project path: ${projectPath}`);
    const git = simpleGit(path.resolve(projectPath));

    // ✅ 1. Check Git Repo
    const isRepo = await git.checkIsRepo();
    if (!isRepo) {
      return {
        content: [{ type: "text", text: "❌ Not a Git repository." }],
        isError: true
      };
    }

    // ✅ 2. Check Changes
    const status = await git.status();
    if (status.isClean()) {
      return {
        content: [{ type: "text", text: "⚠️ No changes to commit." }],
        isError: false
      };
    }

    // ✅ 3. Get Current Branch
    const branchInfo = await git.branchLocal();
    const currentBranch = branchInfo.current;

    // ✅ 4. Validate Base Branch
    const allBranches = await git.branch();
    if (!allBranches.all.includes(baseBranch)) {
      return {
        content: [{ type: "text", text: `❌ Base branch '${baseBranch}' does not exist.` }],
        isError: true
      };
    }

    // ✅ 5. Commit + Push
    await git.add(".");
    await git.commit(message);
    await git.push("origin", currentBranch);

    // ✅ 6. Validate ENV
    const { GITHUB_OWNER, GITHUB_REPO, GITHUB_TOKEN } = process.env;

    if (!GITHUB_TOKEN || !GITHUB_OWNER || !GITHUB_REPO) {
      return {
        content: [{ type: "text", text: "❌ Missing GitHub credentials." }],
        isError: true
      };
    }

    // ✅ 7. Create PR
    const response = await axios.post(
      `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/pulls`,
      {
        title: message,
        head: currentBranch,
        base: baseBranch
      },
      {
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
          Accept: "application/vnd.github.v3+json"
        }
      }
    );

    return {
      content: [{
        type: "text",
        text: `✅ PR Created: ${response.data.html_url}`
      }]
    };

  } catch (error: any) {
    // ✅ 8. Smart Error Handling
    if (error.response?.status === 401) {
      return {
        content: [{ type: "text", text: "❌ Invalid GitHub token." }],
        isError: true
      };
    }

    if (error.response?.status === 422) {
      return {
        content: [{ type: "text", text: "⚠️ PR already exists or branch issue." }],
        isError: false
      };
    }

    return {
      content: [{ type: "text", text: `❌ Error: ${error.message}` }],
      isError: true
    };
  }
};

export const createPRTool = {
  name: "createPR",
  description: "Smart Git + PR automation tool",
  schema: createPRSchema,
  execute: executeCreatePR
};