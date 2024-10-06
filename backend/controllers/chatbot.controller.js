import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY is not defined in the environment variables.");
}

// Initialize the GoogleGenerativeAI with the API key
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-pro-002",
  systemInstruction: `You are the StudyONE interview chatbot, designed to help students prepare for their interviews. 
1. Trigger: You will start your interaction when the user inputs "Let's start the interview prep." or something like that.
2. Once triggered, ask the user, "What topic would you like to prepare for?"
3. After receiving the topic, proceed with the following questions:
   - "Introduce yourself."
   - "What is your experience with [topic]?"
   - "Can you explain key concepts related to [topic]?"
   - "What challenges have you faced in this area?"
   - "How do you stay updated in this field?"
   - "Can you give an example of how you solved a technical problem related to [topic]?"
4. After each response from the user:
   - Provide constructive feedback on their answer.
   - Ask the next question in the sequence.
Ensure that the feedback is helpful and that the transition to the next question is smooth. If the user has not yet triggered the interview mode, respond with a message indicating that they need to start the interview prep first.`,
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

let chatSession;
let started = false;

export const chatWithBot = async (req, res) => {
  const userInput = req.body.message;

  if (!userInput) {
    return res.status(400).json({ error: "Message is required." });
  }

  console.log("User input received:", userInput);

  try {
    if (userInput.toLowerCase() === "let's start the interview prep") {
      if (!started) {
        started = true;
        // Initialize the chat session if it doesn't exist
        chatSession = model.startChat({
          generationConfig,
          history: [
            {
              role: "user",
              parts: [{ text: userInput }],
            },
          ],
        });

        // Get the chatbot's initial response
        const result = await chatSession.sendMessage(userInput);
        const responseText = await result.response.text();

        console.log("Response from the chatbot:", responseText);
        res.json({ response: responseText });
      } else {
        return res.json({ response: "You have already started the interview prep. Please respond to the current question." });
      }
    } else {
      if (!started) {
        return res.json({ response: "To start your interview preparation, please type 'Let's start the interview prep'." });
      } else {
        // Continue the conversation if the chat session already exists
        const result = await chatSession.sendMessage(userInput);
        const responseText = await result.response.text();

        console.log("Response from the chatbot:", responseText);
        res.json({ response: responseText });
      }
    }
  } catch (error) {
    if (error.status === 429) {
      console.error("Rate limit exceeded:", error);
      res.status(429).json({
        error: "The chatbot is receiving too many requests right now. Please try again later.",
      });
    } else {
      console.error("Error with chatbot:", error);
      res.status(500).json({
        error: "An error occurred while interacting with the chatbot. Please try again later.",
      });
    }
  }
};
