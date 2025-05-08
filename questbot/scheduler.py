from datetime import datetime

from aiogram import Bot
from loguru import logger

from questbot.keyboards import build_quest_keyboard
from questbot.messages import quest_remind_message, quest_start_message
from questbot.services.quest import QuestService
from questbot.utils import parse_reminders, stringify_reminders


async def quests_lookup(bot: Bot):
    quest_service = QuestService()

    # Discard all ignored quests
    for task in quest_service.watch_pending():
        quest = task["quest"]

        await bot.send_message(
            int(task["message"].chat.id),
            text=f"Время на ответ на вопросы по квесту {quest.questName} вышло.",
        )
        recepients = [quest.questioner.tgId]
        recepients.extend(list(map(lambda x: x.tgId, quest.recepientChats)))
        recepients.extend(list(map(lambda x: x.tgId, quest.recepientEmployees)))

        for tg_id in set(recepients):
            await bot.send_message(
                text=f"""
{quest.employee.usernameShort} проигнорировал ответ на вопросы по квесту {quest.questName}.
""",
                chat_id=tg_id,
            )

        if quest.timeIncrement is not None:
            delta = parse_reminders(quest.timeIncrement)

            assert delta
            next_time = datetime.now() + delta[0]

            result = quest_service.modify(
                quest.id,
                {
                    "inProgress": False,
                    "nextTime": next_time.strftime("%m-%d-%Y %H:%M"),
                },
            )
            if result is None:
                logger.error("something went wrong on quest modifying")

        else:
            for tg_id in set(recepients):
                await bot.send_message(
                    text=f"""
    Переменная timeIncrement не назначена. Требуется ручное указание даты следующего ответа по квесту.
    """,
                    chat_id=tg_id,
                )

            result = quest_service.modify(
                quest.id,
                {
                    "inProgress": False,
                    "nextTime": None,
                },
            )
            if result is None:
                logger.error("something went wrong on modifying quest")

    # Query quest list
    quests = quest_service.all()
    assert quests is not None

    for questId in map(lambda x: x.id, quests):

        # Get all data of specified quest by ID
        quest = quest_service.by_id(questId)
        assert quest is not None

        # Skip quest if nextTime is not specified
        if quest.nextTime is None or quest.nextTime == "":
            continue

        next_time = datetime.fromisoformat(quest.nextTime).replace(tzinfo=None)

        # Send remind notification
        reminders = parse_reminders(quest.reminders)

        if reminders is not None:
            # If quest is for active employee
            if quest.employee.active:
                for j, reminder in enumerate(reversed(sorted(reminders))):
                    if next_time - reminder < datetime.now():
                        await bot.send_message(
                            int(quest.employee.tgId),
                            text=quest_remind_message.format(
                                days=reminder.days,
                                next_time=next_time,
                                questioner_name=quest.questioner.usernameShort,
                                project_name=quest.questName,
                                deadline=quest.deadline,
                                comment=quest.comment,
                                time_to_answer=quest.timeToAnswer,
                                questions="-" + "\n-".join(quest.questions),
                            ),
                        )
                        logger.info(
                            f"send notification to {quest.employee.usernameShort} by quest {quest.questName} with reminder {reminder}"
                        )

                        rems = reminders.copy()
                        rems.pop(j)
                        rems = stringify_reminders(rems)

                        result = quest_service.modify(quest.id, {"reminders": rems})
                        if result is None:
                            logger.error("something went wrong on modifying quest")

        # Start quest
        if next_time < datetime.now() and not quest.inProgress:
            message = await bot.send_message(
                quest.employee.tgId,
                text=quest_start_message.format(
                    questioner_name=quest.questioner.usernameShort,
                    project_name=quest.questName,
                    comment=quest.comment,
                    time_to_answer=quest.timeToAnswer,
                    questions="-" + "\n-".join(quest.questions),
                ),
                reply_markup=build_quest_keyboard(quest),
            )

            quest_service.set_pending(quest=quest, message=message)

            logger.info(
                f"send start quest message to {quest.employee.usernameShort} by quest {quest.questName}"
            )

            result = quest_service.toggle_progress(quest.id)
            if result is None:
                logger.error("something went wrong on toggling quest progress")
