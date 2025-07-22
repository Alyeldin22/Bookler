import React, { useEffect, useState } from "react"
import axios from "../utils/axiosInstance"
import HotelCard from "../components/shared/HotelCard"
import { countries } from "../utils/countries"

export default function HotelsSearch() {
  const [hotels, setHotels] = useState([])
  const [country, setCountry] = useState("")

  useEffect(() => {
    let url = "/hotels"
    if (country) url += `?address.countryIsoCode=${country}`
    axios.get(url).then(r => setHotels(r.data))
  }, [country])

  return (
    <div style={{ padding: 24 }}>
      <h2>Hotels</h2>
      <select value={country} onChange={e => setCountry(e.target.value)}>
        <option value="">All Countries</option>
        {countries.map(c => (
          <option key={c.value} value={c.value}>{c.label}</option>
        ))}
      </select>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginTop: 16 }}>
        {hotels.length === 0 ? (
          <div>No result found</div>
        ) : hotels.map(hotel => (
          <HotelCard key={hotel.id} hotel={hotel} />
        ))}
      </div>
    </div>
  )
} 