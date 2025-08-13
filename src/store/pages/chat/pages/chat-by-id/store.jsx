import { create } from "zustand";
import axiosRequest from "@/lib/axiosRequest";

export const useChatById = create((set) => ({
  messages: [],
  getChatById: async (id) => {
    try {
      const { data } = await axiosRequest.get(
        `/Chat/get-chat-by-id?chatId=${id}`
      );
      set({ messages: data.data });
    } catch (error) {
      console.error(error);
    }
  },

  sendMessage: async (formData) => {
    await axiosRequest.put(`/Chat/send-message`, formData);
  },

  deleteMessage: async (id) => {
    await axiosRequest.delete(`/Chat/delete-message?massageId=${id}`);
  },

  deleteChat: async (id) => {
    await axiosRequest.delete(`/Chat/delete-chat?chatId=${id}`);
  },
}));

      // <div className="border-2 min-h-12 max-h-12 m-4 p-2 rounded-xl border-[#E2E8F0] flex justify-between gap-1 items-center">
      //   <button>
      //     <svg
      //       xmlns="http://www.w3.org/2000/svg"
      //       fill="none"
      //       viewBox="0 0 24 24"
      //       strokeWidth={1.5}
      //       stroke="currentColor"
      //       className="size-6 text-[#475569]"
      //     >
      //       <path
      //         strokeLinecap="round"
      //         strokeLinejoin="round"
      //         d="M15.182 15.182a4.5 4.5 0 0 1-6.364 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z"
      //       />
      //     </svg>
      //   </button>
      //   <form onSubmit={handleSend} className="flex gap-2">
      //     <input
      //       type="text"
      //       value={inpMessage}
      //       onChange={(e) => setinpMessage(e.target.value)}
      //       placeholder="Введите сообщение"
      //       className="border p-2 flex-1"
      //     />

      //     <label className="cursor-pointer">
      //       <input type="file" className="hidden" onChange={handleFileChange} />
      //       <svg
      //         xmlns="http://www.w3.org/2000/svg"
      //         fill="none"
      //         viewBox="0 0 24 24"
      //         strokeWidth={1.5}
      //         stroke="currentColor"
      //         className="w-8 h-8 text-blue-500"
      //       >
      //         <path
      //           strokeLinecap="round"
      //           strokeLinejoin="round"
      //           d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
      //         />
      //       </svg>
      //     </label>

      //     <button
      //       type="submit"
      //       className="bg-blue-500 text-white px-4 py-2 rounded"
      //     >
      //       Отправить
      //     </button>
      //   </form>
      //   {openImg && (
      //     <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      //       <div className="bg-white p-4 rounded">
      //         <img src={openImg} alt="preview" className="max-h-64 mb-4" />
      //         <button
      //           onClick={handleSend}
      //           className="bg-green-500 text-white px-4 py-2 rounded mr-2"
      //         >
      //           Отправить
      //         </button>
      //         <button
      //           onClick={() => {
      //             setinpFile(null);
      //             setOpenImg(null);
      //           }}
      //           className="bg-red-500 text-white px-4 py-2 rounded"
      //         >
      //           Отмена
      //         </button>
      //       </div>
      //     </div>
      //   )}
      // </div>