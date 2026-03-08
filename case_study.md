# Case Study: LSTNR

**Title:** LSTNR — Believe Early, Grow Together
**Subtitle:** Turning music discovery into a prediction market where fans invest in the artists they believe in.

---

## **THE BLUEPRINT**

| MY ROLE | DELIVERABLES | TEAM | YEAR |
| :--- | :--- | :--- | :--- |
| Product Designer | UI/UX Design, Prototyping | 3 Developers, 1 PM | 2024 |

---

## **THE CONTEXT**

### **The Problem at Hand**

Music discovery today is passive. Fans listen, stream, and share, but they don't participate in the upside of an artist's success. The connection is emotional, but the value capture is one-sided. We asked: *What if you could invest in an artist's career just as you invest in a stock?*

### **Where We Started**

"Predicting success wasn't just hard; it was impossible without the right incentives."
We realized that for fans to care, they needed "skin in the game." We needed to build a platform that wasn't just about listening, but about **believing**. LSTNR was born from the idea of quantifying "clout" and "hype" into tradeable assets.

---

## **THE DECISION**

### **The Web 2.5 Constraint**

Initially, we built LSTNR on a "Web 2.5" architecture—a sleek frontend backed by a centralized Supabase ledger. It worked for speed, but it introduced a critical ceiling: **Trust**.
Users were buying "shares" that only existed in our database. If LSTNR went offline, their assets vanished. We realized that for a prediction market to have real stakes, the ledger couldn't just be *secure*; it had to be *sovereign*.

### **The On-Chain Pivot**

This insight drove the decision to move the ledger on-chain. By migrating to a decentralized infrastructure, we solved three problems at once:

1. **Trust:** The user owns the asset, not the platform.
2. **Liquidity:** Markets can remain open 24/7 without centralized clearing.
3. **Composability:** LSTNR assets can now interact with the broader DeFi ecosystem.

---

## **THE PROCESS**

### **85% Design, 15% Vibe Code**

"Designing LSTNR wasn't just about pixels; it was about velocity."
I spent 85% of the time in **Figma**, crafting a high-fidelity design system that left zero ambiguity. The remaining 15%? **Vibe coding.**

Using **Antigravity**, I translated those designs into a functional **Expo Go** app at breakneck speed. This workflow allowed me to move from "static vibe" to "shipping code" without the typical dev handoff friction.

---

## **THE DEEP DIVE**

### **01. Onboarding**
>
> *Insert Screen Recording: Onboarding Flow*

**"Believe early. Grow together."**
The onboarding isn't just a sign-up; it's a manifesto. We used deep, immersive gradients and a background orbit animation to set a premium, futuristic tone immediately.

* **The Hook:** We frame the value proposition instantly—"Invest in their story, earn in their success."
* **The Bridge:** By offering multiple entry points (Wallet, Google, Apple), we bridge the gap between web2 ease and web3 utility.

### **02. Artists & Labels**
>
> *Insert Screen Recording: Artists / Labels Flow*

**Investing in Culture**
This is the heart of LSTNR. We designed the **Artist Detail** page to look less like a playlist and more like a Bloomberg terminal for culture.

* **Market Confidence Score (MCS):** A composite metric (0-100%) that gives users an instant read on sentiment, derived from volume retention and price stability.
* **The Chart:** We implemented a financial-grade line chart (d3-shape) that scrubs smoothly, allowing users to track price history from "15m" to "All time."
* **Buy/Sell:** The "Trade Sheet" is designed for speed—frictionless execution so fans can back their convictions instantly.

### **03. Predictions**
>
> *Insert Screen Recording: Predictions Flow*

**The North Star**
Beyond trading artist shares, users can bet on specific outcomes. *Will [Artist] hit 1M streams?*

* **Visual Clarity:** We used color-coded badges (Green/Red) for "Yes/No" outcomes and clear "Open Position" summaries.
* **Discovery:** A robust filter system (Outcome, End Date, Region) helps users find the markets they understand best.
* **Impact:** This turns passive knowledge ("I know this song is blowing up") into an active asset class.

### **04. Inbox & Portfolio**
>
> *Insert Screen Recording: Inbox / Portfolio Flow*

**Skin in the Game**
The Portfolio is the user's ledger of belief. We grouped assets into "Artist Shares" and "Market Positions" to separate long-term conviction from short-term speculation.

* **The Inbox as a VIP Club:** The "Holders Chat" (Inbox) is gated. You can't just slide in; you have to *buy* in.
* **The UI:** We added a "Buy to Chat" CTA for non-holders, turning FOMO into a conversion mechanic. The chat itself shows the live price and 24h change, reminding users that this community is bound by shared value.

### **05. Profile & Settings**
>
> *Insert Screen Recording: Profile / Settings Flow*

**Identity & Reputation**
A user's profile on LSTNR is their resume of taste.

* **Stats:** We highlight "Portfolio Value" alongside "Followers," signaling that on LSTNR, your net worth is a measure of your ear for talent.
* **Watchlist:** A personalized feed of potential plays, keeping users engaged even when they aren't ready to buy.
* **Settings:** Clean, functional control over the account, ensuring the "Business" side of the app never gets in the way of the "Culture."

---

## **THE IMPACT**

**Bridging the Gap**
LSTNR successfully gamified music discovery without cheapening the art. By combining the sleek aesthetics of a music player with the data density of a trading app, we created a new category: **Cultural Finance.**

> *Final tagline or visual close*
