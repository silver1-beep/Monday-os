// api/chat.js
import Anthropic from '@anthropic-ai/sdk';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(500).json({ error: 'ANTHROPIC_API_KEY environment variable is not defined on the server.' });
  }

  const { messages, ownerTitle } = req.body || {};
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Invalid or missing messages array.' });
  }

  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const identityTitle = ownerTitle || 'Sir';

  try {
    const systemPrompt = `You are MONDAY, an advanced, ultra-intelligent AI assistant reminiscent of Marvel's J.A.R.V.I.S. framework. 
Your interface is a holographic tactical operating system. You address the user as ${identityTitle}. 
Be precise, highly capable, elegant, and slightly witty. Keep spoken responses crisp, punchy, and professional.

CRITICAL LOGIC: You have a long-term memory matrix. Pay close attention to personal preferences, names, or project details specified by ${identityTitle}. If they provide new facts about themselves, explicitly acknowledge that you have integrated it into your memory systems.`;

    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      system: systemPrompt,
      messages: messages.map(m => ({
        role: m.role === 'assistant' ? 'assistant' : 'user',
        content: m.content
      }))
    });

    const reply = response.content.filter(b => b.type === 'text').map(b => b.text).join('\n');
    return res.status(200).json({ reply });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}