import { Message } from "@/types/index";
import { FC } from "react";
import { ChatInput } from "./ChatInput";
import { ChatLoader } from "./ChatLoader";
import { ChatMessage } from "./ChatMessage";
import { ResetChat } from "./ResetChat";

interface Props {
  messages: Message[];
  loading: boolean;
  onSend: (message: Message) => void;
  onReset: () => void;
}

export const Chat: FC<Props> = ({ messages, loading, onSend, onReset }) => {
  return (
    <section className="w-full">
      <div className="flex flex-row justify-between items-center mb-6">
        <ResetChat onReset={onReset} />
      </div>

      <div className="flex flex-col gap-2 rounded-2xl bg-white/80 shadow-lg px-4 py-6 sm:p-8 border border-neutral-200 max-h-[70vh] overflow-y-auto">
        {messages.map((message, index) => (
          <div key={index} className="transition-all duration-200">
            <ChatMessage message={message} />
          </div>
        ))}

        {loading && (
          <div className="my-2">
            <ChatLoader />
          </div>
        )}
      </div>

      <div className="mt-6">
        <ChatInput onSend={onSend} loading={loading} />
      </div>
    </section>
  );
};
