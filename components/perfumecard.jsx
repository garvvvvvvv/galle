"use client";

import React, { useEffect } from 'react';
import './perfumecard.css'
import { motion } from "framer-motion";
import { SpotlightButton } from './SpotlightButton'; // Adjust the import based on your file structure

const PerfumeCard = (props) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            whileHover={{ scale: 1.03, boxShadow: "0 8px 32px rgba(80,60,40,0.13)" }}
            whileTap={{ scale: 0.98 }}
        >
            <div className="perfumeCard">
                <img src={props.img} alt="Perfume" className="zoom-on-hover" />
                <h1 className="perfumeName">{props.title}</h1>
                <h3 className="perfumeDescription">This is a brief description of the perfume. It highlights the key notes and characteristics that make it unique.</h3>
                <div className="perfumeDetails">
                    <h2 className="perfumePrice">Rs.399</h2>
                    <h3 className="perfumeSize">30ml</h3>
                </div>
                <SpotlightButton
                  className="addToCartButton"
                >
                  Add to Cart
                </SpotlightButton>
            </div>
        </motion.div>
    )
}

export default PerfumeCard
