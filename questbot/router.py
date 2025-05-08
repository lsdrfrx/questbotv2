from datetime import datetime

from aiogram import Bot, F, Router
from aiogram.filters import Command, CommandStart
from aiogram.fsm.context import FSMContext
from aiogram.types import (CallbackQuery, KeyboardButton, Message,
                           ReplyKeyboardMarkup)
from loguru import logger

from questbot.keyboards import menu
from questbot.services.project import ProjectService
from questbot.services.quest import QuestService
from questbot.states import QuestAnswerState, QuestRescheduleState
from questbot.utils import parse_reminders

quest_service = QuestService()
project_service = ProjectService()

router = Router()


@router.message(CommandStart())
async def handle_start(message: Message):
    await message.answer("Старт")


@router.message(Command("menu"))
async def handle_menu(message: Message):
    await message.answer("Главное меню", reply_markup=menu)


# TODO: Make help handler great again

# @router.message(F.text == "Помощь")
# async def handle_help(
#     message: Message,
#     state: FSMContext,
# ):
#     presets = mongodb["variables"].find_one({"variable": "help_presets"})
#     if presets:
#         presets = presets["value"]

#     await message.answer(
#         text="Как мы можем вам помочь?",
#         reply_markup=kb.build_preset_keyboard(presets),
#     )
#     await state.set_state(HelpState.presets)


# @router.message(HelpState.presets)
# async def capture_answer(
#     message: Message,
#     state: FSMContext,
#     db: Session,
#     mongodb: Database,
#     bot: Bot,
# ):
#     if message.text == "Другая проблема...":
#         await message.answer(
#             text="Пожалуйста, опишите вашу проблему подробно.",
#             reply_markup=kb.clear,
#         )
#         await state.set_state(HelpState.other)
#     else:
#         await notify_hr(message, state, db, mongodb, bot)


# @router.message(HelpState.other)
# async def notify_hr(
#     message: Message,
#     state: FSMContext,
#     db: Session,
#     mongodb: Database,
#     bot: Bot,
# ):
#     hr_id = mongodb["variables"].find_one({"variable": "hr_id"})

#     assert hr_id
#     assert message.from_user

#     hr_id = hr_id["value"]

#     hr_user_name = db.query(User).filter(User.tg_id == hr_id).one().questioner_name

#     await message.answer(
#         f"Служба экстренной психологической помощи уже выезжает! Ждите письма от {hr_user_name}!"
#     )
#     await bot.send_message(
#         chat_id=hr_id,
#         text=f"Пользователь {message.from_user.username} обратился за помощью с сообщением:",
#     )
#     await bot.forward_message(
#         chat_id=hr_id,
#         from_chat_id=message.chat.id,
#         message_id=message.message_id,
#     )
#     await state.clear()


@router.callback_query(F.data.split(":")[0] == "start_quest")
async def start_quest(callback: CallbackQuery, state: FSMContext):
    await state.set_state(QuestAnswerState.progress)
    await callback.answer()
    assert callback.data
    assert callback.message
    quest_id = int(callback.data.split(":")[1])
    quest = quest_service.by_id(quest_id)

    assert quest

    await callback.message.answer(
        f"""По поручению {quest.questioner.usernameShort} задаю {len(quest.questions)} вопроса по проекту {quest.questName}. На них нужно ответить в течение {quest.timeToAnswer}. Обратите внимание: {quest.comment}."""
    )

    await state.set_data(
        {
            "idx": 0,
            "quest": quest,
            "answers": [[] for _ in range(len(quest.questions))],
        }
    )

    await callback.message.answer(
        f"Вопрос 1: {quest.questions[0]}",
        reply_markup=ReplyKeyboardMarkup(
            keyboard=[
                [KeyboardButton(text="Закончить ответ")],
            ],
            resize_keyboard=True,
            one_time_keyboard=True,
        ),
    )


