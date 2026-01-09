import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  ShieldCheck,
  Users,
  Briefcase,
  Building,
  Cpu,
  RefreshCw,
  Zap,
  TrendingUp,
  Sparkles,
  Send,
  Loader2,
  Home,
  Info,
  Globe,
  Menu,
  Lock,
  RotateCcw,
} from 'lucide-react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient';
import './index.css';

const nodesData = {
  VVC: {
    id: 'VVC ',
    title: 'VVC',
    subtitle: 'De Toegangspoort',
    icon: <Users className="w-6 h-6" />,
    color: 'from-orange-400 to-pink-500',
    description: 'De enige toegangspoort voor gebruikers en de startknop van de motor.',
    details:
      'VVC is de brandstoftoevoer (nieuwe leden). Het biedt toegang tot zowel de servicebedrijven als de exclusieve financiële kern.',
  },
  INVESTBOTIQ: {
    id: 'INVESTBOTIQ',
    title: 'INVESTBOTIQ',
    subtitle: 'De Motorcomputer',
    icon: <Cpu className="w-6 h-6" />,
    color: 'from-blue-500 to-indigo-600',
    description: 'Het intelligente brein dat bepaalt hoeveel kapitaal waar nodig is.',
    details:
      "Analyseert kansen en zet de opdracht uit: 'Ik heb een investering, maar meer slagkracht nodig.' Stuurt door naar Spontiva.",
  },
  SPONTIVA: {
    id: 'SPONTIVA',
    title: 'SPONTIVA',
    subtitle: 'De Financierings Hefboom',
    icon: <TrendingUp className="w-6 h-6" />,
    color: 'from-cyan-400 to-blue-500',
    description: 'Creëert financiële hefboomwerking en vraagt financiering aan.',
    details:
      'Fungeert als de financiële pomp. Regelt kapitaal voor de grotere investeringen die INVESTBOTIQ identificeert door TGC aan te vragen bij DJOBBA.',
  },
  DJOBBA: {
    id: 'DJOBBA',
    title: 'DJOBBA',
    subtitle: 'De Generator',
    icon: <Zap className="w-6 h-6" />,
    color: 'from-yellow-400 to-amber-500',
    description: 'Generator die vloeibare brandstof (cashflow) produceert uit werk.',
    details:
      'Zet arbeid om in kapitaal (TGC). De winst (TGA) wordt niet uitgekeerd, maar direct ingezet om vastgoed te kopen.',
  },
  ASH: {
    id: 'ASH',
    title: 'AFTERSTUDENTHOUSING',
    subtitle: 'Het Onroerendgoed',
    icon: <Building className="w-6 h-6" />,
    color: 'from-emerald-400 to-green-600',
    description: 'De ultieme bestemming: waardevast vastgoed.',
    details:
      'Brandstof wordt gestold in steen. Dit bezit genereert via verhuur nieuwe inkomsten die terugvloeien naar INVESTBOTIQ; de cirkel rond.',
  },
  SERVICES: {
    id: 'SERVICES',
    title: 'Servicebedrijven',
    subtitle: 'Ondersteunende Diensten',
    icon: <ShieldCheck className="w-6 h-6" />,
    color: 'from-slate-400 to-slate-600',
    description: 'Losstaande diensten beschikbaar via VVC.',
    details:
      'Spraakzaam Samen, Cybersecurity 31 RJP en Angels Mediate. Essentieel voor breed aanbod, maar niet in de financiële groeicyclus.',
  },
};

const cycleSteps = [
  {
    id: 'VVC',
    title: 'VVC → INVESTBOTIQ',
    reason:
      'VVC start de motor. Het brengt nieuwe leden/brandstof binnen en stuurt alles via INVESTBOTIQ voor allocatie.',
  },
  {
    id: 'INVESTBOTIQ',
    title: 'INVESTBOTIQ → SPONTIVA',
    reason:
      'INVESTBOTIQ vindt de deal maar heeft hefboom nodig. Spontiva regelt extra kapitaal voor grotere, lucratievere investeringen.',
  },
  {
    id: 'SPONTIVA',
    title: 'SPONTIVA → DJOBBA',
    reason:
      'Spontiva vraagt TGC aan bij DJOBBA: de cashflow-generator uit arbeid. Dit tankt de brandstof voor het plan.',
  },
  {
    id: 'DJOBBA',
    title: 'DJOBBA → AFTERSTUDENTHOUSING',
    reason:
      'TGA wordt niet uitgekeerd maar gestold in vastgoed. Zo wordt tijdelijke cashflow omgezet in waardevast actief.',
  },
  {
    id: 'ASH',
    title: 'AFTERSTUDENTHOUSING → INVESTBOTIQ',
    reason:
      'Huurwinst stroomt terug naar INVESTBOTIQ: leningen aflossen, nieuwe investeringen, en de generator laten groeien.',
  },
];

