from aiogram.types import (InlineKeyboardButton, InlineKeyboardMarkup,
                           KeyboardButton, ReplyKeyboardMarkup,
                           ReplyKeyboardRemove)

# TODO: remove keyboard button resizing
menu = ReplyKeyboardMarkup(
    keyboard=[
        [KeyboardButton(text="Помощь")],
    ],
    resize_keyboard=True,
    one_time_keyboard=True,
)


def build_preset_keyboard(preset_list):
    return ReplyKeyboardMarkup(
        keyboard=[[KeyboardButton(text=text)] for text in preset_list],
        # resize_keyboard=True,
        one_time_keyboard=True,
    )


def build_quest_keyboard(quest):
    return InlineKeyboardMarkup(
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
                if quest.timeSetByEmployee
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
    )


clear = ReplyKeyboardRemove()