@router.message(QuestAnswerState.progress)
async def get_answer(message: Message, state: FSMContext, bot: Bot):
    data = await state.get_data()

    if message.text == "Закончить ответ":
        if len(data["answers"][data["idx"]]) == 0:
            await message.answer(
                "Вы не ответили на вопрос. Убедитесь, что вы нажали Enter :)"
            )
            return

        data["idx"] += 1

        if data["idx"] == len(data["quest"].questions):
            await finish_quest(message, state, bot)
            return

        await message.answer(
            f"Спасибо!\n\n Вопрос {data["idx"] + 1}: {data["quest"].questions[data["idx"]]}"
        )
    else:
        data["answers"][data["idx"]].append(message)

    await state.set_data(data)


async def finish_quest(message: Message, state: FSMContext, bot: Bot):
    data = await state.get_data()
    quest_service.finish_pending(data["quest"]["id"])
    await state.set_state(QuestAnswerState.next_time)

    time_set_by_employee = data["quest"].timeSetByEmployee
    time_increment = data["quest"].timeIncrement

    if time_set_by_employee is True:
        await message.answer(
            """Спасибо!

    Когда вы будете готовы ответить на вопросы в следующий раз?
    Пожалуйста, отправьте сообщение в следующем формате:
    [число][единица],
    где единица может быть:
    - w (неделя)
    - d (день)
    - h (час)
    - m (минута)

    Пример: 7d. В таком случае я вернусь с этими вопросами через 7 дней."""
        )
    else:
        message.text = time_increment
        get_next_time(message, state, bot)


@router.message(QuestAnswerState.next_time)
async def get_next_time(message: Message, state: FSMContext, bot: Bot):
    data = await state.get_data()
    quest = data["quest"]

    assert message.text

    delta = parse_reminders(message.text)
    if delta is None:
        await message.answer(
            "Временной промежуток введен некорректно. Попробуйте еще раз."
        )
        return

    if len(delta) == 0:
        logger.error("Delta is empty")

    if quest.countdown is not None:
        quest.countdown -= 1
        if quest.countdown == 0:
            quest.active = False

    next_time = datetime.now() + delta[0]

    result = quest_service.modify(
        quest.id,
        {
            "nextTime": next_time.strftime("%m-%d-%Y %H:%M"),
            "inProgress": False,
        },
    )
    if result is None:
        logger.error("something went wrong on quest modifying")

    await state.clear()
    await message.answer(
        f"Спасибо! Я вернусь с этим квестом {next_time.strftime("%d.%m.%Y в %H:%M")}"
    )

    recepients = [quest.questioner.tgId]

    recepients.extend(list(map(lambda x: x.tgId, quest.recepientChats)))
    recepients.extend(list(map(lambda x: x.tgId, quest.recepientEmployees)))

    if quest.sendToProjectChat:
        recepients.append(quest.project.chat.tgId)
    if quest.sendToClubChat:
        recepients.append(quest.club.chat.tgId)
    if quest.sendToUpperProjects:
        projects = project_service.all()
        assert projects
        for id in map(lambda x: x.id, projects):
            project = project_service.by_id(id)
            assert project
            subproject = list(
                filter(lambda x: x.id == quest.project.id, project.subprojects)
            )
            if len(subproject) != 0:
                recepients.append(project.chat.tgId)

    if quest.sendToBureauChat:
        recepients.append(quest.bureau.chat.tgId)

    for tg_id in set(recepients):
        await bot.send_message(
            text=f"{quest.employee.usernameShort} закончил ответ на вопросы по квесту {quest.questName}. Ответы на вопросы следующие:",
            chat_id=tg_id,
        )
        for i, (question, answer) in enumerate(
            zip(quest.questions, data["answers"]),
            start=1,
        ):
            await bot.send_message(tg_id, f"Вопрос {i}: {question}")
            for msg in answer:
                await bot.forward_message(
                    chat_id=tg_id,
                    from_chat_id=msg.chat.id,
                    message_id=msg.message_id,
                )
        await bot.send_message(
            text=f"Следующий ответ по квесту {quest.questName} от пользователя {quest.employee.usernameShort} ожидается {next_time.strftime("%d.%m.%Y в %H:%M")}",
            chat_id=tg_id,
        )


