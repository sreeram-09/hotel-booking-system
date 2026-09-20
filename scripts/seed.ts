import dotenv from "dotenv"
dotenv.config({ path: ".env.local" })

import mongoose from "mongoose"
import Hotel from "../models/Hotel"
import Room from "../models/Room"

const MONGODB_URI = process.env.MONGODB_URI!

const locations = [
  { city: "Guntur", state: "Andhra Pradesh" },
  { city: "Vijayawada", state: "Andhra Pradesh" },
  { city: "Visakhapatnam", state: "Andhra Pradesh" },
  { city: "Tirupati", state: "Andhra Pradesh" },
  { city: "Nellore", state: "Andhra Pradesh" },
  { city: "Kakinada", state: "Andhra Pradesh" },
  { city: "Rajahmundry", state: "Andhra Pradesh" },
  { city: "Kurnool", state: "Andhra Pradesh" },
  { city: "Hyderabad", state: "Telangana" },
  { city: "Warangal", state: "Telangana" },
  { city: "Bangalore", state: "Karnataka" },
  { city: "Mysore", state: "Karnataka" },
  { city: "Mangalore", state: "Karnataka" },
  { city: "Chennai", state: "Tamil Nadu" },
  { city: "Coimbatore", state: "Tamil Nadu" },
  { city: "Madurai", state: "Tamil Nadu" },
  { city: "Ooty", state: "Tamil Nadu" },
  { city: "Mumbai", state: "Maharashtra" },
  { city: "Pune", state: "Maharashtra" },
  { city: "Nagpur", state: "Maharashtra" },
  { city: "Delhi", state: "Delhi" },
  { city: "Jaipur", state: "Rajasthan" },
  { city: "Udaipur", state: "Rajasthan" },
  { city: "Jodhpur", state: "Rajasthan" },
  { city: "Ahmedabad", state: "Gujarat" },
  { city: "Surat", state: "Gujarat" },
  { city: "Goa", state: "Goa" },
  { city: "Kochi", state: "Kerala" },
  { city: "Thiruvananthapuram", state: "Kerala" },
  { city: "Kolkata", state: "West Bengal" },
  { city: "Lucknow", state: "Uttar Pradesh" },
  { city: "Varanasi", state: "Uttar Pradesh" },
  { city: "Agra", state: "Uttar Pradesh" },
  { city: "Bhopal", state: "Madhya Pradesh" },
  { city: "Indore", state: "Madhya Pradesh" },
  { city: "Bhubaneswar", state: "Odisha" },
  { city: "Patna", state: "Bihar" },
  { city: "Ranchi", state: "Jharkhand" },
  { city: "Guwahati", state: "Assam" },
  { city: "Chandigarh", state: "Chandigarh" },
  { city: "Dehradun", state: "Uttarakhand" },
  { city: "Shimla", state: "Himachal Pradesh" },
  { city: "Srinagar", state: "Jammu and Kashmir" },
  { city: "Amritsar", state: "Punjab" }
]

const hotelStyles = [
  "Grand",
  "Royal",
  "Luxury",
  "Comfort",
  "Elite",
  "Premium",
  "Central",
  "Heritage",
  "Paradise",
  "Regency"
]

const hotelTypes = [
  "Hotel",
  "Resort",
  "Suites",
  "Inn",
  "Residency"
]

const propertyTypes = [
  "Hotel",
  "Resort",
  "Villa",
  "Apartment",
  "Guest House",
  "Hostel"
]

const roomTypes = [
  "Standard Room",
  "Deluxe Room",
  "Premium Room",
  "Executive Room",
  "Suite"
]

const bedTypes = [
  "Single Bed",
  "Double Bed",
  "Queen Bed",
  "King Bed",
  "Twin Beds"
]

const roomAmenities = [
  ["Free WiFi", "Air Conditioning", "TV"],
  ["Free WiFi", "TV", "Mini Fridge"],
  ["Free WiFi", "Air Conditioning", "Breakfast"],
  ["Free WiFi", "TV", "Room Service"],
  ["Free WiFi", "Air Conditioning", "Mini Fridge", "TV"]
]

