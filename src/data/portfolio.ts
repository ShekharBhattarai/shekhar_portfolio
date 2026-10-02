// All the portfolio content lives here. Edit this file to update the site —
// the components in src/components only handle layout and styling.

/** One of the four accent colours defined in src/styles/global.css. */
export type Accent = 'lime' | 'coral' | 'sky' | 'violet' | 'pink';

export const profile = {
  firstName: 'Shekhar',
  lastName: 'Bhattarai',
  status: 'Open to RF · Antenna · SATCOM projects & collaborations',
  intro:
    'Doctorate at XLIM in Reconfigurable Antenna with a Reduced Beamforming Network for 5G+ Applications',
  email: 'Shekharbhattarai7@gmail.com',
  phone: '(+33) 745 405 037',
  phoneHref: 'tel:+33745405037',
  location: 'Limoges, France',
  coords: '45.83°N 1.26°E',
  linkedin: 'https://www.linkedin.com/in/shekhar-bhattarai8/',
  cv: '/Shekhar_Bhattarai_CV.pdf',
  portrait: '/shekhar_pp.webp',
  availability: 'Available from September 2025',
};

export const highlights: { label: string; text: string; accent: Accent }[] = [
  { label: 'Ongoing', text: 'PhD in RF & Antenna, XLIM', accent: 'lime' },
  { label: 'Masters Degree', text: 'M.Sc. SATCOM, ENSEEIHT', accent: 'coral' },
];

export const spectrumBands = ['UHF', '2GHz', '3GHz', '5GHz', 'X', 'Ku', 'Ka', '40/60GHz'];

export const tools = [
  'ANSYS HFSS', 'CST', 'Altair FEKO','Keysight ADS', 'COMSOL', 'GNU Radio',
  'MATLAB / Simulink', 'Python', 'C/C++', 'USRP', 'HackRF', 'FPGA · VHDL',
  'STM32', 'Linux', 'Git',
];

export const experience: {
  period: string;
  location: string;
  ongoing?: boolean;
  role: string;
  company: string;
  accent: Accent;
  summary?: string;
  bullets?: string[];
  tags?: string[];
  image?: string;
}[] = [
  {
    period: 'Feb 2025 — Aug 2025',
    location: 'Toulouse, France',
    ongoing: false,
    role: 'Satellite Communications System Engineer — Intern',
    company: 'AUMOVIO (Continental Automotive France S.A.S)',
    accent: 'lime',
    summary:
      'End-of-study internship: review of the latest 3GPP/5GAA standards, link-budget analysis of different LEO constellations for automotive applications (sub-6 GHz and Ka/Ku band), and parametric study, modeling and validation using digital-twin models to recommend key parameters for next-gen NTN vehicle terminals.',
    tags: ['3GPP / 5GAA', 'LEO', 'Ka/Ku','FEKO', 'Digital twin'],
    image: '/AUMOVIO.webp'
  },
  {
    period: 'Jun 2024 — Sep 2024',
    image: '/Anywaves.webp',
    location: 'Toulouse, France',
    role: 'R&D Intern — Compact Phased Array Antenna',
    company: 'Anywaves',
    accent: 'violet',
    bullets: [
      'Design validation, simulation and analysis of a compact phased array on X-band satellite payload antenna.',
    ],
    tags: ['X-band', 'Phased array', 'Radome', 'XPD'],
  },
  {
    period: 'Feb 2022 — Jul 2023',
    image: '/orionspace.webp',
    location: 'Nepal',
    role: 'Research & Development Engineer',
    company: 'Orion Space Nepal Pvt. Ltd.',
    accent: 'sky',
    bullets: [
      'Antenna design, tuning and installation for pico-satellites and the ground-station receiver.',
      'R&D on embedded and software development for commercial PocketQubes (nano/pico satellites).',
      'Testing and implementation of CW, GFSK and LoRa modulation for satellite communication in UHF band.',
      'Link budget, power budget, resource allocation and management for pico-satellites.',
    ],
  },
];

export const education: {
  period: string;
  degree: string;
  school: string;
  accent: Accent;
}[] = [
  {
    period: '2023 — 2025',
    degree: 'M.Sc. Satellite Communication Systems (SATCOM)',
    school: 'INP Toulouse, ENSEEIHT · Toulouse, France',
    accent: 'lime',
  },
  {
    period: '2017 — 2022',
    degree: 'B.Eng. Electronics & Communication Engineering',
    school: 'Tribhuvan University, IOE Eastern Regional Campus · Dharan, Nepal',
    accent: 'coral',
  },
];

export const thesis = {
  label: 'Bachelor thesis · f₀ = 3.2 GHz',
  title: 'Design and Performance Analysis of Different Microstrip Patch Antenna for 5G Application',
  summary:
    'Design of MPA at 3.2 GHz using different substrates to determine the effect of substrate on gain and radiation efficiency.',
  // Drop an image into public/ and set its path here, e.g. '/thesis-antenna.png'.
  image: null as string | null,
};

