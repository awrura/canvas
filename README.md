![Static Badge](https://img.shields.io/badge/React-18.3.1-blue?logo=react)
![Static Badge](https://img.shields.io/badge/bootstrap-5.3.3-blue?logo=bootstrap)
![Static Badge](https://img.shields.io/badge/docker-25.0.4-blue?logo=docker)

# Клиент рисования

Представляет собой React приложение, для рисования пиксельных изображений для матрицы в браузере

## Сборка

Для сборки используется [Dockerfile](https://github.com/awrura/bridge/blob/main/docker/Dockerfile), поэтому сборка возможна через `Docker`. **Важно**, перед запуском `docker` контейнера необходимо создать и заполнить `.env` файл. Пример файла можно посмотреть в **`.env.example`**

## Жизненный цикл

При входе пользователю требуется залогиниться. После этого открывается панель выбора матрицы и рисования на ней. Информация о пользователе и его матрицах тянется с сервиса [hub](https://github.com/awrura/hub) По окончании рисования при нажатии на кнопку "Send" рисунок отобразиться на матрице. Для отправки используется плагин [bridge](https://github.com/awrura/bridge)

![image](https://github.com/user-attachments/assets/80350ee8-3a63-43f4-9a88-3e489b89b474)
