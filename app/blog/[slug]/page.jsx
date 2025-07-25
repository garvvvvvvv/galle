import { notFound } from "next/navigation";
import "../blog.css";

const blogPosts = {
  "fragrance-trends-2025": {
    title: "Fragrance Trends 2025: Scents That Will Define the Year",
    date: "July 25, 2025",
    image: "/perfume.jpg",
    content: (
      <>
        <p>2025 is shaping up to be a revolutionary year for fragrance lovers. From eco-conscious blends to bold, genderless scents, the world of perfume is evolving fast. Expect to see more natural ingredients, innovative packaging, and a focus on sustainability. Brands are experimenting with unexpected notes—think smoky tea, green fig, and even salty ocean air. Whether you love florals or crave something spicy, there’s a trend for everyone this year.</p>
        <p>Our top picks for 2025 include:</p>
        <ul>
          <li>Eco-friendly perfumes with biodegradable packaging</li>
          <li>Layered scents that evolve throughout the day</li>
          <li>Unisex fragrances with bold, unique notes</li>
        </ul>
        <p>Ready to discover your new signature scent? Explore our latest collection and stay ahead of the curve!</p>
      </>
    )
  },
  "choosing-signature-scent": {
    title: "How to Choose Your Signature Scent: A Guide for Beginners",
    date: "July 20, 2025",
    image: "/perfume.jpg",
    content: (
      <>
        <p>Choosing a signature scent can feel overwhelming, but it’s all about personal expression. Start by exploring different fragrance families: floral, woody, fresh, and oriental. Visit a store and test a few perfumes on your skin—let them settle for a few hours to see how they evolve. Don’t rush! Your signature scent should make you feel confident and happy every time you wear it.</p>
        <p>Tips for finding your scent:</p>
        <ul>
          <li>Test no more than 3-4 perfumes at a time</li>
          <li>Try samples at home for a few days</li>
          <li>Consider the season and your lifestyle</li>
        </ul>
        <p>Remember, the best scent is the one that feels uniquely you.</p>
      </>
    )
  },
  "perfume-layering-tips": {
    title: "Perfume Layering: Tips to Create a Unique Fragrance",
    date: "July 15, 2025",
    image: "/perfume.jpg",
    content: (
      <>
        <p>Perfume layering is the secret to a truly personal fragrance. Start with a base scent—something simple and clean. Add a second perfume with a complementary note, like vanilla or citrus. The key is to experiment: spray one on your wrists, the other on your neck, and see how they blend. Avoid mixing two very strong scents, and always test before wearing out.</p>
        <p>Layering ideas:</p>
        <ul>
          <li>Woody + floral for a romantic twist</li>
          <li>Citrus + musk for a fresh, modern vibe</li>
          <li>Spicy + vanilla for warmth and depth</li>
        </ul>
        <p>With a little creativity, you’ll craft a scent that’s all your own!</p>
      </>
    )
  },
  "eco-friendly-perfume": {
    title: "Why Eco-Friendly Perfume Matters in 2025",
    date: "July 10, 2025",
    image: "/perfume.jpg",
    content: (
      <>
        <p>Eco-friendly perfumes are more than a trend—they’re a necessity. In 2025, consumers are demanding transparency, clean ingredients, and sustainable packaging. Look for brands that use natural extracts, avoid harmful chemicals, and invest in recyclable materials. Not only are these perfumes better for the planet, but they’re also gentler on your skin.</p>
        <p>How to spot a green fragrance:</p>
        <ul>
          <li>Check for certifications (organic, cruelty-free, vegan)</li>
          <li>Read the ingredient list—avoid parabens and phthalates</li>
          <li>Support brands with eco-conscious values</li>
        </ul>
        <p>Make the switch to eco-friendly perfume and join the movement for a cleaner, greener future.</p>
      </>
    )
  }
};

export default function BlogPostPage({ params }) {
  const post = blogPosts[params.slug];
  if (!post) return notFound();
  return (
    <main className="blog-post-page">
      <h1 className="blog-post-title">{post.title}</h1>
      <div className="blog-post-date">{post.date}</div>
      <img src={post.image} alt={post.title} className="blog-post-img" />
      <div className="blog-post-content">{post.content}</div>
    </main>
  );
}
