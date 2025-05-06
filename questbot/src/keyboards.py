from aiogram.types import (
    InlineKeyboardMarkup,
    KeyboardButton,
    ReplyKeyboardMarkup,
    ReplyKeyboardRemove,
)


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


clear = ReplyKeyboardRemove()