export const courses = [
  'Embedded systems', 'Electromagnetics', 'RF & Microwave', 'Antennas & propagation',
  'Wireless comms', 'Satellite comms', 'Remote sensing', 'Broadcast',
];

export const projects: { tag: string; title: string; description: string; accent: Accent }[] = [
  {
    tag: 'GEO · Airbus D&S',
    title: 'Telecom spacecraft sizing for GEO',
    description:
      'RF link budget, antenna selection and placement, power budget, thermal sizing and heat dissipation, LEOP propellant, mass budget and hardware trade-offs to meet launcher and mission constraints.',
    accent: 'coral',
  },
  {
    tag: '900 MHz / 4 GHz',
    title: 'RF link budget, super-heterodyne Tx',
    description:
      'Budget analysis of a telecom Tx/Rx RF payload designed with COTS parts to meet target requirements. I was responsible for the 4 GHz HPA design.',
    accent: 'lime',
  },
  {
    tag: '40 & 60 GHz · MEMS',
    title: 'Dual-band BPF & phase shifter',
    description:
      'Capacitive-plate MEMS dual bandpass filter centred at 60 GHz and 40 GHz, plus a dynamic phase shifter using the same MEMS.',
    accent: 'pink',
  },
  {
    tag: '600 MHz · ADS',
    title: 'Enhanced-gain power amplifier',
    description:
      'Optimized-gain amplifier with PAE efficiency, linearity (IP3, C/I3), P1dB power limits, gain and noise circles in ADS.',
    accent: 'sky',
  },
  {
    tag: '2.5 GHz · full-wave',
    title: 'Finite planar array antenna',
    description:
      'MPA unit element with quarter-wave inverter matching; infinite, ideal finite and real finite arrays via full-wave simulation.',
    accent: 'coral',
  },
  {
    tag: 'X-band · 18 dBi',
    title: 'Horn & patch antennas',
    description:
      'X-band horn with 18 dBi gain; Rogers RO4003 patch comparing feeding techniques and design complexity.',
    accent: 'lime',
  },
];

export const skills: { title: string; items: string; accent: Accent }[] = [
  {
    title: 'RF & Microwave',
    items: 'EM theory (coupling, S-parameters), active/passive RF, antenna theory, analog/digital beamforming, MIMO, wave propagation',
    accent: 'lime',
  },
  {
    title: 'Wireless & SATCOM',
    items: 'NTN standards (Rel. 17/18), probability theory,  channel coding, modulation, multiple access, diversity, SDR, digital & statistical signal processing',
    accent: 'sky',
  },
  {
    title: 'Simulation & analysis',
    items: 'Keysight ADS, ANSYS HFSS, CST, Altair FEKO, COMSOL Multiphysics, GNU Radio',
    accent: 'coral',
  },
  {
    title: 'Programming',
    items: 'MATLAB/Simulink (Antenna, Satcom, 5G, NTN toolboxes), Python, C/C++',
    accent: 'pink',
  },
  {
    title: 'Embedded & hardware',
    items: 'SDRs (USRP, HackRF), FPGA (VHDL), embedded design for RF, RF measurement tools, microcontrollers',
    accent: 'lime',
  },
  {
    title: 'Other',
    items: 'Linux, Git / version control, MS Office, SolidWorks',
    accent: 'sky',
  },
];

export const presentations = [
  {
    title: 'Keynote Speaker on Pico-Sat for the Space Pioneer',
    where: "Yuri's Night Celebration 2023, St. Xavier's College Nepal",
  },
  {
    title: 'Present Scenario of Satellite Development in Nepal',
    where: 'IOE Pulchowk Campus, 2023',
  },
];

export const awards: { icon: string; title: string; where: string; accent: Accent }[] = [
  {
    icon: '★',
    title: 'Runner-up, IoT Smart Digital Room design',
    where: 'X-Tech Studio 1.0 Exposition, IOE ERC, 2018',
    accent: 'lime',
  },
  {
    icon: '◆',
    title: 'Participant, International Agriculture Robotics Competition',
    where: 'United Nations ESCAP-CSAM, Qingdao, China 2019',
    accent: 'sky',
  },
];

export const additionalCourses = [
  { title: 'KARI International Space Training (KARIST)', where: 'Korean Aerospace Research Institute, 2022' },
  { title: 'RF & Millimeter-wave Circuit Design', where: 'Eindhoven Univ. of Technology, Coursera, 2024' },
];

export const leadership = [
  'Technical coordinator, DELTA 2.0 (national-level engineering event)',
  'Trainer, basic robotics & microcontrollers — Robotics Club and EXCESS',
  'Trainer in educational CanSat and CubeSat technologies',
  'Member, Robotics Club, Eastern Regional Campus Dharan (2017–2022)',
];

/** `bars` is the number of filled signal bars, out of 4. */
export const languages = [
  { name: 'Nepali', level: 'Native', bars: 4 },
  { name: 'English', level: 'Fluent', bars: 4 },
  { name: 'Hindi', level: 'Fluent', bars: 3 },
  { name: 'French', level: 'A2', bars: 1 },
];

