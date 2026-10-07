import React, { useState, useEffect } from 'react';
import {
  X, Sparkles, MessageSquare, RotateCcw, ShieldAlert,
  Volume2, Music, ListPlus, Sliders, Play, Check, Send,
  Tv, Film, Star, ArrowRight, Zap, RefreshCw, Compass
} from 'lucide-react';
import { Anime } from '../types/anime';

interface AILabSuiteModalProps {
  isOpen: boolean;
  onClose: () => void;
  animes: Anime[];
  activeTool?: string;
  onPlayAnime: (anime: Anime) => void;
}

type AIToolTab = 'companion' | 'recap' | 'mood' | 'spoiler' | 'dubbing' | 'curation' | 'sound' | 'playlist';

export const AILabSuiteModal: React.FC<AILabSuiteModalProps> = ({
  isOpen,
  onClose,
  animes,
  activeTool,
  onPlayAnime,
}) => {
  // Determine initial tab from tool title
  const getInitialTab = (): AIToolTab => {
    if (!activeTool) return 'companion';
    const lower = activeTool.toLowerCase();
    if (lower.includes('recap')) return 'recap';
    if (lower.includes('mood')) return 'mood';
    if (lower.includes('spoiler')) return 'spoiler';
    if (lower.includes('dubbing') || lower.includes('voice')) return 'dubbing';
    if (lower.includes('curat')) return 'curation';
    if (lower.includes('playlist')) return 'playlist';
    if (lower.includes('sound')) return 'sound';
    return 'companion';
  };

  const [activeTab, setActiveTab] = useState<AIToolTab>(getInitialTab());

  useEffect(() => {
    if (activeTool) {
      setActiveTab(getInitialTab());
    }
  }, [activeTool]);

  // Companion Chat state
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'ai' | 'user'; text: string; time: string }>>([
    {
      sender: 'ai',
      text: 'Salut! Sunt Animaxia Otaku Companion. Cu ce te pot ajuta astăzi? Întreabă-mă despre anime-uri, recomandări, ordinea episoadelor sau studiouri de animație!',
      time: 'Acum',
    },
  ]);
  const [userQuery, setUserQuery] = useState('');

  // Recap state
  const [selectedRecapAnime, setSelectedRecapAnime] = useState<Anime>(animes[0] || {} as Anime);

  // Mood Playlist state
  const [selectedMood, setSelectedMood] = useState<'adrenalina' | 'chill' | 'drama' | 'comedie' | 'mister'>('adrenalina');

  // Spoiler Shield state
  const [spoilerShieldLevel, setSpoilerShieldLevel] = useState<'strict' | 'moderate' | 'off'>('moderate');

  // Audio Dubbing state
  const [preferredDub, setPreferredDub] = useState<'ro' | 'ja' | 'en'>('ja');
  const [subtitlesLanguage, setSubtitlesLanguage] = useState<'ro' | 'en' | 'off'>('ro');

  if (!isOpen) return null;

  // Handle Companion message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userQuery.trim()) return;

    const q = userQuery.trim().toLowerCase();
    const time = new Date().toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit' });
    const newMsg = { sender: 'user' as const, text: userQuery, time };
    setChatMessages((prev) => [...prev, newMsg]);
    setUserQuery('');

    // Instant smart answers based on catalog
    setTimeout(() => {
      let reply = '';
      if (q.includes('titan') || q.includes('attack on titan')) {
        reply = '„Attack on Titan” (Shingeki no Kyojin) este o capodoperă animată de Wit Studio și MAPPA. În baza de date Animaxia poți reda Ep. 1 și Ep. 2 la calitate 1080p cu omitere automată de intro!';
      } else if (q.includes('frieren')) {
        reply = '„Frieren: Beyond Journey\'s End” este cel mai apreciat anime fantasy din 2024 (notă 9.9/10). Îți recomand să începi cu primul episod pentru o călătorie profundă despre timp și prietenie.';
      } else if (q.includes('recomand') || q.includes('ce să văd') || q.includes('sugestie')) {
        const topAnimes = [...animes].sort((a, b) => b.rating - a.rating).slice(0, 3);
        reply = `Îți recomand din catalogul nostru: ${topAnimes.map((a) => `„${a.title}” (${a.rating}★)`).join(', ')}. Toate sunt disponibile în playerul universal!`;
      } else if (q.includes('hls') || q.includes('stream') || q.includes('miner')) {
        reply = 'Animaxia utilizează redare nativă HLS (.m3u8), MP4 și suport iframe embed. Minerul integrat poate extrage orice stream direct dintr-un link public!';
      } else {
        reply = `Am căutat în baza de date locală cu ${animes.length} titluri. Îți sugerez să explorezi secțiunea „Catalog” sau să selectezi un gen preferat din meniul de sus!`;
      }

      setChatMessages((prev) => [...prev, { sender: 'ai', text: reply, time: new Date().toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit' }) }]);
    }, 400);
  };

  // Filter mood animes
  const getMoodAnimes = () => {
    switch (selectedMood) {
      case 'adrenalina':
        return animes.filter((a) => a.genres.some((g) => ['Action', 'Acțiune', 'Sci-Fi', 'Cyberpunk'].includes(g))).slice(0, 4);
      case 'chill':
        return animes.filter((a) => a.genres.some((g) => ['Animation', 'Comedie', 'Family', 'Ghibli'].includes(g))).slice(0, 4);
      case 'drama':
        return animes.filter((a) => a.genres.some((g) => ['Drama', 'Dramă', 'Romance', 'Fantezie'].includes(g))).slice(0, 4);
      case 'comedie':
        return animes.filter((a) => a.genres.some((g) => ['Comedy', 'Comedie', 'Family'].includes(g))).slice(0, 4);
      case 'mister':
        return animes.filter((a) => a.genres.some((g) => ['Mystery', 'Mister', 'Psihologic', 'Thriller'].includes(g))).slice(0, 4);
      default:
        return animes.slice(0, 4);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-neutral-950/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-rose-950 via-neutral-900 to-amber-950/70 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-600 via-rose-500 to-amber-500 flex items-center justify-center shadow-lg shadow-rose-600/30">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-white font-['Space_Grotesk'] tracking-wide">
                  AI LAB SUITE — 8 INSTRUMENTE INTERACTIVE
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Activ &amp; Sincronizat
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                Companion, Recapitulări, Playlist-uri după stare, Scut spoilere și Dublaje
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-neutral-800/80 hover:bg-neutral-700 text-neutral-400 hover:text-white flex items-center justify-center border border-neutral-700 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tools Tabs Bar */}
        <div className="p-3 bg-neutral-950/80 border-b border-neutral-800 flex items-center gap-2 overflow-x-auto scrollbar-none">
          {[
            { id: 'companion', label: 'AI Companion', icon: MessageSquare },
            { id: 'recap', label: 'AI Recap', icon: RotateCcw },
            { id: 'mood', label: 'AI Mood Playlist', icon: Music },
            { id: 'spoiler', label: 'AI Spoiler Shield', icon: ShieldAlert },
            { id: 'dubbing', label: 'AI Dubbing & Audio', icon: Volume2 },
            { id: 'curation', label: 'AI Curation', icon: Compass },
            { id: 'playlist', label: 'AI Playlist Editor', icon: ListPlus },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                    : 'bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800 border border-neutral-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {/* TAB 1: COMPANION */}
          {activeTab === 'companion' && (
            <div className="space-y-4">
              <div className="p-4 bg-neutral-950/60 rounded-2xl border border-neutral-800 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">Animaxia Otaku Companion</h3>
                  <p className="text-xs text-neutral-400">Răspunde instantaneu despre conținutul din baza de date Animaxia</p>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded border border-emerald-400/20">
                  Online (Fără API extern)
                </span>
              </div>

              {/* Chat Thread */}
              <div className="h-64 sm:h-72 overflow-y-auto p-4 bg-neutral-950/80 rounded-2xl border border-neutral-800 space-y-3">
                {chatMessages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-rose-600 text-white rounded-br-none shadow-md shadow-rose-600/20'
                          : 'bg-neutral-800/90 text-neutral-200 rounded-bl-none border border-neutral-700/80'
                      }`}
                    >
                      <p>{msg.text}</p>
                      <span className="block text-[9px] opacity-60 text-right mt-1 font-mono">
                        {msg.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Întreabă ceva (ex: 'Ce anime de acțiune îmi recomanzi?', 'Despre ce e Titan?')..."
                  value={userQuery}
                  onChange={(e) => setUserQuery(e.target.value)}
                  className="flex-1 bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-rose-500"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shrink-0 shadow-md shadow-rose-600/30"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Trimite</span>
                </button>
              </form>
            </div>
          )}

          {/* TAB 2: RECAP */}
          {activeTab === 'recap' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <h3 className="text-sm font-bold text-white">Rezumat Rapid &amp; Recapitulare Sezon</h3>
                  <p className="text-xs text-neutral-400">Află ce s-a întâmplat înainte să pornești următorul episod</p>
                </div>

                <select
                  value={selectedRecapAnime?.id}
                  onChange={(e) => {
                    const found = animes.find((a) => a.id === e.target.value);
                    if (found) setSelectedRecapAnime(found);
                  }}
                  className="bg-neutral-950 border border-neutral-800 text-xs text-white rounded-xl px-3 py-2 focus:outline-none focus:border-rose-500 cursor-pointer"
                >
                  {animes.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.title}
                    </option>
                  ))}
                </select>
              </div>

              {selectedRecapAnime && (
                <div className="p-5 bg-neutral-950/70 rounded-2xl border border-neutral-800 space-y-4">
                  <div className="flex items-start gap-4">
                    <img
                      src={selectedRecapAnime.coverImage}
                      alt={selectedRecapAnime.title}
                      className="w-20 sm:w-24 aspect-[3/4] object-cover rounded-xl border border-neutral-800 shadow"
                    />
                    <div>
                      <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider">
                        {selectedRecapAnime.studio} · {selectedRecapAnime.releaseYear}
                      </span>
                      <h4 className="text-lg font-black text-white">{selectedRecapAnime.title}</h4>
                      <p className="text-xs text-neutral-300 mt-1 leading-relaxed">
                        {selectedRecapAnime.description}
                      </p>
                    </div>
                  </div>

                  {/* Bullet recap points */}
                  <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-800/80 space-y-2">
                    <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5" />
                      Puncte cheie de reținut:
                    </span>
                    <ul className="text-xs text-neutral-300 space-y-1.5 list-disc list-inside">
                      <li>Conflictul central începe în primul sezon cu o răsturnare de situație majoră.</li>
                      <li>Personajul principal își descoperă adevărata putere și jură să schimbe soarta lumii.</li>
                      <li>Episoadele disponibile în Animaxia beneficiază de stream HD și etichete automate de intro skip.</li>
                    </ul>
                  </div>

                  <button
                    onClick={() => {
                      onPlayAnime(selectedRecapAnime);
                      onClose();
                    }}
                    className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-rose-600/30 transition cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Vizionează acest titlu acum</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: MOOD PLAYLIST */}
          {activeTab === 'mood' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-white">Playlist-uri după Starea de Spirit</h3>
                <p className="text-xs text-neutral-400">Selectează cum te simți acum și vom genera un maraton personalizat</p>
              </div>

              {/* Mood selector pills */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {[
                  { id: 'adrenalina', label: '🔥 Adrenalină', desc: 'Acțiune & Cyberpunk' },
                  { id: 'chill', label: '🍃 Relaxare', desc: 'Ghibli & Peaceful' },
                  { id: 'drama', label: '💧 Lacrimi', desc: 'Dramă & Emoție' },
                  { id: 'comedie', label: '🤣 Râsete', desc: 'Comedie pură' },
                  { id: 'mister', label: '🧠 Mister', desc: 'Thriller & Minte' },
                ].map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setSelectedMood(m.id as any)}
                    className={`p-3 rounded-2xl border text-left transition cursor-pointer ${
                      selectedMood === m.id
                        ? 'bg-rose-600 text-white border-rose-500 shadow-lg shadow-rose-600/30'
                        : 'bg-neutral-950/60 hover:bg-neutral-800 text-neutral-300 border-neutral-800'
                    }`}
                  >
                    <div className="font-bold text-xs">{m.label}</div>
                    <div className="text-[10px] opacity-75 mt-0.5">{m.desc}</div>
                  </button>
                ))}
              </div>

              {/* Mood items list */}
              <div className="space-y-2 pt-2">
                <span className="text-xs font-bold text-neutral-300">
                  Maraton Recomandat ({getMoodAnimes().length} titluri):
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {getMoodAnimes().map((anime) => (
                    <div
                      key={anime.id}
                      onClick={() => {
                        onPlayAnime(anime);
                        onClose();
                      }}
                      className="p-3 bg-neutral-950/70 hover:bg-neutral-850 rounded-xl border border-neutral-800 flex items-center gap-3 transition cursor-pointer group"
                    >
                      <img
                        src={anime.coverImage}
                        alt={anime.title}
                        className="w-14 aspect-[3/4] object-cover rounded-lg border border-neutral-800 shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <h4 className="text-xs font-bold text-white truncate group-hover:text-rose-400 transition-colors">
                          {anime.title}
                        </h4>
                        <p className="text-[10px] text-neutral-400 mt-0.5">
                          {anime.studio} · {anime.releaseYear}
                        </p>
                        <span className="inline-block mt-1 text-[10px] text-amber-300 font-mono">
                          ★ {anime.rating.toFixed(1)} / 10
                        </span>
                      </div>
                      <Play className="w-4 h-4 text-rose-500 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SPOILER SHIELD */}
          {activeTab === 'spoiler' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-white">AI Spoiler Shield — Protecție Inteligentă</h3>
                <p className="text-xs text-neutral-400">Controlează gradul de protecție împotriva dezvăluirilor din comentarii și sinopsisuri</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  {
                    id: 'strict',
                    title: '🛡️ Strict',
                    desc: 'Ascunde complet toate comentariile și sinopsisurile avansate din sezoane ulterioare.',
                  },
                  {
                    id: 'moderate',
                    title: '⚡ Moderat (Recomandat)',
                    desc: 'Afișează voal de protecție pe comentariile marcate ca spoiler cu buton de dezvăluire la cerere.',
                  },
                  {
                    id: 'off',
                    title: '🔓 Dezactivat',
                    desc: 'Arată direct toate comentariile fără filtru de spoiler.',
                  },
                ].map((s) => (
                  <div
                    key={s.id}
                    onClick={() => setSpoilerShieldLevel(s.id as any)}
                    className={`p-4 rounded-2xl border cursor-pointer transition ${
                      spoilerShieldLevel === s.id
                        ? 'bg-rose-950/30 border-rose-500 text-white'
                        : 'bg-neutral-950/60 hover:bg-neutral-800 border-neutral-800 text-neutral-300'
                    }`}
                  >
                    <div className="font-bold text-xs">{s.title}</div>
                    <p className="text-[11px] text-neutral-400 mt-1 leading-relaxed">{s.desc}</p>
                    {spoilerShieldLevel === s.id && (
                      <span className="inline-block mt-2 text-[10px] font-bold text-rose-400 uppercase font-mono">
                        ✓ Nivel Activ
                      </span>
                    )}
                  </div>
                ))}
              </div>

              <div className="p-4 bg-neutral-950/60 rounded-2xl border border-neutral-800 text-xs text-neutral-400">
                <span className="font-bold text-white">Stare actuală:</span> Scutul este activat la nivelul{' '}
                <strong className="text-rose-400 uppercase">{spoilerShieldLevel}</strong>. Setările se aplică instant în toate ferestrele de detalii.
              </div>
            </div>
          )}

          {/* TAB 5: DUBBING & AUDIO */}
          {activeTab === 'dubbing' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-white">Preferințe Dublaj &amp; Subtitrări</h3>
                <p className="text-xs text-neutral-400">Alege limba audio principală și formatul de subtitrare în Playerul Universal</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-neutral-950/60 rounded-2xl border border-neutral-800 space-y-3">
                  <span className="text-xs font-bold text-white">Pistă Audio Preferată:</span>
                  {[
                    { id: 'ja', label: '🇯🇵 Japoneză Originală (Recomandat)', note: 'Sunet studio original 5.1' },
                    { id: 'ro', label: '🇷🇴 Română (Dublaj sau sincronizat)', note: 'Canale Kids și desene clasice' },
                    { id: 'en', label: '🇺🇸 Engleză (Dub oficial)', note: 'Actori internaționali' },
                  ].map((d) => (
                    <div
                      key={d.id}
                      onClick={() => setPreferredDub(d.id as any)}
                      className={`p-3 rounded-xl border cursor-pointer transition flex items-center justify-between ${
                        preferredDub === d.id
                          ? 'bg-rose-950/30 border-rose-500 text-white'
                          : 'bg-neutral-900 border-neutral-800 text-neutral-300 hover:bg-neutral-850'
                      }`}
                    >
                      <div>
                        <div className="text-xs font-semibold">{d.label}</div>
                        <div className="text-[10px] text-neutral-500">{d.note}</div>
                      </div>
                      {preferredDub === d.id && <Check className="w-4 h-4 text-rose-500" />}
                    </div>
                  ))}
                </div>

                <div className="p-4 bg-neutral-950/60 rounded-2xl border border-neutral-800 space-y-3">
                  <span className="text-xs font-bold text-white">Subtitrare:</span>
                  {[
                    { id: 'ro', label: '🇷🇴 Română (Traducere completă)', note: 'Sincronizare cadru cu cadru' },
                    { id: 'en', label: '🇺🇸 Engleză (Subtitrare CC)', note: 'Pentru învățare și referință' },
                    { id: 'off', label: '✕ Fără subtitrare', note: 'Ecran complet curat' },
                  ].map((s) => (
                    <div
                      key={s.id}
                      onClick={() => setSubtitlesLanguage(s.id as any)}
                      className={`p-3 rounded-xl border cursor-pointer transition flex items-center justify-between ${
                        subtitlesLanguage === s.id
                          ? 'bg-rose-950/30 border-rose-500 text-white'
                          : 'bg-neutral-900 border-neutral-800 text-neutral-300 hover:bg-neutral-850'
                      }`}
                    >
                      <div>
                        <div className="text-xs font-semibold">{s.label}</div>
                        <div className="text-[10px] text-neutral-500">{s.note}</div>
                      </div>
                      {subtitlesLanguage === s.id && <Check className="w-4 h-4 text-rose-500" />}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: CURATION */}
          {activeTab === 'curation' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-white">AI Curation — Selecții Speciale</h3>
                <p className="text-xs text-neutral-400">Titluri de top grupate după excelența artistică și vizuală</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 bg-neutral-950/60 rounded-2xl border border-neutral-800 space-y-2">
                  <span className="text-[10px] font-bold text-amber-400 uppercase">Capodopere Vizuale</span>
                  <h4 className="text-sm font-bold text-white">Animație &amp; Grafică 4K</h4>
                  <p className="text-xs text-neutral-400">
                    Your Name, Cyberpunk: Edgerunners, Demon Slayer. Calitate impecabilă a cadrului.
                  </p>
                </div>
                <div className="p-4 bg-neutral-950/60 rounded-2xl border border-neutral-800 space-y-2">
                  <span className="text-[10px] font-bold text-rose-400 uppercase">Povești Epice</span>
                  <h4 className="text-sm font-bold text-white">Saga &amp; Lore Imens</h4>
                  <p className="text-xs text-neutral-400">
                    Attack on Titan, Steins;Gate, Vinland Saga. Scenarii complexe și tensiune psihologică.
                  </p>
                </div>
                <div className="p-4 bg-neutral-950/60 rounded-2xl border border-neutral-800 space-y-2">
                  <span className="text-[10px] font-bold text-emerald-400 uppercase">Clasice de Aur</span>
                  <h4 className="text-sm font-bold text-white">Open Movies &amp; Blender</h4>
                  <p className="text-xs text-neutral-400">
                    Sintel, Big Buck Bunny, Tears of Steel. Filme open source ce au marcat industria 3D.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: PLAYLIST EDITOR */}
          {activeTab === 'playlist' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-white">Creator &amp; Editor Playlist-uri</h3>
                <p className="text-xs text-neutral-400">Organizează maratoane de vizionare cu prietenii sau pentru weekend</p>
              </div>

              <div className="p-4 bg-neutral-950/60 rounded-2xl border border-neutral-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">Playlist Curent: „Maraton Weekend Otaku”</span>
                  <span className="text-xs text-rose-400 font-mono">4 episoade</span>
                </div>

                <div className="space-y-2">
                  {animes.slice(0, 3).map((a, idx) => (
                    <div
                      key={a.id}
                      className="flex items-center justify-between p-2.5 bg-neutral-900 rounded-xl border border-neutral-800 text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-neutral-500 font-mono">{idx + 1}.</span>
                        <span className="font-semibold text-white">{a.title}</span>
                      </div>
                      <span className="text-neutral-400">{a.episodes[0]?.duration || '24m'}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => {
                    if (animes[0]) onPlayAnime(animes[0]);
                    onClose();
                  }}
                  className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Pornește Playlist-ul</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
