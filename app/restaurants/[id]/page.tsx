"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Restaurant = {
  id: string; name: string; category: string; description: string | null; address: string; phone: string | null;
  latitude: number | null; longitude: number | null; rating: number | null; priceRange: string | null; imageUrl: string | null;
  websiteUrl: string | null; menuUrl: string | null; orderUrl: string | null; googleMapsUrl: string | null;
};
const labels: Record<string, string> = { RICE: "飯", NOODLE: "麵", JAPANESE: "日式", THAI: "泰式", KOREAN: "韓式", HOTPOT: "火鍋", DESSERT: "甜點", DRINK: "飲品", OTHER: "其他" };

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

export default function RestaurantDetail({ params }: { params: Promise<{ id: string }> }) {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [error, setError] = useState("");
  useEffect(() => { params.then(({ id }) => fetch(`/api/restaurants/${id}`).then(async (response) => { if (!response.ok) throw new Error("找不到這間餐廳"); return response.json() as Promise<{ data: Restaurant }>; }).then((payload) => setRestaurant(payload.data)).catch((requestError: Error) => setError(requestError.message))); }, [params]);
  if (error) return <main className="detail-shell"><div className="detail-container"><Link className="back-link" href="/">← 返回餐廳列表</Link><p className="feedback error-message">{error}</p></div></main>;
  if (!restaurant) return <main className="detail-shell"><div className="detail-container"><p className="feedback">正在載入餐廳資料...</p></div></main>;
  return <main className="detail-shell"><div className="detail-container"><Link className="back-link" href="/">← 返回餐廳列表</Link><div className="detail-hero"><div className="detail-image" style={{ backgroundImage: `url(${restaurant.imageUrl ?? categoryImages[restaurant.category]})` }} /><div className="detail-copy"><p className="kicker">{labels[restaurant.category] ?? restaurant.category} / FENGJIA</p><h1>{restaurant.name}</h1><p className="detail-description">{restaurant.description ?? "逢甲商圈值得收藏的用餐選擇。"}</p><div className="detail-rating"><strong>★ {restaurant.rating?.toFixed(1) ?? "—"}</strong><span>價位 {restaurant.priceRange ?? "—"}</span></div></div></div><section className="info-grid"><div><span>地址</span><p>{restaurant.address}</p></div><div><span>電話</span><p>{restaurant.phone ? <a href={`tel:${restaurant.phone}`}>{restaurant.phone}</a> : "尚未提供"}</p></div></section><div className="detail-actions">{restaurant.menuUrl && <a className="primary-link" href={restaurant.menuUrl} target="_blank" rel="noreferrer">查看菜單</a>}{restaurant.orderUrl && <a href={restaurant.orderUrl} target="_blank" rel="noreferrer">線上訂餐</a>}{restaurant.websiteUrl && <a href={restaurant.websiteUrl} target="_blank" rel="noreferrer">官方網站</a>}</div></div></main>;
}