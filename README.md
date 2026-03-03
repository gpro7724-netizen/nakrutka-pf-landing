# Сайт по сеошке (Agressor)

Одностраничный лендинг для сервиса накрутки поведенческих факторов в Яндекс.

## Запуск локально

Откройте `index.html` в браузере или поднимите локальный сервер:

```bash
npx serve .
# или
python -m http.server 8080
```

## Деплой на Vercel (и заявки в Telegram)

1. Установите [Vercel CLI](https://vercel.com/docs/cli) и выполните `vercel` в папке проекта.
2. В настройках проекта (Vercel Dashboard → Project → Settings → Environment Variables) добавьте:
   - `TELEGRAM_BOT_TOKEN` — токен бота от [@BotFather](https://t.me/BotFather).
   - `TELEGRAM_CHAT_ID` — числовой ID чата, куда слать заявки (ваш личный: напишите боту [@userinfobot](https://t.me/userinfobot), он покажет ваш ID).
3. После деплоя форма будет отправлять POST на `https://ваш-домен.vercel.app/api/send-lead`.

Если деплой без Vercel (только статика): замените в `js/main.js` переменную `API_LEAD` на URL вашей serverless-функции или используйте сервис типа Formspree с webhook в Telegram.

## Структура

- `index.html` — разметка всех блоков
- `css/styles.css` — стили, Mobile First
- `js/main.js` — формы, бургер-меню, плавный скролл
- `api/send-lead.js` — serverless для отправки заявок в Telegram
- `img/logo.svg` — логотип Agressor
- `assets/favicon.svg` — фавикон

## Контакт для заявок

Telegram: [@pashninburgers1](https://t.me/pashninburgers1)
