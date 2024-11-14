from flask import Blueprint, render_template, jsonify, request, redirect, url_for
import requests
from datetime import datetime, timedelta
from . import db
from .models.partner import Partner
from .models.vote import Vote, VoteOption
import time

main = Blueprint('main', __name__)

def get_bitcoin_data():
    try:
        response = requests.get('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true')
        data = response.json()['bitcoin']
        return {
            'price': data['usd'],
            'change_24h': data['usd_24h_change'],
            'volume': data['usd_24h_vol']
        }
    except Exception as e:
        print(f"Error fetching Bitcoin price: {e}")
        return {'price': 0, 'change_24h': 0, 'volume': 0}

# Dashboard
@main.route('/')
@main.route('/dashboard')
def dashboard():
    btc_data = get_bitcoin_data()
    partners = Partner.query.all()
    
    # Calculate totals
    total_btc = sum(partner.bitcoin_contribution for partner in partners)
    total_usd_invested = sum(partner.total_usd_contributed for partner in partners)
    monthly_team_total = sum(partner.monthly_usd_contribution for partner in partners)
    current_value = total_btc * btc_data['price']
    yearly_goal = monthly_team_total * 12
    
    # Calculate days until next contribution
    today = datetime.now()
    next_month = today.replace(day=28) + timedelta(days=4)
    next_contribution = next_month.replace(day=1)
    days_until_contribution = (next_contribution - today).days
    
    return render_template('dashboard.html',
                         btc_price=btc_data['price'],
                         btc_change_24h=btc_data['change_24h'],
                         total_btc=total_btc,
                         total_usd_invested=total_usd_invested,
                         current_value=current_value,
                         monthly_team_total=monthly_team_total,
                         yearly_goal=yearly_goal,
                         days_until_contribution=days_until_contribution,
                         partners=partners)

# Partner Management
@main.route('/partners')
def partners():
    partners = Partner.query.all()
    monthly_team_total = sum(p.monthly_usd_contribution for p in partners)
    return render_template('management/partners.html',
                         partners=partners,
                         monthly_team_total=monthly_team_total)

# Voting System
@main.route('/voting')
def voting():
    active_votes = Vote.query.filter_by(status='active').all()
    past_votes = Vote.query.filter(Vote.status != 'active').all()
    return render_template('management/voting.html',
                         active_votes=active_votes,
                         past_votes=past_votes)

# Investment Projections
@main.route('/projections')
def projections():
    try:
        response = requests.get('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd')
        btc_price = response.json()['bitcoin']['usd']
    except:
        btc_price = 40000  # Fallback price
    
    # Get current portfolio data
    partners = Partner.query.all()
    monthly_team_total = sum(p.monthly_usd_contribution for p in partners)
    total_btc = sum(p.bitcoin_contribution for p in partners)
    
    return render_template('investment/projections.html',
                         btc_price=btc_price,
                         monthly_team_total=monthly_team_total,
                         total_btc=total_btc)

# Helper function for Bitcoin price
def get_bitcoin_price():
    try:
        response = requests.get('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd')
        return response.json()['bitcoin']['usd']
    except:
        return 0

@main.route('/api/bitcoin-price')
def bitcoin_price_api():
    try:
        response = requests.get('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true')
        data = response.json()['bitcoin']
        return jsonify({
            'price': data['usd'],
            'change_24h': data['usd_24h_change']
        })
    except Exception as e:
        print(f"Error fetching Bitcoin price: {e}")
        return jsonify({
            'price': 0,
            'change_24h': 0
        })

@main.route('/votes/create', methods=['POST'])
def create_vote():
    title = request.form['title']
    description = request.form['description']
    expires_in = int(request.form['expires_in'])
    options = request.form.getlist('options[]')
    
    vote = Vote(
        title=title,
        description=description,
        expires_at=datetime.utcnow() + timedelta(days=expires_in)
    )
    
    db.session.add(vote)
    
    for option_text in options:
        option = VoteOption(vote=vote, text=option_text)
        db.session.add(option)
    
    db.session.commit()
    return redirect(url_for('main.voting'))

@main.route('/api/votes/cast', methods=['POST'])
def cast_vote():
    data = request.get_json()
    option = VoteOption.query.get(data['option_id'])
    if option:
        option.votes_count += 1
        db.session.commit()
        return jsonify({'success': True})
    return jsonify({'success': False})