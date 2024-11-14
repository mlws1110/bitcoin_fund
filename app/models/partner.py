from app import db
from datetime import datetime

class Partner(db.Model):
    __tablename__ = 'partner'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    bitcoin_contribution = db.Column(db.Float, default=0.0)
    monthly_usd_contribution = db.Column(db.Float, default=100.0)
    ownership_percentage = db.Column(db.Float, default=12.5)
    total_usd_contributed = db.Column(db.Float, default=0.0)
    status = db.Column(db.String(20), default='Active')
    joined_date = db.Column(db.DateTime, default=datetime.utcnow)
    transactions = db.relationship('BitcoinTransaction', backref='partner', lazy=True)

    def __repr__(self):
        return f'<Partner {self.name}>'

    def calculate_btc_from_usd(self, btc_price):
        """Calculate BTC amount from USD contribution"""
        return self.monthly_usd_contribution / btc_price if btc_price > 0 else 0 

    def get_contribution_history(self):
        """Get monthly contribution history"""
        return BitcoinTransaction.query.filter_by(
            partner_id=self.id
        ).order_by(BitcoinTransaction.timestamp.desc()).all()

    def get_voting_participation(self):
        """Calculate voting participation rate"""
        total_votes = Vote.query.count()
        partner_votes = PartnerVote.query.filter_by(partner_id=self.id).count()
        return (partner_votes / total_votes * 100) if total_votes > 0 else 0