"use client";

import React, { useEffect } from 'react';
import './perfumecard.css'


const PerfumeCard = (props) => {

    return (
        <div>
            <div className="perfumeCard">
                <img src={props.img} alt="Perfume" />
                <h1 className="perfumeName">{props.title}</h1>
                <h3 className="perfumeDescription">This is a brief description of the perfume. It highlights the key notes and characteristics that make it unique.</h3>
                <div className="perfumeDetails">
                    <h2 className="perfumePrice">Rs.399</h2>
                    <h3 className="perfumeSize">30ml</h3>
                </div>
                <button className="addToCartButton">Add to Cart</button>
            </div>
        </div>
    )
}

export default PerfumeCard
