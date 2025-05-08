import asyncio
import os
import sys

from aiogram import Bot, Dispatcher
from dotenv import load_dotenv
from loguru import logger

from questbot.router import router
from questbot.scheduler import quests_lookup

load_dotenv()


async def main() -> None:
    logger.info("initialize routers")
    dp = Dispatcher()
    dp.include_router(router)

    logger.info("start polling")
    await dp.start_polling(bot)


async def scheduler(bot):
    while True:
        await quests_lookup(bot)
        await asyncio.sleep(5)


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

    loop = asyncio.new_event_loop()

    scheduler_task = loop.create_task(scheduler(bot))
    scheduler_task.add_done_callback(check_exceptions)

    bot_task = loop.create_task(main())

    loop.run_forever()