@router.callback_query(F.data.split(":")[0] == "reschedule_quest")
async def reschedule_quest(callback: CallbackQuery, state: FSMContext):
    await callback.answer()
    assert callback.data
    assert callback.message
    quest_id = int(callback.data.split(":")[1])
    quest = quest_service.by_id(quest_id)

    assert quest

    await state.set_data({"quest": quest})

    await callback.message.answer(
        "Укажите причину переноса.",
        reply_markup=ReplyKeyboardMarkup(
            keyboard=[[KeyboardButton(text="Пропустить")]],
        ),
    )
    await state.set_state(QuestRescheduleState.reason)


@router.message(QuestRescheduleState.reason)
async def get_reschedule_reason(message: Message, state: FSMContext):
    data = await state.get_data()
    data["reason"] = "" if message.text == "Пропустить" else message.text
    await state.set_data(data)

    await message.answer(
        """
Когда вы будете готовы ответить на вопросы в следующий раз?
Пожалуйста, отправьте сообщение в следующем формате:
[число][единица],
где единица может быть:
- w (неделя)
- d (день)
- h (час)
- m (минута)

Пример: 7d. В таком случае я вернусь с этими вопросами через 7 дней.
"""
    )
    await state.set_state(QuestRescheduleState.date)


@router.message(QuestRescheduleState.date)
async def get_new_quest_date(
    message: Message,
    state: FSMContext,
    bot: Bot,
):
    data = await state.get_data()
    quest = data["quest"]

    assert message.text

    delta = parse_reminders(message.text)
    if delta == None:
        await message.answer(
            "Временной промежуток введен некорректно. Попробуйте еще раз."
        )
        return

    if len(delta) == 0:
        logger.error("Delta is empty")

    next_time = datetime.now() + delta[0]

    result = quest_service.modify(
        quest.id,
        {
            "nextTime": next_time.strftime("%m-%d-%Y %H:%M"),
            "inProgress": False,
        },
    )
    if result is None:
        logger.error("something went wrong on quest modifying")

    await state.clear()
    await message.answer(
        f"Спасибо! Я вернусь с этим квестом {next_time.strftime("%d.%m.%Y в %H:%M")}"
    )

    recepients = [quest.questioner.tgId]
    recepients.extend(list(map(lambda x: x.tgId, quest.recepientChats)))
    recepients.extend(list(map(lambda x: x.tgId, quest.recepientEmployees)))

    for tg_id in set(recepients):
        await bot.send_message(
            text=f"""
{quest.employee.usernameShort} перенес квест {quest.questName} на {next_time.strftime("%d.%m.%Y в %H:%M")}
Причина переноса{" не указана." if data["reason"] == "" else f": {data["reason"]}"}
""",
            chat_id=tg_id,
        )


@router.callback_query(F.data.split(":")[0] == "need_meeting")
async def need_meeting_for_quest(callback: CallbackQuery, bot: Bot):
    await callback.answer()

    assert callback.data

    quest_id = int(callback.data.split(":")[1])
    quest = quest_service.by_id(quest_id)

    assert quest

    recepients = [quest.questioner.tgId]
    recepients.extend(list(map(lambda x: x.tgId, quest.recepientChats)))
    recepients.extend(list(map(lambda x: x.tgId, quest.recepientEmployees)))

    for tg_id in set(recepients):
        await bot.send_message(
            text=f"""
{quest.employee.usernameShort} просит организовать созвон по квесту {quest.questName}!
""",
            chat_id=tg_id,
        )
        await callback.message.answer(
            """
Просьба об организации созвона была отправлена во все инстанции!
Ждите сообщение от вашего менеджера.
"""
        )
