export const packageFixtures = [
  {
    slug: "starter",
    name: "Starter",
    summary: "A 4-week foundation program for complete beginners.",
    description:
      "Starter covers core trading foundations, MT5 setup, risk basics, and community access for students building their first repeatable process.",
    durationDays: 28,
    priceMinor: 149900,
    currency: "AED",
    compareAtPriceMinor: null,
    isFeatured: false,
    grantsTelegramAccess: true,
    features: [
      "Core trading and MT5 setup",
      "Risk management and community",
      "Market basics and chart reading",
      "Trading journal starter templates"
    ]
  },
  {
    slug: "professional",
    name: "Professional",
    summary: "The most popular 8-week roadmap for practical execution.",
    description:
      "Professional adds Gold Masterclass, Smart Money Concepts, live sessions, and trade-journal workflows for structured growth.",
    durationDays: 56,
    priceMinor: 299900,
    currency: "AED",
    compareAtPriceMinor: null,
    isFeatured: true,
    grantsTelegramAccess: true,
    features: [
      "Gold Masterclass and SMC",
      "Trade journal and live sessions",
      "Weekly analysis and Q&A",
      "Lifetime resources and templates"
    ]
  },
  {
    slug: "elite",
    name: "Elite",
    summary: "A 10-week advanced-growth program for serious students.",
    description:
      "Elite deepens institutional price action, ICT concepts, portfolio mindset, live room exposure, and performance review discipline.",
    durationDays: 70,
    priceMinor: 599900,
    currency: "AED",
    compareAtPriceMinor: null,
    isFeatured: false,
    grantsTelegramAccess: true,
    features: [
      "Advanced price action and ICT",
      "Portfolio management mindset",
      "Live room and trade reviews",
      "Risk-controlled strategy coaching"
    ]
  },
  {
    slug: "vip",
    name: "VIP",
    summary: "A limited-seat custom mentorship track.",
    description:
      "VIP is the highest-touch program with founder-led guidance, 1-to-1 coaching, WhatsApp access, live review, and custom pacing.",
    durationDays: 90,
    priceMinor: 1299900,
    currency: "AED",
    compareAtPriceMinor: null,
    isFeatured: false,
    grantsTelegramAccess: true,
    features: [
      "1-to-1 coaching and WhatsApp",
      "Custom roadmap and seat confirmation",
      "Live execution review mindset",
      "Long-term mentorship relationship"
    ]
  }
] as const;

export const serviceFixtures = [
  {
    slug: "market-fundamentals",
    title: "Market Fundamentals",
    summary: "Participants, brokers, sessions, liquidity and volatility.",
    body:
      "Students learn how markets are structured before moving into technical decisions, so every setup starts with context."
  },
  {
    slug: "technical-analysis",
    title: "Technical Analysis",
    summary: "Structure, support/resistance, supply and demand, candles and patterns.",
    body:
      "Chart reading is taught as a repeatable planning skill, not as a promise of guaranteed trade outcomes."
  },
  {
    slug: "smart-money-concepts",
    title: "Smart Money Concepts",
    summary: "Liquidity, sweeps, order blocks, FVG, BOS and CHoCH.",
    body:
      "SMC modules help students understand institutional price-action language and risk-first invalidation."
  },
  {
    slug: "gold-masterclass",
    title: "Gold Masterclass",
    summary: "Gold behavior, news impact, kill zones, scalping and swing context.",
    body:
      "XAUUSD is a core focus, with emphasis on volatility, preparation, and capital-preservation decisions."
  },
  {
    slug: "risk-psychology",
    title: "Risk and Psychology",
    summary: "Position sizing, 1% rule, drawdown control, fear, greed and discipline.",
    body:
      "The academy emphasizes trading psychology, journaling, and risk control before any live-market application."
  },
  {
    slug: "live-market-sessions",
    title: "Live Market Sessions",
    summary: "Weekly analysis, Q&A, trade reviews and live-market application.",
    body:
      "Students apply the roadmap through live education sessions, reviews, and community support without automated execution."
  }
] as const;

export const academyRoadmapFixtures = [
  "Market Basics",
  "Chart Reading",
  "Technical Analysis",
  "Smart Money Concepts",
  "Gold Trading",
  "Risk Management",
  "Psychology",
  "Live Trading"
] as const;

export const academyBonusFixtures = [
  "Trading Journal",
  "Risk Calculator",
  "Position Size Calculator",
  "Trading Plan Template",
  "Economic Calendar Guide",
  "Gold Trading Checklist",
  "Trading Psychology Workbook",
  "Weekly Market Outlook",
  "Lifetime Community Access"
] as const;

