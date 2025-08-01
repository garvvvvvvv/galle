"use client";
import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";

const testimonials = [
	{
		name: 'Simran D.',
		text: 'Galle perfumes are my new favorite! The scent lasts all day and feels luxurious.'
	},
	{
		name: 'Vikram P.',
		text: 'I gifted this to my wife and she loved it. The packaging is premium and delivery was quick.'
	},
	{
		name: 'Megha R.',
		text: 'I have sensitive skin and this perfume works perfectly for me. Highly recommended!'
	}
];

export default function Testimonials() {
	const [idx, setIdx] = useState(0);
	useEffect(() => {
		const timer = setInterval(() => {
			setIdx(i => (i + 1) % testimonials.length);
		}, 2000);
		return () => clearInterval(timer);
	}, []);

	return (
		<motion.section
			initial={{ opacity: 0, y: 40 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true }}
			transition={{ duration: 0.7, ease: "easeOut" }}
			style={{ margin: '2rem 0', padding: '1.5rem', background: '#f7ece6', borderRadius: 12, maxWidth: '1400px', alignContent: 'center', margin: 'auto', textAlign: 'center' }}
		>
			<h2 style={{ fontFamily: 'Playfair Display', fontWeight: 600, fontSize: '1.5rem', marginBottom: 16 }}>Testimonials</h2>
			<div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
				{testimonials.map((t, i) => (
					<motion.div
						key={i}
						initial={{ opacity: 0, scale: 0.96 }}
						animate={{ opacity: i === idx ? 1 : 0, scale: i === idx ? 1 : 0.96 }}
						transition={{ duration: 0.5, ease: "easeOut" }}
						style={{
							background: '#fff', borderRadius: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.07)', padding: 18, minWidth: 220, flex: 1, display: i === idx ? 'block' : 'none'
						}}
					>
						<img src="/pfp.svg" alt="profile-picture" srcset="" style={{ width: 88, height: 88 }} />
						<div style={{ fontWeight: 600, marginBottom: 6 }}>{t.name}</div>
						<div style={{ color: '#412a1f', fontWeight: 400 }}>{t.text}</div>
					</motion.div>
				))}
			</div>
		</motion.section>
	);
}
