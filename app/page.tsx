"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Category = "all" | "RICE" | "NOODLE" | "JAPANESE" | "THAI" | "KOREAN" | "HOTPOT" | "DESSERT" | "OTHER";
type SortOption = "rating" | "name";
type Restaurant = { id: string; name: string; category: string; address: string; phone: string | null; rating: number | null; priceRange: string | null; imageUrl: string | null; websiteUrl: string | null; menuUrl: string | null; orderUrl: string | null; googleMapsUrl: string | null; description: string | null };
const categories: { label: string; value: Category; icon: string }[] = [
  { label: "全部", value: "all", icon: "✦" }, { label: "飯", value: "RICE", icon: "🍚" }, { label: "麵", value: "NOODLE", icon: "🍜" }, { label: "日式", value: "JAPANESE", icon: "🍣" }, { label: "泰式", value: "THAI", icon: "🌶" }, { label: "韓式", value: "KOREAN", icon: "🥢" }, { label: "火鍋", value: "HOTPOT", icon: "🍲" }, { label: "甜點", value: "DESSERT", icon: "🍮" }, { label: "其他", value: "OTHER", icon: "🍽" },
];
const categoryLabels: Record<string, string> = { RICE: "飯", NOODLE: "麵", JAPANESE: "日式", THAI: "泰式", KOREAN: "韓式", HOTPOT: "火鍋", DESSERT: "甜點", DRINK: "飲品", OTHER: "其他" };
const categoryImages: Record<string, string> = { RICE: "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=1200&q=85", NOODLE: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=1200&q=85", JAPANESE: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=85", THAI: "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?auto=format&fit=crop&w=1200&q=85", KOREAN: "https://images.unsplash.com/photo-1498654896293-37aacf113fd9?auto=format&fit=crop&w=1200&q=85", HOTPOT: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1200&q=85", DESSERT: "https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=1200&q=85", OTHER: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=85" };
function hasValue(value: string | null | undefined): value is string { return Boolean(value?.trim()); }

export default function Home() {
  const router = useRouter();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [category, setCategory] = useState<Category>("all");
  const [sort, setSort] = useState<SortOption>("rating");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [randomLoading, setRandomLoading] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const params = new URLSearchParams();
    if (category !== "all") params.set("category", category);
    if (search.trim()) params.set("search", search.trim());
    params.set("sort", sort);
    fetch(`/api/restaurants?${params}`, { signal: controller.signal })
      .then(async (response) => { if (!response.ok) throw new Error(); return response.json() as Promise<{ data: Restaurant[] }>; })
      .then((payload) => { setRestaurants(payload.data); setError(""); })
      .catch((requestError: Error) => { if (requestError.name !== "AbortError") setError("餐廳資料載入失敗，請稍後再試"); })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [category, search, sort]);

  async function chooseForMe() {
    if (randomLoading) return;
    setRandomLoading(true);
    try { const response = await fetch("/api/restaurants/random"); const payload = await response.json() as { data?: Restaurant }; if (response.ok && payload.data) router.push(`/restaurant/${payload.data.id}`); } finally { setRandomLoading(false); }
  }

  return <main className="app-shell"><div className="mobile-app">
    <header className="app-topbar"><Link href="/" className="app-brand"><span className="app-brand-dot">✦</span><span>逢甲<span>今天吃什麼？</span></span></Link><button className="icon-button" aria-label="通知">♧</button></header>
    <section className="promo-banner"><div><span className="promo-tag">FENGJIA FOOD FINDER</span><h1>今天吃什麼？<br /><b>讓我們幫你找！</b></h1><p>逢甲學生的日常美食指南</p></div><span className="promo-bowl">🍜</span></section>
    <label className="app-search"><span>⌕</span><input value={search} onChange={(event) => { setLoading(true); setSearch(event.target.value); }} placeholder="搜尋店家、料理或關鍵字" /></label>
    <section className="quick-actions"><button onClick={chooseForMe} disabled={randomLoading}><span className="quick-icon">{randomLoading ? "…" : "🎲"}</span><b>{randomLoading ? "挑選中..." : "今天吃什麼"}</b><small>隨機推薦一家店</small></button><button onClick={() => document.getElementById("categories")?.scrollIntoView({ behavior: "smooth" })}><span className="quick-icon">⌕</span><b>美食轉盤</b><small>探索逢甲好味道</small></button></section>
    <section className="section-block" id="categories"><div className="section-title"><div><small>EXPLORE</small><h2>找點好吃的</h2></div><span>{loading ? "載入中" : `${restaurants.length} 間`}</span></div><div className="category-scroller">{categories.map((item) => <button className={category === item.value ? "food-category active" : "food-category"} key={item.value} onClick={() => { setLoading(true); setCategory(item.value); }}><span>{item.icon}</span><small>{item.label}</small></button>)}</div></section>
    <section className="section-block ranking-section"><div className="section-title"><div><small>NEARBY TABLES</small><h2>學生推薦排行榜</h2></div><label className="sort-control">排序<select aria-label="餐廳排序方式" value={sort} onChange={(event) => { setLoading(true); setSort(event.target.value as SortOption); }}><option value="rating">Google 評分</option><option value="name">店名</option></select></label></div>{error && <p className="app-message error-message">{error}</p>}{!loading && !error && restaurants.length === 0 && <p className="app-message">找不到符合的餐廳</p>}{loading ? <p className="app-message">正在找尋今天的答案...</p> : <div className="ranking-list">{restaurants.map((restaurant, index) => <RestaurantRow key={restaurant.id} restaurant={restaurant} rank={index + 1} />)}</div>}</section>
    <nav className="bottom-nav"><Link className="bottom-item active" href="/"><span>⌂</span>探索</Link><button className="bottom-item" onClick={chooseForMe}><span>🎲</span>推薦</button><button className="bottom-item" onClick={() => document.getElementById("categories")?.scrollIntoView({ behavior: "smooth" })}><span>♨</span>美食</button><span className="bottom-item"><span>⌖</span>逢甲</span><span className="bottom-item"><span>●</span>我的</span></nav>
  </div></main>;
}

function RestaurantRow({ restaurant, rank }: { restaurant: Restaurant; rank: number }) {
  const imageUrl = hasValue(restaurant.imageUrl) ? restaurant.imageUrl : categoryImages[restaurant.category];
  return <Link className="ranking-row" href={`/restaurant/${restaurant.id}`}><strong className={rank < 4 ? "rank top-rank" : "rank"}>{rank}</strong><div className="ranking-image" style={imageUrl ? { backgroundImage: `url(${imageUrl})` } : undefined} /><div className="ranking-info"><h3>{restaurant.name}</h3><p><b>{restaurant.rating !== null ? `Google ★ ${restaurant.rating.toFixed(1)}` : "Google 星等 尚未提供"}</b><span>{hasValue(restaurant.priceRange) ? `價位 ${restaurant.priceRange}` : "價位 尚未提供"}</span></p><small>{categoryLabels[restaurant.category] ?? restaurant.category}</small></div><span className="row-arrow">›</span></Link>;
}