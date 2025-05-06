import asyncio
import datetime
import os
import sys

import httpx
import schedule
from aiogram import Bot, Dispatcher
from aiogram.types import InlineKeyboardButton, InlineKeyboardMarkup
from box import Box
from dotenv import load_dotenv
from loguru import logger

from questbot.src.router import router
from questbot.src.utils import parse_reminders, stringify_reminders

load_dotenv()

JWT_TOKEN = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NDU4NTE3NTIyMDEsInVzZXJuYW1lIjoibHNkcmZyeCIsImlhdCI6MTc0NTg1MTE0N30.8Tew4eLodc13DkyYwmLDeQd6EyNmg6QdtHsUAjAohJ8"


def quests_lookup(bot: Bot):
    quests = httpx.get(
        "http://localhost:3000/quests",
        headers={"Authorization": JWT_TOKEN},
    )
    data = list(map(lambda x: Box(x), quests.json()))
    for i, questId in enumerate(data):
        quest = httpx.get(
            f"http://localhost:3000/quests/{questId.id}",
            headers={"Authorization": JWT_TOKEN},
        )

        quest = Box(quest.json())
        logger.info(quest)

        try:
            reminders = parse_reminders(quest.reminders)
        except ValueError:
            logger.info(f"Unable to parse reminders: {quest.reminders}")
            continue

        if quest.employee.active:
            for j, reminder in enumerate(reversed(sorted(reminders))):
                if quest.next_time - reminder < datetime.datetime.now():
                    message = f"""Напоминаю: через {reminder.days} дней, в {quest.next_time}, по поручению {quest.questioner.questioner_name} я задам вопросы по проекту {quest.project.project_name}.

Дедлайн по связанной с вопросами задаче: {quest.deadline}

Комментарий к вопросам: {quest.comment}.
Для ответа на вопросы у вас будет 40 минут.

Список вопросов:
{"\n".join([f"- {question}" for question in quest.questions])}"""

                    _ = bot.send_message(quest.employee.tgId, text=message)
                    rems = reminders.copy()
                    rems.pop(j)
                    quest.reminders = stringify_reminders(rems)
                    # db.commit()

        if quest.nextTime < datetime.datetime.now() and not quest.inProgress:
            message = f"""
По поручению {quest.questioner.name} задаю следующие вопросы по проекту {quest.project.name} с комментарием {quest.comment}, для ответа на которые у вас есть 40 минут.
{"\n".join([f"- {question}" for question in quest.questions])}
            """

            _ = bot.send_message(
                quest.employee.tgId,
                text=message,
                reply_markup=InlineKeyboardMarkup(
                    inline_keyboard=[
                        (
                            [
                                InlineKeyboardButton(
                                    text="Начать",
                                    callback_data=f"start_quest:{quest.id}",
                                ),
                                InlineKeyboardButton(
                                    text="Перенести",
                                    callback_data=f"reschedule_quest:{quest.id}",
                                ),
                            ]
                            if quest.timeSetByUser
                            else [
                                InlineKeyboardButton(
                                    text="Начать",
                                    callback_data=f"start_quest:{quest.id}",
                                ),
                            ]
                        ),
                        [
                            InlineKeyboardButton(
                                text="Нужен созвон",
                                callback_data=f"need_meeting:{quest.id}",
                            ),
                        ],
                    ]
                ),
            )
            quest.in_progress = True
            # db.commit()


async def main() -> None:
    logger.info("initialize routers")
    dp = Dispatcher()
    dp.include_router(router)

    logger.info("start polling")
    await dp.start_polling(bot)


async def scheduler():
    while True:
        schedule.run_pending()
        await asyncio.sleep(1)


def check_exceptions(task):
    try:
        _ = task.result()
    except Exception as e:
        raise e


if __name__ == "__main__":
    logger.info("attempt to read token")
    TOKEN = os.getenv("BOT_TOKEN", "")
    if len(TOKEN) == 0:
        logger.error("unable to read token")
        sys.exit(-1)

    bot = Bot(token=TOKEN)
    schedule.every(5).seconds.do(quests_lookup, bot=bot)

    loop = asyncio.new_event_loop()
    scheduler_task = loop.create_task(scheduler())
    scheduler_task.add_done_callback(check_exceptions)
    bot_task = loop.create_task(main())

    loop.run_forever()

    # asyncio.run(main())