const translations = {
  nl: {
    nav: {
      home: 'Home',
      motor: 'Ecosysteem',
      overige: 'Overige Motoren',
      pitch: 'Pitch',
      over: 'Over',
      proMenu: 'Pro Submenu',
      proOn: 'Pro Mode',
      proOff: 'Pro Uit',
      themeDark: 'Dark',
      themeLight: 'Light',
      lang: 'NL',
    },
    pitch: {
      openingQuestion: 'Heb je wel eens gedacht: Was ik maar rijk geboren?',
      openingBody: 'Waar gaat dat bruto geld eigenlijk heen? Wat komt er voor bruto of betalen zij mij uit hun eigen zak?',
      researchIntro: 'Wij hebben het onderzoek voor jou gedaan.',
      kiyosakiQuote: 'Hoe blijven rijke mensen rijk? Het standaard antwoord: ze laten het geld voor hun werken.',
      butHow: 'Ja, maar hoe?',
      silenceNote: 'En dan blijft het meestal stil. Of heel vaag. Of heel complex.',
      insightTitle: 'Het Inzicht',
      insightBody: 'We hebben hier geen oplossing voor. Wel hebben we het inzicht. Je kan het landschap zien, maar inzicht bepaalt wat je eruit haalt.',
      systemTitle: 'Wij maken gebruik van het systeem',
      systemBody: 'Klinkt niet zo goed hè? Of misschien wel. We gebruiken in elk geval niks nieuws — we roeien met de riemen die we hebben.',
      tgcTitle: 'Time Gap Cashflow',
      tgcBody: 'De tijd die tussen elke betaling zit. Het geld dat dus stil staat.',
      methodsHighlight: '60+',
      methodsBody: 'verschillende manieren om daar bij te komen.',
      passiveTitle: 'Van cashflow naar passief inkomen',
      passiveBody: 'Dankzij Robert weten wij ook de manier om daar passief inkomen van te maken.',
      workNote: 'Klinkt als veel werk. Klopt.',
      automationTitle: 'Daarom hebben wij het geautomatiseerd',
      automationBody: 'Het zijn stappen, het is een flow.',
      ctaQuestion: 'Wil je meer weten of heb je vragen?',
      ctaAnswer: 'Waarschijnlijk beide.',
      contactChoice: 'Wil je met een AI praten of met een echt persoon — iemand van ons Team?',
      formTitle: 'Aanmelden als ZZP\'er',
      formSubtitle: 'Vul in wat je wilt delen — alleen naam en e-mail zijn verplicht',
      formName: 'Naam *',
      formEmail: 'E-mail *',
      formPhone: 'Telefoonnummer',
      formCompany: 'Bedrijfsnaam',
      formKvk: 'KVK-nummer',
      formSector: 'Sector / branche',
      formYearsZzp: 'Jaren als ZZP\'er',
      formRevenue: 'Maandelijkse omzet (indicatie)',
      formRevenueOptions: ['< €2.500', '€2.500 - €5.000', '€5.000 - €10.000', '> €10.000', 'Zeg ik liever niet'],
      formInterests: 'Waar ben je in geïnteresseerd?',
      formInterestOptions: ['Time Gap Cashflow', 'Passief inkomen', 'Vastgoed', 'Automatisering', 'Netwerk/community'],
      formHowHeard: 'Hoe heb je ons gevonden?',
      formHowHeardOptions: ['Google', 'LinkedIn', 'Via bekende', 'Event', 'Anders'],
      formContact: 'Voorkeur voor contact',
      formContactOptions: ['E-mail', 'Telefoon', 'WhatsApp'],
      formMessage: 'Je vraag of opmerking',
      formSubmit: 'Verstuur aanmelding',
      formSubmitting: 'Bezig...',
      formSuccess: 'Bedankt! We nemen snel contact op.',
      formError: 'Er ging iets mis. Probeer het opnieuw.',
      formAlt: 'Of praat met onze AI',
      ctaMotor: 'Bekijk de motor',
      pitchOverview: {
        title: 'Het fundamentele probleem',
        subtitle: 'Hard werken stopt waar kapitaal begint.',
        brokenPromise:
          'Het fundamentele probleem is een gebroken belofte. Ons economisch model zegt dat hard werken wordt beloond met vooruitgang. Maar in de praktijk wordt je arbeid omgezet in geld dat stopt met werken zodra jij stopt.',
        closedCircuit:
          'De echte waardegroei – in vastgoed, bedrijven, infrastructuur – is voorbehouden aan een gesloten circuit van gevestigde investeerders met kapitaal. Daardoor blijven de meeste mensen permanent buitenstaanders in het spel van vermogensopbouw.',
        mission: 'Wij maken je van buitenstaander tot deelnemer en eigenaar.',
        ctaDeep: 'Bekijk de volledige pitch',
        labelBroken: 'Gebroken belofte',
        labelClosed: 'Gesloten circuit',
        labelMission: 'Onze missie',
      },
    },
    home: {
      title: 'Ons Ecosysteem',
      subtitle: 'Start de reis: bekijk de volledige financiële motor.',
      cta: 'Naar de motor',
      promiseTitle: 'De Belofte',
      promiseBody:
        'Wij bieden geen snel rijk worden. Wij bieden een systeem. Een transparante, geautomatiseerde weg om je dagelijkse inzet rechtstreeks en efficiënt te laten resulteren in groeiend, tastbaar eigen vermogen. Je wordt geen consument van financiële producten; je wordt mede-eigenaar van de machine die ze creëert.',
    },
  },
  en: {
    nav: {
      home: 'Home',
      motor: 'Ecosystem',
      overige: 'Other Engines',
      pitch: 'Pitch',
      over: 'About',
      proMenu: 'Pro Submenu',
      proOn: 'Pro Mode',
      proOff: 'Pro Off',
      themeDark: 'Dark',
      themeLight: 'Light',
      lang: 'EN',
    },
    pitch: {
      openingQuestion: "Ever thought: there's a catch here somewhere?",
      openingBody: 'Where does that gross money actually go? What comes in before gross, or are they paying me from their own pocket?',
      researchIntro: 'We did the research for you.',
      kiyosakiQuote: 'How do the rich stay rich? The standard answer: they let money work for them.',
      butHow: 'Yes, but how?',
      silenceNote: 'And then it usually goes silent. Or very vague. Or very complex.',
      insightTitle: 'The Insight',
      insightBody: "We don't have a solution for this. But we do have the insight. You can see the landscape, but insight determines what you get out of it.",
      systemTitle: 'We use the system',
      systemBody: "Doesn't sound great, does it? Or maybe it does. Either way, we use nothing new — we work with what we have.",
      tgcTitle: 'Time Gap Cashflow',
      tgcBody: 'The time between each payment. The money that sits still.',
      methodsHighlight: '60+',
      methodsBody: 'different ways to access it.',
      passiveTitle: 'From cashflow to passive income',
      passiveBody: 'Thanks to Robert, we also know the way to turn this into passive income.',
      workNote: 'Sounds like a lot of work. True.',
      automationTitle: "That's why we automated it",
      automationBody: "It's steps, it's a flow.",
      ctaQuestion: 'Want to know more or have questions?',
      ctaAnswer: 'Probably both.',
      contactChoice: 'Want to talk to an AI or a real person — someone from our Team?',
      formTitle: 'Sign up as freelancer',
      formSubtitle: 'Fill in what you want to share — only name and email are required',
      formName: 'Name *',
      formEmail: 'Email *',
      formPhone: 'Phone number',
      formCompany: 'Company name',
      formKvk: 'Chamber of Commerce #',
      formSector: 'Sector / industry',
      formYearsZzp: 'Years as freelancer',
      formRevenue: 'Monthly revenue (estimate)',
      formRevenueOptions: ['< €2,500', '€2,500 - €5,000', '€5,000 - €10,000', '> €10,000', 'Prefer not to say'],
      formInterests: 'What are you interested in?',
      formInterestOptions: ['Time Gap Cashflow', 'Passive income', 'Real estate', 'Automation', 'Network/community'],
      formHowHeard: 'How did you find us?',
      formHowHeardOptions: ['Google', 'LinkedIn', 'Referral', 'Event', 'Other'],
      formContact: 'Preferred contact method',
      formContactOptions: ['Email', 'Phone', 'WhatsApp'],
      formMessage: 'Your question or comment',
      formSubmit: 'Submit registration',
      formSubmitting: 'Submitting...',
      formSuccess: 'Thanks! We will be in touch soon.',
      formError: 'Something went wrong. Please try again.',
      formAlt: 'Or chat with our AI',
      ctaMotor: 'View the engine',
      pitchOverview: {
        title: 'The fundamental problem',
        subtitle: 'Hard work stops where capital begins.',
        brokenPromise:
          'The fundamental problem is a broken promise. Our economic model says hard work is rewarded with progress. In practice your labor turns into money that stops working the moment you stop.',
        closedCircuit:
          'Real value growth — in real estate, companies, infrastructure — is reserved for a closed circuit of capital-backed investors. Most people remain outsiders in the game of wealth building.',
        mission: 'We turn you from outsider into participant and owner.',
        ctaDeep: 'View the full pitch',
        labelBroken: 'Broken promise',
        labelClosed: 'Closed circuit',
        labelMission: 'Our mission',
      },
    },
    home: {
      title: 'Financial Ecosystem',
      subtitle: 'Start the journey: explore the complete financial engine.',
      cta: 'To the engine',
      promiseTitle: 'The Promise',
      promiseBody:
        'We do not offer get-rich-quick. We offer a system. A transparent, automated way to turn your daily effort directly and efficiently into growing, tangible equity. You do not become a consumer of financial products; you become a co-owner of the machine that creates them.',
    },
  },
};

const PitchOverview = ({ lang = 'nl', proMode = false }) => {
  const t = translations[lang]?.pitch?.pitchOverview || translations.nl.pitch.pitchOverview;
  return (
    <div className="px-4 py-10 mx-auto space-y-6 max-w-5xl">
      <div className="space-y-3">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-400 text-center md:text-left">{t.subtitle}</p>
        <div className="flex flex-col gap-3 items-center md:flex-row md:items-center md:justify-between">
          <h1 className="text-3xl font-black text-center text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-400 to-indigo-400 md:text-left">
            {t.title}
          </h1>
          <Link to="/pitch/full" className="cta-button">
            <ArrowRight size={16} /> {t.ctaDeep}
          </Link>
        </div>
      </div>
      <SectionCard title={t.labelBroken} proMode={proMode}>
        {t.brokenPromise}
      </SectionCard>
      <SectionCard title={t.labelClosed} proMode={proMode}>
        {t.closedCircuit}
      </SectionCard>
      <SectionCard title={t.labelMission} proMode={proMode}>
        {t.mission}
      </SectionCard>
    </div>
  );
};

