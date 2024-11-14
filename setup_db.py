from app import create_app, db
from app.models.partner import Partner
from app.models.milestone import Milestone
from app.models.vote import Vote, VoteOption
from app.models.transaction import BitcoinTransaction
from datetime import datetime, timedelta

def setup_database():
    app = create_app()
    with app.app_context():
        # Drop all existing tables and create new ones
        db.drop_all()
        db.create_all()
        
        # Create the 8 partners
        partners = [
            Partner(
                name=f"Partner {i+1}", 
                email=f"partner{i+1}@example.com",
                monthly_usd_contribution=100.0,
                ownership_percentage=12.5,
                total_usd_contributed=0.0
            ) for i in range(8)
        ]
        
        # Add partners to database
        db.session.add_all(partners)
        
        # Create initial milestones
        milestones = [
            Milestone(
                title="First Bitcoin Goal",
                target_btc=1.0,
                target_date=datetime.now() + timedelta(days=365),
                achieved=False
            ),
            Milestone(
                title="Team 5 BTC Goal",
                target_btc=5.0,
                target_date=datetime.now() + timedelta(days=730),
                achieved=False
            )
        ]
        
        # Add milestones to database
        db.session.add_all(milestones)
        
        # Create sample vote
        sample_vote = Vote(
            title="Increase Monthly Contributions",
            description="Proposal to increase monthly contributions to $150 per partner",
            expires_at=datetime.now() + timedelta(days=7),
            status='active'
        )
        db.session.add(sample_vote)
        
        # Add vote options
        vote_options = [
            VoteOption(
                vote=sample_vote,
                text="Yes, increase to $150",
                votes_count=0
            ),
            VoteOption(
                vote=sample_vote,
                text="No, keep at $100",
                votes_count=0
            ),
            VoteOption(
                vote=sample_vote,
                text="Discuss at next meeting",
                votes_count=0
            )
        ]
        db.session.add_all(vote_options)
        
        db.session.commit()
        
        print("Database setup complete!")
        print("Added 8 partners with $100 monthly contributions each")
        print("Added initial milestones")
        print("Added sample vote")

if __name__ == "__main__":
    setup_database() 