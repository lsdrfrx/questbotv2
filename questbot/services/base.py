import os

import httpx
from box import Box
from dotenv import load_dotenv

load_dotenv()


class BaseService:
    base_url = os.getenv("VITE_QUESTBOT_API_HOST")
    model_uri = ""

    headers = {
        "Auth-Type": "bot",
        "Authorization": f"Bearer {os.getenv('QUESTBOT_API_AUTH_BOT_SECRET')}",
    }

    def __init__(self):
        self.url = f"{self.base_url}{self.model_uri}"

    def all(self) -> list[Box] | None:
        data = httpx.get(self.url, headers=self.headers)
        if data.status_code == 200:
            data = list(map(lambda x: Box(x), data.json()))
            return data
        return None

    def by_id(self, id: str | int) -> Box | None:
        data = httpx.get(f"{self.url}/{id}", headers=self.headers)
        if data.status_code == 200:
            data = Box(data.json())
            return data
        return None

    def create(self, body) -> Box | None:
        data = httpx.post(self.url, headers=self.headers, data=body)
        if data.status_code == 200:
            data = Box(data.json())
            return data
        return None

    def delete(self, id) -> Box | None:
        data = httpx.delete(f"{self.url}/{id}", headers=self.headers)
        if data.status_code == 200:
            data = Box(data.json())
            return data
        return None

    def modify(self, id, body) -> Box | None:
        data = httpx.put(f"{self.url}/{id}", headers=self.headers, data=body)
        if data.status_code == 200:
            data = Box(data.json())
            return data
        return None