export const marketCoverageFixtures = [
  "Gold (XAUUSD)",
  "Forex Major Currency Pairs",
  "Bitcoin (BTC)",
  "Ethereum (ETH)",
  "NASDAQ (US100)",
  "US30 (Dow Jones)",
  "USTECH",
  "Crude Oil"
] as const;

export const faqFixtures = [
  {
    category: "Program Access",
    slug: "program-access",
    items: [
      {
        question: "Is TWC a broker or investment adviser?",
        answer:
          "No. TWC Academy is an education, analysis, mentorship, and community platform. It does not place trades, hold funds, or provide personalised financial advice."
      },
      {
        question: "When does my program access start?",
        answer:
          "Program access starts only after the server receives and verifies a successful payment notification from the configured provider."
      }
    ]
  },
  {
    category: "Payments",
    slug: "payments",
    items: [
      {
        question: "Can the checkout price be changed in the browser?",
        answer:
          "No. Checkout is created server-side from the current package price stored in the database."
      },
      {
        question: "Which payment provider is configured?",
        answer:
          "The platform has a provider-neutral payment layer. Razorpay sandbox is currently configured as the default development adapter and can be replaced with the approved gateway."
      }
    ]
  },
  {
    category: "Telegram",
    slug: "telegram",
    items: [
      {
        question: "How do I join the free Telegram channel?",
        answer:
          "Use the public Join Free Telegram link. Premium access appears in your dashboard only after active program eligibility is confirmed."
      },
      {
        question: "Does TWC copy trades to MT4 or MT5?",
        answer:
          "No. This platform does not include automated trading, trade copying, broker execution, MT4/MT5 integration, or TradingView premium API integration."
      }
    ]
  },
  {
    category: "Risk",
    slug: "risk",
    items: [
      {
        question: "Are results guaranteed?",
        answer:
          "No. Trading involves risk and past information is not a guarantee of future outcomes. Demo placeholders must be replaced with client-approved content before production."
      }
    ]
  }
] as const;

export const resultFixtures = [
  {
    title: "Demo Education Review",
    caption:
      "Demo placeholder showing how a published learning recap can be displayed after client approval.",
    sourceLabel: "Development sample",
    verificationLabel: "Not a performance claim",
    disclosure: "Demo placeholder. Replace with approved client material before production."
  },
  {
    title: "Demo Community Feedback",
    caption:
      "A sample card for approved Telegram feedback, with date, disclosure, and source label fields.",
    sourceLabel: "Development sample",
    verificationLabel: "Pending client approval",
    disclosure: "Demo placeholder. Not real customer feedback."
  }
] as const;

export const testimonialFixtures = [
  {
    authorName: "Demo Member",
    roleLabel: "Academy cohort",
    quote:
      "The dashboard helped me understand what access I had and where to find the learning material.",
    disclosure: "Demo placeholder. Not real customer feedback."
  },
  {
    authorName: "Sample Learner",
    roleLabel: "Gold Masterclass learner",
    quote:
      "The risk notes and session preparation format made the education easier to follow.",
    disclosure: "Demo placeholder. Not real customer feedback."
  }
] as const;

export const legalPages = {
  privacy: {
    title: "Privacy Policy",
    body:
      "This placeholder describes how TWC collects account, payment, consent, support, and Telegram access data. Final wording must be reviewed and approved by qualified legal counsel before production."
  },
  terms: {
    title: "Terms and Conditions",
    body:
      "This placeholder defines program access, acceptable use, account security, payment processing, and platform limitations. Replace with approved legal terms before launch."
  },
  refund: {
    title: "Refund and Cancellation Policy",
    body:
      "This placeholder explains that refunds, cancellations, and program access impact depend on the approved business policy and payment-provider capabilities."
  },
  "trading-risk": {
    title: "Trading Risk Disclaimer",
    body:
      "Trading foreign exchange, commodities, indices, and related markets involves substantial risk. TWC content is educational and informational only and does not guarantee any outcome."
  },
  "financial-advice": {
    title: "Financial Advice Disclaimer",
    body:
      "TWC does not provide personalised investment advice, brokerage services, custody, execution, or automated trading."
  },
  cookies: {
    title: "Cookie Policy",
    body:
      "This placeholder explains necessary, analytics, and marketing cookie categories. Nonessential scripts should load only after user consent."
  }
} as const;