const App = () => {
  const [selected, setSelected] = useState('VVC');
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
  const [proMode, setProMode] = useState(() => localStorage.getItem('proMode') === 'true');
  const [lang, setLang] = useState(() => localStorage.getItem('lang') || 'nl');
  const [ctaAnimating, setCtaAnimating] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('proMode', proMode ? 'true' : 'false');
  }, [proMode]);

  useEffect(() => {
    localStorage.setItem('lang', lang);
  }, [lang]);

  useEffect(() => {
    // reset selection when leaving de motor-pagina
    if (location.pathname !== '/financiele-motor') {
      setSelected('VVC');
    }
  }, [location.pathname]);

  useEffect(() => {
    if (!ctaAnimating) return;
    const timeout = setTimeout(() => setCtaAnimating(false), 900);
    return () => clearTimeout(timeout);
  }, [location.pathname, ctaAnimating]);

  useEffect(() => {
    const onScroll = () => {
      const max = document.body.scrollHeight - window.innerHeight || 1;
      const ratio = Math.min(1, Math.max(0, window.scrollY / max));
      document.documentElement.style.setProperty('--scroll-tilt', ratio.toFixed(3));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const selectedNode = useMemo(() => nodesData[selected], [selected]);

  const handleStartMotor = () => {
    setCtaAnimating(true);
    navigate('/financiele-motor');
  };

  return (
    <div className="min-h-screen text-white bg-slate-950">
      {ctaAnimating && (
        <div className="cta-overlay">
          <div className="cta-overlay-glow" />
          <div className="cta-overlay-content">
            <div className="cta-overlay-ring">
              <RefreshCw className="w-8 h-8 text-cyan-200 animate-spin-slow" />
            </div>
            <div className="text-sm font-semibold text-cyan-100">Motor laden...</div>
            <div className="cta-overlay-bar">
              <span className="cta-overlay-bar-fill" />
            </div>
          </div>
        </div>
      )}
      <Nav
        theme={theme}
        proMode={proMode}
        lang={lang}
        onToggleTheme={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
        onTogglePro={() => setProMode((p) => !p)}
        onToggleLang={() => setLang((l) => (l === 'nl' ? 'en' : 'nl'))}
      />
      <div key={location.pathname} className="page-animate">
        <Routes>
          <Route path="/" element={<HomeLogo lang={lang} onStartMotor={handleStartMotor} />} />
          <Route path="/pitch" element={<PitchOverview lang={lang} proMode={proMode} />} />
          <Route path="/pitch/full" element={<PitchPage lang={lang} proMode={proMode} />} />
          <Route
            path="/financiele-motor"
            element={
              <div className="flex flex-col gap-4 px-3 py-3 mx-auto max-w-7xl sm:px-4 sm:py-5 lg:py-7 lg:gap-5 motor-entry">
                <Header mounted={mounted} />
                <div className="grid gap-3 sm:gap-4 lg:gap-5 lg:grid-cols-[1.7fr_1fr]">
                  <CanvasPanel selected={selected} onSelect={setSelected} mounted={mounted} />
                  <InfoPanel selectedNode={selectedNode} />
                </div>
                <CycleTimeline selected={selected} onSelect={setSelected} />
              </div>
            }
          />
          <Route path="/overige-motoren" element={<OverigeMotoren />} />
          <Route path="/over" element={<AboutPage />} />
          {proMode && (
            <>
              <Route path="/pro/vvc" element={<MotorDetail id="VVC" />} />
              <Route path="/pro/investbotiq" element={<MotorDetail id="INVESTBOTIQ" />} />
              <Route path="/pro/spontiva" element={<MotorDetail id="SPONTIVA" />} />
              <Route path="/pro/djobba" element={<MotorDetail id="DJOBBA" />} />
              <Route path="/pro/afterstudenthousing" element={<MotorDetail id="ASH" />} />
              <Route path="/pro/faq" element={<ProFaq />} />
            </>
          )}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </div>
  );
};

const Nav = ({ theme, proMode, lang, onToggleTheme, onTogglePro, onToggleLang }) => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const tNav = translations[lang]?.nav || translations.nl.nav;
  const links = [
    { to: '/', label: tNav.home, icon: <Home size={16} /> },
    { to: '/financiele-motor', label: tNav.motor, icon: <Sparkles size={16} /> },
    { to: '/overige-motoren', label: tNav.overige, icon: <Briefcase size={16} /> },
    { to: '/pitch', label: tNav.pitch, icon: <ArrowRight size={16} /> },
    { to: '/over', label: tNav.over, icon: <Info size={16} /> },
  ];
  useEffect(() => setOpen(false), [location.pathname]);

  return (
    <header className="sticky top-0 z-40 border-b backdrop-blur-xl bg-slate-950/70 border-slate-800">
      <div className="flex justify-between items-center px-4 py-3 mx-auto max-w-7xl">
        <Link to="/" className="flex gap-2 items-center font-bold text-slate-100">
          <span className="rounded-lg bg-sky-500/15 px-2 py-1 text-xs uppercase tracking-[0.25em] text-sky-300">
            Verdienende Vrienden Club
          </span>
          <span className="text-sm text-slate-300">Ecosysteem</span>
        </Link>
        <div className="flex gap-3 items-center">
          <nav className="hidden gap-2 md:flex">
            {links.map((link) => (
              <NavLink key={link.to} {...link} active={location.pathname === link.to} />
            ))}
          </nav>
          <button
            onClick={onToggleTheme}
            className="inline-flex gap-1 items-center px-3 py-2 rounded-lg border border-slate-700 bg-slate-900/70 text-slate-200 hover:border-sky-500/50"
          >
            <Sparkles size={16} className="text-cyan-300" />
            <span className="text-xs font-semibold">{theme === 'dark' ? tNav.themeDark : tNav.themeLight}</span>
          </button>
          <button
            onClick={onToggleLang}
            className="inline-flex gap-1 items-center px-3 py-2 rounded-lg border border-slate-700 bg-slate-900/70 text-slate-200 hover:border-emerald-400/60"
          >
            <Globe size={16} className="text-emerald-300" />
            <span className="text-xs font-semibold">{lang === 'nl' ? 'NL' : 'EN'}</span>
          </button>
          <button
            onClick={onTogglePro}
            className={`inline-flex items-center gap-1 rounded-lg border px-3 py-2 text-slate-200 transition ${
              proMode
                ? 'border-emerald-400 bg-emerald-500/20 hover:border-emerald-300'
                : 'border-slate-700 bg-slate-900/70 hover:border-slate-500'
            }`}
          >
            <ShieldCheck size={16} className={proMode ? 'text-emerald-300' : 'text-slate-300'} />
            <span className="text-xs font-semibold">{proMode ? tNav.proOn : tNav.proOff}</span>
          </button>
          <button
            className="inline-flex justify-center items-center p-2 rounded-lg border border-slate-700 bg-slate-900/70 text-slate-200 md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
          >
            <Menu size={18} />
          </button>
        </div>
      </div>
      {proMode && (
        <div className="px-4 py-2 border-t border-slate-800 bg-slate-900/80">
          <div className="text-[11px] uppercase tracking-[0.3em] text-slate-400 mb-1">{tNav.proMenu}</div>
          <div className="flex flex-wrap gap-2">
            {[
              { to: '/pro/vvc', label: 'VVC' },
              { to: '/pro/investbotiq', label: 'INVESTBOTIQ' },
              { to: '/pro/spontiva', label: 'SPONTIVA' },
              { to: '/pro/djobba', label: 'DJOBBA' },
              { to: '/pro/afterstudenthousing', label: 'AfterStudentHousing' },
              { to: '/pro/faq', label: 'FAQ' },
            ].map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`rounded-lg px-3 py-1 text-sm border transition ${
                  location.pathname === item.to
                    ? 'border-emerald-400/70 bg-emerald-500/15 text-emerald-200'
                    : 'border-slate-700 bg-slate-900/60 text-slate-200 hover:border-slate-500'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
      {open && (
        <div className="px-4 pb-4 border-t md:hidden border-slate-800 bg-slate-900/90">
          <div className="flex flex-col gap-2 pt-2">
            {links.map((link) => (
              <NavLink key={link.to} {...link} active={location.pathname === link.to} mobile />
            ))}
            {proMode && (
              <div className="flex flex-col gap-1 mt-2">
                {[
                  { to: '/pro/vvc', label: 'VVC' },
                  { to: '/pro/investbotiq', label: 'INVESTBOTIQ' },
                  { to: '/pro/spontiva', label: 'SPONTIVA' },
                  { to: '/pro/djobba', label: 'DJOBBA' },
                  { to: '/pro/afterstudenthousing', label: 'AfterStudentHousing' },
                  { to: '/pro/faq', label: 'FAQ' },
                ].map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className="px-3 py-2 text-sm rounded-lg border border-slate-800 bg-slate-900/70 text-slate-200"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

const NavLink = ({ to, label, icon, active, mobile }) => (
  <Link
    to={to}
    className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-all ${
      active
        ? 'text-sky-200 border bg-sky-500/20 border-sky-500/30 shadow-glow'
        : 'text-slate-200 hover:text-white hover:bg-slate-800/70'
    } ${mobile ? 'border border-slate-800' : ''}`}
  >
    {icon}
    {label}
  </Link>
);

const Header = ({ mounted }) => (
  <div className="overflow-hidden relative px-6 py-6 bg-gradient-to-br rounded-2xl border shadow-2xl border-slate-800/50 from-slate-900/80 via-slate-900 to-slate-950 header-hero group hover:border-cyan-400/30 transition-all duration-500">
    <div className="absolute inset-0 opacity-30 group-hover:opacity-50 transition-opacity" style={{ backgroundImage: 'radial-gradient(#22d3ee 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
    <div className="absolute top-0 left-1/4 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '5s' }} />
    <div className="absolute bottom-0 right-1/4 w-56 h-56 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s', animationDelay: '1s' }} />
    <div className="flex relative flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex gap-4 items-center">
        <div className="relative group/icon">
          <div className="p-3.5 rounded-xl ring-2 bg-sky-500/15 ring-sky-400/40 group-hover/icon:ring-sky-300/60 group-hover/icon:bg-sky-500/25 transition-all duration-300">
            <RefreshCw className="text-sky-300 group-hover/icon:text-sky-200 transition-colors animate-spin-slow" />
          </div>
          <div className="absolute -inset-1 bg-sky-500/20 rounded-xl blur-md opacity-0 group-hover/icon:opacity-100 transition-opacity" />
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-slate-400 group-hover:text-slate-300 transition-colors">Financieel Ecosysteem</p>
          <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-400 to-indigo-400 animate-gradient" style={{ backgroundSize: '200% 200%' }}>
            Gesloten Financiële Motor
          </h1>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 text-[11px] text-slate-300">
        <Badge>Alle toegang via VVC</Badge>
        <Badge>Financiering: Spontiva</Badge>
        <Badge>Time Gap Cashflow: DJOBBA</Badge>
        <Badge>Invest: AfterStudentHousing</Badge>
      </div>
    </div>
  </div>
);

const Badge = ({ children }) => (
  <span className="px-3 py-1.5 rounded-full border shadow-inner border-slate-700/70 bg-slate-900/70 text-slate-200 shadow-cyan-500/10 hover:border-cyan-500/40 hover:bg-slate-800/80 hover:text-cyan-100 transition-all duration-300 cursor-default">
    {children}
  </span>
);

const CanvasPanel = ({ selected, onSelect, mounted }) => {
  return (
    <div className="rounded-2xl neon-border">
      <div className="overflow-visible relative rounded-2xl border shadow-2xl neon-content border-slate-800 bg-slate-900/70 group hover:border-slate-700 transition-all duration-500">
        <div className="absolute inset-0 opacity-10 group-hover:opacity-15 transition-opacity" style={{ backgroundImage: 'radial-gradient(#6366f1 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
        <div className="absolute top-1/4 left-1/3 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '7s' }} />
        <div className="absolute bottom-1/4 right-1/3 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s', animationDelay: '2s' }} />
        <div className="relative h-[440px] sm:h-[500px] lg:h-[540px] w-full">
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
            <defs>
              <marker id="arrow" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="#64748b" />
              </marker>
              <marker id="flow" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="#38bdf8" />
              </marker>
              <marker id="return" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="#22c55e" />
              </marker>
              <linearGradient id="flowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.2" />
                <stop offset="50%" stopColor="#60a5fa" stopOpacity="1" />
                <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.2" />
              </linearGradient>
            </defs>

            {/* VVC down to Investbotiq */}
            <line x1="50" y1="8" x2="50" y2="24" stroke="#f97316" strokeWidth="2.4" strokeDasharray="3 4" markerEnd="url(#arrow)" />

            {/* Flow diamond */}
            <path d="M53 30 Q 78 30 82 48" fill="none" stroke="#38bdf8" strokeWidth="2.2" markerEnd="url(#flow)" opacity="0.6" />
            <path d="M82 52 Q 78 70 55 70" fill="none" stroke="#38bdf8" strokeWidth="2.2" markerEnd="url(#flow)" opacity="0.6" />
            <path d="M47 70 Q 22 70 18 52" fill="none" stroke="#38bdf8" strokeWidth="2.2" markerEnd="url(#flow)" opacity="0.6" />

            {/* Return loop */}
            <path d="M18 48 Q 22 30 45 30" fill="none" stroke="#22c55e" strokeWidth="2.2" strokeDasharray="7 4" markerEnd="url(#return)" className="animate-[pulse_3s_ease-in-out_infinite]" />

            {/* Animated flow dots */}
            <FlowDot dur="3s" path="M53 30 Q 78 30 82 48" delay="0s" />
            <FlowDot dur="3s" path="M82 52 Q 78 70 55 70" delay="0.7s" />
            <FlowDot dur="3s" path="M47 70 Q 22 70 18 52" delay="1.4s" />
            <FlowDot dur="4s" path="M18 48 Q 22 30 45 30" delay="0s" color="#22c55e" size={1.3} />
          </svg>

          {/* Nodes */}
          <Node spot="top" onClick={() => onSelect('VVC')} active={selected === 'VVC'} node={nodesData.VVC} />
          <Node spot="topMid" onClick={() => onSelect('INVESTBOTIQ')} active={selected === 'INVESTBOTIQ'} node={nodesData.INVESTBOTIQ} />
          <Node spot="right" onClick={() => onSelect('SPONTIVA')} active={selected === 'SPONTIVA'} node={nodesData.SPONTIVA} />
          <Node spot="bottom" onClick={() => onSelect('DJOBBA')} active={selected === 'DJOBBA'} node={nodesData.DJOBBA} />
          <Node spot="left" onClick={() => onSelect('ASH')} active={selected === 'ASH'} node={nodesData.ASH} />

          <ServicesCard onClick={() => onSelect('SERVICES')} active={selected === 'SERVICES'} />

        </div>
      </div>
    </div>
  );
};

const FlowDot = ({ path, dur, delay = '0s', color = '#60a5fa', size = 1 }) => (
  <circle r={size} fill={color}>
    <animateMotion repeatCount="indefinite" dur={dur} begin={delay} path={path} />
  </circle>
);

const nodePositions = {
  top: 'left-1/2 top-0 sm:top-2 -translate-x-1/2',
  topMid: 'left-1/2 top-[30%] -translate-x-1/2',
  right: 'right-[6%] top-1/2 -translate-y-1/2',
  bottom: 'left-1/2 bottom-[10%] -translate-x-1/2',
  left: 'left-[6%] top-1/2 -translate-y-1/2',
};

const Node = ({ spot, node, active, onClick }) => {
  const isVvc = node.id === 'VVC';
  return (
    <div
      className={`absolute cursor-pointer ${nodePositions[spot]} group`}
      onClick={onClick}
      aria-label={node.title}
      role="button"
    >
      <div
        className={`relative flex ${isVvc ? 'w-24 h-24 md:h-32 md:w-32' : 'w-28 h-28 md:h-36 md:w-36'} flex-col items-center justify-center rounded-full border-2 transition-all duration-500 ${
          active
            ? isVvc
              ? 'scale-115 border-orange-200 bg-gradient-to-br from-orange-400 via-rose-400 to-pink-500 shadow-[0_0_50px_rgba(255,153,102,0.6)]'
              : 'scale-115 border-cyan-300 bg-slate-800 shadow-[0_0_45px_rgba(34,211,238,0.4)]'
            : 'border-slate-600 bg-slate-900/80 hover:border-slate-400 hover:scale-105 hover:shadow-[0_0_25px_rgba(148,163,184,0.2)]'
        }`}
      >
        {active && <div className={`absolute inset-0 rounded-full opacity-30 blur-2xl bg-gradient-to-r ${node.color} animate-pulse`} style={{ animationDuration: '3s' }} />}
        {!active && <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-20 blur-xl bg-gradient-to-r from-cyan-400 to-blue-400 transition-opacity duration-500" />}
        <div
          className={`pointer-events-none absolute -top-14 right-0 z-20 rounded-lg border px-3 py-2 text-[11px] shadow-xl node-tooltip backdrop-blur-sm ${
            active ? 'block border-cyan-500/50 bg-slate-900/95' : 'hidden group-hover:block border-slate-700 bg-slate-900/90'
          }`}
        >
          <div className="font-semibold">{node.title}</div>
          <div className="text-slate-300">{node.subtitle}</div>
        </div>
        <div
          className={`relative mb-2 rounded-full p-3 transition-all duration-300 ${
            active
              ? isVvc
                ? 'bg-gradient-to-br from-white/90 via-orange-100 to-pink-100 text-orange-700 shadow-lg'
                : `bg-gradient-to-br ${node.color} text-white shadow-lg`
              : 'bg-slate-800 text-slate-300 group-hover:bg-slate-750 group-hover:text-slate-200'
          }`}
        >
          {node.icon}
        </div>
        <div className="relative text-center">
          <div className={`text-xs font-bold md:text-sm transition-colors ${active ? 'text-white' : 'text-slate-200 group-hover:text-white'}`}>{node.title}</div>
          {active && <div className="text-[10px] text-slate-300">{node.subtitle}</div>}
        </div>
        <div className={`absolute -top-1 left-1/2 w-1.5 h-1.5 rounded-full -translate-x-1/2 transition-colors ${active ? 'bg-cyan-400' : 'bg-slate-500 group-hover:bg-slate-400'}`} />
        <div className={`absolute -bottom-1 left-1/2 w-1.5 h-1.5 rounded-full -translate-x-1/2 transition-colors ${active ? 'bg-cyan-400' : 'bg-slate-500 group-hover:bg-slate-400'}`} />
        <div className={`absolute left-0 top-1/2 w-1.5 h-1.5 rounded-full -translate-y-1/2 transition-colors ${active ? 'bg-cyan-400' : 'bg-slate-500 group-hover:bg-slate-400'}`} />
        <div className={`absolute right-0 top-1/2 w-1.5 h-1.5 rounded-full -translate-y-1/2 transition-colors ${active ? 'bg-cyan-400' : 'bg-slate-500 group-hover:bg-slate-400'}`} />
      </div>
    </div>
  );
};

const ServicesCard = ({ active, onClick }) => (
  <div
    onClick={onClick}
    className={`absolute left-2 top-4 sm:left-3 sm:top-6 w-32 sm:w-36 md:left-6 md:top-8 md:w-40 cursor-pointer rounded-xl border p-3 text-sm transition-all duration-300 group/services ${
      active
        ? 'border-slate-400 bg-slate-700/90 shadow-[0_0_25px_rgba(148,163,184,0.4)]'
        : 'border-slate-700 bg-slate-800/60 hover:border-slate-500 hover:bg-slate-800/80 hover:shadow-[0_0_15px_rgba(148,163,184,0.2)]'
    }`}
  >
    <div className={`flex gap-2 items-center mb-2 transition-colors ${active ? 'text-slate-100' : 'text-slate-200 group-hover/services:text-slate-100'}`}>
      <ShieldCheck className={`transition-colors ${active ? 'text-slate-300' : 'text-slate-400 group-hover/services:text-slate-300'}`} size={16} />
      <span className="font-semibold">Services</span>
    </div>
    <ul className={`space-y-1 text-[11px] transition-colors ${active ? 'text-slate-300' : 'text-slate-400 group-hover/services:text-slate-300'}`}>
      <li>• Spraakzaam Samen</li>
      <li>• Cybersecurity 31 RJP</li>
      <li>• Angels Mediate</li>
    </ul>
  </div>
);

const InfoPanel = ({ selectedNode }) => (
  <div className="rounded-2xl neon-border">
    <div className="flex flex-col gap-3 p-3 h-full rounded-2xl border shadow-2xl neon-content sm:gap-4 border-slate-800 bg-slate-900/80 sm:p-4 group hover:border-slate-700 transition-all duration-500">
      <div className="relative overflow-hidden p-4 rounded-xl border shadow-inner border-slate-800 bg-slate-950/60 sm:p-5 group/header hover:border-slate-700 transition-all duration-300">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan-500/10 to-transparent rounded-full blur-2xl" />
        <div className="relative">
          <div className="text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-400 group-hover/header:text-slate-300 transition-colors">Huidige selectie</div>
          <div className={`mt-1.5 text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r ${selectedNode.color} animate-gradient`} style={{ backgroundSize: '200% 200%' }}>
            {selectedNode.title}
          </div>
          <div className="text-base italic sm:text-lg text-slate-300 group-hover/header:text-slate-200 transition-colors">"{selectedNode.subtitle}"</div>
        </div>
      </div>

      <Card title="Functie" accent="blue">
        {selectedNode.description}
      </Card>
      <Card title="Waarom deze stap?" accent="green" icon={<Lock size={16} />}>
        {selectedNode.details}
      </Card>

      {selectedNode.id === 'ASH' && (
        <div className="rounded-lg neon-border">
          <div className="relative overflow-hidden p-4 rounded-lg border neon-content border-green-500/40 bg-green-900/20 group/cycle hover:border-green-400/50 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent" />
            <div className="relative">
              <div className="flex gap-2 items-center mb-2 font-semibold text-green-300 group-hover/cycle:text-green-200 transition-colors">
                <RefreshCw size={16} className="animate-spin-slow" />
                De Cirkel is Rond
              </div>
              <p className="text-xs text-green-100/90 leading-relaxed">
                De winsten uit het vastgoed vloeien terug naar INVESTBOTIQ voor nieuwe hefbomen en groei van de generator.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  </div>
);

const Card = ({ title, accent, children, icon }) => {
  const colors = {
    blue: 'text-blue-400 border-blue-500/30',
    green: 'text-green-400 border-green-500/30',
  };
  const glowColors = {
    blue: 'from-blue-500/10',
    green: 'from-green-500/10',
  };
  return (
    <div className="rounded-lg neon-border">
      <div className="overflow-hidden relative p-3 rounded-lg border shadow-inner neon-content border-slate-800 bg-slate-950/50 sm:p-4 group/card hover:border-slate-700 hover:bg-slate-950/60 transition-all duration-300">
        <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${glowColors[accent]} to-transparent rounded-full blur-2xl opacity-0 group-hover/card:opacity-100 transition-opacity duration-500`} />
        <div className="relative">
          <div className={`flex gap-2 items-center mb-2 font-semibold text-[13px] sm:text-sm text-slate-100 ${colors[accent]} group-hover/card:brightness-110 transition-all`}>
            {icon ?? <Zap size={16} className="group-hover/card:scale-110 transition-transform" />}
            {title}
          </div>
          <p className="text-slate-200 leading-relaxed text-[13px] sm:text-sm group-hover/card:text-slate-100 transition-colors">{children}</p>
        </div>
      </div>
    </div>
  );
};

const CycleTimeline = ({ selected, onSelect }) => {
  return (
    <div className="rounded-2xl neon-border">
      <div className="overflow-hidden relative p-4 rounded-2xl border shadow-2xl neon-content border-slate-800 bg-slate-900/70 sm:p-5 group hover:border-slate-700 transition-all duration-500">
        <div className="absolute top-0 left-1/4 w-48 h-48 bg-cyan-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s' }} />
        <div className="absolute bottom-0 right-1/4 w-40 h-40 bg-indigo-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '7s', animationDelay: '1.5s' }} />
        <div className="relative">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-slate-400 group-hover:text-slate-300 transition-colors mb-4">
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            De Complete Cyclus
          </div>
          <div className="mt-3 grid gap-3 grid-flow-col auto-cols-[minmax(200px,1fr)] overflow-x-auto pb-2 sm:grid-flow-col sm:auto-cols-[minmax(220px,1fr)] lg:grid-flow-row lg:grid-cols-5 lg:auto-rows-auto">
            {cycleSteps.map((step, index) => {
              const isActive = selected === step.id || (step.id === 'ASH' && selected === 'ASH');
              return (
                <div
                  key={step.id}
                  onClick={() => onSelect(step.id === 'ASH' ? 'ASH' : step.id)}
                  className={`group/step flex h-full cursor-pointer flex-col gap-2 rounded-xl border p-3.5 transition-all duration-300 relative overflow-hidden ${
                    isActive
                      ? 'border-cyan-400/70 bg-slate-800/90 shadow-[0_0_25px_rgba(34,211,238,0.3)]'
                      : 'border-slate-800 bg-slate-900/60 hover:border-slate-600 hover:bg-slate-800/70 hover:shadow-[0_0_15px_rgba(148,163,184,0.15)]'
                  }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {isActive && <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent" />}
                  <div className="relative">
                    <div className="flex gap-2 items-center text-sm font-semibold text-slate-100 mb-2">
                      <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold transition-all ${
                        isActive 
                          ? 'bg-cyan-500/30 text-cyan-200 shadow-[0_0_10px_rgba(34,211,238,0.3)]' 
                          : 'bg-cyan-500/20 text-cyan-300 group-hover/step:bg-cyan-500/25'
                      }`}>
                        {step.title}
                      </span>
                    </div>
                    <p className={`text-xs leading-relaxed transition-colors ${
                      isActive ? 'text-slate-200' : 'text-slate-300 group-hover/step:text-slate-200'
                    }`}>{step.reason}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

const SectionCard = ({ title, children, proMode = false }) => (
  <div
    className={`relative overflow-hidden group p-6 rounded-2xl border shadow-2xl transition duration-300 ${
      proMode
        ? 'border-cyan-400/60 bg-slate-900/80 hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(34,211,238,0.35)]'
        : 'border-slate-800 bg-slate-900/70'
    }`}
  >
    {proMode && (
      <>
        <div
          className="pointer-events-none absolute -inset-px rounded-2xl opacity-40 blur-lg bg-gradient-to-r from-cyan-500/50 via-blue-500/30 to-indigo-500/50 animate-[pulse_6s_ease-in-out_infinite]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl opacity-25 bg-[radial-gradient(circle_at_20%_20%,rgba(34,211,238,0.2),transparent_40%),radial-gradient(circle_at_80%_0%,rgba(99,102,241,0.22),transparent_38%),radial-gradient(circle_at_50%_100%,rgba(14,165,233,0.25),transparent_40%)]"
          aria-hidden
        />
        <div
          className="absolute -inset-1 rounded-3xl border opacity-30 pointer-events-none border-cyan-400/40 animate-spin-slow"
          aria-hidden
        />
      </>
    )}
    <div className="relative z-10 space-y-1">
      <h3 className="flex gap-2 items-center text-lg font-semibold text-slate-100">
        <Sparkles
          size={16}
          className={`drop-shadow-[0_0_8px_rgba(34,211,238,0.6)] ${proMode ? 'text-cyan-300 animate-pulse' : 'text-cyan-300'}`}
        />
        <span className={proMode ? 'transition-colors group-hover:text-cyan-100' : ''}>{title}</span>
      </h3>
      <p className={`text-slate-300 transition ${proMode ? 'group-hover:text-slate-100 group-hover:translate-x-[2px]' : ''}`}>
        {children}
      </p>
    </div>
  </div>
);

const OverigeMotoren = () => (
  <div className="px-4 py-8 mx-auto space-y-6 max-w-5xl">
    <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-indigo-400">Overige Motoren</h1>
    <p className="text-slate-300">
      Beschikbaar via VVC, ondersteunen de totale machine met communicatie, security en mediatie.
    </p>
    <div className="grid gap-4 md:grid-cols-3">
      {[
        { name: 'Spraakzaam Samen', desc: 'Communicatie en community support.' },
        { name: 'Cybersecurity 31 RJP', desc: 'Beveiliging en digitale weerbaarheid.' },
        { name: 'Angels Mediate', desc: 'Mediatie en begeleiding bij samenwerkingen.' },
      ].map((svc) => (
        <SectionCard key={svc.name} title={svc.name}>
          {svc.desc}
        </SectionCard>
      ))}
    </div>
  </div>
);

const AboutPage = () => (
  <div className="px-4 py-8 mx-auto space-y-4 max-w-4xl">
    <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-cyan-400">Over het model</h1>
    <SectionCard title="Waarom deze flow?">
      Het systeem zet arbeid om in kapitaal, gebruikt hefboom voor grotere investeringen, en solidificeert waarde in vastgoed. De huurwinst voedt de cyclus opnieuw.
    </SectionCard>
    <SectionCard title="Governance">
      Toegang loopt uitsluitend via VVC. INVESTBOTIQ orkestreert de allocatie, Spontiva verzorgt hefboom, DJOBBA genereert TGC, ASH verankert waarde.
    </SectionCard>
  </div>
);

const NotFound = () => (
  <div className="px-4 py-12 mx-auto space-y-3 max-w-3xl text-center">
    <h1 className="text-4xl font-black text-white">404</h1>
    <p className="text-slate-300">Pagina niet gevonden.</p>
    <Link to="/" className="inline-flex gap-2 items-center px-4 py-2 text-sky-100 rounded-lg border bg-sky-500/20 border-sky-500/40">
      <Home size={16} /> Terug naar ecosysteem
    </Link>
  </div>
);

const PitchPage = ({ lang = 'nl', proMode = false }) => {
  const t = translations[lang]?.pitch || translations.nl.pitch;
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    company_name: '',
    kvk_number: '',
    sector: '',
    years_zzp: '',
    monthly_revenue: '',
    interest_areas: [],
    how_heard: '',
    preferred_contact: 'email',
    message: '',
  });
  const [status, setStatus] = useState('idle'); // idle | submitting | success | error

  const handleCheckbox = (area) => {
    setForm((prev) => ({
      ...prev,
      interest_areas: prev.interest_areas.includes(area)
        ? prev.interest_areas.filter((a) => a !== area)
        : [...prev.interest_areas, area],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');
    try {
      const { error } = await supabase.from('zzp_signups').insert([
        {
          name: form.name,
          email: form.email,
          phone: form.phone || null,
          company_name: form.company_name || null,
          kvk_number: form.kvk_number || null,
          sector: form.sector || null,
          years_zzp: form.years_zzp ? parseInt(form.years_zzp, 10) : null,
          monthly_revenue: form.monthly_revenue || null,
          interest_areas: form.interest_areas.length > 0 ? form.interest_areas : null,
          how_heard: form.how_heard || null,
          preferred_contact: form.preferred_contact,
          message: form.message || null,
          lang,
        },
      ]);
      if (error) throw error;
      setStatus('success');
      setForm({
        name: '',
        email: '',
        phone: '',
        company_name: '',
        kvk_number: '',
        sector: '',
        years_zzp: '',
        monthly_revenue: '',
        interest_areas: [],
        how_heard: '',
        preferred_contact: 'email',
        message: '',
      });
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  const inputClass =
    'w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-slate-100 placeholder:text-slate-500 focus:border-sky-500 focus:outline-none text-sm';

  const neonWrap = proMode ? 'relative overflow-hidden group border-cyan-400/60 bg-slate-900/80 hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(34,211,238,0.35)] transition duration-300' : '';
  const neonOverlay = proMode ? (
    <>
      <div className="pointer-events-none absolute -inset-px rounded-3xl opacity-35 blur-lg bg-gradient-to-r from-cyan-500/50 via-blue-500/30 to-indigo-500/40 animate-[pulse_6s_ease-in-out_infinite]" aria-hidden />
      <div className="pointer-events-none absolute inset-0 rounded-3xl opacity-20 bg-[radial-gradient(circle_at_20%_20%,rgba(34,211,238,0.15),transparent_40%),radial-gradient(circle_at_80%_0%,rgba(99,102,241,0.18),transparent_38%),radial-gradient(circle_at_50%_100%,rgba(14,165,233,0.2),transparent_40%)]" aria-hidden />
    </>
  ) : null;

  return (
    <div className="px-4 py-12 mx-auto space-y-10 max-w-4xl pitch-black-text">
      {/* Opening */}
      <div className="space-y-6 text-center">
        <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-sky-300 via-cyan-300 to-emerald-300 md:text-4xl">
          {t.openingQuestion}
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-slate-300">{t.openingBody}</p>
      </div>

      {/* Research & Kiyosaki */}
      <div className={`overflow-hidden relative p-6 rounded-2xl border border-slate-800 bg-slate-900/70 md:p-8 ${neonWrap}`}>
        <div className="pointer-events-none absolute -inset-0.5 rounded-3xl bg-gradient-to-r from-cyan-500 via-indigo-500 to-fuchsia-500 opacity-40 blur-lg" />
        {neonOverlay}
        <div className="relative z-10 space-y-4">
          <p className="text-slate-200">{t.researchIntro}</p>
          <blockquote className="pl-4 text-lg italic text-amber-100 border-l-4 border-amber-400">
            {t.kiyosakiQuote}
          </blockquote>
          <p className="text-2xl font-bold text-sky-300">{t.butHow}</p>
          <p className="text-slate-400">{t.silenceNote}</p>
        </div>
      </div>

      {/* Insight */}
      <div className={`overflow-hidden relative p-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 md:p-8 ${neonWrap}`}>
        <div className="pointer-events-none absolute -inset-1 rounded-3xl bg-gradient-to-r from-cyan-400 via-indigo-500 to-fuchsia-500 opacity-30 blur-xl" />
        {neonOverlay}
        <div className="relative z-10 space-y-3">
          <h2 className="text-xl font-bold text-emerald-200">{t.insightTitle}</h2>
          <p className="text-slate-100">{t.insightBody}</p>
        </div>
      </div>

      {/* System */}
      <div className="space-y-2 text-center">
        <h2 className="text-xl font-bold text-slate-100">{t.systemTitle}</h2>
        <p className="text-slate-300">{t.systemBody}</p>
      </div>

      {/* TGC Hero */}
      <div className={`overflow-hidden relative p-8 text-center bg-gradient-to-br rounded-2xl border border-cyan-500/40 from-cyan-900/30 to-slate-900 ${neonWrap}`}>
        <div className="pointer-events-none absolute -inset-1 rounded-3xl bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 opacity-40 blur-lg" />
        {neonOverlay}
        <div className="relative z-10 space-y-4">
          <h2 className="text-2xl font-black text-cyan-200 md:text-3xl">{t.tgcTitle}</h2>
          <p className="text-lg text-slate-200">{t.tgcBody}</p>
          <div className="flex gap-3 justify-center items-center pt-2">
            <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-400">
              {t.methodsHighlight}
            </span>
            <span className="text-lg text-slate-200">{t.methodsBody}</span>
          </div>
        </div>
      </div>

      {/* Passive Income */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className={`p-6 space-y-2 rounded-2xl border border-slate-800 bg-slate-900/70 ${neonWrap}`}>
          {neonOverlay}
          <h3 className="font-bold text-slate-100">{t.passiveTitle}</h3>
          <p className="text-sm text-slate-300">{t.passiveBody}</p>
        </div>
        <div className={`p-6 space-y-2 rounded-2xl border border-slate-800 bg-slate-900/70 ${neonWrap}`}>
          {neonOverlay}
          <p className="text-sm text-slate-400">{t.workNote}</p>
          <h3 className="font-bold text-emerald-300">{t.automationTitle}</h3>
          <p className="text-sm text-slate-200">{t.automationBody}</p>
        </div>
      </div>

      {/* CTA */}
      <div className="space-y-2 text-center">
        <p className="text-xl font-semibold text-slate-100">{t.ctaQuestion}</p>
        <p className="text-slate-400">{t.ctaAnswer}</p>
        <p className="pt-2 text-lg text-sky-200">{t.contactChoice}</p>
      </div>

      {/* Form + AI option */}
      <div className="grid lg:grid-cols-[1.3fr_0.7fr] gap-6">
        <form onSubmit={handleSubmit} className={`overflow-hidden relative p-6 rounded-2xl border border-slate-800 bg-slate-900/80 ${neonWrap}`}>
          <div className="pointer-events-none absolute -inset-0.5 rounded-3xl bg-gradient-to-r from-cyan-500 via-indigo-500 to-fuchsia-500 opacity-40 blur-lg" />
          {neonOverlay}
          <div className="relative z-10 space-y-5">
            <div>
              <h3 className="text-lg font-bold text-slate-100">{t.formTitle}</h3>
              <p className="text-sm text-slate-400">{t.formSubtitle}</p>
            </div>

          {/* Required fields */}
          <div className="grid gap-4 sm:grid-cols-2">
            <input
              type="text"
              placeholder={t.formName}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className={inputClass}
              required
            />
            <input
              type="email"
              placeholder={t.formEmail}
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className={inputClass}
              required
            />
          </div>

          {/* Optional fields */}
          <div className="grid gap-4 sm:grid-cols-2">
            <input
              type="tel"
              placeholder={t.formPhone}
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className={inputClass}
            />
            <input
              type="text"
              placeholder={t.formCompany}
              value={form.company_name}
              onChange={(e) => setForm({ ...form, company_name: e.target.value })}
              className={inputClass}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <input
              type="text"
              placeholder={t.formKvk}
              value={form.kvk_number}
              onChange={(e) => setForm({ ...form, kvk_number: e.target.value })}
              className={inputClass}
            />
            <input
              type="text"
              placeholder={t.formSector}
              value={form.sector}
              onChange={(e) => setForm({ ...form, sector: e.target.value })}
              className={inputClass}
            />
            <input
              type="number"
              placeholder={t.formYearsZzp}
              value={form.years_zzp}
              onChange={(e) => setForm({ ...form, years_zzp: e.target.value })}
              className={inputClass}
              min="0"
            />
          </div>

          {/* Revenue select */}
          <div>
            <label className="block mb-1 text-xs text-slate-400">{t.formRevenue}</label>
            <select
              value={form.monthly_revenue}
              onChange={(e) => setForm({ ...form, monthly_revenue: e.target.value })}
              className={inputClass}
            >
              <option value="">--</option>
              {t.formRevenueOptions.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          {/* Interests checkboxes */}
          <div>
            <label className="block mb-2 text-xs text-slate-400">{t.formInterests}</label>
            <div className="flex flex-wrap gap-2">
              {t.formInterestOptions.map((opt) => (
                <label
                  key={opt}
                  className={`cursor-pointer rounded-lg border px-3 py-1.5 text-sm transition ${
                    form.interest_areas.includes(opt)
                      ? 'border-sky-400 bg-sky-500/20 text-sky-100'
                      : 'border-slate-700 bg-slate-800 text-slate-300 hover:border-slate-600'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={form.interest_areas.includes(opt)}
                    onChange={() => handleCheckbox(opt)}
                    className="sr-only"
                  />
                  {opt}
                </label>
              ))}
            </div>
          </div>

          {/* How heard */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block mb-1 text-xs text-slate-400">{t.formHowHeard}</label>
              <select
                value={form.how_heard}
                onChange={(e) => setForm({ ...form, how_heard: e.target.value })}
                className={inputClass}
              >
                <option value="">--</option>
                {t.formHowHeardOptions.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block mb-1 text-xs text-slate-400">{t.formContact}</label>
              <select
                value={form.preferred_contact}
                onChange={(e) => setForm({ ...form, preferred_contact: e.target.value })}
                className={inputClass}
              >
                {t.formContactOptions.map((opt) => (
                  <option key={opt} value={opt.toLowerCase()}>{opt}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Message */}
          <textarea
            placeholder={t.formMessage}
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            rows={3}
            className={`resize-none ${inputClass}`}
          />

          {/* Submit */}
          <button
            type="submit"
            disabled={status === 'submitting'}
            className="flex gap-2 justify-center items-center px-4 py-3 w-full font-semibold text-white bg-gradient-to-r from-sky-500 to-emerald-500 rounded-lg transition hover:opacity-90 disabled:opacity-60"
          >
            {status === 'submitting' ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                {t.formSubmitting}
              </>
            ) : (
              <>
                <Send size={18} />
                {t.formSubmit}
              </>
            )}
          </button>

            {status === 'success' && (
              <p className="text-sm text-center text-emerald-400">{t.formSuccess}</p>
            )}
            {status === 'error' && (
              <p className="text-sm text-center text-red-400">{t.formError}</p>
            )}
          </div>
        </form>

        <div className="flex overflow-hidden relative flex-col justify-center items-center p-6 text-center rounded-2xl border border-emerald-500/30 bg-emerald-500/10">
          <div className="pointer-events-none absolute -inset-1 rounded-3xl bg-gradient-to-r from-indigo-400 via-purple-500 to-cyan-400 opacity-35 blur-xl" />
          <div className="relative z-10 space-y-4">
            <Cpu size={48} className="text-emerald-300" />
            <p className="font-semibold text-emerald-100">{t.formAlt}</p>
            <Link
              to="/financiele-motor"
              className="inline-flex gap-2 items-center px-5 py-2 text-sky-100 rounded-xl border transition border-sky-400/50 bg-sky-500/20 hover:bg-sky-500/30"
            >
              <Sparkles size={16} /> {t.ctaMotor}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

const MotorDetail = ({ id }) => {
  const node = nodesData[id];
  if (!node) return <NotFound />;
  const extras = {
    VVC: {
      focus: 'Instroom en gating van leden en diensten.',
      metrics: ['Aantal nieuwe leden', 'Kwaliteit/fit-scan', 'Conversie naar kernmotor'],
    },
    INVESTBOTIQ: {
      focus: 'Allocatie, due diligence, besliskaders.',
      metrics: ['Deal throughput', 'IRR-targets', 'Risicoprofiel per deal'],
    },
    SPONTIVA: {
      focus: 'Hefboom en funding-strategie.',
      metrics: ['Opgehaald kapitaal', 'Kosten van kapitaal', 'Snelheid van tranches'],
    },
    DJOBBA: {
      focus: 'Arbeid → cashflow (TGC.',
      metrics: ['Cashflow per periode', 'Winstmarge', 'Opschalingsratio'],
    },
    ASH: {
      focus: 'Vastgoed-anker en terugstroom.',
      metrics: ['Bezettingsgraad', 'Huurwinst', 'Waardegroei'],
    },
  }[id] || { focus: 'Kernonderdeel', metrics: [] };

  const proAnim = (delay = 0) => ({
    className: 'pro-animate',
    style: { animationDelay: `${delay}s` },
  });

  return (
    <div className="px-4 py-8 mx-auto space-y-5 max-w-5xl">
      <div className="flex gap-3 items-center pro-animate" style={{ animationDelay: '0s' }}>
        <div className="p-3 rounded-xl border bg-slate-900/70 border-slate-800 pro-badge">
          {node.icon}
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Pro detail</p>
          <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-cyan-300">
            {node.title}
          </h1>
          <p className="italic text-slate-300">"{node.subtitle}"</p>
        </div>
      </div>
      <div {...proAnim(0.05)}>
        <SectionCard title="Functie">
          {node.description}
        </SectionCard>
      </div>
      <div {...proAnim(0.1)}>
        <SectionCard title="Waarom deze stap?">
          {node.details}
        </SectionCard>
      </div>
      <div {...proAnim(0.15)}>
        <SectionCard title="Pro focus">
          <p className="mb-2 text-slate-200">{extras.focus}</p>
          {extras.metrics.length > 0 && (
            <ul className="pl-4 space-y-1 list-disc text-slate-200">
              {extras.metrics.map((m) => (
                <li key={m}>{m}</li>
              ))}
            </ul>
          )}
        </SectionCard>
      </div>
      <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900/70 pro-animate" style={{ animationDelay: '0.2s' }}>
        <div className="mb-2 text-sm font-semibold text-sky-200">Samenvattende pitch</div>
        <p className="text-slate-200/90">
          {node.title} is een rad in de gesloten motor. Het maakt de cyclus sterker en sneller. Combineer deze pagina met de hoofdvisual om investeerders en partners in één flow mee te nemen.
        </p>
      </div>
    </div>
  );
};

const ProFaq = () => {
  const items = [
    {
      q: 'Waarom een gesloten motor?',
      a: 'Controle over de flow: instroom via VVC, allocatie via INVESTBOTIQ, hefboom via Spontiva, cashflow uit DJOBBA, waarde-anker in ASH, huurwinst terug.',
    },
    {
      q: 'Wat is het voordeel van Pro Mode?',
      a: 'Verdiepende info, metrics en subnavigatie per motor. Handig voor stakeholders die details willen zien.',
    },
    {
      q: 'Hoe waarborg je risicobeheer?',
      a: 'Gate via VVC, besliskaders in INVESTBOTIQ, gescheiden diensten, hefboom met plafonds, vastgoed als collateral.',
    },
    {
      q: 'Hoe schaal je dit?',
      a: 'Meer leden → meer kansen → grotere hefbomen → meer cashflow → extra vastgoed → sterkere terugstroom.',
    },
    {
      q: 'Welke diensten horen niet in de kerncyclus?',
      a: 'Spraakzaam Samen, Cybersecurity 31 RJP, Angels Mediate. Wel via VVC beschikbaar, niet in de kernmotor.',
    },
  ];
  return (
    <div className="px-4 py-8 mx-auto space-y-4 max-w-4xl">
      <div className="space-y-1">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Pro FAQ</p>
        <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-cyan-300">
          Veelgestelde vragen
        </h1>
        <p className="text-slate-300">Kort en bondig voor stakeholders die dieper willen.</p>
      </div>
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.q} className="p-4 rounded-xl border border-slate-800 bg-slate-900/70">
            <div className="text-sm font-semibold text-emerald-300">{item.q}</div>
            <p className="mt-1 text-sm text-slate-200">{item.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const HomeLogo = ({ lang, onStartMotor }) => {
  const tHome = translations[lang]?.home || translations.nl.home;
  const cardRef = React.useRef(null);
  const safeStart = React.useCallback(() => {
    if (typeof onStartMotor === 'function') onStartMotor();
  }, [onStartMotor]);

  const handleMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
    const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
    cardRef.current.style.setProperty('--tiltX', `${y * -10}deg`);
    cardRef.current.style.setProperty('--tiltY', `${x * 12}deg`);
  };

  const resetTilt = () => {
    if (!cardRef.current) return;
    cardRef.current.style.setProperty('--tiltX', '0deg');
    cardRef.current.style.setProperty('--tiltY', '0deg');
  };

  return (
    <div className="px-4 py-16 home-hero">
      <div
        ref={cardRef}
        className="home-card"
        onMouseMove={handleMove}
        onMouseLeave={resetTilt}
      >
        <div className="home-card-glow" />
        <div className="absolute inset-0 overflow-hidden rounded-[23px] pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }} />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '5s', animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-emerald-500/15 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s', animationDelay: '2s' }} />
        </div>
        <div className="relative space-y-5">
          <div className="flex justify-center">
            <div className="relative group">
              <div
                className="flex relative justify-center items-center mx-auto bg-gradient-to-br rounded-3xl backdrop-blur-sm from-sky-400/40 via-cyan-300/40 to-indigo-400/40 ring-[12px] ring-cyan-400/20 transition-all duration-500 group-hover:ring-cyan-300/40 group-hover:scale-105"
                style={{ width: '5rem', height: '5rem' }}
              >
                <RefreshCw className="w-10 h-10 text-cyan-100 drop-shadow-2xl animate-spin-slow" />
                <div className="absolute inset-0 rounded-3xl border-2 border-cyan-300/50 group-hover:border-cyan-200/70 transition-colors" />
                <div className="absolute -inset-3 opacity-50 blur-2xl bg-gradient-to-br from-cyan-400/40 via-blue-400/30 to-indigo-400/40 group-hover:opacity-70 transition-opacity" />
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/10 to-transparent" />
              </div>
              <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/30 via-blue-500/30 to-indigo-500/30 rounded-full blur-xl opacity-60 group-hover:opacity-80 transition-opacity" />
            </div>
          </div>
          <div className="space-y-3 text-center">
            <div className="inline-block px-4 py-1.5 rounded-full bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-indigo-500/20 border border-cyan-400/30 backdrop-blur-sm">
              <p className="text-xs uppercase tracking-[0.35em] text-cyan-200 font-semibold">Verdienende Vrienden Club</p>
            </div>
            <h1 className="text-[2.1rem] leading-tight font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 via-blue-300 to-indigo-300 drop-shadow-lg animate-gradient">
              {tHome.title}
            </h1>
            <p className="text-[0.92rem] text-slate-100 max-w-md mx-auto leading-relaxed">{tHome.subtitle}</p>
          </div>
          <div className="flex gap-3 justify-center items-center pt-2">
            <button
              onClick={safeStart}
              className="cta-button group"
              type="button"
            >
              <Sparkles size={16} className="group-hover:rotate-12 transition-transform" /> 
              <span>{tHome.cta}</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          <div className="text-center promise-card group hover:border-cyan-400/40 transition-all duration-300">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="w-8 h-[1px] bg-gradient-to-r from-transparent to-cyan-400/50" />
              <div className="text-[11px] uppercase tracking-[0.3em] text-cyan-300 font-semibold">{tHome.promiseTitle}</div>
              <div className="w-8 h-[1px] bg-gradient-to-l from-transparent to-cyan-400/50" />
            </div>
            <p className="text-[0.9rem] leading-relaxed text-center text-slate-50 group-hover:text-white transition-colors">
              {tHome.promiseBody}
            </p>
          </div>
        </div>
        <div className="neon-lines" />
      </div>
    </div>
  );
};

export default App;
