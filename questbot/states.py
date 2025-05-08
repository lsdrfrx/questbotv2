from aiogram.fsm.state import State, StatesGroup


class HelpState(StatesGroup):
    presets = State()
    other = State()


class QuestAnswerState(StatesGroup):
    progress = State()
    next_time = State()


class QuestRescheduleState(StatesGroup):
    reason = State()
    date = State()


class PollAnswerState(StatesGroup):
    pass
