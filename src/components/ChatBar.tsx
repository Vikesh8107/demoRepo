import React, { useState, useEffect, KeyboardEvent } from "react";
import axios from "axios";
import WelcomeBanner from "./WelcomeBanner";
import ChatInterface from "./ChatInterface";
import PlusIcon from "@heroicons/react/outline/PlusIcon";

interface ChatBarProps {
  email: string | null;
  displayName: string | null;
}

const ChatBar: React.FC<ChatBarProps> = ({ email, displayName }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedText, setRecordedText] = useState("");
  const [recordedResultText, setRecordedResultText] = useState("");
  const [selectedRadio, setSelectedRadio] = useState<number | null>(null);
  const [requestValue, setRequestValue] = useState<number | null>(null);
  const [isChatStarted, setIsChatStarted] = useState<boolean>(false);
  const token = localStorage.getItem("jwtToken");

  const handleRadioClick = async (value: number) => {
    setSelectedRadio(value);
    setRequestValue(value);
  };

  const handleNewChat = () => {
    window.location.reload();
  };

  const handleSubmit = async () => {
    if (requestValue == null) return;

    setIsChatStarted(true);

    try {
      // Define headers with the token
      const headers = {
        token: token,
      };

      const response = await axios.post(
        "https://kontentgpt-production-838d.up.railway.app/submit_with_type",
        { prompt: recordedText || "", type: requestValue === 1 ? "Short Form" : "Long Form" },
        { headers }
      );

      let outputString =
        typeof response.data.output === "string"
          ? response.data.output
          : JSON.stringify(response.data.output);

      outputString = outputString.replace(/\*\*/g, "").replace(/\\n/g, "\n");

      setRecordedResultText(outputString);
      setRecordedText(""); // Clear the input text
      setSelectedRadio(null);
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent default behavior of form submission
      handleSubmit();
    }
  };

  useEffect(() => {
    if (isRecording) {
      const stream = new MediaStream(); // Declare and initialize the stream variable
      const mediaRecorder = new MediaRecorder(stream); // Pass the MediaStream object as an argument
      // Logic for recording
    }
  }, [isRecording]);

  return (
    <>
      {!isChatStarted && <WelcomeBanner displayName={displayName} />}
      <div className="fixed bottom-7 mt-25 left-0 right-0 top-20 flex justify-end items-center flex-col gap-2">
        {isChatStarted && <ChatInterface email={email} question={recordedText} answer={recordedResultText} />}
        <div className="relative">
          <input
            type="text"
            placeholder="Type your script data and select LONG or SHORT form..."
            value={recordedText}
            onChange={(e) => setRecordedText(e.target.value)}
            className="h-16 w-96 py-2 px-4 bg-gray-200 text-black border-none rounded-full pr-20"
            style={{
              width: "calc(100vw - 180px)",
              maxWidth: "800px",
              minWidth: "320px",
              fontSize: "16px",
            }}
            onKeyDown={handleKeyPress}
          />
          <button
            className="absolute top-2 right-4 bg-gray-200 text-black rounded-full p-3 hover:bg-gray-300"
            onClick={handleNewChat}
            title="New Chat"
          >
            <PlusIcon className="h-6 w-6" />
          </button>
          <button
            className="absolute top-2 right-16 bg-gray-200 text-black rounded-full p-3 hover:bg-gray-300"
            onClick={handleSubmit}
            title="Submit"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
            </svg>
          </button>
        </div>

        <div className="flex flex-row gap-5">
          <div className="flex items-center">
            <button
              id="default-radio-1"
              type="button"
              value=""
              name="default-radio"
              className={`w-128 h-8 text-blue-600 border-gray-300 min-w-24 rounded-full focus:ring-blue-500 dark:focus:ring-blue-600 ${
                selectedRadio === 1 ? "bg-gradient-to-r from-blue-300 via-purple-400 to-red-300" : "bg-gradient-to-r from-white to-gray-100"
              }`}
              onClick={() => handleRadioClick(1)}
            >
              <label id="default-radio-1" className="ms-2 me-2 text-sm font-medium text-black">Short Form</label>
            </button>
          </div>

          <div className="flex items-center">
            <button
              id="default-radio-2"
              type="button"
              value=""
              name="default-radio"
              className={`w-128 h-8 text-blue-600 border-gray-300 min-w-24 rounded-full focus:ring-blue-500 dark:focus:ring-blue-600 ${
                selectedRadio === 2 ? "bg-gradient-to-r from-blue-300 via-purple-400 to-red-300" : "bg-gradient-to-r from-white to-gray-100"
              }`}
              onClick={() => handleRadioClick(2)}
            >
              <label id="default-radio-2" className="ms-2 me-2 text-sm font-medium text-black">Long Form</label>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatBar;
