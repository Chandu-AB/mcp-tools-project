import axios from "axios";
import simpleGitModule from "simple-git";

const simpleGit = simpleGitModule.default || simpleGitModule;

const git = simpleGit();

export const createPRTool = {
  name: "createPR",
  description: "Commit code, push changes, and create a pull request",

  inputSchema: {
    type: "object",
    properties: {
      message: { type: "string", description: "Commit message" }
    },
    required: ["message"]
  },

  execute: async (args: any) => {
    try {
      const git = simpleGit(); // ✅ inside execute

      const commitMessage = args?.message || "Auto commit from MCP";

      // ✅ get current branch
      const currentBranch = (await git.branch()).current;

      // ✅ add & commit
      await git.add(".");
      await git.commit(commitMessage);

      // ✅ push to same branch
      await git.push("origin", currentBranch);

      // ✅ create PR
      const response = await axios.post(
        `https://api.github.com/repos/${process.env.GITHUB_OWNER}/${process.env.GITHUB_REPO}/pulls`,
        {
          title: commitMessage,
          head: currentBranch,
          base: process.env.BASE_BRANCH || "main", // ✅ fallback
          body: "PR created via MCP"
        },
        {
          headers: {
            Authorization: `token ${process.env.GITHUB_TOKEN}`,
            Accept: "application/vnd.github+json"
          }
        }
      );

      return `PR Created: ${response.data.html_url}`;

    } catch (error: any) {
  console.error("PR Error:", error.response?.data || error.message);
  return `Error creating PR: ${error.message}`;
}
  }
};