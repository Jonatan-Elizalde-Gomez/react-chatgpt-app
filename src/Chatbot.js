import React, { useState } from 'react';
import axios from 'axios';

const Chatbot = () => {
    const [messages, setMessages] = useState([]);
    const [userInput, setUserInput] = useState('');
    const sendMessage = async (e) => {
        e.preventDefault();
        const userMessage = userInput;
        if (!userMessage.trim()) return;
        const newMessages = [...messages, { author: "user", text: userMessage }];
        setMessages(newMessages);
        setUserInput('');

        try {
            const response = await axios.post(
                "https://api.openai.com/v1/completions",
                {
                    model: "text-davinci-003", // Cambia esto por tu modelo GPT personalizado
                    prompt: userMessage,
                    temperature: 0.7,
                    max_tokens: 150,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
                    },
                }
            );

            setMessages([...newMessages, { author: "bot", text: response.data.choices[0].text.trim() }]);
        } catch (error) {
            console.error("Error al enviar mensaje:", error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
            <div className="bg-white shadow overflow-hidden sm:rounded-lg w-1/2">
                <div className="border-t border-gray-200 p-4">
                    {messages.map((msg, index) => (
                        <div key={index} className={`text-sm text-${msg.author === 'user' ? 'blue-500' : 'green-500'} mb-2`}>
                            {msg.text}
                        </div>
                    ))}
                </div>
                <form onSubmit={sendMessage} className="bg-gray-50 px-4 py-3 text-right">
                    <input
                        type="text"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        placeholder="Escribe tu mensaje aquí..."
                    />
                    <button
                        type="submit"
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mt-2"
                    >
                        Enviar
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Chatbot;