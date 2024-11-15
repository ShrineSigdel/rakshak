from datetime import datetime

class Accident:
    def __init__(self, type:str,  latitude: float, longitude: float, frquency: int = 1, latest_update: datetime = datetime.utcnow()):
        self.type = type
        self.latitude = latitude
        self.longitude = longitude
        self.frquency = frquency
        self.latest_update = latest_update
