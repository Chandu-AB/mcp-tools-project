import axios from "axios";

export const generateCommitMessageSchema = {
  type: "object",
  properties: {
    changes: { 
      type: "string", 
      description: "Brief description of the code changes" 
    }
  },
  required: ["changes"]
};

export const executeGenerateCommitMessage = async (args: any) => {
  try {
    const { changes } = args;
    
    // ✅ 1. Ollama API Call
    // Note: Ensure Ollama is running locally on port 11434
    const response = await axios.post("http://localhost:11434/api/generate", {
      model: "tinyllama",
      prompt: `Generate a concise, professional git commit message for these changes: ${changes}. 
               Respond with ONLY the commit message text, no explanations.`,
      stream: false
    });

    // ✅ 2. Safe Response Handling
    // This prevents the "Cannot read properties of undefined (reading 'substring')" error
    const rawContent = response.data?.response || "feat: update project files";
    
    // Clean up the response (remove quotes or extra newlines if any)
    const cleanMessage = rawContent.toString().trim().replace(/["']/g, "");

    return {
      content: [{ 
        type: "text", 
        text: cleanMessage 
      }]
    };

  } catch (error: any) {
    console.error("❌ Ollama Error:", error.message);
    
    // Fallback message if Ollama is down or fails
    return {
      content: [{ 
        type: "text", 
        text: `feat: update based on changes (${args.changes.substring(0, 30)}...)` 
      }],
      isError: false // We return a fallback instead of crashing
    };
  }
};

export const generateCommitMessageTool = {
  name: "generateCommitMessage",
  description: "Uses local Ollama (tinyllama) to generate a professional git commit message.",
  inputSchema: generateCommitMessageSchema,
  execute: executeGenerateCommitMessage
};