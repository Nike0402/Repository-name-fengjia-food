"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Category = "all" | "RICE" | "NOODLE" | "JAPANESE" | "THAI";
type Restaurant = {
  id: string; name: string; category: string; description: string | null; address: string;
  phone: string | null; rating: number | null; priceRange: string | null; imageUrl: string | null;
  menuUrl: string | null; orderUrl: string | null; googleMapsUrl: string | null;
};

const categories: { label: string; value: Category }[] = [
  { label: "全部", value: "all" }, { label: "飯", value: "RICE" }, { label: "麵", value: "NOODLE" },
  { label: "日式", value: "JAPANESE" }, { label: "泰式", value: "THAI" },
];
const categoryLabels: Record<string, string> = { RICE: "飯", NOODLE: "麵", JAPANESE: "日式", THAI: "泰式", KOREAN: "韓式", HOTPOT: "火鍋", DESSERT: "甜點", DRINK: "飲品", OTHER: "其他" };

const categoryImages: Record<string, string> = {
  RICE: "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=1200&q=85",
  NOODLE: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=1200&q=85",
  JAPANESE: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=85",
  THAI: "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?auto=format&fit=crop&w=1200&q=85",
  KOREAN: "https://images.unsplash.com/photo-1498654896293-37aacf113fd9?auto=format&fit=crop&w=1200&q=85",
  HOTPOT: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1200&q=85",
  DESSERT: "https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=1200&q=85",
  DRINK: "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=1200&q=85",
  OTHER: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=85",
};

export default function Home() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [category, setCategory] = useState<Category>("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [randomRestaurant, setRandomRestaurant] = useState<Restaurant | null>(null);
  const [randomLoading, setRandomLoading] = useState(false);
  const [randomError, setRandomError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    const params = new URLSearchParams();
    if (category !== "all") params.set("category", category);
    if (search.trim()) params.set("search", search.trim());
    fetch(`/api/restaurants?${params.toString()}`, { signal: controller.signal })
      .then(async (response) => { if (!response.ok) throw new Error("餐廳資料載入失敗"); return response.json() as Promise<{ data: Restaurant[] }>; })
      .then((payload) => { setRestaurants(payload.data); setError(""); })
      .catch((requestError: Error) => { if (requestError.name !== "AbortError") setError(requestError.message); })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [category, search]);

  async function showRandomRestaurant() {
    setRandomLoading(true);
    setRandomError("");
    try {
      const response = await fetch("/api/restaurants/random");
      const payload = await response.json() as { data?: Restaurant; error?: string };
      if (!response.ok || !payload.data) throw new Error(payload.error ?? "目前找不到推薦餐廳");
      setRandomRestaurant(payload.data);
    } catch (requestError) {
      setRandomError(requestError instanceof Error ? requestError.message : "推薦餐廳時發生錯誤");
      setRandomRestaurant(null);
    } finally {
      setRandomLoading(false);
    }
  }

  return (
    <main className="finder-shell">
      <div className="finder-noise" aria-hidden="true" />
      <section className="finder-container">
        <header className="site-header"><Link className="wordmark" href="/"><span className="wordmark-icon">麵</span><span><b>逢甲</b>今天吃什麼？</span></Link><span className="header-location">TAICHUNG / FENGJIA</span></header>
        <section className="hero-block"><p className="kicker">FENGJIA FOOD FINDER <span>✦</span></p><h1>今天，<em>吃點好的。</em></h1><p className="hero-copy">在逢甲夜市與校園之間，找到下一餐剛剛好的答案。</p></section>
        <section className="search-panel" aria-label="餐廳搜尋">
          <label className="search-field"><span aria-hidden="true">⌕</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="搜尋餐廳、料理或關鍵字" /></label>
          <button className="random-button" type="button" onClick={showRandomRestaurant} disabled={randomLoading}>{randomLoading ? "正在抽籤..." : "🎲 今天吃什麼？"} <span>↗</span></button>
        </section>
        {randomError && <p className="feedback error-message">{randomError}</p>}
        {randomRestaurant && <RandomRecommendation restaurant={randomRestaurant} />}
        <nav className="category-tabs" aria-label="料理分類">{categories.map((item) => <button className={category === item.value ? "category-tab active" : "category-tab"} key={item.value} type="button" onClick={() => setCategory(item.value)}>{item.label}</button>)}</nav>
        <div className="results-heading"><div><p className="section-label">NEARBY TABLES</p><h2>逢甲附近的好味道</h2></div><span>{loading ? "載入中..." : `${restaurants.length} 間餐廳`}</span></div>
        {error && <p className="feedback error-message">{error}。請確認 PostgreSQL 與 DATABASE_URL 已設定。</p>}
        {loading && <div className="feedback">正在找尋今天的答案...</div>}
        {!loading && !error && restaurants.length === 0 && <div className="feedback">找不到符合條件的餐廳，換個關鍵字試試。</div>}
        <section className="restaurant-grid" aria-live="polite">{restaurants.map((restaurant) => <RestaurantCard key={restaurant.id} restaurant={restaurant} />)}</section>
      </section>
    </main>
  );
}

