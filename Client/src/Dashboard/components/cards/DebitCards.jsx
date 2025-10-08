import React from 'react'
import './DebitCards.css'
import card_img from '../../../assets/images/horizon-card.png'
import card from '../../../assets/icons/card.svg'
import transfer from '../../../assets/icons/transfer.svg'

const DebitCards = () => {
  return (
    <div className='debit-cards'>
        <img src={card_img} alt="Debit Card" />
        <div className="details">
            <p className='sub'>Card Balance</p>
            <p className='main'>₹39,800.02</p>
            <div className="btns">
                <div className="btn-history">
                        <img src={card} alt="Wallet" />
                        <p>History</p>
                </div>
                <div className="btn-transfer">
                    <img src={transfer} alt="Transfer" />
                    <p>Transfer</p>
                </div>
            </div>
        </div>
        
    </div>
  )
}

export default DebitCards