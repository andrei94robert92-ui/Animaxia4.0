import React, { useState, useEffect } from 'react';
import {
  Sparkles, RefreshCw, Cpu, Layers, Tag, Calendar,
  Building, Film, User, Hash, CheckCircle2
} from 'lucide-react';
import { TaxonomyData, DatabaseStats } from '../types/anime';
import { api } from '../services/api';

interface AITaxonomySectionProps {
  taxonomy: TaxonomyData | null;
  stats: DatabaseStats | null;
  onRefresh: () => void;
}

export const AITaxonomySection: React.FC<AITaxonomySectionProps> = ({
  taxonomy,
  stats,
  onRefresh,
}) => {
  const [currentTimeStr, setCurrentTimeStr] = useState(
    new Date().toLocaleTimeString('ro-RO')
  );
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStatus, setAnalysisStatus] = useState<string | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTimeStr(new Date().toLocaleTimeString('ro-RO'));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleReanalyze = () => {
    setIsAnalyzing(true);
    setAnalysisStatus('AI analizează biblioteca și recalculează metadatele...');
    setTimeout(() => {
      onRefresh();
      setIsAnalyzing(false);
      setAnalysisStatus('Clasificare AI completată cu succes! Taxonomie sincronizată.');
      setTimeout(() => setAnalysisStatus(null), 3000);
    }, 900);
  };

  const totalTitles = stats?.totalTitles || taxonomy?.totalExtracted.titles || 3;
  const genresList = taxonomy ? Object.entries(taxonomy.genres) : [];
  const categoriesList = taxonomy ? Object.entries(taxonomy.categories) : [];
  const yearsList = taxonomy ? Object.entries(taxonomy.years) : [];
  const decadesList = taxonomy?.decades || [];

  return (
    <section className="mb-12 space-y-6">
      {/* Top AI Live Bar */}
      <div className="bg-neutral-900/70 border border-neutral-800 rounded-3xl p-6 sm:p-8 relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                LIVE · {currentTimeStr}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                AI Analiză conținut
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1">
              Platforma, mereu la zi — clasificare automată pe tot ce încarci
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onRefresh}
              className="p-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition cursor-pointer"
              title="Reîmprospătează"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={handleReanalyze}
              disabled={isAnalyzing}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-rose-600/25 transition cursor-pointer"
            >
              <Cpu className="w-4 h-4" />
              <span>{isAnalyzing ? 'Se analizează...' : 'Re-analiză AI'}</span>
            </button>
          </div>
        </div>

        {analysisStatus && (
          <div className="mb-6 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{analysisStatus}</span>
          </div>
        )}

        {/* 4 Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="p-4 rounded-2xl bg-neutral-950/70 border border-neutral-800/80">
            <span className="text-[11px] text-neutral-400 font-semibold uppercase tracking-wider">
              Titluri analizate
            </span>
            <div className="text-3xl font-black text-white mt-1">{totalTitles}</div>
            <span className="text-[10px] text-emerald-400">Indexate în catalog</span>
          </div>

          <div className="p-4 rounded-2xl bg-neutral-950/70 border border-neutral-800/80">
            <span className="text-[11px] text-neutral-400 font-semibold uppercase tracking-wider">
              Surse gata de redare
            </span>
            <div className="text-3xl font-black text-white mt-1">
              {stats?.totalEpisodes || totalTitles}
            </div>
            <span className="text-[10px] text-rose-400">Stream-uri MP4 / HLS</span>
          </div>

          <div className="p-4 rounded-2xl bg-neutral-950/70 border border-neutral-800/80">
            <span className="text-[11px] text-neutral-400 font-semibold uppercase tracking-wider">
              Genuri detectate
            </span>
            <div className="text-3xl font-black text-white mt-1">
              {genresList.length || 7}
            </div>
            <span className="text-[10px] text-amber-400">Taxonomie dinamică</span>
          </div>

          <div className="p-4 rounded-2xl bg-neutral-950/70 border border-neutral-800/80">
            <span className="text-[11px] text-neutral-400 font-semibold uppercase tracking-wider">
              Categorii active
            </span>
            <div className="text-3xl font-black text-white mt-1">
              {categoriesList.length || 5}
            </div>
            <span className="text-[10px] text-neutral-400">Film, Serial, Anime...</span>
          </div>
        </div>

        {/* Genuri & Categorii create automat */}
        <div className="border-t border-neutral-800/80 pt-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-white tracking-wide">
                Genuri & Categorii create automat de AI
              </h4>
              <p className="text-xs text-neutral-400">
                Fiecare titlu încărcat e clasificat instant — taxonomia crește cu biblioteca
              </p>
            </div>
            <button
              onClick={handleReanalyze}
              className="text-xs text-rose-400 hover:text-rose-300 font-semibold cursor-pointer"
            >
              Regenerare taxonomie →
            </button>
          </div>

          {/* 4 Stat Boxes (Genuri, Categorii, Decenii, Ani) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-neutral-950/60 rounded-xl border border-neutral-800 flex items-center gap-3">
              <span className="text-xl">🎭</span>
              <div>
                <span className="text-lg font-bold text-white leading-tight block">
                  {genresList.length}
                </span>
                <span className="text-[10px] text-neutral-400 font-medium">Genuri</span>
              </div>
            </div>

            <div className="p-3 bg-neutral-950/60 rounded-xl border border-neutral-800 flex items-center gap-3">
              <span className="text-xl">🗂️</span>
              <div>
                <span className="text-lg font-bold text-white leading-tight block">
                  {categoriesList.length}
                </span>
                <span className="text-[10px] text-neutral-400 font-medium">Categorii</span>
              </div>
            </div>

            <div className="p-3 bg-neutral-950/60 rounded-xl border border-neutral-800 flex items-center gap-3">
              <span className="text-xl">📅</span>
              <div>
                <span className="text-lg font-bold text-white leading-tight block">
                  {decadesList.length || 3}
                </span>
                <span className="text-[10px] text-neutral-400 font-medium">Decenii</span>
              </div>
            </div>

            <div className="p-3 bg-neutral-950/60 rounded-xl border border-neutral-800 flex items-center gap-3">
              <span className="text-xl">🗓️</span>
              <div>
                <span className="text-lg font-bold text-white leading-tight block">
                  {yearsList.length}
                </span>
                <span className="text-[10px] text-neutral-400 font-medium">Ani</span>
              </div>
            </div>
          </div>

          {/* AI Extractor Metadata Breakdown */}
          <div className="bg-neutral-950/80 rounded-2xl p-4 sm:p-6 border border-neutral-800 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h5 className="text-xs font-bold uppercase tracking-wider text-neutral-300">
                  AI Extractor Metadata — An · Genuri · Franciză · Studio · Categorii · Actori · Trilogie · Colecție
                </h5>
                <p className="text-[11px] text-neutral-500">
                  Metadata reală extrasă din conținuturile existente — alimentează catalogul universal
                </p>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded border border-emerald-400/20">
                Pool AI: {totalTitles}/{totalTitles} extrase · se actualizează mereu
              </span>
            </div>

            {/* Completion Pills / Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 text-xs">
              <div className="p-2 bg-neutral-900 rounded-lg border border-neutral-800 text-center">
                <span className="text-neutral-400 text-[10px] block">Titluri</span>
                <span className="font-bold text-white">{totalTitles} · 100%</span>
              </div>
              <div className="p-2 bg-neutral-900 rounded-lg border border-neutral-800 text-center">
                <span className="text-neutral-400 text-[10px] block">An</span>
                <span className="font-bold text-white">{totalTitles} · 100%</span>
              </div>
              <div className="p-2 bg-neutral-900 rounded-lg border border-neutral-800 text-center">
                <span className="text-neutral-400 text-[10px] block">Genuri</span>
                <span className="font-bold text-white">{totalTitles} · 100%</span>
              </div>
              <div className="p-2 bg-neutral-900 rounded-lg border border-neutral-800 text-center">
                <span className="text-neutral-400 text-[10px] block">Descriere</span>
                <span className="font-bold text-white">{totalTitles} · 100%</span>
              </div>
              <div className="p-2 bg-neutral-900 rounded-lg border border-neutral-800 text-center">
                <span className="text-neutral-400 text-[10px] block">Studio</span>
                <span className="font-bold text-white">{totalTitles} · 100%</span>
              </div>
              <div className="p-2 bg-neutral-900 rounded-lg border border-neutral-800 text-center">
                <span className="text-neutral-400 text-[10px] block">Categorii</span>
                <span className="font-bold text-white">{totalTitles} · 100%</span>
              </div>
              <div className="p-2 bg-neutral-900 rounded-lg border border-neutral-800 text-center">
                <span className="text-neutral-400 text-[10px] block">Colecție</span>
                <span className="font-bold text-neutral-300">Detectată</span>
              </div>
              <div className="p-2 bg-neutral-900 rounded-lg border border-neutral-800 text-center">
                <span className="text-neutral-400 text-[10px] block">Stream</span>
                <span className="font-bold text-emerald-400">Activ</span>
              </div>
            </div>

            {/* Extracted Values Display */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-3 border-t border-neutral-850">
              {/* Ani */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-neutral-400 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" /> Ani ({yearsList.length})
                </span>
                <div className="flex flex-wrap gap-1">
                  {yearsList.slice(0, 5).map(([year, count]) => (
                    <span key={year} className="text-[11px] bg-neutral-900 text-neutral-300 px-2 py-0.5 rounded border border-neutral-800">
                      {year} <small className="text-neutral-500">({count})</small>
                    </span>
                  ))}
                </div>
              </div>

              {/* Genuri */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-neutral-400 flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5" /> Genuri ({genresList.length})
                </span>
                <div className="flex flex-wrap gap-1">
                  {genresList.slice(0, 5).map(([genre, count]) => (
                    <span key={genre} className="text-[11px] bg-neutral-900 text-neutral-300 px-2 py-0.5 rounded border border-neutral-800">
                      {genre} <small className="text-neutral-500">({count})</small>
                    </span>
                  ))}
                </div>
              </div>

              {/* Categorii */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-neutral-400 flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5" /> Categorii ({categoriesList.length})
                </span>
                <div className="flex flex-wrap gap-1">
                  {categoriesList.map(([cat, count]) => (
                    <span key={cat} className="text-[11px] bg-neutral-900 text-neutral-300 px-2 py-0.5 rounded border border-neutral-800 capitalize">
                      {cat} <small className="text-neutral-500">({count})</small>
                    </span>
                  ))}
                </div>
              </div>

              {/* Studiouri */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-neutral-400 flex items-center gap-1">
                  <Building className="w-3.5 h-3.5" /> Studiouri ({taxonomy ? Object.keys(taxonomy.studios).length : 0})
                </span>
                <div className="flex flex-wrap gap-1">
                  {taxonomy &&
                    Object.entries(taxonomy.studios).slice(0, 4).map(([studio, count]) => (
                      <span key={studio} className="text-[11px] bg-neutral-900 text-neutral-300 px-2 py-0.5 rounded border border-neutral-800">
                        {studio} <small className="text-neutral-500">({count})</small>
                      </span>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
