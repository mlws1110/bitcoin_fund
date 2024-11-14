from app import db
from datetime import datetime

class Milestone(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    target_btc = db.Column(db.Float, nullable=False)
    target_date = db.Column(db.DateTime)
    achieved = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f'<Milestone {self.title}>' 