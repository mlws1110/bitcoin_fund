from app import db
from datetime import datetime

class BitcoinTransaction(db.Model):
    __tablename__ = 'bitcoin_transaction'
    
    id = db.Column(db.Integer, primary_key=True)
    partner_id = db.Column(db.Integer, db.ForeignKey('partner.id'), nullable=False)
    amount_btc = db.Column(db.Float, nullable=False)
    price_usd = db.Column(db.Float, nullable=False)
    transaction_type = db.Column(db.String(20), nullable=False)  # 'buy' or 'sell'
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f'<BitcoinTransaction {self.amount_btc} BTC at ${self.price_usd}>' 