import React, { useState, useEffect } from "react";
import k from "../assets/logo/k.png";
import LoadingAnimation from "./LoadingAnimation"; // Import your loading animation component

interface ChatInterfaceProps {
  question: string;
  answer: string;
  email: string | null;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  question,
  answer,
  email,
}) => {
  const isMobile = window.innerWidth <= 768;
  const [loading, setLoading] = useState(false); // Initially not loading
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false); // Initially assume not logged in
  const [prevQuestion, setPrevQuestion] = useState<string>(""); // Store previous question
  const [prevAnswer, setPrevAnswer] = useState<string>(""); // Store previous answer

  useEffect(() => {
    // Function to send request to backend
    const sendRequestToBackend = () => {
      // Simulate request to backend
      setLoading(true); // Set loading to true while waiting for response

      // Simulate loading delay (replace with actual fetch or backend call)
      setTimeout(() => {
        setLoading(false); // Set loading to false once response is received

        // Store question and answer in session storage
        setPrevQuestion(question);
        setPrevAnswer(answer);
      }, 15000); // 15 seconds for demonstration
    };

    // Call sendRequestToBackend whenever you want to send a request for the answer
    // For demonstration, calling it immediately when the component is rendered
    sendRequestToBackend();
  }, [question, answer]); // Trigger effect when question or answer changes

  useEffect(() => {
    // Check if the user is logged in when the email changes
    setIsLoggedIn(email !== null);
  }, [email]); // Trigger effect when email changes

  return (
    <div
      className="w-full h-full flex flex-col gap-5 overflow-y-auto items-center "
      style={{ scrollbarWidth: "thin", scrollbarColor: "inherit" }}
    >
      {/* Render previous question and answer */}
      <div
        className={`${
          isMobile ? "w-full" : "w-1/2"
        } h-auto flex flex-row gap-5 p-5 justify-start items-center`}
      >
        <img src={k} className="h-10" alt="Logo" />
        <p>{prevQuestion}</p>
      </div>

      <div
        className={`${
          isMobile ? "w-full" : "w-1/2"
        } h-full flex flex-row gap-5 p-5 justify-center items-start`}
      >
        {loading ? (
          <LoadingAnimation />
        ) : (
          <>
            <img src={k} className="h-10" alt="Logo" />
            <p>{prevAnswer}</p>
          </>
        )}
      </div>
    </div>
  );
};

export default ChatInterface;
