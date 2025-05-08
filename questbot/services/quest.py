from datetime import datetime, timedelta

import httpx
from box import Box

from questbot.services.base import BaseService


class QuestService(BaseService):
    model_uri = "/quests"
    pending = []

    def toggle_progress(self, id: str | int) -> Box | None:
        quest = self.by_id(id)

        assert quest

        quest.inProgress = not quest.inProgress
        data = httpx.get(f"{self.url}/{id}/toggleProgress", headers=self.headers)
        if data.status_code == 200:
            data = Box(data.json())
            return data
        return None

    def set_pending(self, quest, message):
        self.pending.append(
            {
                "quest": quest,
                "message": message,
                "ttl": timedelta(seconds=quest.timeToAnswer),
                "start_time": datetime.now(),
            }
        )

    def watch_pending(self):
        for task in self.pending:
            if task["start_time"] + task["ttl"] >= datetime.now():
                yield task

    def finish_pending(self, quest_id: str | int):
        self.pending = list(filter(lambda x: x.id != quest_id))
