export interface SubsystemDetail {
  name: string;
  telemetry: string;
}

export interface IndustryItem {
  id: string;
  number: string; // e.g. "01"
  name: string; // e.g. "Automotive & Manufacturing"
  tag: string; // e.g. "01 — AUTOMOTIVE & MANUFACTURING"
  headline: string;
  description: string;
  capabilities: string[];
  href: string;
  figureTitle: string;
  defaultReadout: string;
  subsystems: Record<string, SubsystemDetail>;
}

export const INDUSTRIES_LIST: IndustryItem[] = [
  {
    id: "automotive-manufacturing",
    number: "01",
    name: "Automotive & Manufacturing",
    tag: "01 — AUTOMOTIVE & MANUFACTURING",
    headline: "DRIVING MANUFACTURING EXCELLENCE WITH SAP.",
    description:
      "End-to-end SAP solutions for automotive and manufacturing enterprises to streamline operations, optimize production, and build a smarter, connected supply chain.",
    capabilities: [
      "Production Planning & Scheduling",
      "Supply Chain & Inventory Management",
      "Plant & Asset Maintenance (EAM)",
      "Quality & Compliance Management",
      "Connected Factory & Industry 4.0",
    ],
    href: "/industries/automotive-manufacturing",
    figureTitle: "AUTONOMOUS ASSEMBLY & DUAL-AXIS GANTRY RIG",
    defaultReadout: "CYCLE: 14.2s · TAKT SLA: 99.8% · TOLERANCE: ±0.02mm · ROBOT: ACTIVE",
    subsystems: {
      "robot-arm": {
        name: "6-Axis Robotic Servo Manipulator",
        telemetry: "Kinematics: 3.4 m/s · End-Effector: Spot Weld · Precision: ±0.015mm",
      },
      conveyor: {
        name: "Precision Roller Transport Deck",
        telemetry: "Velocity: 1.2 m/s · Payload: 1,450 kg · Encoder: 4,096 PPR",
      },
      "laser-scanner": {
        name: "Profilometer Laser Inspection Arch",
        telemetry: "Sampling: 20 kHz · Point Density: 0.1mm · Defect Reject: 0.001%",
      },
      "factory-core": {
        name: "Autonomous Plant Telemetry Core",
        telemetry: "SAP ME/MII Direct Sync · OPC-UA Telemetry: Nominal",
      },
    },
  },
  {
    id: "banking-financial-services",
    number: "02",
    name: "Banking & Financial Services",
    tag: "02 — BANKING & FINANCIAL SERVICES",
    headline: "DIGITAL BANKING FOR A SMARTER FINANCIAL WORLD.",
    description:
      "Modernizing core banking ledgers, risk compliance architectures, automated payments, and real-time financial analytics with mission-critical security and zero downtime.",
    capabilities: [
      "Core Banking & Process Automation",
      "Risk & Compliance Management",
      "Customer 360 & Personalization",
      "Financial Planning & Analytics",
      "Automated Fraud & AML Detection",
    ],
    href: "/industries/banking-financial-services",
    figureTitle: "CRYPTOGRAPHIC HSM LEDGER VAULT & CONSENSUS CORE",
    defaultReadout: "TPS: 142,500 · SETTLEMENT: 18ms · FAULT TOLERANCE: BFT ACTIVE",
    subsystems: {
      "vault-core": {
        name: "FIPS 140-3 Hardware Security Module",
        telemetry: "Quantum-Resistant Kyber Keys · Zero-Knowledge Proofs",
      },
      "ledger-bus": {
        name: "Atomic Dual-Rail Ledger Sync Bus",
        telemetry: "Throughput: 142.5k TPS · Latency: 18ms · Redundancy: 3x",
      },
      "fraud-dial": {
        name: "Real-Time AML & Anomaly Telemetry",
        telemetry: "Model Drift: 0.00% · Scoring Latency: 1.8ms · FPR: <0.001%",
      },
      "clearing-nodes": {
        name: "Decentralized Settlement Gateway",
        telemetry: "ISO 20022 Direct Rail · Atomic DvP Clearing: Verified",
      },
    },
  },
  {
    id: "aviation-aerospace",
    number: "03",
    name: "Aviation & Aerospace",
    tag: "03 — AVIATION & AEROSPACE",
    headline: "POWERING AEROSPACE OPERATIONS WITH SAP.",
    description:
      "Optimizing complex fleet maintenance scheduling (MRO), air cargo telemetry, mission readiness, and multi-tier component traceability with defense-grade compliance.",
    capabilities: [
      "Maintenance, Repair & Overhaul (MRO)",
      "Supply Chain & Inventory Management",
      "Flight & Operations Management",
      "Regulatory & Safety Compliance",
      "Component Life-Cycle Traceability",
    ],
    href: "/industries/aviation-aerospace",
    figureTitle: "SUPERSONIC AERODYNAMIC RIG & AVIONICS TELEMETRY STAND",
    defaultReadout: "MACH 2.40 · DYNAMIC Q: 68.4 kPa · FLUTTER DAMPED · SYNCED",
    subsystems: {
      "airframe-mount": {
        name: "Piezoelectric Multi-Axis Load Cell",
        telemetry: "Lift/Drag: 4.82 · Strain: 120 µε · Resonance: Damped",
      },
      "hangar-telemetry": {
        name: "Fleet MRO Health Monitoring Station",
        telemetry: "Engine Telemetry: Live · Predictive Turbine Cycle: 99.9%",
      },
      "radar-dish": {
        name: "Phased-Array Telemetry Uplink",
        telemetry: "Bandwidth: 28 GHz Ka-Band · BER: 10⁻¹² · Track Lock: OK",
      },
      "avionics-bus": {
        name: "MIL-STD-1553B / ARINC 429 Bus",
        telemetry: "Bus Load: 42% · CRC Error: 0 · Sync Jitter: <5ns",
      },
    },
  },
  {
    id: "ecommerce-retail",
    number: "04",
    name: "E-commerce & Retail",
    tag: "04 — E-COMMERCE & RETAIL",
    headline: "HIGH-THROUGHPUT OMNICHANNEL FULFILLMENT WITH SAP.",
    description:
      "Scaling intelligent warehouse order orchestration, dynamic inventory allocation, automated returns pipelines, and unified commerce telemetry across millions of daily orders.",
    capabilities: [
      "Omnichannel Order Orchestration",
      "Warehouse & 3PL Logistics (EWM)",
      "Dynamic Pricing & Inventory Sync",
      "Autonomous Returns Processing",
      "Customer Lifetime Value Optimization",
    ],
    href: "/industries/ecommerce-retail",
    figureTitle: "HIGH-VELOCITY INDUCTION & VOLUMETRIC SORTATION RIG",
    defaultReadout: "THROUGHPUT: 18,400 PPH · WEIGH-IN-MOTION: NOMINAL · RUNNING",
    subsystems: {
      "sortation-tray": {
        name: "Cross-Belt Tilt-Tray Diverter",
        telemetry: "Divert Speed: 2.8 m/s · Sort Accuracy: 99.998%",
      },
      dimensioner: {
        name: "Optical 3D Volumetric Profiler",
        telemetry: "Volume Delta: ±2 cm³ · Weight Cell: Dynamic 0-50 kg",
      },
      "dispatch-fleet": {
        name: "Autonomous AGV Dispatch Fleet",
        telemetry: "Units Active: 48 · Battery Avg: 88% · Route Efficiency: 98.4%",
      },
      "fulfillment-hub": {
        name: "SAP EWM Central Inventory Engine",
        telemetry: "Order Cycle Time: 8.2 min · Pick Error Rate: 0.00%",
      },
    },
  },
  {
    id: "education-learning",
    number: "05",
    name: "Education & Learning",
    tag: "05 — EDUCATION & LEARNING",
    headline: "EMPOWERING HIGHER EDUCATION WITH DIGITAL FOUNDATIONS.",
    description:
      "Transforming student lifecycle operations, campus ERP resources, research grant compliance, and personalized learning pathways with scalable cloud architectures.",
    capabilities: [
      "Student Lifecycle Management (SLcM)",
      "Research Grant & Funding Governance",
      "Digital Credentialing & Transcripts",
      "Campus Facility & Resource Optimization",
      "Adaptive Learning Analytics",
    ],
    href: "/industries/education-learning",
    figureTitle: "COGNITIVE KNOWLEDGE-GRAPH SYNTHESIZER & MEMORY MATRIX",
    defaultReadout: "NODES: 4.8M · RETENTION INDEX: 96.2% · LATENCY: 4.1ms · READY",
    subsystems: {
      "knowledge-core": {
        name: "Hierarchical Concept Indexing Module",
        telemetry: "Ontology Depth: 18 Levels · Cross-Discipline Edges: 12.4M",
      },
      "memory-matrix": {
        name: "Spaced-Repetition Decay Compensator",
        telemetry: "Ebbinghaus Curve Retention: 96.2% · Reinforcement: Auto",
      },
      "clock-tower": {
        name: "Master Academic Pacing Chronometer",
        telemetry: "Semester Sync: Locked · Milestone Convergence: Optimal",
      },
      "learning-bus": {
        name: "Student Adaptive Feedback Telemetry",
        telemetry: "Active Learners: 84,200 · Comprehension Index: 92.4%",
      },
    },
  },
  {
    id: "government-public-sector",
    number: "06",
    name: "Government & Public Sector",
    tag: "06 — GOVERNMENT & PUBLIC SECTOR",
    headline: "CITIZEN-FIRST DIGITAL GOVERNANCE & SOVEREIGN INFRASTRUCTURE.",
    description:
      "Deploying sovereign, mathematically auditable ERP solutions and citizen service platforms with zero-trust security, strict data sovereignty, and public compliance.",
    capabilities: [
      "Sovereign Cloud & FedRAMP / GovCloud",
      "Public Financial Management & Budgeting",
      "Citizen Identity & Permitting Portals",
      "Defense & Public Safety Asset Tracking",
      "Tamper-Evident Regulatory Compliance",
    ],
    href: "/industries/government-public-sector",
    figureTitle: "SOVEREIGN HSM ROOT-OF-TRUST & CONSENSUS ENCLAVE",
    defaultReadout: "SECURITY: FIPS 140-3 LEVEL 4 · ZERO-EGRESS AIR-GAP · VERIFIED",
    subsystems: {
      "enclave-vault": {
        name: "Sovereign Root-of-Trust Hardware Crypt",
        telemetry: "Tamper Sensors: Armed · Zeroization Circuit: Active",
      },
      "data-diode": {
        name: "Optocoupled Unidirectional Data Diode",
        telemetry: "Forward Transfer: 10 Gbps · Reverse Egress: Physically Zero",
      },
      "civic-kiosk": {
        name: "Citizen Identity Attestation Terminal",
        telemetry: "Biometric Hash: Cryptographically Zero-Knowledge Proofed",
      },
      "audit-journal": {
        name: "Immutable Merkle Audit Log",
        telemetry: "Block Height: 8,421,902 · SHA-3 Root: Verified",
      },
    },
  },
  {
    id: "energy-utilities",
    number: "07",
    name: "Energy & Utilities",
    tag: "07 — ENERGY & UTILITIES",
    headline: "ACCELERATING GRID MODERNIZATION & CLEAN ENERGY MATURITY.",
    description:
      "Integrating renewable energy telemetry, automated smart meter grids, asset condition maintenance, and regulatory carbon accounting with SAP IS-U infrastructure.",
    capabilities: [
      "Smart Meter Data Management (MDM)",
      "Transmission & Distribution Grid EAM",
      "Renewable Generation & Storage Integration",
      "Carbon Emissions & ESG Accounting",
      "Predictive Outage & Storm Dispatch",
    ],
    href: "/industries/energy-utilities",
    figureTitle: "SYNCHRONOUS GRID LOAD BALANCER & PMU PHASOR RIG",
    defaultReadout: "GRID FREQ: 50.002 Hz · PHASE ANGLE: +0.4° · RESERVE: 420 MW",
    subsystems: {
      "substation-pylon": {
        name: "765 kV Ultra-High Voltage Busbar",
        telemetry: "Line Current: 1,840 A · Corona Loss: Negligible · SF6: 99.8%",
      },
      synchrophasor: {
        name: "Precision PMU Phasor Measurement Unit",
        telemetry: "Reporting Rate: 60 fps · GPS Time Tag: <1 µs UTC Error",
      },
      "wind-turbine": {
        name: "Renewable Generation Telemetry Node",
        telemetry: "Rotor Speed: 14.8 RPM · Pitch Angle: 2.4° · Output: 4.2 MW",
      },
      "battery-inverter": {
        name: "BESS Solid-State Four-Quadrant Inverter",
        telemetry: "Active Power: ±250 MW · Response Time: 4.8 ms",
      },
    },
  },
  {
    id: "healthcare-life-sciences",
    number: "08",
    name: "Healthcare & Life Sciences",
    tag: "08 — HEALTHCARE & LIFE SCIENCES",
    headline: "CONNECTED CLINICAL WORKFLOWS & COMPLIANT PATIENT CARE.",
    description:
      "Orchestrating clinical supply chains, serialized pharmaceutical distribution, HIPAA-compliant patient data pipelines, and smart hospital equipment telemetry.",
    capabilities: [
      "Clinical Supply Chain & Serialized Inventory",
      "HIPAA & GxP Regulatory Compliance",
      "Patient Health Information (PHI) Governance",
      "Smart Hospital Asset & Bed Management",
      "Telehealth & Diagnostic System Integration",
    ],
    href: "/industries/healthcare-life-sciences",
    figureTitle: "STERILE CRYOGENIC COLD-CHAIN & INFUSION ANALYZER RIG",
    defaultReadout: "DEWAR TEMP: -86.4°C · FLOW: 0.25 mL/min · STERILITY: 100%",
    subsystems: {
      "cryo-dewar": {
        name: "Liquid Nitrogen Vacuum-Insulated Dewar",
        telemetry: "Core Temp: -86.4°C · Level: 94.2% · Boil-off Rate: 0.08%/day",
      },
      "infusion-manifold": {
        name: "Precision Peristaltic Micro-Dosing Loop",
        telemetry: "Dispense Accuracy: ±0.05 µL · Bubble Sensor: Clear",
      },
      spectrometer: {
        name: "In-Line Spectroscopic Biomarker Assay",
        telemetry: "Purity Index: 99.98% · Contaminant Delta: 0.00 ppm",
      },
      "clinical-gateway": {
        name: "HIPAA / HL7 FHIR Healthcare Gateway",
        telemetry: "End-to-End Encrypted · EHR Protocol: FHIR R4 Compliant",
      },
    },
  },
  {
    id: "oil-gas",
    number: "09",
    name: "Oil & Gas",
    tag: "09 — OIL & GAS",
    headline: "OPTIMIZING UPSTREAM & DOWNSTREAM HYDROCARBON OPERATIONS.",
    description:
      "Automating wellhead telemetry, refinery asset integrity management, pipeline logistics, and environmental safety reporting with enterprise SAP Oil & Gas (IS-Oil).",
    capabilities: [
      "Upstream Wellhead Telemetry & Scheduling",
      "Refinery Maintenance & Turnaround Planning",
      "Hydrocarbon Supply Chain & Pipeline SCADA",
      "Health, Safety & Environmental (HSE) Compliance",
      "Joint Venture Accounting & Royalty Tracking",
    ],
    href: "/industries/oil-gas",
    figureTitle: "HIGH-PRESSURE CHOKE MANIFOLD & SCADA SUPERVISORY RIG",
    defaultReadout: "CHOKE DP: 140 bar · FLOW: 42,000 bpd · ACOUSTIC LEAK: ZERO",
    subsystems: {
      "choke-valve": {
        name: "Tungsten Carbide Needle Choke Assembly",
        telemetry: "Trim Position: 68.2% · Pressure Drop: 140 bar · Cavitation: None",
      },
      "orifice-meter": {
        name: "Differential Pressure Orifice Meter Run",
        telemetry: "Beta Ratio: 0.60 · Gas Density: 0.72 kg/m³ · Accuracy: ±0.15%",
      },
      "storage-sphere": {
        name: "Pressurized Liquefied Hydrocarbon Sphere",
        telemetry: "Internal Pressure: 18.4 bar · Liquid Level: 74.2% · Relief: OK",
      },
      "pipeline-telemetry": {
        name: "SCADA Acoustic Pipeline Leak Sensor",
        telemetry: "Acoustic Noise Floor: -84 dB · Waveguide Sensor: Operational",
      },
    },
  },
  {
    id: "telecom-media",
    number: "10",
    name: "Telecom & Media",
    tag: "10 — TELECOM & MEDIA",
    headline: "NEXT-GENERATION NETWORK INFRASTRUCTURE & REVENUE ASSURANCE.",
    description:
      "Powering 5G network rollout tracking, high-velocity subscriber billing (BRIM), digital rights management, and zero-touch network service provisioning.",
    capabilities: [
      "SAP BRIM Billing & Revenue Innovation",
      "5G Fiber & Tower Asset Deployment",
      "Subscriber Churn Analytics & AI Retention",
      "Digital Content Rights & Royalties",
      "Network Fault Automation & Self-Healing",
    ],
    href: "/industries/telecom-media",
    figureTitle: "5G MASSIVE-MIMO BEAMFORMING & PHASED-ARRAY RIG",
    defaultReadout: "BEAM AZIMUTH: 34.2° · EIRP: 58 dBm · LATENCY: 1.1ms · 64T64R",
    subsystems: {
      "mimo-array": {
        name: "64-Element Phased-Array Transceiver",
        telemetry: "Beam Azimuth: 34.2° · Elevation: 4.8° · Gain: +28 dBi",
      },
      "optical-fronthaul": {
        name: "eCPRI 25 Gbps Fiber Optical Gateway",
        telemetry: "Framing: eCPRI v2.0 · Optical Power: -2.4 dBm · Sync: PTP v2",
      },
      "server-blade": {
        name: "Open-RAN Virtualized Baseband Unit",
        telemetry: "Compute Utilization: 44% · Frame Latency: 1.1 ms",
      },
      "spectrum-dial": {
        name: "Harmonic Distortion & Spectrum Analyzer",
        telemetry: "EVM: 1.2% · ACPR: -48 dBc · Spurious Emissions: Under Mask",
      },
    },
  },
  {
    id: "pharmaceuticals-biotechnology",
    number: "11",
    name: "Pharmaceuticals & Biotechnology",
    tag: "11 — PHARMACEUTICALS & BIOTECHNOLOGY",
    headline: "ACCELERATING DRUG DISCOVERY & GMP-COMPLIANT PRODUCTION.",
    description:
      "Automating clinical trial supply chains, electronic batch record management (EBR), serialized track-and-trace, and FDA 21 CFR Part 11 validated deployments.",
    capabilities: [
      "GMP Batch Record & Release Automation",
      "Clinical Trial Material Tracking (CTM)",
      "Cold Chain Storage & Telemetry Monitoring",
      "Global Serialization & Track-and-Trace",
      "Validated Cloud QMS & LIMS Integration",
    ],
    href: "/industries/pharmaceuticals-biotechnology",
    figureTitle: "CONTINUOUS PERFUSION BIOREACTOR & DNA SEQUENCER RIG",
    defaultReadout: "DENSITY: 84×10⁶/mL · DISSOLVED O2: 40.2% · pH: 7.22 · GMP OK",
    subsystems: {
      "bioreactor-vessel": {
        name: "316L Stainless Steel Perfusion Vessel",
        telemetry: "Working Volume: 50 L · Agitation: 140 RPM · Impeller: Marine",
      },
      "dna-sequencer": {
        name: "Microfluidic Capillary Electrophoresis Cell",
        telemetry: "Read Length: 1,200 bp · Q-Score: Q40 · Error Rate: <0.01%",
      },
      "sparger-manifold": {
        name: "Micro-Porous Gas Sparging Manifold",
        telemetry: "O2 Flow: 2.4 SLPM · CO2 Strip Rate: 98% · Bubble Size: 20 µm",
      },
      "gmp-controller": {
        name: "Annex 11 / 21 CFR Part 11 Electronic Log",
        telemetry: "Signature Hash: Validated · Audit Trail: Continuous",
      },
    },
  },
  {
    id: "lending-fintech",
    number: "12",
    name: "Lending & FinTech",
    tag: "12 — LENDING & FINTECH",
    headline: "AUTONOMOUS CREDIT DECISIONING & REAL-TIME CLEARING.",
    description:
      "Architecting automated loan origination pipelines, algorithmic credit underwriting, liquidity management, and instant cross-border settlement ledgers.",
    capabilities: [
      "Autonomous Loan Underwriting & Scoring",
      "Instant ACH, FedNow & SEPA Instant Rails",
      "Dynamic Liquidity & Collateral Optimization",
      "Regulatory Reporting & Capital Adequacy",
      "Decentralized Asset Tokenization & Escrow",
    ],
    href: "/industries/lending-fintech",
    figureTitle: "ATOMIC LIQUIDITY MATCHING ENGINE & RISK HORIZON DIAL",
    defaultReadout: "EXECUTION: 840 ns · MATCH RATE: 99.999% · PTP JITTER: <2ns",
    subsystems: {
      "matching-engine": {
        name: "FPGA Ultra-Low Latency Order Matcher",
        telemetry: "Tick-to-Trade: 840 ns · Queue Depth: 0 · Throughput: 1.8M msg/s",
      },
      "risk-dial": {
        name: "Real-Time Value-at-Risk (VaR) Governor",
        telemetry: "Confidence: 99.9% · Stress Simulation: 10,000 Monte Carlo paths",
      },
      "ptp-clock": {
        name: "Rubidium Atomic PTP Hardware Master Clock",
        telemetry: "Stratum-1 Locked · Drift: <1 ns/day · Allan Deviation: 10⁻¹³",
      },
      "settlement-bridge": {
        name: "Instant DvP Atomic Clearing Bridge",
        telemetry: "Counterparty Exposure: Net Zero · Collateral Velocity: 100%",
      },
    },
  },
];
