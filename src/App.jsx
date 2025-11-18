import React, { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { Slider } from "./components/ui/slider";
import { Input } from "./components/ui/input";
import { Badge } from "./components/ui/badge";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { Info } from "lucide-react";
import { useEffect } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";




// --- Data model ---
const METRICS = [
  { 
    key: "marketing", 
    label: "Marketing & SEO", 
    description: "Built-in tools for visibility and customer growth." 
  },
  { 
    key: "store",      
    label: "E-Commerce Core",         
    description: "How powerful and complete the core ecommerce engine is." 
  },
  { 
    key: "payments",   
    label: "Payment Support",             
    description: "Support for iDEAL, SEPA, and other EU-specific payment methods." 
  },
  { 
    key: "admin",      
    label: "Ease of use",             
    description: "How easy it is for staff to manage content, prices, and products." 
  },
  { 
    key: "custom",     
    label: "Design & Customisation",  
    description: "Freedom to control layouts, branding, and theme logic." 
  },
  { 
    key: "scale",      
    label: "Scalability",             
    description: "Ability to expand to new subjects, branches, or cities easily." 
  },
  { 
    key: "ecosystem",  
    label: "Future Integration",      
    description: "Ecosystem for plugins, APIs, booking, and CRM integration." 
  },
  { 
    key: "cost",       
    label: "Total cost",              
    description: "Overall yearly running cost, including apps and fees." 
  }
];

const PLATFORMS = [
  {
    id: "shopify",
    name: "Shopify",
    scores: {
      marketing: 10,
      store: 10,
      payments: 9,
      admin: 9,
      custom: 7,
      scale: 10,
      ecosystem: 9,
      cost: 4
    },
    strengths: [
      "Industry-leading ecommerce and marketing suite",
      "Clean admin interface, easy for teams",
      "Integrates well with EU payment providers"
    ],
    risks: [
      "Booking and service sales require add-ons",
      "Transaction and app fees add up",
      "Theme system limits design freedom compared to Webflow"
    ]
  },

  {
    id: "woocommerce",
    name: "WordPress + WooCommerce",
    scores: {
      marketing: 9,
      store: 9,
      payments: 10,
      admin: 4,
      custom: 10,
      scale: 9,
      ecosystem: 10,
      cost: 7
    },
    strengths: [
      "Total control over products, SEO, and checkout flow",
      "Best EU payment support (Mollie, Adyen, Stripe)",
      "Unlimited design and plugin freedom"
    ],
    risks: [
      "Requires hosting and security maintenance",
      "UI can overwhelm non-technical staff",
      "Complexity grows fast without careful curation"
    ]
  },

  {
    id: "wix",
    name: "Wix",
    scores: {
      marketing: 7,
      store: 7,
      payments: 7,
      admin: 10,
      custom: 6,
      scale: 6,
      ecosystem: 7,
      cost: 9
    },
    strengths: [
      "Fast to launch with all-in-one marketing dashboard",
      "Ideal for small teams and simple product lines",
      "Includes iDEAL and SEPA through Wix Payments"
    ],
    risks: [
      "Limited structure for scaling or multi-brand growth",
      "Shallow analytics compared to Shopify or WooCommerce",
      "Ecosystem less mature than Shopify"
    ]
  },

  {
    id: "webflow",
    name: "Webflow",
    scores: {
      marketing: 6,
      store: 6,
      payments: 6,
      admin: 6,
      custom: 9,
      scale: 7,
      ecosystem: 6,
      cost: 3
    },
    strengths: [
      "Top-tier design control and branding precision",
      "CMS structure fits content-rich tutoring or course sites",
      "Native SEO fields and integrations with analytics tools"
    ],
    risks: [
      "Ecommerce features limited for service models",
      "Fewer built-in marketing automations",
      "Higher cost once CMS and Ecommerce plans combine"
    ]
  },

  {
    id: "squarespace",
    name: "Squarespace",
    scores: {
      marketing: 4,
      store: 4,
      payments: 1,
      admin: 7,
      custom: 4,
      scale: 4,
      ecosystem: 4,
      cost: 6
    },
    strengths: [
      "Strong branding control for visual businesses",
      "Decent SEO and email marketing integration for simple use cases"
    ],
    risks: [
      "No iDEAL or SEPA support for EU merchants",
      "Very limited extensibility and plugin ecosystem"
    ]
  },

  {
    id: "framer",
    name: "Framer",
    scores: {
      marketing: 3,
      store: 3,
      payments: 4,
      admin: 3,
      custom: 7,
      scale: 3,
      ecosystem: 3,
      cost: 10
    },
    strengths: [
      "Fast, inexpensive for small, design-focused sites",
      "Excellent visuals for simple marketing landing pages"
    ],
    risks: [
      "Lacks serious ecommerce or marketing automation",
      "Not suitable for scaling or multi-service stores"
    ]
  },

  {
    id: "kajabi",
    name: "Kajabi",
    scores: {
      marketing: 1,
      store: 1,
      payments: 3,
      admin: 1,
      custom: 1,
      scale: 1,
      ecosystem: 1,
      cost: 1
    },
    strengths: [
      "Strong built-in email automation for course creators",
      "All-in-one system requires no external hosting"
    ],
    risks: [
      "Weak general ecommerce and SEO tools",
      "Rigid templates and high price for narrow functionality"
    ]
  }
];

const PLATFORM_COMMENTS = {
  shopify: {
    marketing: "Among hosted platforms, Shopify has the deepest marketing toolkit — robust SEO structure, analytics, and native ad integrations. WooCommerce can match it with plugins, but few others come close.",
    store: "Very strong cart and checkout. Less flexible than WooCommerce, but far more robust than Wix, Webflow, or Framer.",
    payments: "Solid EU coverage via Mollie/Stripe. Not as native or broad as WooCommerce. Much better than Squarespace or Kajabi.",
    admin: "Cleaner than WooCommerce and Webflow. Less hand-holding than Wix. Easier than Framer for non-designers.",
    custom: "Liquid themes allow moderate depth. Less freedom than WooCommerce or Webflow. More control than Wix or Squarespace.",
    scale: "Handles growth as well as WooCommerce with less ops work. Scales better than Wix, Squarespace, or Framer.",
    ecosystem: "Large, reliable app store. Not as endless as WooCommerce, but higher quality than Wix or Squarespace.",
    cost: "Higher recurring app and transaction fees. Usually pricier than Wix or Framer. Cheaper than Kajabi for general ecommerce."
  },

  woocommerce: {
    marketing: "Excellent SEO and marketing potential via WordPress plugins. Beats Shopify in raw flexibility but needs technical setup to reach parity. Wix and Squarespace are much more limited.",
    store: "Most flexible model and checkout control. Can outclass Shopify with effort. Heavier setup than Wix or Squarespace.",
    payments: "Best EU mix via Mollie/Adyen/Stripe. Broader and cleaner than Shopify, Webflow, or Wix. Squarespace lags far behind.",
    admin: "Powerful but busy. Harder than Shopify and Wix. Easier to break than hosted tools like Squarespace.",
    custom: "Full code access beats all others. Webflow rivals visual freedom but lacks backend range.",
    scale: "Matches or exceeds Shopify if hosted well. Needs maintenance, unlike Wix or Squarespace. Framer cannot follow.",
    ecosystem: "Widest selection. Quality varies more than Shopify’s store. Deeper than Wix, Webflow, or Squarespace.",
    cost: "Hosting + plugins can be efficient at scale. Cheaper long-term than Shopify add-ons in complex builds. Not as cheap as Framer for small sites."
  },

  wix: {
    marketing: "Good built-in SEO controls and email marketing tools. Easier to use than WooCommerce or Webflow, but less advanced analytics and ad integrations than Shopify.",
    store: "Simple store that works. Less powerful than Shopify or WooCommerce. Smoother than Webflow or Framer for basics.",
    payments: "iDEAL and SEPA via Wix Payments. Not as flexible as WooCommerce or Shopify with Mollie. Ahead of Squarespace and Kajabi.",
    admin: "Easiest for non-technical teams. Simpler than Shopify and miles easier than WooCommerce or Webflow.",
    custom: "Template edits are fine. Far less control than Webflow or WooCommerce. Comparable to Squarespace.",
    scale: "OK for small catalogs. Falls behind Shopify and WooCommerce as you add subjects or branches.",
    ecosystem: "Enough apps for small ops. Shallower than Shopify and WooCommerce. Broader than Framer.",
    cost: "Predictable bundle pricing. Cheaper than Shopify in many cases. More than Framer at the very low end."
  },

  webflow: {
    marketing: "Strong SEO and structured data tools, better than Wix or Squarespace. Marketing automations lag far behind Shopify or WooCommerce.",
    store: "Great visuals. Ecommerce features lag behind Shopify and WooCommerce. More usable than Framer for catalogs.",
    payments: "Stripe works. EU options are narrower than WooCommerce and often trickier than Shopify. Better than Squarespace or Kajabi.",
    admin: "Structured but needs training. Easier than WooCommerce. Harder than Wix and Shopify.",
    custom: "Best design control of hosted tools. Backend logic still trails WooCommerce. More flexible than Wix or Squarespace.",
    scale: "Handles mid-size well. Large catalogs push you to automations. Shopify and WooCommerce scale more cleanly.",
    ecosystem: "Decent via Zapier/Make and APIs. Smaller native marketplace than Shopify or WooCommerce. Ahead of Framer.",
    cost: "CMS + Ecommerce plans get pricey. Often more than Wix. Can rival Shopify once add-ons are counted."
  },

  squarespace: {
    marketing: "Decent SEO and email basics. Simpler than Webflow or WooCommerce but shallower than Shopify. Not ideal for serious campaign tracking or multilingual SEO.",
    store: "Beautiful templates. Basic store only. Trails Shopify and WooCommerce in features. Easier than Webflow.",
    payments: "Stripe only in practice. Lacks native iDEAL/SEPA. Worst EU fit here with Kajabi.",
    admin: "Polished and simple. Easier than WooCommerce or Webflow. Similar to Wix, but less flexible.",
    custom: "Template-first approach. Less control than Webflow and WooCommerce. Comparable to Wix.",
    scale: "Fine for small catalogs. Falls behind Shopify and WooCommerce quickly. Webflow scales better for structured content.",
    ecosystem: "Limited extensions. Behind Shopify and WooCommerce by a lot. Narrower than Wix.",
    cost: "Flat pricing is fair. Cheaper than Shopify for tiny stores. Not as low as Framer."
  },

  framer: {
    marketing: "Minimal SEO and almost no marketing automation. Fine for quick landing pages but nowhere near Shopify, WooCommerce, or even Wix.",
    store: "Minimal store features. Good for a few items. Not competitive with Shopify, WooCommerce, or even Wix.",
    payments: "Stripe-centric. EU options weaker than WooCommerce or Shopify with Mollie. Similar to Webflow embeds.",
    admin: "Very light CMS. Easier than WooCommerce, but less practical than Wix or Shopify for operations.",
    custom: "Strong visuals for landing pages. Far less functional depth than Webflow or WooCommerce.",
    scale: "Not built for large catalogs. Lags behind all others as you grow.",
    ecosystem: "Sparse. Embeds and custom code only. Smallest marketplace here.",
    cost: "Cheapest to run. Good for MVPs. You outgrow it faster than any other option."
  },

  kajabi: {
    marketing: "Focused on email sequences and funnels for course creators. Much weaker SEO and campaign flexibility than Shopify or WooCommerce. Similar limits to Squarespace.",
    store: "Excellent for courses and memberships. Poor fit for general ecommerce. Trails even Wix for service sales.",
    payments: "Stripe checkout. Weak EU options vs WooCommerce or Shopify. Similar limits to Squarespace.",
    admin: "Creator-friendly, but narrow. Easier than WooCommerce. Less useful than Shopify or Wix for services.",
    custom: "Rigid templates. Less control than all others except Framer’s backend.",
    scale: "Scales within the course model only. Not suited for multi-subject service catalogs like Shopify or WooCommerce.",
    ecosystem: "Closed system. Far fewer integrations than Shopify or WooCommerce. Even Wix is broader.",
    cost: "High subscription for limited flexibility. Often the worst value here unless you sell only courses."
  }
};

function normalizeForRadar(scores) {
  // Recharts Radar expects an array of { metric, value }
  return METRICS.map((m) => ({ metric: m.label, value: scores[m.key] }));
}

function ScorePills({ scores }) {
  return (
    <div className="flex flex-wrap gap-2">
      {METRICS.map((m) => (
        <Badge key={m.key} variant="secondary" className="rounded-2xl px-3 py-1 text-xs">
          {m.label}: {scores[m.key]}
        </Badge>
      ))}
    </div>
  );
}

function PlatformCard({ platform, large }) {
  const data = useMemo(() => normalizeForRadar(platform.scores), [platform]);
  return (
    <Card
      className={`border rounded-xl p-4 bg-white 
        w-full min-h-[460px] sm:min-h-[420px]
        shadow-sm transition-transform duration-200 
        flex flex-col justify-center items-center
      ${large ? " max-w-[1050px] border-2 border-yellow-500 bg-yellow-50" : 
        "max-w-[750px] scale-y-10 border-gray-300 bg-gray-50"}`}
    >


      <CardHeader className="pb-2 w-full flex justify-between items-center">
        <CardTitle className="text-base sm:text-lg font-semibold text-gray-800">
          {platform.name}
        </CardTitle>
        <div
          className={`text-sm sm:text-base font-medium ${
            platform.weightedScore >= 8 
              ? "text-green-600"
              : platform.weightedScore >= 6
              ? "text-yellow-600"
              : "text-gray-500"
          }`}
        >
        {platform.weightedScore.toFixed(1)}/10
        </div>
      </CardHeader>

      <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 sm:gap-10 items-center">
        <div className="h-52 sm:h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={data} outerRadius="70%">
              <PolarGrid />
              <PolarAngleAxis dataKey="metric" tick={{ fontSize: 9 }} />
              <PolarRadiusAxis angle={90} domain={[0, 10]} tick={{ fontSize: 9 }} />
              <Radar
                name={platform.name}
                dataKey="value"
                stroke="#111827"
                fill="#111827"
                fillOpacity={0.3}
              />              
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  const { metric, value } = payload[0].payload;
                  const metricKey = METRICS.find((m) => m.label === metric)?.key;
                  const comment = PLATFORM_COMMENTS[platform.id]?.[metricKey];
                  return (
                    <div className="bg-white border border-gray-200 rounded-md p-2 shadow-sm text-xs max-w-[200px]">
                      <div className="font-semibold text-gray-800 mb-1">{metric}</div>
                      <div className="text-gray-600 mb-1">Score: {value}/10</div>
                      <div className="text-gray-500">{comment}</div>
                    </div>
                  );
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        {large ? <div className="text-xs italic text-center">(Click on a point to see details)</div> : ""}
        </div>
        <div className="space-y-3 text-sm sm:text-base">
          <div>
            <h4 className="font-semibold text-sm mb-1">Strengths</h4>
            <ul className="list-disc list-inside text-gray-600">
              {platform.strengths.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-1">Risks</h4>
            <ul className="list-disc list-inside text-gray-600">
              {platform.risks.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </div>
          <ScorePills scores={platform.scores} />
        </div>
      </CardContent>
    </Card>
  );
}

export default function App() {
  const [showTitle, setShowTitle] = useState(false);
  const [logoExited, setLogoExited] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [showApp, setShowApp] = useState(false);
  const [playAnimation, setPlayAnimation] = useState(false);
  const [query, setQuery] = useState("");

  const [weights, setWeights] = useState(() => {
    const w = {};
    METRICS.forEach((m) => (w[m.key] = 5));
    return w;
  });

  useEffect(() => {
    if (playAnimation) {
      const timer = setTimeout(() => setShowApp(true), 1200);
      return () => clearTimeout(timer);
    }
  }, [playAnimation]);

  const scoredPlatforms = useMemo(() => {
    return PLATFORMS.map((p) => {
      let weightedSum = 0;
      let totalWeight = 0;
      METRICS.forEach((m) => {
        weightedSum += p.scores[m.key] * weights[m.key];
        totalWeight += weights[m.key];
      });
      const weightedAvg = totalWeight > 0 ? weightedSum / totalWeight : 0;
      const normalized = (weightedAvg / 10) * 10; // scale to 0–10
      return { ...p, weightedScore: normalized };
    });
  }, [weights]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return scoredPlatforms
      .filter((p) => p.name.toLowerCase().includes(q))
      .sort((a, b) => b.weightedScore - a.weightedScore);
  }, [query, scoredPlatforms]);

  return (
    <div className="min-h-screen bg-white">
      <main className="min-h-screen flex flex-col items-center justify-center bg-white overflow-hidden">
        <AnimatePresence>
          {!showApp && (
            <motion.div
              key="landing"
              className="fixed inset-0 flex flex-col items-center justify-center"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.6, ease: "easeInOut" } }}
            >
              <div className="relative flex flex-col items-center justify-center space-y-4">
                <LogoAnimation
                  onShowTitle={() => setShowTitle(true)}
                  onExitComplete={() => {
                    setLogoExited(true);
                    setTimeout(() => setShowApp(true), 800);
                  }}
                />
                  <motion.h1
                    key="title"
                    className="text-4xl sm:text-5xl text-center font-bold text-gray-900 bg-white/95 backdrop-blur-sm"
                    initial={{ opacity: 0, y: 60 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  > Website<br/>Platform Selector
                  </motion.h1>
              </div>
            </motion.div>
          )}

        {showApp && (
          <motion.div
            key="main"
            initial={{ opacity: 0, y: 80 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="pt-24" // <-- add some top padding for the header space

          >

            <h1 className="fixed top-0 left-0 w-full text-center text-3xl sm:text-5xl font-bold text-gray-900 bg-white/95 backdrop-blur-sm py-4 z-20">
              Platform Selector
            </h1>
            <div className="max-w-12xl mx-auto px-3 sm:px-6 py-6 flex flex-col items-center space-y-6">
              <section className="max-w-6xl text-center">
                <h1 className="mb-4 text-sm sm:text-base">How important is...</h1>
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 sm:grid-cols-4 lg:grid-cols-4 gap-4 sm:gap-6 justify-items-center">
                  {METRICS.map((m) => (
                    <div key={m.key} className="flex flex-col items-center space-y-2 w-full">
                      <span className="text-[10px] sm:text-xs font-semibold text-center">{m.label}</span>
                      <div className="text-[10px] text-gray-500 h-[32px] flex items-center justify-center text-center px-1">
                        {m.description}
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="10"
                        step="1"
                        value={weights[m.key]}
                        onChange={(e) => setWeights({...weights, [m.key]: Number(e.target.value) })}
                        className="w-full accent-yellow-500"
                      />
                      <div className="text-[10px] sm:text-xs text-gray-600">{weights[m.key]}</div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="w-full mx-auto py-6 sm:py-10 space-y-8 sm:space-y-10">
                {filtered.length > 0 && (
                  <div className="flex justify-center">
                    <PlatformCard platform={filtered[0]} large={true} />
                  </div>
                )}

                <div className="grid grid-cols-1 justify-center gap-10 justify-items-center items-center">
                  {filtered.slice(1, 7).map((p) => (
                    <div key={p.id} >
                      <PlatformCard platform={p} large={false} />
                    </div>
                  ))}
                </div>

              </section>
              <footer className="py-8" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      </main>
    </div>
  );
}

export function LogoAnimation({ onShowTitle, onExitComplete }) {
  const barControls = useAnimation();
  const topControls = useAnimation();
  const bottomControls = useAnimation();
  const dotControls = useAnimation();
  const textControls = useAnimation();
  const [hovered, setHovered] = useState(false);
  const [exiting, setExiting] = useState(false);
  const logoGroupControls = useAnimation();
  const x_size = 120;
  const y_size = 50;
  // --- Hover sequence ---
  useEffect(() => {
    if (hovered) {
      // bar drops
      barControls.start({
        rotate: -90,
        y: 60,
        x: 10,
        originX: 0,
        transition: { type: "spring", stiffness: 40, damping: 12, duration: 1.8 },
      });

      // circles move apart
      topControls.start({
        y: -80,
        x: 1,
        scale: 3,
        rotate: 0,
        borderRadius: "50%",
        transition: {
          type: "spring",
          stiffness: 60,
          damping: 10,
          delay: 0.05,
        },
      });
      bottomControls.start({
        y: 10,
        x: 9,
        scale: 4,
        rotate: 0,
        borderRadius: "50%",
        transition: {
          type: "spring",
          stiffness: 60,
          damping: 10,
          delay: 0.1,
        },
      });

      // flatten left edges after they settle
      setTimeout(() => {
        topControls.start({
          borderTopLeftRadius: "0%",
          borderBottomLeftRadius: "0%",
          borderTopRightRadius: "50%",
          borderBottomRightRadius: "50%",
          transition: { duration: 0.6, ease: "easeInOut", delay: 0.05 },
        });
        bottomControls.start({
          borderTopLeftRadius: "0%",
          borderBottomLeftRadius: "0%",
          borderTopRightRadius: "50%",
          borderBottomRightRadius: "50%",
          transition: { duration: 0.6, ease: "easeInOut", delay: 0.25 },
        });
      }, 150);

      // dot pop
      setTimeout(() => {
        dotControls.start({
          y: 50,
          x: 70,
          scale: 1.8,
          // borderRadius: "70%",
          transition: { type: "spring", stiffness: 80, damping: 8},
        });
      }, 250);

      // show text
      setTimeout(() => {
        textControls.start({
          opacity: 0,
          transition: { duration: 0.2, ease: "easeOut" },
        });
      }, 10);
    // } else {
    //   // revert to idle
    //   barControls.start({
    //     rotate: 0,
    //     y: 0,
    //     transition: { type: "spring", stiffness: 60, damping: 12, duration: 1.5 },
    //   });
    //   topControls.start({
    //     y: 0,
    //     scale: 1,
    //     rotate: 0,
    //     borderRadius: "40%",
    //     borderTopLeftRadius: "40%",
    //     borderBottomLeftRadius: "40%",
    //     borderTopRightRadius: "40%",
    //     borderBottomRightRadius: "40%",
    //     transition: { type: "spring", stiffness: 50, damping: 14 },
    //   });
    //   bottomControls.start({
    //     y: 0,
    //     scale: 1,
    //     rotate: 0,
    //     borderRadius: "40%",
    //     borderTopLeftRadius: "40%",
    //     borderBottomLeftRadius: "40%",
    //     borderTopRightRadius: "40%",
    //     borderBottomRightRadius: "40%",
    //     transition: { type: "spring", stiffness: 50, damping: 14 },
    //   });
    //   dotControls.start({
    //     y: 0,
    //     x: 0,
    //     scale: 1,
    //     transition: { type: "spring", stiffness: 80, damping: 12 },
    //   });
    //   textControls.start({
    //     opacity: 1,
    //     transition: { duration: 0.5 },
    //   });
    }}, [
    hovered,
    barControls,
    topControls,
    bottomControls,
    dotControls,
    textControls,
        ]);

  // useEffect(() => {
      // if (exiting) {
      //   // whole logo falls, rotates 90°, bounces, then disappears
      //   logoGroupControls.start({
      //     rotate: 0,
      //     opacity: 0,
      //     transition: {
      //       duration: 1.4,
      //       ease: "easeInOut",
      //       times: [0, 0.55, 0.75, 1]
      //     }
        // }).then(() => {
        //   logoGroupControls.start({
        //     scale: 1,
        //     opacity: 1,
        //     transition: { duration: 0.4, ease: "easeInOut" }
        //   });
    //     });
    //   }
    // }, [exiting]);
  // --- Idle wiggle & shape morph ---
    useEffect(() => {
      if (!hovered && !exiting) {
        topControls.start({
          x: [-x_size, -x_size, x_size, x_size, -x_size],
          y: [-y_size, y_size, y_size, -y_size, -y_size],
          borderRadius: ["100%", "70%", "50%", "20%", "50%", "70%", "50%", "20%", "50%"],
          rotate: [0, 920],
          transition: {
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.4,
          },
        });
        bottomControls.start({
          x: [-x_size, -x_size, x_size, x_size, -x_size],
          y: [-y_size, y_size, y_size, -y_size, -y_size],
          borderRadius: ["100%", "70%", "50%", "20%", "50%", "70%", "50%", "20%", "50%"],
          rotate: [0, 920],
          transition: {
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.0,
          },
        });
        dotControls.start({
          x: [-x_size, -x_size, x_size, x_size, -x_size],
          y: [-y_size, y_size, y_size, -y_size, -y_size],
          borderRadius: ["100%", "70%", "50%", "20%", "50%", "70%", "50%", "20%", "50%"],
          rotate: [0, 920],
          transition: {
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.6,
          },
        });
      }
    }, [hovered, exiting, barControls, topControls, bottomControls, dotControls]);

  return (
    <motion.div
      className="relative w-48 h-48 flex items-center justify-center cursor-pointer"
      onClick={() => {
        setHovered(true);
        onShowTitle?.();                    // parent shows title
        setTimeout(() => setExiting(true), 2600); // begin drift up
        setTimeout(() => onExitComplete?.(), 2300); // parent shows main app
      }}
      >

      <div className="absolute inset-0" />


    <motion.div
        className="relative w-full h-full flex items-center justify-center"
        animate={logoGroupControls}
        initial={{ rotate: 0, y: 0, scale: 1, opacity: 1 }}
        style={{ originX: 0.5, originY: 0.5 }} // rotation center
      >
        {/* Bar */}
        <motion.div
          className="absolute bg-[#e7bc2f] rounded-md flex items-center justify-center"
          style={{ width: "200px", height: "50px", zIndex: 10, }}
          
          animate={barControls}
          initial={{ rotate: 0, y: 0 }}
        >
          <motion.span
            className="text-white font-medium text-sm select-none"
            animate={textControls}
            initial={{ opacity: 1 }}
          >
            Start
          </motion.span>
        </motion.div>

        {/* Top squircle */}
        <motion.div
          className="absolute bg-[#e7bc2f]"
          style={{ width: "15px", height: "15px" }}
          animate={topControls}
          initial={{ borderRadius: "50%", y: 0, scale:1, rotate: 0 }}
        />

        {/* Bottom squircle */}
        <motion.div
          className="absolute bg-[#e7bc2f]"
          style={{ width: "15px", height: "15px" }}
          animate={bottomControls}
          initial={{ borderRadius: "50%", y: 0, scale:2, rotate: 0 }}
        />
        {/* Dot */}
        <motion.div
          className="absolute bg-[#e7bc2f]"
          style={{ width: "8px", height: "8px", borderRadius: "50%" }}
          animate={dotControls}
          initial={{ y: 0, scale: 1 }}
        />
        </motion.div>
    </motion.div>
  );
}
