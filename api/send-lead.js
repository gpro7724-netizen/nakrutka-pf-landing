/**
 * Vercel Serverless: приём заявки с лендинга и отправка в Telegram.
 * Переменные окружения: TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID
 * TELEGRAM_CHAT_ID — числовой ID чата (узнать: написать боту @userinfobot или получить через getUpdates после сообщения боту)
 */

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.error('TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID not set');
    res.status(500).json({ error: 'Server configuration error' });
    return;
  }

  let body;
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  } catch (e) {
    res.status(400).json({ error: 'Invalid JSON' });
    return;
  }

  const name = (body.name || '').trim();
  const contact = (body.contact || '').trim();

  if (!name || !contact) {
    res.status(400).json({ error: 'Name and contact are required' });
    return;
  }

  const text = [
    'Новая заявка с лендинга Agressor',
    '',
    'Имя: ' + name,
    'Контакт: ' + contact,
    '',
    'Ответить: https://t.me/pashninburgers1'
  ].join('\n');

  const url = `https://api.telegram.org/bot${token}/sendMessage`;
  const payload = {
    chat_id: chatId,
    text: text,
    disable_web_page_preview: true
  };

  try {
    const tgRes = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await tgRes.json();

    if (!data.ok) {
      console.error('Telegram API error:', data);
      res.status(502).json({ error: 'Failed to send to Telegram' });
      return;
    }

    res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};
