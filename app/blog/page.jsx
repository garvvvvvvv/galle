"use client";
import Link from "next/link";
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

  }
];

export default function BlogIndex() {
  return (
    <main className="blog-listing-page">
      <h1 className="blog-title-main">GALLE Blog</h1>
      <div className="blog-list">
        {blogPosts.map(post => (
          <Link href={`/blog/${post.slug}`} className="blog-card" key={post.slug}>
            <img src={post.image} alt={post.title} className="blog-card-img" />
            <div className="blog-card-content">
              <div className="blog-card-date">{post.date}</div>
              <div className="blog-card-title">{post.title}</div>
              <div className="blog-card-desc">{post.desc}</div>
              <span className="blog-card-read">Read More →</span>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}