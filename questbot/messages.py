quest_remind_message = """Напоминаю: через {days} дней, в {next_time}, по поручению {questioner_name} я задам вопросы по проекту {project_name}.

Дедлайн по связанной с вопросами задаче: {deadline}

Комментарий к вопросам: {comment}.
Для ответа на вопросы у вас будет {time_to_answer}.

Список вопросов:
{questions}"""


# quest_remind_message = """Напоминаю: через {reminder.days} дней, в {quest.nextTime}, по поручению {quest.questioner.name} я задам вопросы по проекту {quest.project.project_name}.

# Дедлайн по связанной с вопросами задаче: {quest.deadline}

# Комментарий к вопросам: {quest.comment}.
# Для ответа на вопросы у вас будет 40 минут.

# Список вопросов:
# {"\n".join([f"- {question}" for question in quest.questions])}"""

quest_start_message = """
По поручению {questioner_name} задаю следующие вопросы по проекту {project_name} с комментарием {comment}, для ответа на которые у вас есть {time_to_answer}.
{questions}"""

# quest_start_message = """
# По поручению {quest.questioner.name} задаю следующие вопросы по проекту {quest.project.name} с комментарием {quest.comment}, для ответа на которые у вас есть {time_to_answer}.
# {"\n".join([f"- {question}" for question in quest.questions])}"""
