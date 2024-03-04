import React, { useState } from 'react';
import axios from 'axios';

const Chatbot = () => {
    const [showChatbot, setShowChatbot] = useState(false);
    const [messages, setMessages] = useState([]);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const toggleChatbot = () => {
        setShowChatbot(!showChatbot);
    };

    const closeChatbot = () => {
        setShowChatbot(false);
    };

    const sendMessage = async (e) => {
        e.preventDefault();
        const userMessage = userInput.trim();
        if (!userMessage) return;

        const newMessages = [...messages, { author: "user", text: userMessage }];
        setMessages(newMessages);
        setUserInput('');
        setIsLoading(true);

        try {
            const response = await axios.post(
                "http://localhost:5000/api/completions",
                {
                    prompt: userMessage,
                }
            );

            const botResponse = response.data.choices[0].message.content;
            setMessages([...newMessages, { author: "bot", text: botResponse }]);
        } catch (error) {
            console.error("Error al enviar mensaje:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-10 right-10 z-50">
            {!showChatbot && (
                <button
                    onClick={toggleChatbot}
                    className="bg-blue-500 text-white rounded-full p-3 shadow-lg"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 14l-7 7m0 0l-7-7m7 7V3"
                        />
                    </svg>
                </button>
            )}
            {showChatbot && (
                <div className="bg-indigo-50 shadow-md rounded-lg overflow-hidden w-80">
                    <div className="flex justify-between items-center bg-indigo-200 px-4 py-2">
                        <p className="text-indigo-800">Chatbot</p>
                        <button
                            onClick={closeChatbot}
                            className="text-indigo-800 hover:text-indigo-600 focus:outline-none"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>
                    <div className="border-b border-indigo-200 p-4 h-[400px] overflow-y-auto">
                        {messages.map((msg, index) => (
                            <div key={index} className={`flex mb-2 ${msg.author === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`rounded-lg px-4 py-2 ${msg.author === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start items-center">
                                <div className="animate-ping rounded-full h-4 w-4 bg-blue-500 mr-2" />
                                <p className="text-gray-600">Escribiendo...</p>
                            </div>
                        )}
                    </div>
                    <form onSubmit={sendMessage} className="border-t border-indigo-200 p-4 flex">
                        <input
                            type="text"
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            className="flex-1 mr-2 p-2 border rounded-md focus:outline-none"
                            placeholder="Escribe tu mensaje aquí..."
                        />
                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none"
                        >
                            Enviar
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Chatbot;
