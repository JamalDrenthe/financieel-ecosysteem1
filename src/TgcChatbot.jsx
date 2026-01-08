import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Bot, Globe, Loader2, Moon, Send, Sun, User } from 'lucide-react';

const TGC_CONTEXT = `
WHITEPAPER: Time Gap Cash Flow (TGC)
Een liquiditeitsstrategie gebaseerd op tijd, niet op bezit.

1. Inleiding
Traditionele financiële modellen zijn primair gebaseerd op bezit, waardegroei en lange termijn rendement. Time Gap Cash Flow (TGC) is een financieel concept waarbij waarde wordt gecreëerd door het tijdverschil tussen inkomende en uitgaande geldstromen strategisch te benutten. Het doel is het genereren van cashflow binnen de tijdsruimte, zonder afhankelijk te zijn van waardestijging of langdurige kapitaalvastzetting.

2. Definitie van Time Gap Cash Flow
TGC is het systematisch benutten van het tijdsverschil tussen ontvangst en verplichting van kapitaal om tijdelijke liquiditeit productief in te zetten.
Belangrijk:
• Het geld is tijdelijk beschikbaar
• De verplichting is vast en bekend
• De opbrengst ontstaat binnen de tijdsruimte
De winst is niet het kapitaal zelf, maar wat het kapitaal kan doen gedurende de tijd dat het beschikbaar is.

3. De kernvariabelen van TGC
Een TGC-structuur bestaat altijd uit drie vaste componenten:
3.1 Inkomende kasstroom: Vast of voorspelbaar, direct beschikbaar, contractueel/operationeel geborgd.
3.2 Tijdsgat (Time Gap): De periode tussen ontvangst en verplichting. Bepaalt de maximale inzetbaarheid.
3.3 Uitgaande verplichting: Vast bedrag, vast moment, niet afhankelijk van prestaties.
Formule (conceptueel): TGC-opbrengst = Productieve output binnen tijdsgat – operationele kosten.

4. TGC vs traditionele financiering
Focus: Tijd (TGC) vs Bezit (Traditioneel)
Rendement: Korte cycli (TGC) vs Lange termijn (Traditioneel)
Kapitaal: Tijdelijke liquiditeit (TGC) vs Eigen vermogen (Traditioneel)
Risico: Timingfouten (TGC) vs Waardeschommelingen (Traditioneel)
Groei: Cyclisch (TGC) vs Lineair (Traditioneel)
TGC vereist geen groei van waarde, alleen efficiënt gebruik van tijd.

5. Waar TGC winst maakt
5.1 Liquiditeitsoptimalisatie: Kapitaal dat anders stil zou staan, wordt tijdelijk actief in te zetten.
5.2 Snelheid: De opbrengst ontstaat binnen de verplichtingsperiode.
5.3 Schaalbaarheid: Zodra de structuur werkt kan deze herhaald, gecombineerd of parallel uitgevoerd worden.

6. Voorwaarden voor een valide TGC-structuur
1. Voorspelbaarheid: Inkomende en uitgaande stromen bekend.
2. Tijdsmarge: Output realiseert zich sneller dan verplichting.
3. Liquiditeit boven rendement: Cashflow is belangrijker dan winstpercentage.
4. Geen afhankelijkheid van instroom: Functioneert onafhankelijk van nieuwe deelnemers.
5. Exit-moment ingebouwd: Elke cyclus heeft een duidelijk eindpunt.

7. Wat Time Gap Cash Flow expliciet niet is
❌ Geen schuldenstrategie, geen hefboom op waardestijging, geen piramodel, geen speculatie, geen afhankelijkheid van toekomstige beloftes. TGC faalt zodra verplichtingen afhankelijk worden van onzekere opbrengsten.

8. Risico’s en faalpunten
8.1 Timing mismatch: Opbrengsten later dan gepland.
8.2 Operationele vertraging: Verkleint de time gap.
8.3 Overoptimalisatie: Te agressief inzetten vergroot fragiliteit.
8.4 Psychologische valkuil: Overschatting van wat haalbaar is in korte tijd.

9. Waarom TGC zelden expliciet wordt benoemd
Vaak verborgen in handelsstructuren, supply chains, abonnementsmodellen en kredietlijnen.

10. Filosofische onderlaag
Geld is geen bezit, maar een tijdelijk instrument. Van "Hoeveel heb ik?" naar "Wat kan dit geld doen zolang het hier is?".

11. Conclusie
TGC creëert waarde zonder waardegroei, gebruikt tijd als hefboom, hanteert korte cycli en eindigt zonder structurele verplichtingen.

12. Slot
Het succes ligt in discipline, structuur en tijdsbewustzijn.
`;

