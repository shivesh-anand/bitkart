import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { IChat, IMessage } from "@/types/chat";

const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:5000/api/v1",
  credentials: "include",
});

export const chatApiSlice = createApi({
  reducerPath: "chatApi",
  baseQuery,

  endpoints: (builder) => ({
    getChats: builder.query<IChat[], void>({
      query: () => "chats",
    }),
    getChatById: builder.query({
      query: (id) => `chats/${id}`,
    }),
    createChat: builder.mutation<IChat, { users: string[] }>({
      query: (chat) => ({
        url: "chats/create",
        method: "POST",
        body: chat,
      }),
    }),
    deleteChat: builder.mutation<void, string>({
      query: (id) => ({
        url: `chats/${id}`,
        method: "DELETE",
      }),
    }),
    getMessagesByChat: builder.query<IMessage[], string>({
      query: (chatId) => `messages/${chatId}/messages`,
    }),
    createMessage: builder.mutation<IMessage, Partial<IMessage>>({
      query: (message) => ({
        url: "messages/create",
        method: "POST",
        body: message,
      }),
    }),
    getMessageById: builder.query<IMessage, string>({
      query: (id) => `messages/${id}`,
    }),
    updateMessage: builder.mutation<IMessage, { id: string; content: string }>({
      query: ({ id, content }) => ({
        url: `messages/${id}`,
        method: "PUT",
        body: { content },
      }),
    }),
    deleteMessage: builder.mutation<void, string>({
      query: (id) => ({
        url: `messages/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetChatsQuery,
  useGetChatByIdQuery,
  useCreateChatMutation,
  useDeleteChatMutation,
  useGetMessagesByChatQuery,
  useCreateMessageMutation,
  useGetMessageByIdQuery,
  useUpdateMessageMutation,
  useDeleteMessageMutation,
} = chatApiSlice;
