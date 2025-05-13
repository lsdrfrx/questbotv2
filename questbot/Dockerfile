FROM python:3.13

WORKDIR /app

ENV PYTHONFAULTHANDLER=1 \
  PYTHONUNBUFFERED=1 \
  PYTHONHASHSEED=random \
  PIP_NO_CACHE_DIR=off \
  PIP_DISABLE_PIP_VERSION_CHECK=on \
  PIP_DEFAULT_TIMEOUT=100 \
  POETRY_NO_INTERACTION=1 \
  POETRY_VIRTUALENVS_CREATE=false \
  POETRY_CACHE_DIR='/var/cache/pypoetry' \
  POETRY_HOME='/usr/local' \
  POETRY_VERSION=1.8.4

COPY poetry.lock pyproject.toml ./

ENV PATH="$POETRY_HOME/bin:$PATH"

RUN pip install "poetry==$POETRY_VERSION" --break-system-packages

COPY poetry.lock pyproject.toml ./
COPY .env ./.env
COPY questbot/ ./questbot

RUN poetry install --no-root --no-ansi

ENTRYPOINT poetry run python -m questbot.main
