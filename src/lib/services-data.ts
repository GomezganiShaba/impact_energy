export interface ServiceDetail {
  slug: string;
  num: string;
  title: string;
  shortDesc: string;
  tag: string;
  image: string;
  alt: string;
  heroHeadline: string;
  overview: string;
  whatToExpect: {
    title: string;
    description: string;
  }[];
  components: string[];
  keyApplications: string[];
  operationalModel?: {
    heading: string;
    points: string[];
  };
  impact: {
    metric: string;
    label: string;
  }[];
}

export const SERVICES_DETAILED: ServiceDetail[] = [
  {
    slug: "standalone-hybrid-solar",
    num: "01",
    title: "Standalone & Hybrid Solar Systems",
    shortDesc:
      "Panels, charge controller, inverter and battery bank sized for a home, shop or clinic, fully off-grid or hybrid with backup during outages.",
    tag: "Power & Backup",
    image: "/images/services/service-solar-system.jpg",
    alt: "Solar panels mounted on rooftop by Impact Energy Solution",
    heroHeadline: "Reliable electricity for homes, farms and commercial enterprises.",
    overview:
      "Impact Energy Solution (IES) designs and installs bespoke standalone and hybrid solar power systems tailored to your exact load requirements. Rather than selling generic off-the-shelf packages, our renewable energy professionals conduct thorough on-site energy audits in Lilongwe and across Malawi to size generation, conversion, and energy storage capacity for 24/7 reliability.",
    whatToExpect: [
      {
        title: "Site Load Audit & Sizing",
        description:
          "Our engineers measure your peak and continuous electrical loads, roof structural integrity, and solar irradiance to engineer the optimum kilowatt-hour system.",
      },
      {
        title: "Certified Engineering & Installation",
        description:
          "Professional mounting, fire-safe DC wiring, surge protection, inverter programming, and clean battery enclosure installation by our in-house crew.",
      },
      {
        title: "Seamless Hybrid Switching",
        description:
          "Instant automatic changeover during ESCOM grid outages, zero flicker for sensitive electronics, and smart battery preservation.",
      },
      {
        title: "Digital Performance Tracking",
        description:
          "Integration of digital monitoring tools enabling real-time generation tracking, storage level visibility, and preemptive fault alerts.",
      },
    ],
    components: [
      "Tier-1 Monocrystalline Solar PV Modules",
      "Pure Sine Wave Hybrid Inverters",
      "MPPT High-Efficiency Charge Controllers",
      "Deep-Cycle Lithium Iron Phosphate (LiFePO4) or Gel Batteries",
      "Industrial AC/DC Surge Protection & Earthing",
      "Digital Remote Monitoring System",
    ],
    keyApplications: [
      "Residential Homes and Estates (Area 23, Area 49, and beyond)",
      "Rural Clinics, Maternity Wards, and Health Centres",
      "Off-grid Schools, Laboratories, and Administrative Offices",
      "Commercial Retail Outlets, Salons, and Cold Storage",
      "Productive-Use Small Enterprises & Workshops",
    ],
    operationalModel: {
      heading: "Clean Energy Distribution & Last-Mile Delivery",
      points: [
        "Distributed through IES regional distribution hubs in Lilongwe.",
        "Door-to-door demonstrations and community marketing by trained local agents.",
        "Digital sales tracking and mobile payment integration for flexible access.",
        "Dedicated technical support teams available 7 days a week.",
      ],
    },
    impact: [
      { metric: "100%", label: "Power uptime during grid blackouts" },
      { metric: "0kg", label: "Fossil fuel emissions compared to generators" },
      { metric: "10-25+", label: "Years expected solar panel design lifespan" },
    ],
  },
  {
    slug: "solar-water-pumping",
    num: "02",
    title: "Solar Water Pumping & Irrigation",
    shortDesc:
      "Borehole and tank-tower pumping for homes, institutions and farms, including drip-irrigation setups like the Dowa Mpisi project.",
    tag: "Water & Agriculture",
    image: "/images/services/service-water-pumping.jpg",
    alt: "Solar-fed tank tower and greenhouse irrigation installation",
    heroHeadline: "Lifesaving water delivery and productive irrigation powered by the sun.",
    overview:
      "Solar water pumping transforms livelihoods by eliminating dependence on costly diesel pumps or erratic manual collection. From domestic borehole pumping to community tap stands and large-scale agricultural drip irrigation (as proven at our landmark Dowa Mpisi solar water pumping and greenhouse project), IES delivers turnkey water security across Malawi.",
    whatToExpect: [
      {
        title: "Hydrogeological Assessment",
        description:
          "Verification of borehole yield, static water level, pumping head, and daily water volume requirements before recommending pump specifications.",
      },
      {
        title: "Civil, Plumbing & Tower Construction",
        description:
          "Structural tank-tower erection, pump-house construction, underground distribution pipework, and secure waterpoint tap stands.",
      },
      {
        title: "Productive Use of Energy (PUE)",
        description:
          "Direct integration with modern drip-irrigation manifolds, greenhouse watering lines, and livestock watering troughs to boost agricultural incomes.",
      },
      {
        title: "Automatic Pressure & Float Controls",
        description:
          "Dry-run borehole protection sensors and automatic high-tank float switches that prevent overflow and motor burnout.",
      },
    ],
    components: [
      "Brushless DC or AC Solar Submersible Borehole Pumps",
      "Direct Solar VFD Pump Inverters with MPPT Tracking",
      "Reinforced Steel Tank Elevation Towers (3m, 6m, or 9m)",
      "Food-Grade Polyethylene Storage Reservoirs",
      "Precision Drip Lines, Filters, and Flow Regulators",
      "Security Brick Pump House & Concrete Tap Stands",
    ],
    keyApplications: [
      "Commercial Farms, Horticultural Greenhouses, and Seed Nurseries",
      "Community Boreholes and Rural Village Tap Stands",
      "Boarding Schools, Mission Hospitals, and Orphanages",
      "Livestock and Poultry Farming Water Points",
      "Private Residences and Area 23 & 49 Compounds",
    ],
    operationalModel: {
      heading: "Productive Use of Energy (PUE) Model",
      points: [
        "Structured around agricultural productivity and year-round harvesting.",
        "Demonstrated through the successful Dowa Mpisi greenhouse and irrigation system.",
        "Collaboration with local farming cooperatives, NGOs, and irrigation specialists.",
        "Routine water yield monitoring and preventative pump servicing.",
      ],
    },
    impact: [
      { metric: "0 MWK", label: "Ongoing diesel fuel expenses for pumping" },
      { metric: "3x", label: "Potential crop yields with year-round irrigation" },
      { metric: "10,000+", label: "Litres pumped daily per standard installation" },
    ],
  },
  {
    slug: "mini-grids",
    num: "03",
    title: "Decentralized Mini-Grids",
    shortDesc:
      "Shared generation and distribution for a cluster of homes, a village centre or a small estate.",
    tag: "Community Power",
    image: "/images/services/service-mini-grids.jpg",
    alt: "Inverter and mini-grid distribution board electrical installation",
    heroHeadline: "Scalable mini-grid generation bringing clean power to entire clusters.",
    overview:
      "When communities, trade centres, or residential estates are beyond the national grid, IES engineers decentralized solar mini-grids. By aggregating solar generation, heavy-duty battery banks, and a local low-voltage distribution network, we power clusters of households, shops, grain mills, and refrigeration units with transparent digital metering.",
    whatToExpect: [
      {
        title: "Community Demand Profiling",
        description:
          "Comprehensive mapping of household consumption, small business machinery, street lighting needs, and projected seasonal growth.",
      },
      {
        title: "Central Generation & Storage Hub",
        description:
          "Ground-mounted or rooftop solar arrays coupled to centralized three-phase inverter banks and modular energy storage enclosures.",
      },
      {
        title: "Distribution Reticulation & Metering",
        description:
          "Pole-mounted overhead lines, drop cables, individual consumer distribution boards, and pre-paid smart metering options.",
      },
      {
        title: "Local Community Management",
        description:
          "Training of resident operators and community committees to handle primary customer support, meter reading, and tariff collection.",
      },
    ],
    components: [
      "Central High-Capacity Solar PV Field",
      "Three-Phase Synchronized Grid-Forming Inverters",
      "Heavy-Duty Industrial Battery Bank Storage",
      "Low-Voltage Distribution Reticulation & Poles",
      "Consumer Connection Interface Units with Circuit Breakers",
      "Digital Remote SCADA & Smart Metering Interface",
    ],
    keyApplications: [
      "Rural Trading Centres and Market Towns",
      "Agricultural Settlements and Farming Estates",
      "Lakeside Fishing Communities and Tourism Lodges",
      "Institutional Campuses, Colleges, and Hospital Compounds",
      "Planned Subdivisions and Housing Cooperatives",
    ],
    operationalModel: {
      heading: "Agent Network & Community Governance",
      points: [
        "Operates through Level 1 Regional Hub (IES) oversight and logistics.",
        "Level 2 Community Sales and Service Agents manage customer connections.",
        "Digital customer management and transparent sales monitoring.",
        "Partnerships with development agencies, local councils, and microfinance.",
      ],
    },
    impact: [
      { metric: "24/7", label: "Reliable power for micro-enterprises and shops" },
      { metric: "100s", label: "Of households connected from a single station" },
      { metric: "MERA", label: "Full safety and regulatory compliance" },
    ],
  },
  {
    slug: "clean-cooking",
    num: "04",
    title: "Clean Cooking Technologies",
    shortDesc:
      "Efficient stoves and fuel alternatives that cut smoke and firewood use.",
    tag: "Clean Fuel & Health",
    image: "/images/services/service-clean-cooking.jpg",
    alt: "Clean energy technologies promoting environmental sustainability",
    heroHeadline: "Modern cooking technologies protecting families and forests.",
    overview:
      "Indoor air pollution from traditional firewood and charcoal cooking remains one of Malawi's most urgent health and deforestation challenges. IES implements a proven, decentralized last-mile distribution model for high-efficiency cookstoves and sustainable biomass pellet fuels, bringing affordable, smokeless cooking to rural and peri-urban homes.",
    whatToExpect: [
      {
        title: "Household Product Demonstrations",
        description:
          "Our trained community sales agents conduct live cooking demonstrations in neighborhoods, churches, and local markets to show fuel savings.",
      },
      {
        title: "Guaranteed Pellet Fuel Supply",
        description:
          "Reliable access to biomass pellets stocked through our Lilongwe regional hub and local community distribution nodes.",
      },
      {
        title: "Dramatically Reduced Smoke",
        description:
          "Up to 90% reduction in harmful particulate emissions, protecting mothers and children from respiratory illness and eye irritation.",
      },
      {
        title: "Customer Retention & Follow-up",
        description:
          "Ongoing household check-ins by local agents to ensure user comfort, stove maintenance, and uninterrupted fuel delivery.",
      },
    ],
    components: [
      "Forced-Air Gasifying Clean Cookstoves (Micro-Gasifiers)",
      "High-Density Agricultural Biomass Pellets",
      "Thermal Insulated Rocket Stoves for Large Families",
      "Institutional Biomass Cooking Stoves for Schools",
      "Built-in Rechargeable Fan Batteries with Solar Charging",
      "Community Distribution Hub Inventory Systems",
    ],
    keyApplications: [
      "Peri-Urban Households in Lilongwe (Area 23, Area 49, and surrounds)",
      "Rural Households Seeking Firewood Independence",
      "School Feeding Programs and Boarding Institutions",
      "Restaurants, Bakeries, and Roadside Food Vendors",
      "Community Kitchens and Church Gathering Facilities",
    ],
    operationalModel: {
      heading: "IES Clean Cooking Distribution Model",
      points: [
        "Regional Distribution Hub: Central Lilongwe storage for stoves and pellet fuels.",
        "Community Sales Agents: Recruited and trained locally for door-to-door sales.",
        "Direct Engagement: Product demonstrations at markets, gatherings, and homes.",
        "Customer Retention: Sustained pellet fuel supply and regular follow-up visits.",
      ],
    },
    impact: [
      { metric: "60-80%", label: "Reduction in household cooking fuel expenses" },
      { metric: "90%", label: "Reduction in toxic indoor smoke and soot" },
      { metric: "0", label: "Dependence on endangered indigenous forest charcoal" },
    ],
  },
  {
    slug: "biogas",
    num: "05",
    title: "Biogas Installation & Waste-to-Energy",
    shortDesc:
      "Digesters that turn farm and kitchen waste into cooking gas.",
    tag: "Renewable Gas",
    image: "/images/services/service-biogas.jpg",
    alt: "Biogas digester and pump house infrastructure in Malawi",
    heroHeadline: "Turn farm and kitchen waste into unlimited free cooking gas.",
    overview:
      "Biogas technology converts animal manure, agricultural crop residues, and kitchen organic waste into clean, pressurized methane gas for cooking and lighting, while yielding nutrient-rich organic bio-slurry fertilizer. IES designs and builds fixed-dome and pre-fabricated tubular digesters for households, dairy farms, and institutions across Malawi.",
    whatToExpect: [
      {
        title: "Feedstock & Waste Audit",
        description:
          "Evaluation of available daily organic feedstock (cattle dung, pig waste, food scraps) and water volume to precisely determine digester cubic capacity.",
      },
      {
        title: "Masonry & Digester Construction",
        description:
          "High-durability brickwork, gas-tight plastering, inlet mixing chamber construction, and overflow bio-slurry collection pits.",
      },
      {
        title: "Gas Piping & Safety System",
        description:
          "Installation of UV-resistant gas piping, pressure relief safety valves, water drain traps, and specialized biogas burners.",
      },
      {
        title: "Bio-Slurry Fertilizer Utilization",
        description:
          "Instruction on harvesting and applying enriched organic bio-slurry to crops, eliminating the need for expensive chemical fertilizers.",
      },
    ],
    components: [
      "Heavy-Duty Brick & Concrete Fixed Dome Digesters (6m³ to 50m³)",
      "High-Density Polyethylene Continuous Tubular Digesters",
      "High-Pressure Biogas Distribution Piping & Manometers",
      "Inline Gas Scrubbers (H2S and Moisture Removal)",
      "High-Efficiency Cast-Iron Biogas Stoves and Burners",
      "Digestate Organic Fertilizer Conditioning Chambers",
    ],
    keyApplications: [
      "Dairy and Livestock Smallholders with 2+ Cattle or Pigs",
      "Commercial Piggeries and Poultry Operations",
      "Boarding Schools and Agricultural Colleges with Kitchen Waste",
      "Eco-Lodges and Sustainable Demonstration Farms",
      "Peri-Urban Compounds with Livestock and Vegetable Gardens",
    ],
    operationalModel: {
      heading: "Circular Waste-to-Energy Ecosystem",
      points: [
        "Site evaluation and civil engineering supervised by our technical crew.",
        "Zero ongoing fuel costs: fed completely by daily livestock and kitchen waste.",
        "Dual benefits: continuous clean cooking gas plus organic farm fertilizer.",
        "Routine pressure checks, valve servicing, and user maintenance training.",
      ],
    },
    impact: [
      { metric: "100%", label: "Free, renewable gas after installation" },
      { metric: "0", label: "Chemical fertilizer costs with nutrient-rich bio-slurry" },
      { metric: "20+ yrs", label: "Proven lifespan of fixed-dome brick installations" },
    ],
  },
  {
    slug: "maintenance-servicing",
    num: "06",
    title: "Maintenance & Servicing",
    shortDesc:
      "Scheduled inspection, troubleshooting and repair to keep every system performing after handover.",
    tag: "Engineering Support",
    image: "/images/services/service-maintenance.jpg",
    alt: "Renewable energy engineer servicing and testing solar PV installation",
    heroHeadline: "Continued technical support to guarantee system longevity.",
    overview:
      "At Impact Energy Solution, our commitment does not end at handover. A renewable energy installation is an investment that requires routine care, battery health checks, inverter firmware updates, and rapid troubleshooting. Our technical team is on call 7 days a week from our Lilongwe bases in Area 23 and Area 49 to keep your power and water flowing.",
    whatToExpect: [
      {
        title: "Scheduled Preventative Maintenance",
        description:
          "Routine cleaning of PV modules, torque-checking electrical lugs, testing surge protection arrestors, and deep diagnostic battery health profiling.",
      },
      {
        title: "Rapid Troubleshooting & Repair",
        description:
          "Dedicated call-out service to diagnose inverter fault codes, replace worn submersible pump components, or resolve gas pipeline pressure drops.",
      },
      {
        title: "System Expansion & Upgrades",
        description:
          "Seamless addition of extra solar panels, lithium battery modules, or increased tank elevation as your energy and water needs expand.",
      },
      {
        title: "Warranty & Compliance Assurance",
        description:
          "Full adherence to Malawi Energy Regulatory Authority (MERA) safety standards, with genuine OEM replacement parts.",
      },
    ],
    components: [
      "Digital Infrared Thermal Imaging for Hotspot Detection",
      "Precision Solar String Analyzers & Clamp Multimeters",
      "Battery Internal Resistance & Capacity Testers",
      "Submersible Pump Insulation Resistance Meggers",
      "Manufacturer Certified Replacement Parts & Fuses",
      "Comprehensive Digital Service & Audit Logs",
    ],
    keyApplications: [
      "Existing Residential Solar Installations in Area 23, Area 49 & Lilongwe",
      "Institutional and NGO Water Points Requiring Maintenance",
      "Commercial Solar Inverter Stations and Backup Banks",
      "Agricultural Solar Pumps Requiring Pre-Season Checks",
      "Systems Installed by Other Providers Needing Repair or Upgrades",
    ],
    operationalModel: {
      heading: "Continued Support After Installation",
      points: [
        "Our technical team is on call 7 days a week from Lilongwe Area 23 and Area 49.",
        "Comprehensive service contracts available for farms and institutions.",
        "Digital logging of maintenance history and component health.",
        "MERA licensed renewable energy professionals on every service call.",
      ],
    },
    impact: [
      { metric: "7 Days", label: "A week on-call technical response" },
      { metric: "99%+", label: "Target operational availability across supported sites" },
      { metric: "MERA", label: "Certified compliance on all repairs and inspections" },
    ],
  },
];

export function getServiceBySlug(slug: string): ServiceDetail | undefined {
  return SERVICES_DETAILED.find((s) => s.slug === slug);
}

