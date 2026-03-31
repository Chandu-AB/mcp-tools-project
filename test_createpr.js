import "dotenv/config";
import simpleGitModule from "simple-git";
import path from "path";

const simpleGit = simpleGitModule.default || simpleGitModule;

const executeCreatePR = async (args) => {
  try {
    const { message, baseBranch } = args;

    console.log("Starting createPR execution...");
    console.log("Message:", message);
    console.log("Base branch:", baseBranch);

    const projectPath = process.env.PROJECT_PATH;
    console.log("Project path:", projectPath);

    const git = simpleGit(path.resolve(projectPath));

    // ✅ 1. Check Git Repo
    console.log("Checking if Git repo...");
    const isRepo = await git.checkIsRepo();
    console.log("Is Git repo:", isRepo);

    if (!isRepo) {
      return {
        content: [{ type: "text", text: "❌ Not a Git repository." }],
        isError: true
      };
    }

    // ✅ 2. Check Changes
    console.log("Checking Git status...");
    const status = await git.status();
    console.log("Is clean:", status.isClean());
    console.log("Staged files:", status.staged.length);
    console.log("Modified files:", status.modified.length);

    if (status.isClean()) {
      return {
        content: [{ type: "text", text: "⚠️ No changes to commit." }],
        isError: false
      };
    }

    // ✅ 3. Get Current Branch
    console.log("Getting current branch...");
    const branchInfo = await git.branchLocal();
    const currentBranch = branchInfo.current;
    console.log("Current branch:", currentBranch);

    // ✅ 4. Validate Base Branch
    console.log("Checking all branches...");
    const allBranches = await git.branch();
    console.log("Available branches:", allBranches.all);

    if (!allBranches.all.includes(baseBranch)) {
      return {
        content: [{ type: "text", text: `❌ Base branch '${baseBranch}' does not exist.` }],
        isError: true
      };
    }

    console.log("All checks passed! Would commit and create PR...");

    return {
      content: [{
        type: "text",
        text: `✅ Would create PR: ${message} from ${currentBranch} to ${baseBranch}`
      }]
    };

  } catch (error) {
    console.error("Error:", error.message);
    return {
      content: [{ type: "text", text: `❌ Error: ${error.message}` }],
      isError: true
    };
  }
};

// Test the function
executeCreatePR({ message: "Test commit message", baseBranch: "dev" })
  .then(result => {
    console.log("Result:", result);
  })
  .catch(err => {
    console.error("Test failed:", err);
  });
  try {
    const { message, baseBranch } = args;

    console.log("Starting createPR execution...");
    console.log("Message:", message);
    console.log("Base branch:", baseBranch);

    const projectPath = process.env.PROJECT_PATH!;
    console.log("Project path:", projectPath);

    const git = simpleGit(path.resolve(projectPath));

    // ✅ 1. Check Git Repo
    console.log("Checking if Git repo...");
    const isRepo = await git.checkIsRepo();
    console.log("Is Git repo:", isRepo);

    if (!isRepo) {
      return {
        content: [{ type: "text", text: "❌ Not a Git repository." }],
        isError: true
      };
    }

    // ✅ 2. Check Changes
    console.log("Checking Git status...");
    const status = await git.status();
    console.log("Is clean:", status.isClean());
    console.log("Staged files:", status.staged.length);
    console.log("Modified files:", status.modified.length);

    if (status.isClean()) {
      return {
        content: [{ type: "text", text: "⚠️ No changes to commit." }],
        isError: false
      };
    }

    // ✅ 3. Get Current Branch
    console.log("Getting current branch...");
    const branchInfo = await git.branchLocal();
    const currentBranch = branchInfo.current;
    console.log("Current branch:", currentBranch);

    // ✅ 4. Validate Base Branch
    console.log("Checking all branches...");
    const allBranches = await git.branch();
    console.log("Available branches:", allBranches.all);

    if (!allBranches.all.includes(baseBranch)) {
      return {
        content: [{ type: "text", text: `❌ Base branch '${baseBranch}' does not exist.` }],
        isError: true
      };
    }

    console.log("All checks passed! Would commit and create PR...");

    return {
      content: [{
        type: "text",
        text: `✅ Would create PR: ${message} from ${currentBranch} to ${baseBranch}`
      }]
    };

  } catch (error: any) {
    console.error("Error:", error.message);
    return {
      content: [{ type: "text", text: `❌ Error: ${error.message}` }],
      isError: true
    };
  }
};

// Test the function
executeCreatePR({ message: "Test commit message", baseBranch: "dev" })
  .then(result => {
    console.log("Result:", result);
  })
  .catch(err => {
    console.error("Test failed:", err);
  });