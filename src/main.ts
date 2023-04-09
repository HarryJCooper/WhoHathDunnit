import './style.css';
import { OpenAIApi, Configuration } from 'openai';

const openai = new OpenAIApi(new Configuration({
    apiKey: import.meta.env.VITE_API_KEY
}));

const clickmeElement = document.querySelector<HTMLButtonElement>("#submit") ?? document.createElement("div");
const returnmessageElement = document.querySelector<HTMLDivElement>("#returnmessage") ?? document.createElement("div");
const textinputEl = document.querySelector<HTMLInputElement>("#textinput") ?? document.createElement("input");

const initialUserMessages = [
    {
        role: "system",
        content: "You are describing a murder mystery in the victorian era to a detective, there are four suspects, but don't tell the user who did it until they've asked at least five questions"
    },
    {
        role: "user",
        content: "Describe a murder mystery in the victorian era with four suspects, list all four suspects"
    }
];

const toggleInvisibleClass = (element: any) => {
    element.classList.toggle("invisible");
};

const createMessage = async (messages: any) => {
    toggleInvisibleClass(returnmessageElement);
    const message = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: messages,
    });
    toggleInvisibleClass(returnmessageElement);
    return message.data.choices[0].message?.content ?? "I don't know what to say";
};

const displayResponse = async (userMessages: any) => {
    const response = await createMessage(userMessages);
    userMessages.push({ role: "assistant", content: response });
    console.log(userMessages);
    returnmessageElement.innerText = response;
};

clickmeElement.addEventListener("click", async () => {
    const newUserMessage = { role: "user", content: textinputEl.value };
    initialUserMessages.push(newUserMessage);
    displayResponse(initialUserMessages);
	clickmeElement.innerText = "Ask me another";
});

displayResponse(initialUserMessages);