const hotelAmenities = [
  ["Free WiFi", "Restaurant", "Parking", "Breakfast"],
  ["Free WiFi", "Swimming Pool", "Restaurant", "Gym"],
  ["Beach View", "Pool", "Restaurant", "Spa"],
  ["Free WiFi", "Breakfast", "Parking", "Room Service"],
  ["Restaurant", "Gym", "Parking", "Conference Hall"],
  ["Free WiFi", "Pool", "Spa", "Restaurant"]
]

const images = [
  "https://images.unsplash.com/photo-1566073771259-6a8506099945",
  "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa",
  "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb",
  "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b"
]

const roomImages = [
  "https://images.unsplash.com/photo-1611892440504-42a792e24d32",
  "https://images.unsplash.com/photo-1590490360182-c33d57733427",
  "https://images.unsplash.com/photo-1618773928121-c32242e63f39",
  "https://images.unsplash.com/photo-1595576508898-0ad5c879a061"
]

function getPrice(index: number) {
  return 1800 + (index % 10) * 450
}

function getRating(index: number) {
  return Number((4.1 + (index % 9) * 0.1).toFixed(1))
}

async function seed() {
  await mongoose.connect(MONGODB_URI)

  await Hotel.deleteMany({})
  await Room.deleteMany({})

  const createdHotels = []

  let hotelIndex = 0

  for (const location of locations) {
    for (let hotelNumber = 1; hotelNumber <= 3; hotelNumber++) {
      const style =
        hotelStyles[hotelIndex % hotelStyles.length]

      const type =
        hotelTypes[hotelIndex % hotelTypes.length]

      const propertyType =
        propertyTypes[hotelIndex % propertyTypes.length]

      const hotel = await Hotel.create({
        name: `${style} ${location.city} ${type}`,
        city: location.city,
        state: location.state,
        location: `${location.city}, ${location.state}`,
        description: `A comfortable ${propertyType.toLowerCase()} located in ${location.city}, ${location.state}.`,
        rating: getRating(hotelIndex),
        price: getPrice(hotelIndex),
        image: images[hotelIndex % images.length],
        amenities:
          hotelAmenities[
            hotelIndex % hotelAmenities.length
          ],
        propertyType,
        checkInTime: "12:00 PM",
        checkOutTime: "11:00 AM",
        address: `${hotelIndex + 1}, Main Road, ${location.city}, ${location.state}`,
        policies: [
          "Valid government ID required",
          "Pets are not allowed",
          "Smoking is not allowed inside rooms",
          "Check-in after 12:00 PM",
          "Check-out before 11:00 AM"
        ]
      })

      createdHotels.push(hotel)

      hotelIndex++
    }
  }

  for (let index = 0; index < createdHotels.length; index++) {
    const hotel = createdHotels[index]
    const basePrice = hotel.price

    await Room.create([
      {
        hotelId: hotel._id,
        roomNumber: "101",
        roomType: roomTypes[0],
        price: basePrice,
        capacity: 2,
        bedType: bedTypes[0],
        size: 250,
        amenities: roomAmenities[0],
        image: roomImages[0],
        status: "available"
      },
      {
        hotelId: hotel._id,
        roomNumber: "102",
        roomType: roomTypes[1],
        price: basePrice + 700,
        capacity: 2,
        bedType: bedTypes[1],
        size: 320,
        amenities: roomAmenities[1],
        image: roomImages[1],
        status: "available"
      },
      {
        hotelId: hotel._id,
        roomNumber: "201",
        roomType: roomTypes[2],
        price: basePrice + 1400,
        capacity: 3,
        bedType: bedTypes[2],
        size: 400,
        amenities: roomAmenities[2],
        image: roomImages[2],
        status: "available"
      },
      {
        hotelId: hotel._id,
        roomNumber: "202",
        roomType: roomTypes[3],
        price: basePrice + 2200,
        capacity: 4,
        bedType: bedTypes[3],
        size: 500,
        amenities: roomAmenities[3],
        image: roomImages[3],
        status: "available"
      },
      {
        hotelId: hotel._id,
        roomNumber: "301",
        roomType: roomTypes[4],
        price: basePrice + 3500,
        capacity: 5,
        bedType: bedTypes[4],
        size: 650,
        amenities: roomAmenities[4],
        image: roomImages[0],
        status: "available"
      }
    ])
  }

  console.log("Database seeded successfully")
  console.log(`Hotels added: ${createdHotels.length}`)
  console.log(`Rooms added: ${createdHotels.length * 5}`)

  await mongoose.disconnect()
}

seed()