"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Restaurant = {
  id: string;
  name: string;
  category: string;
  description: string | null;
  address: string;
  phone: string | null;
  rating: number | null;
  priceRange: string | null;
  imageUrl: string | null;
  websiteUrl: string | null;
  menuUrl: string | null;
  orderUrl: string | null;
  googleMapsUrl: string | null;
};

const categoryLabels: Record<string, string> = {
  RICE: "飯",
  NOODLE: "麵",
  JAPANESE: "日式",
  THAI: "泰式",
  KOREAN: "韓式",
  HOTPOT: "火鍋",
  DESSERT: "甜點",
  DRINK: "飲品",
  OTHER: "其他",
};

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

function hasValue(value: string | null | undefined): value is string {
  return Boolean(value?.trim());
}

export default function RestaurantDetail({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [randomLoading, setRandomLoading] = useState(false);
  const [randomError, setRandomError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    params
      .then(({ id }) => fetch(`/api/restaurants/${id}`, { signal: controller.signal }))
      .then(async (response) => {
        const payload = await response.json() as { data?: Restaurant; error?: string };
        if (response.status === 404) throw new Error("找不到這間餐廳");
        if (!response.ok || !payload.data) throw new Error(payload.error ?? "餐廳資料載入失敗，請稍後再試");
        setRestaurant(payload.data);
      })
      .catch((requestError: Error) => {
        if (requestError.name !== "AbortError") setError(requestError.message);
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [params]);

  async function showRandomRestaurant() {
    if (randomLoading) return;
    setRandomLoading(true);
    setRandomError("");
    try {
      const response = await fetch("/api/restaurants/random");
      const payload = await response.json() as { data?: Restaurant };
      if (!response.ok || !payload.data) throw new Error("推薦失敗，請再試一次");
      router.push(`/restaurant/${payload.data.id}`);
    } catch {
      setRandomError("推薦失敗，請再試一次");
    } finally {
      setRandomLoading(false);
    }
  }

  if (loading) {
    return <main className="detail-shell"><div className="detail-container"><Link className="back-link" href="/">← 回到餐廳列表</Link><p className="feedback">正在載入餐廳資料...</p></div></main>;
  }

  if (error || !restaurant) {
    return <main className="detail-shell"><div className="detail-container"><Link className="back-link" href="/">← 回到餐廳列表</Link><p className="feedback error-message">{error || "找不到這間餐廳"}</p></div></main>;
  }

  const imageUrl = hasValue(restaurant.imageUrl) ? restaurant.imageUrl : categoryImages[restaurant.category];

  return (
    <main className="detail-shell">
      <div className="detail-container">
        <Link className="back-link" href="/">← 回到餐廳列表</Link>
        <div className="detail-hero">
          <div className="detail-image" style={imageUrl ? { backgroundImage: `url(${imageUrl})` } : undefined} aria-label={`${restaurant.name} 餐廳圖片`} />
          <div className="detail-copy">
            <p className="kicker">{categoryLabels[restaurant.category] ?? restaurant.category} / FENGJIA</p>
            <h1>{restaurant.name}</h1>
            {restaurant.description && <p className="detail-description">{restaurant.description}</p>}
            <div className="detail-rating">{restaurant.rating !== null && <strong>⭐ {restaurant.rating.toFixed(1)}</strong>}{hasValue(restaurant.priceRange) && <span>💰 {restaurant.priceRange}</span>}</div>
          </div>
        </div>

        {(hasValue(restaurant.address) || hasValue(restaurant.phone)) && <section className="info-grid">
          {hasValue(restaurant.address) && <div><span>地址</span><p>{restaurant.address}</p>{hasValue(restaurant.googleMapsUrl) && <a className="inline-action" href={restaurant.googleMapsUrl} target="_blank" rel="noreferrer">📍 Google Maps 導航</a>}</div>}
          {hasValue(restaurant.phone) && <div><span>電話</span><p><a href={`tel:${restaurant.phone}`}>{restaurant.phone}</a></p></div>}
        </section>}

        <div className="detail-actions">
          {hasValue(restaurant.menuUrl) && <a className="primary-link" href={restaurant.menuUrl} target="_blank" rel="noreferrer">📖 查看菜單</a>}
          {hasValue(restaurant.orderUrl) && <a href={restaurant.orderUrl} target="_blank" rel="noreferrer">🛵 線上訂餐</a>}
          {hasValue(restaurant.websiteUrl) && <a href={restaurant.websiteUrl} target="_blank" rel="noreferrer">🌐 官方網站</a>}
        </div>

        {randomError && <p className="feedback error-message">{randomError}</p>}
        <div className="detail-footer-action"><button className="random-button" type="button" onClick={showRandomRestaurant} disabled={randomLoading}>{randomLoading ? "🎲 挑選中..." : "🎲 今天吃什麼？"}</button></div>
      </div>
    </main>
  );
}