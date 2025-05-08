from datetime import timedelta


def stringify_reminders(reminders: list[timedelta]) -> str:
    """
    Encode reminders list to string
    """

    result = []

    for reminder in reversed(sorted(reminders)):
        if timedelta(weeks=reminder.days) == reminder:
            result.append(f"{reminder.days // 7}w")
        elif timedelta(days=reminder.days) == reminder:
            result.append(f"{reminder.days}d")
        elif timedelta(hours=reminder.seconds // 3600) == reminder:
            result.append(f"{reminder.seconds // 3600}h")
        elif timedelta(minutes=reminder.seconds // 60) == reminder:
            result.append(f"{reminder.seconds // 60}m")

    return ",".join(result)


def parse_reminders(reminders: str) -> list[timedelta] | None:
    """
    Parse reminders string (i.e. `"7d, 1d,3h,15m"`) to list of `timedelta`
    """

    try:
        reminders = reminders.lower()
        reminders = reminders.replace(" ", "")
    except AttributeError:
        return None

    result = []

    for reminder in reminders.split(","):
        if reminder == "":
            continue
        try:
            value, unit = int(reminder[:-1]), reminder[-1]
        except ValueError:
            return None

        match unit:
            case "w":
                result.append(timedelta(weeks=value))
            case "d":
                result.append(timedelta(days=value))
            case "h":
                result.append(timedelta(hours=value))
            case "m":
                result.append(timedelta(minutes=value))
            case _:
                return None

    return result
