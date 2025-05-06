FROM python:3.13

WORKDIR /app

ENV POETRY_HOME="/opt/poetry" \
    POETRY_VIRTUALENVS_IN_PROJECT=1 \
    POETRY_NO_INTERACTION=1

ENV PATH="$POETRY_HOME/bin:$PATH"

RUN curl -sSL https://install.python-poetry.org | python3 -

COPY poetry.lock pyproject.toml ./
COPY .env ./.env
COPY questbot/ ./questbot
COPY questbot_db/ ./questbot_db

RUN poetry install --no-root --no-ansi --without dev

ENTRYPOINT poetry run python -m questbot.main
