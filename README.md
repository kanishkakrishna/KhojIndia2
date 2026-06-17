# KhojIndia: Discover Unseen India 🇮🇳

**KhojIndia** is a full-stack AI-powered travel discovery platform that helps users explore and contribute information about **hidden, unexplored, and lesser-known places in India** — locations that are often missing from mainstream travel platforms and even Google Maps.

The platform allows travelers to discover underrated destinations, access local insights, upload media, contribute new places, and earn **KhojiCoins** through a gamified leaderboard system. KhojIndia also uses AI-powered validation and semantic search to maintain content quality by detecting spam, duplicate, irrelevant, and overly popular tourist-place submissions.

---

## Features

### User Features

* Secure user registration and login
* Discover hidden and lesser-known destinations across India
* Search places by state, district, local name, landmark, or description
* View detailed local information such as:

  * State
  * District
  * Landmark
  * Local name
  * Dhabas
  * Lodges
  * Local guides
  * Travel tips
* Get real-time weather information using OpenWeatherMap API
* Upload images and videos using Cloudinary
* Add notes, personal experiences, and travel tips
* Contribute new unexplored destinations
* Clean and mobile-responsive user interface

---

## AI-Powered Features

### AI Bouncer

KhojIndia includes an **AI Bouncer** system that validates user-submitted places before allowing them into the platform.

The AI Bouncer helps detect and filter:

* Spam submissions
* Fake or irrelevant places
* Overly popular tourist destinations
* Low-quality descriptions
* Repeated or duplicate entries
* Invalid travel content

This helps maintain a high-quality database of truly hidden and meaningful travel destinations.

---

### Vector Semantic Search

KhojIndia uses **vector-based semantic search** to detect similar or duplicate locations even when users describe the same place using different words.

For example:

* “Hidden waterfall near Ranchi forest”
* “Small unexplored waterfall outside Ranchi”

Even if the text is different, semantic search can identify that both entries may refer to a similar location.

This improves duplicate detection and keeps the platform clean and reliable.

---

### Auto Hashtag Generation

KhojIndia automatically generates relevant hashtags from user-submitted place descriptions.

Example tags:

* #HiddenPlace
* #Waterfall
* #Trekking
* #Jharkhand
* #LocalTravel
* #UnexploredIndia

This improves place discoverability and helps users search destinations more effectively.

---

### AI-Based Travel Insights

KhojIndia can generate useful AI-powered insights from place descriptions, user notes, and travel-related information.

These insights help users quickly understand:

* Why the place is worth visiting
* Best type of travelers for the location
* Nearby local experiences
* Travel precautions
* Summary of user-contributed notes

---

## Gamification System

KhojIndia includes a contribution-based reward system where users earn **KhojiCoins** for valid hidden-place submissions.

### KhojiCoin System

Users can earn coins by:

* Adding valid hidden destinations
* Uploading useful media
* Sharing helpful local information
* Contributing meaningful travel tips

### Leaderboard

A leaderboard ranks users based on their KhojiCoins, encouraging healthy competition and more community-driven contributions.

This makes KhojIndia not just a travel discovery app, but also a gamified community platform for explorers.

---

## Security & Authentication

KhojIndia includes proper authentication and protected routes to ensure secure access.

Security features include:

* JWT-based authentication
* Protected user routes
* Secure login/register flow
* Backend validation
* Auth-based access control
* Safe media upload handling

---

## Tech Stack

### Frontend

* React.js
* Vite
* Tailwind CSS
* Material UI
* React Router
* Fetch API
* Responsive UI Design

### Backend

* Node.js
* Express.js
* MongoDB Atlas
* Mongoose
* JWT Authentication
* Multer
* Cloudinary
* OpenWeatherMap API

### AI & Search

* AI-based content validation
* AI Bouncer moderation pipeline
* Vector semantic search
* Embedding-based similarity detection
* Auto hashtag generation
* AI-generated travel insights

---

## System Workflow

```text
User submits a new hidden place
        ↓
Backend receives place details and media
        ↓
AI Bouncer validates the submission
        ↓
Vector semantic search checks for duplicate/similar places
        ↓
If valid, the place is saved in MongoDB
        ↓
Media is uploaded to Cloudinary
        ↓
Weather and local information are attached
        ↓
User earns KhojiCoins
        ↓
Leaderboard is updated
```

---

## Core Modules

### Place Discovery Module

Allows users to search and explore hidden destinations based on location, landmark, district, local name, and travel description.

### Contribution Module

Allows users to add new unexplored destinations with photos, videos, notes, and local details.

### AI Moderation Module

Validates whether a submitted place is genuine, relevant, non-spam, and suitable for the platform.

### Semantic Deduplication Module

Uses vector similarity to detect whether a newly submitted place is already present in the database.

### Gamification Module

Rewards users with KhojiCoins and ranks them through a leaderboard system.

### Weather Module

Fetches real-time weather data for destinations using the OpenWeatherMap API.

---

## Why KhojIndia?

Most travel platforms focus on already famous destinations. KhojIndia focuses on **unseen, underrated, and locally known places** that deserve more attention.

It helps:

* Travelers discover hidden gems
* Local communities promote lesser-known places
* Contributors share real travel knowledge
* Users avoid repetitive mainstream tourist spots
* Hidden destinations gain visibility

---

## Future Scope

* Coin redemption system
* Admin dashboard for manual review
* Advanced AI itinerary planner
* Map-based place discovery
* Geo-tag verification
* User reviews and ratings
* Saved trips and wishlist
* AI-generated trip summaries
* State-wise and district-wise exploration pages
* Mobile app version

---

## Project Status

KhojIndia is fully built and deployed with core features including AI moderation, semantic duplicate detection, secure authentication, media upload, weather integration, KhojiCoins, leaderboard, and responsive UI.

---

## Summary

KhojIndia is an AI-powered hidden-place discovery platform that combines full-stack development, AI moderation, vector semantic search, secure authentication, media uploads, weather APIs, and gamified user engagement to create a scalable and meaningful travel-tech product for exploring unseen India.


##  Project Structure

