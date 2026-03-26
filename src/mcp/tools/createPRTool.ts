import axios from "axios";
import simpleGitModule from "simple-git";
import { z } from "zod";

const simpleGit = (simpleGitModule as any).default || simpleGitModule;

// Schema for AI to understand inputs
export const createPRSchema = {
  message: z.string().describe("Commit message for the changes"),
  baseBranch: z.string().optional().describe("The branch to merge into (default: dev/main)")
};

// Execution logic
export const executeCreatePR = async (args: { message: string; baseBranch?: string }) => {
  
  // ✅ ఇక్కడ మార్పు చేశాం: ప్రాజెక్ట్ పాత్ ని గుర్తించడం
  const projectPath = process.env.PROJECT_PATH || process.cwd();
  
  // ✅ ఇక్కడ మార్పు చేశాం: గిట్ ని ఆ నిర్దిష్ట ఫోల్డర్ లో రన్ చేయమని చెప్పడం
  const git = simpleGit(projectPath); 

  try {
    // డీబగ్గింగ్ కోసం ఒక లాగ్ (AI కి ఎక్కడ పని చేస్తున్నామో తెలుస్తుంది)
    console.error(`Working in directory: ${projectPath}`);

    const branchInfo = await git.branch();
    const currentBranch = branchInfo.current;

    if (!currentBranch) throw new Error("Current branch detect కాలేదు. గిట్ రిపోజిటరీ పాత్ సరిగ్గా ఉందో లేదో చూడండి.");

    // Git Operations
    await git.add(".");
    await git.commit(args.message);
    await git.push("origin", currentBranch);
    console.error(`Pushed to ${currentBranch} successfully.`);

    // GitHub API Call
    const { GITHUB_OWNER, GITHUB_REPO, GITHUB_TOKEN, BASE_BRANCH } = process.env;
    const targetBase = args.baseBranch || BASE_BRANCH || "main";

    const response = await axios.post(
      `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/pulls`,
      {
        title: args.message,
        head: currentBranch,
        base: targetBase,
        body: "PR created via MCP Tool."
      },
      {
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          Accept: "application/vnd.github+json"
        }
      }
    );

    return {
      content: [{ type: "text", text: `✅ PR Success: ${response.data.html_url}` }]
    };
  } catch (error: any) {
    const msg = error.response?.data?.message || error.message;
    console.error("Git/PR Error Details:", error.response?.data || error.message);
    return {
      content: [{ type: "text", text: `❌ PR Error: ${msg}` }],
      isError: true
    };
  }
};

// Exporting as a single tool object for index.ts
export const createPRTool = {
  name: "createPR",
  description: "Commit code, push changes, and create a GitHub PR",
  schema: createPRSchema,
  execute: executeCreatePR
};