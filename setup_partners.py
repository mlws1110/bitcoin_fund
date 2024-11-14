from app import create_app, db
from app.models.partner import Partner
from datetime import datetime

def setup_partners():
    app = create_app()
    with app.app_context():
        # Clear existing partners
        Partner.query.delete()
        
        # Add all partners with equal ownership
        partners = [
            Partner(
                name="Equiano Stewart",
                email="equiano@bitcoinholdings.com",
                monthly_usd_contribution=100.0,
                ownership_percentage=12.5,
                joined_date=datetime.utcnow()
            ),
            Partner(
                name="Michael Williams",
                email="michael@bitcoinholdings.com",
                monthly_usd_contribution=100.0,
                ownership_percentage=12.5,
                joined_date=datetime.utcnow()
            ),
            Partner(
                name="Christopher Mosley",
                email="christopher@bitcoinholdings.com",
                monthly_usd_contribution=100.0,
                ownership_percentage=12.5,
                joined_date=datetime.utcnow()
            ),
            Partner(
                name="Trevor Morgan",
                email="trevor@bitcoinholdings.com",
                monthly_usd_contribution=100.0,
                ownership_percentage=12.5,
                joined_date=datetime.utcnow()
            ),
            Partner(
                name="Marquise Williams",
                email="marquise@bitcoinholdings.com",
                monthly_usd_contribution=100.0,
                ownership_percentage=12.5,
                joined_date=datetime.utcnow()
            ),
            Partner(
                name="Paul Campbell",
                email="paul@bitcoinholdings.com",
                monthly_usd_contribution=100.0,
                ownership_percentage=12.5,
                joined_date=datetime.utcnow()
            ),
            Partner(
                name="James Mitchell",
                email="james@bitcoinholdings.com",
                monthly_usd_contribution=100.0,
                ownership_percentage=12.5,
                joined_date=datetime.utcnow()
            ),
            Partner(
                name="Jamall Moss",
                email="jamall@bitcoinholdings.com",
                monthly_usd_contribution=100.0,
                ownership_percentage=12.5,
                joined_date=datetime.utcnow()
            )
        ]
        
        # Add all partners to the database
        db.session.add_all(partners)
        db.session.commit()
        print("All partners added successfully!")
        
        # Print confirmation of added partners
        for partner in partners:
            print(f"Added: {partner.name}")

if __name__ == "__main__":
    setup_partners() 