const LANGUAGES = {
  NL: {
    name: 'Nederlands',
    welcome: 'Welkom bij de Time Gap Cashflow Chatbot. Hoe kan ik u helpen?',
    placeholder: 'Stel een vraag...',
    short: 'Beknopt',
    normal: 'Balans',
    extensive: 'Uitgebreid',
    loading: 'Analyseren...',
    error: '⚠️ Verbindingsfout.',
  },
  EN: {
    name: 'English',
    welcome: 'Welcome to the Time Gap Cashflow Chatbot. How can I assist you?',
    placeholder: 'Ask a question...',
    short: 'Brief',
    normal: 'Balanced',
    extensive: 'Detailed',
    loading: 'Analyzing...',
    error: '⚠️ Connection error.',
  },
  DE: {
    name: 'Deutsch',
    welcome: 'Willkommen beim Time Gap Cashflow Chatbot. Wie kann ich Ihnen helfen?',
    placeholder: 'Frage stellen...',
    short: 'Knapp',
    normal: 'Ausgewogen',
    extensive: 'Ausführlich',
    loading: 'Analysiere...',
    error: '⚠️ Verbindungsfehler.',
  },
  FR: {
    name: 'Français',
    welcome: 'Bienvenue sur le Time Gap Cashflow Chatbot. Comment puis-je vous aider ?',
    placeholder: 'Posez une question...',
    short: 'Bref',
    normal: 'Équilibré',
    extensive: 'Détaillé',
    loading: 'Analyse...',
    error: '⚠️ Erreur de connexion.',
  },
  ES: {
    name: 'Español',
    welcome: 'Bienvenido al Time Gap Cashflow Chatbot. ¿Cómo puedo ayudarle?',
    placeholder: 'Hacer una pregunta...',
    short: 'Breve',
    normal: 'Equilibrado',
    extensive: 'Detallado',
    loading: 'Analizando...',
    error: '⚠️ Error de conexión.',
  },
};

function buildLengthInstruction(detailLevel) {
  switch (detailLevel) {
    case 'short':
      return 'Max 2 sentences.';
    case 'extensive':
      return 'In-depth, structured with headers and lists.';
    case 'normal':
    default:
      return 'Clear and concise, medium length.';
  }
}

