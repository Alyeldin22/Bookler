import React, { useEffect, useState } from "react"
import axios from "../utils/axiosInstance"
import HotelCard from "../components/shared/HotelCard"
import RecommendedCard from "../components/shared/RecommendedCard"

export default function Home() {
  const [bestOffers, setBestOffers] = useState([])
  const [recommended, setRecommended] = useState([])

  useEffect(() => {
    axios.get("/best_offer").then(r => setBestOffers(r.data))
    axios.get("/recommended_hotels").then(r => setRecommended(r.data))
  }, [])

  return (
    <div style={{ padding: 24 }}>
      <h2>Best Offers</h2>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        {bestOffers.map(hotel => (
          <HotelCard key={hotel.id} hotel={hotel} />
        ))}
      </div>
      <h2 style={{ marginTop: 32 }}>Recommended Hotels</h2>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        {recommended.map(hotel => (
          <RecommendedCard key={hotel.id} hotel={hotel} />
        ))}
      </div>
    </div>
  )
} 