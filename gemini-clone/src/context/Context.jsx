import { createContext, useState } from "react";
import run from "../config/gemini";

export const Context = createContext();

const ContextProvider = (props) => {
  const [input, setInput] = useState("");
  // console.log(input);
  const [recentPrompt, setRecentPrompt] = useState("");
  const [prevPrompts, setPrevPrompts] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState("");

  const delayChar = (index, nextChar) => {
    setTimeout(function () {
      setResultData((prev) => prev + nextChar);
    }, 75 * index); // Adjust the multiplier for faster or slower typing effect
  };

  const newChat = () => {
    setLoading(false)
    setShowResult(false)
  } 

  const onSent = async (prompt) => {
    setResultData("");
    setLoading(true);
    setShowResult(true);
    let response;
    if (prompt !== undefined) {
      response = await run(prompt);
      setRecentPrompt(prompt);
    } else {
      setPrevPrompts((prev) => [...prev, input]);
      setRecentPrompt(input)
      response = await run(input)
    }
    // setRecentPrompt(input);
    // setPrevPrompts(prev=>[...prev,input])
    // const response = await run(input);
    let responseArray = response.split("**");
    let newResponse;

    for (let i = 0; i < responseArray.length; i++) {
      if (i % 2 !== 0) {
        newResponse += "<b>" + responseArray[i] + "</b>";
      } else {
        newResponse += responseArray[i];
      }
    }
    let newResponse2 = newResponse.split("*").join("</br>");
    // setResultData(newResponse2);
    // setResultData(response);
    let newResponceArray = newResponse2.split(" ");
    for (let i = 0; i < newResponceArray.length; i++) {
      const nextword = newResponceArray[i];
      delayChar(i, nextword + " ");
    }
    setLoading(false);
    setInput("");
  };
  // onSent("what is react")
  const contextValue = {
    input,
    setInput,
    recentPrompt,
    setRecentPrompt,
    prevPrompts,
    setPrevPrompts,
    showResult,
    setShowResult,
    loading,
    setLoading,
    resultData,
    setResultData,
    onSent,
    newChat
  };

  return (
    <Context.Provider value={contextValue}>{props.children}</Context.Provider>
  );
};

export default ContextProvider;