export default function TgcChatbot({ className = '', initialLang = 'NL', initialDarkMode = null }) {
  const [currentLang, setCurrentLang] = useState(initialLang);
  const [messages, setMessages] = useState([{ role: 'assistant', content: LANGUAGES[initialLang]?.welcome || LANGUAGES.NL.welcome }]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [detailLevel, setDetailLevel] = useState('normal');
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof initialDarkMode === 'boolean') return initialDarkMode;
    return false;
  });

  const messagesEndRef = useRef(null);

  const t = useMemo(() => LANGUAGES[currentLang] || LANGUAGES.NL, [currentLang]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    if (typeof initialDarkMode === 'boolean') return;
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDarkMode(true);
    }
  }, [initialDarkMode]);

  const handleLanguageChange = (langCode) => {
    setCurrentLang(langCode);
    setMessages([{ role: 'assistant', content: LANGUAGES[langCode]?.welcome || LANGUAGES.NL.welcome }]);
  };

  const callProxy = async (userMessage) => {
    const lengthInstruction = buildLengthInstruction(detailLevel);
    const systemPrompt = `
You are the expert behind the Time Gap Cashflow Chatbot.
IMPORTANT: Respond ALWAYS in ${t.name}.
Tone: Professional, academic, and business-like.

Use ONLY the following context:
${TGC_CONTEXT}

LENGTH/STYLE:
${lengthInstruction}
`;

    const response = await fetch('/api/gemini', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userMessage, systemPrompt }),
    });

    if (!response.ok) {
      throw new Error('API Error');
    }

    const data = await response.json();
    return data?.text;
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = inputValue;
    setInputValue('');
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    const maxRetries = 5;

    try {
      let lastErr = null;
      for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
          const text = await callProxy(userMessage);
          setMessages((prev) => [...prev, { role: 'assistant', content: text || 'Error generating response.' }]);
          lastErr = null;
          break;
        } catch (err) {
          lastErr = err;
          if (attempt < maxRetries) {
            const delay = Math.pow(2, attempt) * 500;
            await new Promise((r) => setTimeout(r, delay));
            continue;
          }
        }
      }

      if (lastErr) {
        setMessages((prev) => [...prev, { role: 'assistant', content: t.error }]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`flex flex-col h-full transition-colors duration-300 font-sans ${
        isDarkMode ? 'bg-[#0F172A] text-slate-200' : 'bg-[#F8FAFC] text-slate-800'
      } ${className}`}
    >
      <header
        className={`border-b px-4 md:px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm transition-colors duration-300 ${
          isDarkMode ? 'bg-[#1E293B] border-slate-700' : 'bg-white border-slate-200'
        }`}
      >
        <div className="flex items-center gap-3 md:gap-4">
          <div className="bg-gradient-to-tr from-blue-700 to-indigo-600 p-2 rounded-xl shadow-lg shrink-0">
            <Bot className="text-white" size={20} />
          </div>
          <div>
            <h1 className={`text-base md:text-lg font-bold tracking-tight leading-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              Time Gap Cashflow Chatbot
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-1 border border-slate-200 dark:border-slate-700">
            <Globe size={14} className="mx-2 text-slate-400" />
            <select
              value={currentLang}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="bg-transparent text-xs font-bold outline-none cursor-pointer pr-2 text-slate-600 dark:text-slate-300"
            >
              {Object.keys(LANGUAGES).map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-2 rounded-lg transition-colors ${
              isDarkMode ? 'bg-slate-700 text-amber-400 hover:bg-slate-600' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
            type="button"
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-4 py-6 md:py-8">
        <div className="max-w-3xl mx-auto space-y-6 md:space-y-8">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex items-start gap-3 md:gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300 ${
                msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              <div
                className={`shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-xl flex items-center justify-center shadow-md ${
                  msg.role === 'user'
                    ? 'bg-slate-800 dark:bg-indigo-600 text-white'
                    : isDarkMode
                      ? 'bg-slate-800 border border-slate-700 text-indigo-400'
                      : 'bg-white border border-slate-200 text-indigo-600'
                }`}
              >
                {msg.role === 'user' ? <User size={16} /> : <Bot size={20} />}
              </div>

              <div
                className={`group relative max-w-[85%] md:max-w-[80%] px-4 py-3 md:px-5 md:py-4 rounded-2xl transition-all ${
                  msg.role === 'user'
                    ? 'bg-indigo-600 text-white rounded-tr-none shadow-xl'
                    : isDarkMode
                      ? 'bg-slate-800 border border-slate-700 rounded-tl-none text-slate-300'
                      : 'bg-white border border-slate-200 rounded-tl-none shadow-sm text-slate-700'
                }`}
              >
                <div className={`prose prose-sm md:prose-base max-w-none break-words leading-relaxed ${isDarkMode ? 'prose-invert' : 'prose-slate'}`}>
                  {msg.content.split('\n').map((line, i) => (
                    <p key={i} className={line.startsWith('•') || line.startsWith('-') ? 'ml-4 -indent-4' : 'mb-2 last:mb-0'}>
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-start gap-4 animate-pulse">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  isDarkMode ? 'bg-slate-800 border border-slate-700 text-indigo-400' : 'bg-white border border-slate-200 text-indigo-600'
                }`}
              >
                <Bot size={20} />
              </div>
              <div
                className={`rounded-2xl rounded-tl-none px-6 py-4 flex items-center gap-3 ${
                  isDarkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-slate-200'
                }`}
              >
                <Loader2 className="animate-spin text-indigo-500" size={16} />
                <span className="text-slate-400 text-sm font-medium">{t.loading}</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      <footer
        className={`border-t p-4 md:p-6 transition-colors duration-300 ${
          isDarkMode ? 'bg-[#1E293B] border-slate-700' : 'bg-white border-slate-200'
        }`}
      >
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="flex justify-center sm:justify-start">
            <div className={`flex p-1 rounded-xl border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-200'}`}>
              {['short', 'normal', 'extensive'].map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setDetailLevel(lvl)}
                  className={`px-3 md:px-5 py-1.5 md:py-2 rounded-lg text-[10px] md:text-xs font-bold transition-all ${
                    detailLevel === lvl
                      ? isDarkMode
                        ? 'bg-slate-700 text-indigo-400 shadow-md ring-1 ring-slate-600'
                        : 'bg-white text-indigo-600 shadow-md ring-1 ring-slate-200'
                      : isDarkMode
                        ? 'text-slate-500 hover:text-slate-300'
                        : 'text-slate-500 hover:text-slate-800'
                  }`}
                  type="button"
                >
                  {t[lvl]}
                </button>
              ))}
            </div>
          </div>

          <div className="relative group">
            <div
              className={`relative flex items-center gap-2 border rounded-2xl p-2 transition-all shadow-sm ${
                isDarkMode
                  ? 'bg-slate-900 border-slate-700 focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-900/20'
                  : 'bg-white border-slate-200 focus-within:border-indigo-400 focus-within:ring-4 focus-within:ring-indigo-50'
              }`}
            >
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder={t.placeholder}
                className="flex-1 bg-transparent px-3 md:px-4 py-2 md:py-3 outline-none placeholder:text-slate-500 text-sm md:text-base text-inherit"
                disabled={isLoading}
              />
              <button
                onClick={handleSendMessage}
                disabled={isLoading || !inputValue.trim()}
                className={`p-2.5 md:p-3 rounded-xl flex items-center justify-center transition-all ${
                  isLoading || !inputValue.trim()
                    ? 'text-slate-600'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-500/20 hover:scale-105'
                }`}
                type="button"
              >
                {isLoading ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 text-[9px] md:text-[10px] text-slate-500 font-medium opacity-60">
            <span>TGC Protocol v1.6</span>
            <span className="w-1 h-1 rounded-full bg-slate-400" />
            <span>Secure Enterprise AI</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