function RandomRecommendation({ restaurant }: { restaurant: Restaurant }) {
  return <section className="random-recommendation" aria-live="polite">
    <div className="recommendation-ticket"><p className="section-label">TODAY&apos;S PICK <span>✦</span></p><p className="recommendation-eyebrow">這一刻，答案是</p><h2>{restaurant.name}</h2><div className="recommendation-facts"><span>{categoryLabels[restaurant.category] ?? restaurant.category}</span><span>★ {restaurant.rating?.toFixed(1) ?? "—"}</span><span>價位 {restaurant.priceRange ?? "—"}</span></div></div>
    <div className="recommendation-actions"><p>{restaurant.address}</p><div>{restaurant.googleMapsUrl && <a href={restaurant.googleMapsUrl} target="_blank" rel="noreferrer">Google Maps ↗</a>}{restaurant.phone && <a href={`tel:${restaurant.phone}`}>電話</a>}{restaurant.menuUrl && <a href={restaurant.menuUrl} target="_blank" rel="noreferrer">菜單</a>}{restaurant.orderUrl && <a href={restaurant.orderUrl} target="_blank" rel="noreferrer">訂餐</a>}<Link className="primary-link" href={`/restaurants/${restaurant.id}`}>查看詳細 <span>↗</span></Link></div></div>
  </section>;
}

function RestaurantCard({ restaurant }: { restaurant: Restaurant }) {
  return <article className="restaurant-card">
    <div className="card-image" style={{ backgroundImage: `url(${restaurant.imageUrl ?? categoryImages[restaurant.category]})` }}><span className="category-badge">{categoryLabels[restaurant.category] ?? restaurant.category}</span></div>
    <div className="card-content"><div className="card-title-row"><h3>{restaurant.name}</h3><span className="rating">★ {restaurant.rating?.toFixed(1) ?? "—"}</span></div>
      <p className="card-description">{restaurant.description ?? "逛逢甲時，值得收藏的用餐選擇。"}</p><div className="card-meta"><span>⌖ {restaurant.address}</span><span>價位 {restaurant.priceRange ?? "—"}</span></div>
      <div className="card-actions"><Link className="primary-link" href={`/restaurants/${restaurant.id}`}>查看店家資訊 <span>↗</span></Link>{restaurant.menuUrl && <a href={restaurant.menuUrl} target="_blank" rel="noreferrer">菜單</a>}{restaurant.orderUrl && <a href={restaurant.orderUrl} target="_blank" rel="noreferrer">訂餐</a>}{restaurant.phone && <a href={`tel:${restaurant.phone}`}>電話</a>}</div>
    </div>
  </article>;
}