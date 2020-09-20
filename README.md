# Анализатор лички ВКонтакте

## Как юзать

Необходимо иметь установленный [Node.js](https://nodejs.org/ru/) версии 14.0.0 или новее.

Выгрузить [архив с данными из ВК](https://vk.com/data_protection?section=rules#archive), распаковать в папку `/path/to/Archive` так, чтобы существовал файл `/path/to/Archive/index.html`.

*Вариант 1.* Если у вас установлен Git, склонировать репозиторий и перейти в папку:

```sh
git clone https://github.com/kiraind/vk-msg-stats.git
cd vk-msg-stats
```

*Вариант 2.* Скачать репозиторий как ZIP-архив, распаковать и в консоли перейти в папку:

```sh
cd path/to/vk-msg-stats-master
```

Установить зависимости:

```sh
npm i
```

Запустить парсинг сообщений:

```sh
npm run parse /path/to/Archive
```

Запускать различные анализаторы:

```sh
# проанализировать количества сообщений по дням с текстом "привет"
npm run find-message "привет"

# топ ваших сообщений
npm run top-your-messages

# топ использованных вами эмоджи
npm run top-your-emojis

# статистика количества сообщений в диалоге с кем-то по неделям
npm run weekly-words "Someone Else"

# статистика частотности слов
# от всех отправителей:
npm run word-frequency
# от конкретного отправителя (включая общие беседы)
npm run word-frequency "Someone Else"
# в своих сообщениях
npm run word-frequency "Вы"

# сравнение словарных запасов в диалоге
npm run vocab-compare "Someone Else"

# анализ количества сообщений по часам суток
npm run time-analyze "Someone Else"
```