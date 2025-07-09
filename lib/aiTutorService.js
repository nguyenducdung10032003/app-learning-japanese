// src/lib/aiTutorService.js
import { GROQ_API_KEY } from '@env';

export const generateAIResponse = async (messages, grammarFocus) => {

  try {
    const systemPrompt = `
      Bạn là trợ giảng tiếng Nhật hữu ích. Hãy giúp người dùng thực hành ngữ pháp tiếng Nhật qua hội thoại.
      
      Tập trung vào các mẫu ngữ pháp: ${grammarFocus.join(", ")}
      
      Nguyên tắc:
      - Giữ câu trả lời ngắn gọn (1-3 câu)
      - Sử dụng tiếng Nhật tự nhiên, giao tiếp
      - Bao gồm bản dịch tiếng Anh trong ngoặc đơn sau câu tiếng Nhật
      - Nhẹ nhàng sửa lỗi ngữ pháp nếu người dùng mắc lỗi
      - Khuyến khích người dùng sử dụng các mẫu ngữ pháp mục tiêu
      - Nếu người dùng viết bằng tiếng Anh, hãy trả lời bằng tiếng Nhật đơn giản kèm bản dịch tiếng Anh
    `;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        messages: [
          { role: "system", content: systemPrompt },
          ...messages.map(msg => ({
            role: msg.role,
            content: msg.content
          }))
        ],
        model: "llama3-8b-8192",
        temperature: 0.7,
        max_tokens: 200
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || `API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || 
      "申し訳ありません、応答を生成できませんでした。\n(Sorry, I couldn't generate a response.)";
  } catch (error) {
    console.error("Groq API Error:", error);
    return "すみません、エラーが発生しました。もう一度お試しください。\n(Sorry, an error occurred. Please try again.)";
  }
};