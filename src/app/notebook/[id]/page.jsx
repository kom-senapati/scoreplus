"use client";
import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { marked } from 'marked'; // This is the usual syntax for importing a default export
import { Comment } from 'react-loader-spinner'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Quiz from "@/components/ui/quiz";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function page({ params }) {

  const [message, setMessage] = useState("");
  const [ContentData, setContentData] = useState("");
  const [reqSend, setReqSend] = useState(false);

  // Handling API call of Content

  const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

  // Function to get Content Data
  async function getContent() {
    setReqSend(true);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = message;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    setContentData(marked(text));
    console.log(response);
    setReqSend(false);
  }
  // TO render markdown content
  const MarkdownRenderer = ({ content }) => {
    return (
      <div
        className="content"
        dangerouslySetInnerHTML={{ __html: content }}
      ></div>
    );
  };

  return (
    <div>
      <div className="flex flex-col min-h-screen w-full text-white bg-slate-800">
        <div className="flex">
          <Tabs defaultValue="content" className="pt-5 px-10">
            <TabsList>
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="quiz">Quiz</TabsTrigger>
            </TabsList>

            {/* Content tab here */}
            <TabsContent value="content" className="w-full">
              <div className="border-2 border-white rounded-xl">
                <div className="h-[65vh] md:min-w-[91vw] m-3 overflow-y-scroll no-scrollbar">
                  {ContentData ? (
                    <div className="flex gap-3 w-full">
                      <Avatar className="sticky top-0 left-0 z-10">
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>AI</AvatarFallback>
                      </Avatar>
                      <div className="bg-gray-950 p-5 rounded-lg w-fit">
                        <MarkdownRenderer content={ContentData} />
                      </div>
                    </div>
                  ) : (
                    <div className="text-center text-white min-w-full">Ask Anything..</div>
                  )}
                </div>

                <form onSubmit={(e) => {
                  e.preventDefault();
                  getContent();
                }} className="flex justify-around items-center sticky px-4 pb-1 gap-2 w-full">
                  <Input
                    value={message}
                    onChange={(e) => { setMessage(e.target.value); }}
                    type="text"
                    id="toggle"
                    className="text-black w-full"
                  />
                  {
                    reqSend ? (
                      <Button
                        type="submit"
                        disabled
                        className="py-6"
                      >
                        <Comment
                          visible={true}
                          ariaLabel="comment-loading"
                          wrapperStyle={{}}
                          wrapperClass="comment-wrapper"
                          backgroundColor="transparent"
                          color="white"
                        />
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        className="py-6"
                      >
                        Ask the topic
                      </Button>
                    )
                  }
                </form>
              </div>
            </TabsContent>


            {/* Quiz tab here */}
            <TabsContent
              value="quiz"
              className="flex flex-col gap-10 p-3"
            >
              <Quiz message={message} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
