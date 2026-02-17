# Neon Market Mini App

Telegram Mini App интернет-магазина с неоновым тёмным интерфейсом:

- главная витрина товаров в 2 колонки (как в маркетплейсах);
- карточка товара с описанием и краткими характеристиками;
- кнопка возврата на главный экран;
- поддержка внешней ссылки на маркетплейс (`marketplace_url`).

## 1) Запуск проекта

```bash
npm install
npm run dev
```

Откройте: `http://localhost:3000`

## 2) Настройка Supabase (опционально)

Если переменные окружения не заданы, приложение работает на демо-товарах.

Создайте `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY
```

Пример SQL таблицы:

```sql
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  price numeric not null default 0,
  image text not null,
  short_specs jsonb,
  marketplace_url text,
  created_at timestamptz not null default now()
);
```

Пример `short_specs`:

```json
["Объём: 500 мл", "Тип: натуральный", "Срок годности: 12 мес"]
```

## 3) Подключение Mini App к Telegram-боту (подробно)

### Шаг 1. Подготовьте production URL

Telegram Mini App открывается только по HTTPS.
Разверните проект (например, на Vercel) и получите URL вида:

`https://your-mini-app-domain.com`

### Шаг 2. Создайте бота в BotFather

1. Откройте `@BotFather`.
2. Команда: `/newbot`
3. Укажите имя и username бота.
4. Сохраните токен (`BOT_TOKEN`) в безопасном месте.

### Шаг 3. Привяжите Web App через menu button

1. В `@BotFather`: `/mybots` -> выберите бота.
2. `Bot Settings` -> `Menu Button` -> `Configure menu button`.
3. Введите:
   - текст кнопки, например: `Открыть магазин`;
   - URL: `https://your-mini-app-domain.com`.

После этого в чате с ботом появится постоянная кнопка запуска Mini App.

### Шаг 4. Создайте App Link (рекомендуется)

1. Команда: `/newapp`
2. Выберите бота.
3. Укажите:
   - название приложения;
   - short name;
   - описание;
   - ссылку на иконку (если запросит);
   - URL Mini App.
4. Получите ссылку вида:
   - `https://t.me/<bot_username>/<app_short_name>`

Её удобно публиковать в канале и рекламе.

### Шаг 5. Подключите Mini App к каналу

1. Добавьте бота в администраторы канала (право публикации постов).
2. Опубликуйте в канале:
   - прямую ссылку `https://t.me/<bot_username>/<app_short_name>`, или
   - сообщение с inline-кнопкой Web App через Bot API.

Пример API-запроса с кнопкой:

```bash
curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/sendMessage" \
  -H "Content-Type: application/json" \
  -d '{
    "chat_id":"@your_channel_username",
    "text":"Открыть магазин",
    "reply_markup":{
      "inline_keyboard":[
        [{"text":"Перейти в Mini App","web_app":{"url":"https://your-mini-app-domain.com"}}]
      ]
    }
  }'
```

### Шаг 6. Проверка

1. Откройте Mini App из меню бота.
2. Откройте Mini App из поста канала.
3. Проверьте:
   - каталог товаров;
   - переход в карточку товара;
   - кнопку возврата в главное меню;
   - внешнюю ссылку маркетплейса в карточке.

## 4) Где редактировать товары

В таблице `products`:

- `title` — название;
- `price` — цена;
- `image` — ссылка на изображение;
- `description` — описание;
- `short_specs` — краткие характеристики;
- `marketplace_url` — внешняя ссылка на товар (WB/Ozon/ЯМ и др.).

Если `marketplace_url` пустой, в карточке будет подсказка, что ссылку можно подключить.
