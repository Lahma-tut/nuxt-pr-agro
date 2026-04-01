FROM nginx:alpine

# Удаляем дефолтный конфиг
RUN rm /etc/nginx/conf.d/default.conf

# Копируем наш конфиг
COPY nginx.conf /etc/nginx/conf.d/app.conf

# Убираем проверку nginx -t, так как upstream хосты будут доступны только во время запуска
# RUN nginx -t  # Удаляем эту строку

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]