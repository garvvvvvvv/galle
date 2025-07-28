"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import "./blog.css";
const blogPosts = [
	{
		slug: "fragrance-trends-2025",
		title: "Fragrance Trends 2025: Scents That Will Define the Year",
		date: "July 25, 2025",
		image: "/perfume.jpg",
		desc: "Explore the top fragrance trends for 2025, from sustainable ingredients to bold new blends. Discover what scents will be everywhere this year and how to choose the perfect one for you.",
	},
	{
		slug: "choosing-signature-scent",
		title: "How to Choose Your Signature Scent: A Guide for Beginners",
		date: "July 20, 2025",
		image: "/perfume.jpg",
		desc: "Finding your signature scent can be overwhelming. We break down the process, from understanding fragrance families to testing perfumes the right way.",
	},
	{
		slug: "perfume-layering-tips",
		title: "Perfume Layering: Tips to Create a Unique Fragrance",
		date: "July 15, 2025",
		image: "/perfume.jpg",
		desc: "Learn the art of perfume layering to create a scent that’s uniquely yours. Our experts share their favorite combinations and dos and don’ts.",
	},
	{
		slug: "eco-friendly-perfume",
		title: "Why Eco-Friendly Perfume Matters in 2025",
		date: "July 10, 2025",
		image: "/perfume.jpg",
		desc: "Sustainability is more than a trend—it's a movement. Discover why eco-friendly perfumes are taking over and how to spot truly green fragrances.",
	},
];

export default function BlogIndex() {
	return (
		<main
			className="blog-listing-page"
			style={{
				background: "linear-gradient(90deg, #fff7f0 0%, #f7ece6 100%)",
				minHeight: "100vh",
				padding: "2.5rem 0",
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
			}}
		>
			<h1
				className="blog-title-main"
				style={{
					fontFamily: "Playfair Display, serif",
					fontWeight: 800,
					fontSize: "2.5rem",
					color: "#8B2E2E",
					marginBottom: "2.5rem",
					textAlign: "center",
				}}
			>
				GALLE Blog
			</h1>
			<div
				className="blog-list"
				style={{
					display: "grid",
					gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
					gap: "2.5rem",
					maxWidth: 1200,
					width: "100%",
					margin: "0 auto",
					padding: "0 2rem",
				}}
			>
				{blogPosts.map((post) => (
					<motion.div
						key={post.slug}
						initial={{ opacity: 0, y: 40 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.7, ease: "easeOut" }}
					>
						<Link
							href={`/blog/${post.slug}`}
							className="blog-card"
							style={{
								display: "flex",
								flexDirection: "column",
								background: "#fff",
								borderRadius: 16,
								boxShadow: "0 2px 12px rgba(80,60,40,0.07)",
								textDecoration: "none",
								color: "#241B19",
								overflow: "hidden",
								minHeight: 340,
								transition: "box-shadow 0.2s",
								border: "1px solid #f7ece6",
							}}
						>
							<img
								src={post.image}
								alt={post.title}
								className="blog-card-img zoom-on-hover"
								style={{
									width: "100%",
									height: 220,
									objectFit: "cover",
									borderBottom: "1px solid #f7ece6",
								}}
							/>
							<div
								className="blog-card-content"
								style={{
									padding: "1.2rem 1.2rem 1.5rem 1.2rem",
									display: "flex",
									flexDirection: "column",
									gap: "0.7rem",
								}}
							>
								<div
									className="blog-card-date"
									style={{
										fontSize: "0.95rem",
										color: "#8B2E2E",
										fontWeight: 500,
									}}
								>
									{post.date}
								</div>
								<div
									className="blog-card-title"
									style={{
										fontSize: "1.3rem",
										fontWeight: 700,
										fontFamily: "Playfair Display, serif",
									}}
								>
									{post.title}
								</div>
								<div
									className="blog-card-desc"
									style={{
										fontSize: "1.05rem",
										color: "#412a1f",
										fontWeight: 400,
									}}
								>
									{post.desc}
								</div>
								<span
									className="blog-card-read"
									style={{
										color: "#A62639",
										fontWeight: 700,
										marginTop: "0.5rem",
										fontSize: "1.05rem",
									}}
								>
									Read More →
								</span>
							</div>
						</Link>
					</motion.div>
				))}
			</div>
		</main>
	);
}