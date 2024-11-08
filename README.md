# Birthday Bot
Бот для ежедневных и еженедельных уведомлений о предстоящих днях рождения.

## API

### `GET /`

Response:

``` json
{
  "service": "brainhub.birthday_bot",
  "instance": 1,
  "version": "1.0.0"
}
```

### `GET /notify-birthdays-today`

Send a notification with users whose birthday is today to the default channel:

Response:

``` json
{
  "success": true
}
```

### `GET /notify-birthdays-next-week`

Send a notification with users who have a birthday in the next 7 days(except today) to the default channel:

Response:

``` json
{
  "success": true
}
```
