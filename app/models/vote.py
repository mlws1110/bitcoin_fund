from app import db
from datetime import datetime

class Vote(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    expires_at = db.Column(db.DateTime, nullable=False)
    status = db.Column(db.String(20), default='active')
    options = db.relationship('VoteOption', backref='vote', lazy=True)

class VoteOption(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    vote_id = db.Column(db.Integer, db.ForeignKey('vote.id'), nullable=False)
    text = db.Column(db.String(200), nullable=False)
    votes_count = db.Column(db.Integer, default=0) 