"use client";

import React, { useState, useMemo, useEffect, useRef, useCallback } from "react";
import confetti from "canvas-confetti";
import { createClient } from "@supabase/supabase-js";
import {
  FORMATIONS,
  UCL_36_POTS,
  EXTENDED_SEASONS_DATA,
  type AppScreen,
  type TacticMentality,
  type FormationSlot,
  type Formation,
  type Player,
  type SeasonSquad,
  type UCLClub,
  type FixtureMatch,
  type LeagueMatchdayMatch,
  type SwissTableRow,
  type BracketTeam,
  type PenaltyShot,
  type BracketMatch,
  type DraftedSlotData,
  type UserCareerStats,
  type HallOfFameEntry,
  type DuelOpponentSquad,
} from "./data/seasons";

// =================================================================
// 0. SUPABASE CLIENT BAĞLANTISI
// =================================================================
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://rjofgkslcaqcnwgfdyut.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_P1u6R87ypGMQbsouNjnAzw_aKCdYAkv";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// =================================================================
// 1. HAFTALIK GÖREV MOTORU
// =================================================================
interface QuestItem {
  id: string;
  title: string;
  desc: string;
  target: number;
  progressKey: "tournamentWins" | "tournamentGoals" | "trophies" | "cleanSheets";
  completed: boolean;
}

function getWeeklyQuests(): QuestItem[] {
  const now = new Date();
  const weekId = Math.floor(now.getTime() / (7 * 24 * 60 * 60 * 1000));
  
  const pool: Omit<QuestItem, "completed">[] = [
    { id: "q1", title: "Avrupa Fatihi", desc: "Bir turnuvada ulaştığın en yüksek galibiyet sayısı.", target: 5, progressKey: "tournamentWins" },
    { id: "q2", title: "Bombardıman", desc: "Bir turnuvada ulaştığın en yüksek toplam gol sayısı.", target: 12, progressKey: "tournamentGoals" },
    { id: "q3", title: "Müziği Duy", desc: "UEFA Şampiyonlar Ligi kupasını müzene götür.", target: 1, progressKey: "trophies" },
    { id: "q4", title: "Çelik Defans", desc: "Bir turnuvada ulaştığın gol yememe (Clean Sheet) sayısı.", target: 3, progressKey: "cleanSheets" }
  ];

  const index = weekId % pool.length;
  return [
    pool[index],
    pool[(index + 1) % pool.length],
    pool[(index + 2) % pool.length]
  ].map((q) => ({ ...q, completed: false }));
}

// =================================================================
// 2. RESMİ LOGO VE AMBLEM BİLEŞENLERİ
// =================================================================
export function OfficialUCLLogo({ className = "w-7 h-7" }: { className?: string }) {
  return (
    <img
      src="https://crests.football-data.org/CL.png"
      alt="UEFA Champions League"
      className={`${className} object-contain shrink-0`}
      referrerPolicy="no-referrer"
      onError={(e) => {
        (e.currentTarget as HTMLImageElement).src = "https://images.weserv.nl/?url=crests.football-data.org/CL.png";
      }}
    />
  );
}

export function OfficialFBCrest({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <img
      src="https://crests.football-data.org/613.png"
      alt="Fenerbahçe SK"
      className={`${className} object-contain shrink-0 drop-shadow-[0_0_12px_rgba(254,241,0,0.5)]`}
      referrerPolicy="no-referrer"
      onError={(e) => {
        (e.currentTarget as HTMLImageElement).src = "https://crests.football-data.org/613.png";
      }}
    />
  );
}

export function ClubLogo({
  club,
  className = "w-8 h-8",
}: {
  club: {
    shortName: string;
    name?: string;
    country?: string;
    logoUrl?: string;
    primaryColor?: string;
    secondaryColor?: string;
    id?: string;
  };
  className?: string;
}) {
  const targetUrl = useMemo(() => {
    if (club.id === "fb" || club.shortName === "FB") return "https://crests.football-data.org/613.png";
    if (club.id === "gal" || club.shortName === "GS") return "https://crests.football-data.org/610.png";
    return club.logoUrl || `https://crests.football-data.org/${club.id}.png`;
  }, [club.id, club.shortName, club.logoUrl]);

  return (
    <img
      key={`${club.id || club.shortName}-${targetUrl}`}
      src={targetUrl}
      alt={club.name || club.shortName}
      className={`${className} object-contain shrink-0 p-0.5`}
      referrerPolicy="no-referrer"
      onError={(e) => {
        const target = e.currentTarget as HTMLImageElement;
        if (!target.src.includes("weserv.nl")) {
          const clean = targetUrl.replace(/^https?:\/\//, "");
          target.src = `https://images.weserv.nl/?url=${encodeURIComponent(clean)}`;
        }
      }}
    />
  );
}

export function RetroFenerbahceKit({
  colors,
  className = "w-10 h-10",
}: {
  colors: { primary: string; secondary: string; stripe: string; collar: string };
  className?: string;
}) {
  return (
    <svg viewBox="0 0 100 100" className={className}>
      <defs>
        <clipPath id="jerseyClip2027">
          <path d="M 28,24 L 38,16 L 62,16 L 72,24 L 86,34 L 76,48 L 68,42 L 68,88 L 32,88 L 32,42 L 24,48 L 14,34 Z" />
        </clipPath>
      </defs>
      <g clipPath="url(#jerseyClip2027)">
        <rect x="0" y="0" width="100" height="100" fill={colors.primary} />
        <rect x="36" y="0" width="8" height="100" fill={colors.stripe} />
        <rect x="48" y="0" width="8" height="100" fill={colors.stripe} />
        <rect x="60" y="0" width="8" height="100" fill={colors.stripe} />
        <rect x="20" y="0" width="8" height="100" fill={colors.stripe} />
        <rect x="76" y="0" width="8" height="100" fill={colors.stripe} />
      </g>
      <path d="M 38,16 Q 50,30 62,16" fill="none" stroke={colors.collar} strokeWidth="3.5" />
      <circle cx="41" cy="38" r="4.5" fill="#fef100" stroke="#002d72" strokeWidth="1.5" />
      <path
        d="M 28,24 L 38,16 L 62,16 L 72,24 L 86,34 L 76,48 L 68,42 L 68,88 L 32,88 L 32,42 L 24,48 L 14,34 Z"
        fill="none"
        stroke="rgba(255,255,255,0.4)"
        strokeWidth="2"
      />
    </svg>
  );
}

// =================================================================
// 3. KALICI SES MOTORU
// =================================================================
class SafeAudioEngine {
  private ucl: HTMLAudioElement | null = null;
  private fb: HTMLAudioElement | null = null;
  public uclPlaying = false;
  public fbPlaying = false;
  public userHasExplicitlyMuted = false;
  public hasPlayedFbOnce = false;
  public hasPlayedUclOnce = false;

  public init() {
    if (typeof window !== "undefined" && !this.ucl) {
      try {
        this.ucl = new Audio("/audio/ucl_anthem.mp3");
        this.ucl.loop = true;
        this.ucl.volume = 0.5;

        this.fb = new Audio("/audio/fb_mars.mp3");
        this.fb.loop = true;
        this.fb.volume = 0.55;
      } catch {}
    }
  }

  public tryAutoPlayFb(cb?: (p: boolean) => void) {
    if (this.userHasExplicitlyMuted || this.hasPlayedFbOnce) return;
    this.hasPlayedFbOnce = true;
    this.playFb(cb);
  }

  public tryAutoPlayUcl(cb?: (p: boolean) => void) {
    if (this.userHasExplicitlyMuted || this.hasPlayedUclOnce) return;
    this.hasPlayedUclOnce = true;
    this.playUcl(cb);
  }

  public playFb(cb?: (p: boolean) => void) {
    this.init();
    if (!this.fb) return;
    if (this.uclPlaying && this.ucl) {
      this.ucl.pause();
      this.uclPlaying = false;
    }
    this.fb
      .play()
      .then(() => {
        this.fbPlaying = true;
        if (cb) cb(true);
      })
      .catch(() => {});
  }

  public playUcl(cb?: (p: boolean) => void) {
    this.init();
    if (!this.ucl) return;
    if (this.fbPlaying && this.fb) {
      this.fb.pause();
      this.fbPlaying = false;
    }
    this.ucl
      .play()
      .then(() => {
        this.uclPlaying = true;
        if (cb) cb(true);
      })
      .catch(() => {});
  }

  public stopAll(cbUcl?: (p: boolean) => void, cbFb?: (p: boolean) => void) {
    if (this.ucl) {
      this.ucl.pause();
      this.ucl.currentTime = 0;
      this.uclPlaying = false;
      if (cbUcl) cbUcl(false);
    }
    if (this.fb) {
      this.fb.pause();
      this.fb.currentTime = 0;
      this.fbPlaying = false;
      if (cbFb) cbFb(false);
    }
  }

  public toggleFb(cb: (p: boolean) => void) {
    this.init();
    if (!this.fb) return;
    if (this.fbPlaying) {
      this.fb.pause();
      this.fbPlaying = false;
      this.userHasExplicitlyMuted = true;
      cb(false);
    } else {
      this.userHasExplicitlyMuted = false;
      this.playFb(cb);
    }
  }

  public toggleUcl(cb: (p: boolean) => void) {
    this.init();
    if (!this.ucl) return;
    if (this.uclPlaying) {
      this.ucl.pause();
      this.uclPlaying = false;
      this.userHasExplicitlyMuted = true;
      cb(false);
    } else {
      this.userHasExplicitlyMuted = false;
      this.playUcl(cb);
    }
  }
}

const safeAudio = new SafeAudioEngine();

// =================================================================
// 4. ANA UYGULAMA BİLEŞENİ
// =================================================================
export default function FBCLMasterpieceApp() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>("LANDING");
  const [memoryMode, setMemoryMode] = useState<boolean>(false);
  const [uclAudioActive, setUclAudioActive] = useState<boolean>(false);
  const [fbAudioActive, setFbAudioActive] = useState<boolean>(false);

  // Menajer Adı
  const [managerName, setManagerName] = useState<string>("Kadıköy Fatihi");

  // Görevler (Quests) & Zirve Skorlar
  const [weeklyQuests, setWeeklyQuests] = useState<QuestItem[]>([]);
  const [bestQuestValues, setBestQuestValues] = useState<Record<string, number>>({});

  // Taktik & Kadro
  const [activeFormation, setActiveFormation] = useState<Formation>(FORMATIONS[3]);
  const [selectedMentality, setSelectedMentality] = useState<TacticMentality>("BALANCED");
  const [lineup, setLineup] = useState<Record<string, DraftedSlotData | null>>({});
  const [draftedNames, setDraftedNames] = useState<string[]>([]);
  const [currentSeason, setCurrentSeason] = useState<SeasonSquad | null>(null);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [isRolling, setIsRolling] = useState<boolean>(false);
  const [passJokers, setPassJokers] = useState<number>(1);
  const [cardFilter, setCardFilter] = useState<"ALL" | "DEF" | "MID" | "AMC" | "ATT" | "GK">("ALL");
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  // İstatistikler (Turnuva İçi)
  const [playerGoalCounts, setPlayerGoalCounts] = useState<Record<string, number>>({});
  const [memorableMatch, setMemorableMatch] = useState<{ opponent: string; score: string; stage: string } | null>(null);

  // Kura & Fikstür
  const [isDrawingAnimation, setIsDrawingAnimation] = useState<boolean>(false);
  const [flashingName, setFlashingName] = useState<string>("Kura Başlatılıyor...");
  const [drawStep, setDrawStep] = useState<number>(0);
  const [fixtures, setFixtures] = useState<FixtureMatch[]>([]);
  const [currentFixtureIndex, setCurrentFixtureIndex] = useState<number>(0);
  const [leagueFullSchedule, setLeagueFullSchedule] = useState<Record<number, LeagueMatchdayMatch[]>>({});

  // Canlı Lig Maç Ekranı
  const [matchState, setMatchState] = useState<"IDLE" | "PLAYING" | "FINISHED">("IDLE");
  const [simSpeed, setSimSpeed] = useState<1 | 2 | 5 | 100>(2);
  const [matchMin, setMatchMin] = useState<number>(0);
  const [isHalftime, setIsHalftime] = useState<boolean>(false);
  const [homeLiveGoals, setHomeLiveGoals] = useState<number>(0);
  const [awayLiveGoals, setAwayLiveGoals] = useState<number>(0);
  const [liveGoalScorers, setLiveGoalScorers] = useState<{ minute: number; name: string; isHome: boolean }[]>([]);
  const [concurrentMatches, setConcurrentMatches] = useState<LeagueMatchdayMatch[]>([]);

  // 36 Takımlı Swiss Puan Tablosu
  const [swissTable, setSwissTable] = useState<SwissTableRow[]>([]);
  const [leagueFinished, setLeagueFinished] = useState<boolean>(false);

  // Dinamik Eleme Turları
  const [bracketMatches, setBracketMatches] = useState<BracketMatch[]>([]);
  const [activeBracketId, setActiveBracketId] = useState<string | null>(null);
  const [bracketLeg, setBracketLeg] = useState<1 | 2>(1);
  const [bracketMatchState, setBracketMatchState] = useState<"IDLE" | "PLAYING" | "EXTRA_TIME" | "PENALTIES" | "FINISHED">("IDLE");

  // Canlı Sıralı Penaltı Durumu
  const [livePenaltyStatus, setLivePenaltyStatus] = useState<{
    round: number;
    homeShooter: string;
    homeScored?: boolean;
    awayShooter: string;
    awayScored?: boolean;
    homeShots: PenaltyShot[];
    awayShots: PenaltyShot[];
    text: string;
  } | null>(null);

  // Sezon Sonu & Turnuva Galibi
  const [campaignTrophy, setCampaignTrophy] = useState<string>("Lig Aşaması");
  const [tournamentWinner, setTournamentWinner] = useState<string | null>(null);

  // Topluluk, Kalıcı Veri (Supabase)
  const [careerStats, setCareerStats] = useState<UserCareerStats>({
    matchesPlayed: 0,
    wins: 0,
    draws: 0,
    losses: 0,
    goalsScored: 0,
    goalsConceded: 0,
    trophies: 0,
    maxOvr: 0,
    highestLeaguePoints: 0,
  });
  const [allTimeScorers, setAllTimeScorers] = useState<Record<string, number>>({});
  const [pickedPlayersCount, setPickedPlayersCount] = useState<Record<string, number>>({});
  const [hallOfFame, setHallOfFame] = useState<HallOfFameEntry[]>([]);
  const [globalLeaderboard, setGlobalLeaderboard] = useState<any[]>([]);
  const [leaderboardTab, setLeaderboardTab] = useState<"WEEKLY" | "DAILY">("WEEKLY");

  // Modallar
  const [isStatsModalOpen, setIsStatsModalOpen] = useState<boolean>(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState<boolean>(false);
  const [isQuestsModalOpen, setIsQuestsModalOpen] = useState<boolean>(false);
  const [isDuelModalOpen, setIsDuelModalOpen] = useState<boolean>(false);
  const [duelInputCode, setDuelInputCode] = useState<string>("");
  const [duelResult, setDuelResult] = useState<{ userScore: number; oppScore: number; userScorers: string[]; oppScorers: string[]; oppManager: string } | null>(null);
  const [copiedCodeNotice, setCopiedCodeNotice] = useState<boolean>(false);

  // Haber Bandı
  const [tickerIndex, setTickerIndex] = useState<number>(0);
  const tickerEvents = useMemo(() => [
    "🟡🔵 Fenerbahçe'de Şampiyonlar Ligi kampı için geri sayım başladı! Kadıköy'de heyecan dorukta.",
    "⚡ UEFA'dan Fenerbahçe'nin yeni kadro yapılanmasına büyük övgü: 'Avrupa'nın en dinamik orta sahası!'",
    "🏆 Sarı-Lacivertli taraftarlar Münih finaline kilitlendi: 'Hedef bu kez kulübe kupayı getirmek.'",
    "⭐ Alex de Souza'dan açıklama: 'Fenerbahçe'nin Şampiyonlar Ligi'ndeki bu kadrosu efsaneleri hatırlatıyor.'",
    "🧤 Kaleci eldivenlerinde muazzam form: Kadıköy'de geçit vermeyen performanslar konuşuluyor.",
    "🚀 Haftalık Kadıköy Hedefleri güncellendi: Maçları kazan, rozetleri topla ve zirveye adını yazdır!"
  ], []);

  useEffect(() => {
    const tickerInterval = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % tickerEvents.length);
    }, 5000);
    return () => clearInterval(tickerInterval);
  }, [tickerEvents.length]);

  const fetchGlobalLeaderboard = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("leaderboard")
        .select("*")
        .order("trophies", { ascending: false })
        .order("best_points", { ascending: false })
        .limit(50);
      
      if (!error && data) {
        setGlobalLeaderboard(data);
      }
    } catch {}
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const sManager = localStorage.getItem("fb_ucl_manager_name");
      if (sManager) setManagerName(sManager);
      const sCareer = localStorage.getItem("fb_ucl_career_stats");
      if (sCareer) setCareerStats(JSON.parse(sCareer));
      const sScorers = localStorage.getItem("fb_ucl_alltime_scorers");
      if (sScorers) setAllTimeScorers(JSON.parse(sScorers));
      const sPicked = localStorage.getItem("fb_ucl_picked_players");
      if (sPicked) setPickedPlayersCount(JSON.parse(sPicked));
      const sHof = localStorage.getItem("fb_ucl_hall_of_fame");
      if (sHof) setHallOfFame(JSON.parse(sHof));
      const sBestQuests = localStorage.getItem("fb_ucl_best_quest_values");
      if (sBestQuests) setBestQuestValues(JSON.parse(sBestQuests));
    } catch {}

    setWeeklyQuests(getWeeklyQuests());
    fetchGlobalLeaderboard();
  }, [fetchGlobalLeaderboard]);

  // Turnuva Zirve Değerleri Hesabı (Düzeltildi: Clean Sheet oppScore kontrolü)
  const currentTurnWins = fixtures.filter((f) => f.played && (f.fbScore ?? 0) > (f.oppScore ?? 0)).length + bracketMatches.filter((m) => m.winnerId === "fb").length;
  const currentTurnGoals = Object.values(playerGoalCounts).reduce((a, b) => a + b, 0);
  const currentTurnTrophy = tournamentWinner === "Fenerbahçe SK" || campaignTrophy === "Şampiyon" ? 1 : 0;
  const currentTurnCleanSheets = fixtures.filter((f) => f.played && (f.oppScore ?? 0) === 0).length;

  useEffect(() => {
    const updated = {
      tournamentWins: Math.max(bestQuestValues.tournamentWins || 0, currentTurnWins),
      tournamentGoals: Math.max(bestQuestValues.tournamentGoals || 0, currentTurnGoals),
      trophies: Math.max(bestQuestValues.trophies || 0, currentTurnTrophy),
      cleanSheets: Math.max(bestQuestValues.cleanSheets || 0, currentTurnCleanSheets),
    };
    setBestQuestValues(updated);
    try {
      localStorage.setItem("fb_ucl_best_quest_values", JSON.stringify(updated));
    } catch {}
  }, [currentTurnWins, currentTurnGoals, currentTurnTrophy, currentTurnCleanSheets]);

  const handleManagerNameChange = (name: string) => {
    setManagerName(name);
    try { localStorage.setItem("fb_ucl_manager_name", name); } catch {}
  };

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const secondHalfTimerRef = useRef<ReturnType<typeof setTimeout> | ReturnType<typeof setInterval> | null>(null);
  const drawIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const penaltyIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const extraTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const instantTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearAllSimTimers = useCallback(() => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
    if (secondHalfTimerRef.current) {
      clearInterval(secondHalfTimerRef.current as any);
      clearTimeout(secondHalfTimerRef.current as any);
      secondHalfTimerRef.current = null;
    }
    if (drawIntervalRef.current) { clearInterval(drawIntervalRef.current); drawIntervalRef.current = null; }
    if (penaltyIntervalRef.current) { clearInterval(penaltyIntervalRef.current); penaltyIntervalRef.current = null; }
    if (extraTimerRef.current) { clearInterval(extraTimerRef.current); extraTimerRef.current = null; }
    if (instantTimerRef.current) { clearTimeout(instantTimerRef.current); instantTimerRef.current = null; }
  }, []);

  useEffect(() => {
    safeAudio.init();
    return () => {
      clearAllSimTimers();
      safeAudio.stopAll(setUclAudioActive, setFbAudioActive);
    };
  }, [clearAllSimTimers]);

  const filledCount = useMemo(() => Object.values(lineup).filter(Boolean).length, [lineup]);

  const rawTeamOvr = useMemo(() => {
    const items = Object.values(lineup).filter(Boolean) as DraftedSlotData[];
    if (items.length === 0) return 0;
    const total = items.reduce((sum, item) => sum + item.effectiveRating, 0);
    return parseFloat((total / items.length).toFixed(1));
  }, [lineup]);

  const teamOvr = useMemo(() => rawTeamOvr.toFixed(1), [rawTeamOvr]);

  const topScorersList = useMemo(() => {
    return Object.entries(playerGoalCounts).sort((a, b) => b[1] - a[1]);
  }, [playerGoalCounts]);

  const albumPercentage = useMemo(() => {
    const distinctPicked = Object.keys(pickedPlayersCount).length;
    return Math.min(100, Math.round((distinctPicked / 306) * 100));
  }, [pickedPlayersCount]);

  const mostPickedList = useMemo(() => {
    return Object.entries(pickedPlayersCount).sort((a, b) => b[1] - a[1]).slice(0, 5);
  }, [pickedPlayersCount]);

  const careerTopScorers = useMemo(() => {
    return Object.entries(allTimeScorers).sort((a, b) => b[1] - a[1]).slice(0, 5);
  }, [allTimeScorers]);

  const gmb = useMemo(() => {
    if (careerStats.matchesPlayed === 0) return "0.00";
    return (careerStats.goalsScored / careerStats.matchesPlayed).toFixed(2);
  }, [careerStats.matchesPlayed, careerStats.goalsScored]);

  // =================================================================
  // HOISTED HELPER FONKSİYONLAR
  // =================================================================
  function calculateMatchGoals(homeRating: number, awayRating: number, homeMult = 1.0, awayMult = 1.0) {
    const ovrDiff = homeRating - awayRating;
    const baseHomeXg = Math.max(0.35, 1.35 + ovrDiff * 0.12 + 0.3);
    const baseAwayXg = Math.max(0.35, 1.35 - ovrDiff * 0.12 - 0.3);

    const finalHomeXg = baseHomeXg * homeMult;
    const finalAwayXg = baseAwayXg * awayMult;

    const sampleGoals = (xg: number) => {
      let goals = 0;
      let prob = xg;
      while (prob > 0.8) {
        if (Math.random() < 0.75) goals++;
        prob -= 0.8;
      }
      if (Math.random() < prob) goals++;
      return Math.min(5, goals);
    };

    return {
      homeGoals: sampleGoals(finalHomeXg),
      awayGoals: sampleGoals(finalAwayXg),
    };
  }

  function pickRealisticFbScorer(activeLineup: DraftedSlotData[]): string {
    const attackers = activeLineup.filter((i) => i.player.positions.some((p) => ["ST", "CF"].includes(p)));
    const wingersCam = activeLineup.filter((i) => i.player.positions.some((p) => ["CAM", "AMC", "RW", "LW", "RM", "LM"].includes(p)));
    const midfielders = activeLineup.filter((i) => i.player.positions.some((p) => ["CM", "CDM"].includes(p)));
    const defenders = activeLineup.filter((i) => i.player.positions.some((p) => ["CB", "LB", "RB", "LWB", "RWB"].includes(p)));

    const rand = Math.random() * 100;
    if (rand < 55 && attackers.length > 0) return attackers[Math.floor(Math.random() * attackers.length)].player.name;
    if (rand < 85 && wingersCam.length > 0) return wingersCam[Math.floor(Math.random() * wingersCam.length)].player.name;
    if (rand < 96 && midfielders.length > 0) return midfielders[Math.floor(Math.random() * midfielders.length)].player.name;
    if (defenders.length > 0) return defenders[Math.floor(Math.random() * defenders.length)].player.name;
    if (attackers.length > 0) return attackers[0].player.name;
    return "Alex de Souza";
  }

  function getOpponentScorer(opponentClubId: string, opponentClubName: string): string {
    const foundClub = UCL_36_POTS.find((c) => c.id === opponentClubId);
    if (foundClub && foundClub.scorersPool && foundClub.scorersPool.length > 0) {
      return foundClub.scorersPool[Math.floor(Math.random() * foundClub.scorersPool.length)];
    }
    return `${opponentClubName || "Rakip"} Yıldızı`;
  }

  // Düzeltme 1: Skor tablosunu sıfırlayan yardımcı
  const resetMatchBoard = useCallback(() => {
    clearAllSimTimers();
    setMatchMin(0);
    setIsHalftime(false);
    setHomeLiveGoals(0);
    setAwayLiveGoals(0);
    setLiveGoalScorers([]);
    setMatchState("IDLE");
  }, [clearAllSimTimers]);

  function resetBracketLiveBoard() {
    clearAllSimTimers();
    setBracketMatchState("IDLE");
    setMatchMin(0);
    setIsHalftime(false);
    setHomeLiveGoals(0);
    setAwayLiveGoals(0);
    setLiveGoalScorers([]);
    setLivePenaltyStatus(null);
  }

  function generateRoundOf16Bracket(top8Teams: SwissTableRow[], poWinners: BracketTeam[]) {
    const r16Matches: BracketMatch[] = [];

    for (let i = 0; i < 8; i++) {
      const seeded = top8Teams[i];
      const opp = poWinners[7 - i] || poWinners[i];
      const isUser = seeded.id === "fb" || opp.id === "fb";

      r16Matches.push({
        id: `r16_${i + 1}`,
        stage: "R16",
        stageTitle: "Son 16",
        teamHome: {
          id: opp.id,
          name: opp.id === "fb" ? "Fenerbahçe SK" : opp.name,
          shortName: opp.shortName,
          country: opp.country,
          rating: opp.id === "fb" ? rawTeamOvr : opp.rating,
          logoUrl: opp.logoUrl,
          isUser: opp.id === "fb",
        },
        teamAway: {
          id: seeded.id,
          name: seeded.id === "fb" ? "Fenerbahçe SK" : seeded.name,
          shortName: seeded.shortName,
          country: seeded.country,
          rating: seeded.id === "fb" ? rawTeamOvr : seeded.rating,
          logoUrl: seeded.logoUrl,
          isUser: seeded.id === "fb",
        },
        leg1: { homeScore: 0, awayScore: 0, played: false },
        leg2: { homeScore: 0, awayScore: 0, played: false },
        isUserMatch: isUser,
      });
    }

    setBracketMatches(r16Matches);
    const userM = r16Matches.find((m) => m.isUserMatch);
    setActiveBracketId(userM?.id || "r16_1");
    setBracketLeg(1);
    resetBracketLiveBoard();
    setCurrentScreen("BRACKET");
  }

  function checkLeg2Outcome(curM: BracketMatch, leg2HostGoals: number, leg2VisitorGoals: number) {
    if (curM.stage === "FINAL") {
      return {
        totalTeamHomeGoals: leg2HostGoals,
        totalTeamAwayGoals: leg2VisitorGoals,
        isDraw: leg2HostGoals === leg2VisitorGoals,
        winnerId: leg2HostGoals > leg2VisitorGoals ? curM.teamHome.id : curM.teamAway.id,
        winnerName: leg2HostGoals > leg2VisitorGoals ? curM.teamHome.name : curM.teamAway.name,
      };
    }

    const totalTeamHomeGoals = curM.leg1.homeScore + leg2VisitorGoals;
    const totalTeamAwayGoals = curM.leg1.awayScore + leg2HostGoals;

    return {
      totalTeamHomeGoals,
      totalTeamAwayGoals,
      isDraw: totalTeamHomeGoals === totalTeamAwayGoals,
      winnerId: totalTeamHomeGoals > totalTeamAwayGoals ? curM.teamHome.id : curM.teamAway.id,
      winnerName: totalTeamHomeGoals > totalTeamAwayGoals ? curM.teamHome.name : curM.teamAway.name,
    };
  }

  function finalizeBracketMatch(
    curM: BracketMatch,
    targetHome: number,
    targetAway: number,
    winnerId: string,
    winnerName: string,
    wasExtra: boolean
  ) {
    if (winnerId === "fb") {
      setMemorableMatch({
        opponent: curM.teamHome.isUser ? curM.teamAway.name : curM.teamHome.name,
        score: curM.stage === "FINAL" ? `${targetHome}-${targetAway}` : `2. Maç: ${targetHome}-${targetAway}`,
        stage: curM.stageTitle,
      });
    }

    setBracketMatches((prev) =>
      prev.map((m) => {
        if (m.id !== curM.id) return m;
        return {
          ...m,
          leg2: m.stage !== "FINAL" ? { homeScore: targetHome, awayScore: targetAway, played: true } : undefined,
          extraTime: wasExtra,
          winnerId,
          winnerName,
        };
      })
    );
  }

  function runAutomatedPenaltyShootout(curM: BracketMatch, finalLegHome: number, finalLegAway: number) {
    setBracketMatchState("PENALTIES");

    const homeClub = bracketLeg === 2 && curM.stage !== "FINAL" ? curM.teamAway : curM.teamHome;
    const awayClub = bracketLeg === 2 && curM.stage !== "FINAL" ? curM.teamHome : curM.teamAway;

    const activeFb = Object.values(lineup).filter(Boolean) as DraftedSlotData[];
    const fbPenPool = activeFb.length > 0 ? activeFb.map((i) => i.player.name) : ["Alex de Souza", "Pierre van Hooijdonk", "Elvir Boliç", "Tuncay Şanlı", "Moussa Sow"];

    const getShooterName = (isUser: boolean, clubId: string, clubName: string, idx: number) => {
      if (isUser) return fbPenPool[idx % fbPenPool.length];
      return getOpponentScorer(clubId, clubName);
    };

    let round = 0;
    let homeScore = 0;
    let awayScore = 0;
    const homeShots: PenaltyShot[] = [];
    const awayShots: PenaltyShot[] = [];

    const penaltyIntervalMs = Math.max(400, Math.floor(1200 / simSpeed));

    penaltyIntervalRef.current = setInterval(() => {
      round += 1;

      const hShooter = getShooterName(homeClub.isUser, homeClub.id, homeClub.name, round - 1);
      const hScored = Math.random() < 0.78;
      if (hScored) homeScore++;
      homeShots.push({ shooter: hShooter, scored: hScored });

      const aShooter = getShooterName(awayClub.isUser, awayClub.id, awayClub.name, round - 1);
      const aScored = Math.random() < 0.76;
      if (aScored) awayScore++;
      awayShots.push({ shooter: aShooter, scored: aScored });

      setLivePenaltyStatus({
        round,
        homeShooter: hShooter,
        homeScored: hScored,
        awayShooter: aShooter,
        awayScored: aScored,
        homeShots: [...homeShots],
        awayShots: [...awayShots],
        text: `Tur ${round}: ${homeClub.shortName || homeClub.name} (${homeScore}) - ${awayClub.shortName || awayClub.name} (${awayScore})`,
      });

      let isDecided = false;
      let winnerId = "";
      let winnerName = "";

      if (round >= 5) {
        if (homeScore !== awayScore) {
          isDecided = true;
          winnerId = homeScore > awayScore ? homeClub.id : awayClub.id;
          winnerName = homeScore > awayScore ? homeClub.name : awayClub.name;
        }
      }

      if (isDecided || round >= 8) {
        if (penaltyIntervalRef.current) clearInterval(penaltyIntervalRef.current);
        penaltyIntervalRef.current = null;

        if (!winnerId) {
          winnerId = homeScore >= awayScore ? homeClub.id : awayClub.id;
          winnerName = homeScore >= awayScore ? homeClub.name : awayClub.name;
        }

        setBracketMatchState("FINISHED");
        setBracketMatches((prev) =>
          prev.map((m) => {
            if (m.id !== curM.id) return m;
            return {
              ...m,
              leg2: m.stage !== "FINAL" ? { homeScore: finalLegHome, awayScore: finalLegAway, played: true } : undefined,
              extraTime: true,
              penalties: { homePens: homeScore, awayPens: awayScore, homeShots, awayShots },
              winnerId,
              winnerName,
            };
          })
        );
      }
    }, penaltyIntervalMs);
  }

  function runExtraTimeSim(curM: BracketMatch, baseHomeGoals: number, baseAwayGoals: number, intervalMs: number) {
    let extraMin = 90;
    let extraHomeG = 0;
    let extraAwayG = 0;

    if (Math.random() < 0.35) {
      if (Math.random() > 0.5) extraHomeG = 1;
      else extraAwayG = 1;
    }

    extraTimerRef.current = setInterval(() => {
      extraMin += 1;
      setMatchMin(extraMin);

      if (extraMin === 105 && extraHomeG + extraAwayG > 0) {
        setHomeLiveGoals(baseHomeGoals + extraHomeG);
        setAwayLiveGoals(baseAwayGoals + extraAwayG);
      }

      if (extraMin >= 120) {
        if (extraTimerRef.current) clearInterval(extraTimerRef.current);
        extraTimerRef.current = null;

        const finalHomeGoals = baseHomeGoals + extraHomeG;
        const finalAwayGoals = baseAwayGoals + extraAwayG;
        const outcome = checkLeg2Outcome(curM, finalHomeGoals, finalAwayGoals);

        if (!outcome.isDraw) {
          setBracketMatchState("FINISHED");
          finalizeBracketMatch(curM, finalHomeGoals, finalAwayGoals, outcome.winnerId, outcome.winnerName, true);
        } else {
          runAutomatedPenaltyShootout(curM, finalHomeGoals, finalAwayGoals);
        }
      }
    }, Math.max(15, Math.floor(intervalMs * 0.7)));
  }

  function resumeBracketSecondHalf(
    currentMin: number,
    planned: { minute: number; name: string; isHome: boolean }[],
    curM: BracketMatch,
    targetHome: number,
    targetAway: number,
    intervalMs: number
  ) {
    let min = currentMin;
    secondHalfTimerRef.current = setInterval(() => {
      min += 1;
      setMatchMin(min);

      const past = planned.filter((e) => e.minute <= min);
      setLiveGoalScorers(past);
      setHomeLiveGoals(past.filter((e) => e.isHome).length);
      setAwayLiveGoals(past.filter((e) => !e.isHome).length);

      if (min >= 90) {
        if (secondHalfTimerRef.current) clearInterval(secondHalfTimerRef.current as any);
        secondHalfTimerRef.current = null;
        setIsHalftime(false);

        if (bracketLeg === 1 && curM.stage !== "FINAL") {
          setBracketMatchState("FINISHED");
          setBracketMatches((prev) =>
            prev.map((m) =>
              m.id === curM.id ? { ...m, leg1: { homeScore: targetHome, awayScore: targetAway, played: true } } : m
            )
          );
          return;
        }

        const outcome = checkLeg2Outcome(curM, targetHome, targetAway);

        if (!outcome.isDraw) {
          setBracketMatchState("FINISHED");
          finalizeBracketMatch(curM, targetHome, targetAway, outcome.winnerId, outcome.winnerName, false);
        } else {
          setBracketMatchState("EXTRA_TIME");
          runExtraTimeSim(curM, targetHome, targetAway, intervalMs);
        }
      }
    }, intervalMs);
  }

  function resumeLeagueSecondHalf(
    fixIndex: number,
    currentMin: number,
    plannedEvents: { minute: number; name: string; isHome: boolean }[],
    isFbHome: boolean,
    fbGoals: number,
    oppGoals: number,
    thisWeekOtherMatches: LeagueMatchdayMatch[],
    intervalMs: number
  ) {
    let min = currentMin;
    secondHalfTimerRef.current = setInterval(() => {
      min += 1;
      setMatchMin(min);

      const past = plannedEvents.filter((e) => e.minute <= min);
      setLiveGoalScorers(past);
      setHomeLiveGoals(past.filter((e) => e.isHome).length);
      setAwayLiveGoals(past.filter((e) => !e.isHome).length);

      if (min >= 90) {
        if (secondHalfTimerRef.current) clearInterval(secondHalfTimerRef.current as any);
        secondHalfTimerRef.current = null;
        finishFixture(fixIndex, fbGoals, oppGoals, plannedEvents, isFbHome, thisWeekOtherMatches);
      }
    }, intervalMs);
  }

  function finishFixture(
    fixIndex: number,
    fbG: number,
    oppG: number,
    scorers: { minute: number; name: string; isHome: boolean }[],
    isFbHome: boolean,
    thisWeekOtherMatches: LeagueMatchdayMatch[]
  ) {
    setMatchState("FINISHED");
    setIsHalftime(false);
    const curFix = fixtures[fixIndex];
    if (!curFix) return;

    const mappedScorers = scorers.map((s) => ({
      minute: s.minute,
      name: s.name,
      isFb: isFbHome ? s.isHome : !s.isHome,
    }));

    mappedScorers
      .filter((s) => s.isFb)
      .forEach((s) => {
        setPlayerGoalCounts((prev) => ({
          ...prev,
          [s.name]: (prev[s.name] || 0) + 1,
        }));
      });

    updateCareerMatchStats(fbG, oppG);
    recordAllTimeGoals(mappedScorers);

    if (fbG > oppG) {
      if (!memorableMatch || fbG - oppG >= 2) {
        setMemorableMatch({
          opponent: curFix.opponent.name,
          score: isFbHome ? `${fbG} - ${oppG}` : `${oppG} - ${fbG}`,
          stage: `Hafta ${curFix.matchday}`,
        });
      }
    }

    setFixtures((prev) => {
      const copy = [...prev];
      copy[fixIndex] = {
        ...copy[fixIndex],
        played: true,
        fbScore: fbG,
        oppScore: oppG,
        scorers: mappedScorers,
      };
      return copy;
    });

    setSwissTable((prev) => {
      const updated = prev.map((r) => ({ ...r }));
      const fbRow = updated.find((r) => r.id === "fb");
      const oppRow = updated.find((r) => r.id === curFix.opponent.id);

      if (fbRow && oppRow) {
        fbRow.played += 1; fbRow.gf += fbG; fbRow.ga += oppG; fbRow.gd = fbRow.gf - fbRow.ga;
        oppRow.played += 1; oppRow.gf += oppG; oppRow.ga += fbG; oppRow.gd = oppRow.gf - oppRow.ga;

        if (fbG > oppG) {
          fbRow.won += 1; fbRow.points += 3; oppRow.lost += 1;
        } else if (fbG === oppG) {
          fbRow.drawn += 1; fbRow.points += 1; oppRow.drawn += 1; oppRow.points += 1;
        } else {
          fbRow.lost += 1; oppRow.won += 1; oppRow.points += 3;
        }
      }

      thisWeekOtherMatches.forEach((m) => {
        const hRow = updated.find((r) => r.id === m.homeClub.id);
        const aRow = updated.find((r) => r.id === m.awayClub.id);
        if (hRow && aRow) {
          hRow.played += 1; hRow.gf += m.homeScore; hRow.ga += m.awayScore; hRow.gd = hRow.gf - hRow.ga;
          aRow.played += 1; aRow.gf += m.awayScore; aRow.ga += m.homeScore; aRow.gd = aRow.gf - aRow.ga;

          if (m.homeScore > m.awayScore) {
            hRow.won += 1; hRow.points += 3; aRow.lost += 1;
          } else if (m.homeScore === m.awayScore) {
            hRow.drawn += 1; hRow.points += 1; aRow.drawn += 1; aRow.points += 1;
          } else {
            aRow.won += 1; aRow.points += 3; hRow.lost += 1;
          }
        }
      });

      const sorted = updated.sort((a, b) => b.points - a.points || b.gd - a.gd || b.gf - a.gf);
      
      if (fixIndex + 1 >= fixtures.length) {
        setLeagueFinished(true);
        const fbFinalPts = sorted.find((r) => r.id === "fb")?.points || 0;
        setCareerStats((cPrev) => ({
          ...cPrev,
          highestLeaguePoints: Math.max(cPrev.highestLeaguePoints, fbFinalPts),
        }));
      }

      return sorted;
    });
  }

  // =================================================================
  // İSTATİSTİK & DRAFT KAYIT FONKSİYONLARI
  // =================================================================
  const recordDraftCompletion = useCallback((currentLineup: Record<string, DraftedSlotData | null>) => {
    const active = Object.values(currentLineup).filter(Boolean) as DraftedSlotData[];
    setPickedPlayersCount((prev) => {
      const updated = { ...prev };
      active.forEach((item) => {
        updated[item.player.name] = (updated[item.player.name] || 0) + 1;
      });
      try { localStorage.setItem("fb_ucl_picked_players", JSON.stringify(updated)); } catch {}
      return updated;
    });
  }, []);

  const updateCareerMatchStats = useCallback((userGoals: number, opponentGoals: number) => {
    setCareerStats((prev) => {
      const isWin = userGoals > opponentGoals;
      const isDraw = userGoals === opponentGoals;
      const updated: UserCareerStats = {
        ...prev,
        matchesPlayed: prev.matchesPlayed + 1,
        wins: prev.wins + (isWin ? 1 : 0),
        draws: prev.draws + (isDraw ? 1 : 0),
        losses: prev.losses + (!isWin && !isDraw ? 1 : 0),
        goalsScored: prev.goalsScored + userGoals,
        goalsConceded: prev.goalsConceded + opponentGoals,
      };
      try { localStorage.setItem("fb_ucl_career_stats", JSON.stringify(updated)); } catch {}
      return updated;
    });
  }, []);

  const recordAllTimeGoals = useCallback((scorersList: { name: string; isFb: boolean }[]) => {
    const fbScorers = scorersList.filter((s) => s.isFb);
    if (fbScorers.length === 0) return;
    setAllTimeScorers((prev) => {
      const updated = { ...prev };
      fbScorers.forEach((s) => {
        updated[s.name] = (updated[s.name] || 0) + 1;
      });
      try { localStorage.setItem("fb_ucl_alltime_scorers", JSON.stringify(updated)); } catch {}
      return updated;
    });
  }, []);

  const recordTrophyInHallOfFame = useCallback(async (finalTrophy: string) => {
    const active = Object.values(lineup).filter(Boolean) as DraftedSlotData[];
    const topScorer = Object.entries(playerGoalCounts).sort((a, b) => b[1] - a[1])[0];

    const newEntry: HallOfFameEntry = {
      id: `hof_${Date.now()}`,
      date: new Date().toLocaleDateString("tr-TR"),
      trophy: finalTrophy,
      ovr: rawTeamOvr,
      formationName: activeFormation.name,
      topScorerName: topScorer ? topScorer[0] : "Alex de Souza",
      topScorerGoals: topScorer ? topScorer[1] : 0,
      lineupList: active.map((item) => ({
        slotLabel: item.player.positions[0] || "FB",
        playerName: item.player.name,
        rating: item.effectiveRating,
      })),
    };

    setHallOfFame((prev) => {
      const updated = [newEntry, ...prev].slice(0, 10);
      try { localStorage.setItem("fb_ucl_hall_of_fame", JSON.stringify(updated)); } catch {}
      return updated;
    });

    setCareerStats((prev) => {
      const updated: UserCareerStats = {
        ...prev,
        trophies: prev.trophies + (finalTrophy === "Şampiyon" ? 1 : 0),
        maxOvr: Math.max(prev.maxOvr, rawTeamOvr),
      };
      try { localStorage.setItem("fb_ucl_career_stats", JSON.stringify(updated)); } catch {}
      return updated;
    });

    try {
      const bestPts = careerStats.highestLeaguePoints;
      const trophiesCount = careerStats.trophies + (finalTrophy === "Şampiyon" ? 1 : 0);

      await supabase.from("leaderboard").insert([
        {
          manager_name: managerName || "Kadıköy Fatihi",
          trophies: trophiesCount,
          max_ovr: rawTeamOvr,
          best_points: bestPts,
          formation_name: activeFormation.name,
          squad_data: newEntry,
          created_at: new Date().toISOString(),
        },
      ]);
      fetchGlobalLeaderboard();
    } catch {}
  }, [lineup, playerGoalCounts, rawTeamOvr, activeFormation.name, careerStats, managerName, fetchGlobalLeaderboard]);

  const generateSquadShareCode = useCallback(() => {
    const active = Object.values(lineup).filter(Boolean) as DraftedSlotData[];
    if (active.length < 11) return "";
    const compactData: DuelOpponentSquad = {
      managerName: managerName || "Kadıköy Fatihi",
      formationName: activeFormation.name,
      teamOvr: rawTeamOvr,
      players: active.map((i) => ({
        slotLabel: i.player.positions[0],
        playerName: i.player.name,
        rating: i.effectiveRating,
      })),
    };
    try {
      return btoa(unescape(encodeURIComponent(JSON.stringify(compactData))));
    } catch {
      return "";
    }
  }, [lineup, activeFormation.name, rawTeamOvr, managerName]);

  const handlePlayDuel = () => {
    if (!duelInputCode.trim()) return;
    try {
      const jsonStr = decodeURIComponent(escape(atob(duelInputCode.trim())));
      const oppData: DuelOpponentSquad = JSON.parse(jsonStr);

      const res = calculateMatchGoals(rawTeamOvr, oppData.teamOvr, 1.05, 0.95);
      const activeFb = Object.values(lineup).filter(Boolean) as DraftedSlotData[];

      const uScorers: string[] = [];
      for (let i = 0; i < res.homeGoals; i++) {
        uScorers.push(pickRealisticFbScorer(activeFb));
      }

      const oScorers: string[] = [];
      for (let i = 0; i < res.awayGoals; i++) {
        const randPlayer = oppData.players[Math.floor(Math.random() * oppData.players.length)];
        oScorers.push(randPlayer ? randPlayer.playerName : "Rakip Yıldızı");
      }

      setDuelResult({
        userScore: res.homeGoals,
        oppScore: res.awayGoals,
        userScorers: uScorers,
        oppScorers: oScorers,
        oppManager: oppData.managerName || "Arkadaş Kadrosu",
      });

      updateCareerMatchStats(res.homeGoals, res.awayGoals);
    } catch {
      alert("Geçersiz Kadro Kodu! Lütfen arkadaşınızın ürettiği kodu tam yapıştırın.");
    }
  };

  const handleFormationChange = (form: Formation) => {
    if (filledCount > 0) {
      if (!window.confirm("Diziliş değiştirildiğinde kurduğun kadro sıfırlanır. Onaylıyor musun?")) return;
    }
    clearAllSimTimers();
    setActiveFormation(form);
    setSelectedMentality(form.mentality);
    setLineup({});
    setDraftedNames([]);
    setCurrentSeason(null);
    setSelectedPlayer(null);
    setIsDrawerOpen(false);
    setPlayerGoalCounts({});
  };

  const getSlotSuitability = (player: Player, slot: FormationSlot) => {
    const isMain = player.positions[0] === slot.label || slot.accepts[0] === player.positions[0];
    const canPlay = player.positions.some((pos) => slot.accepts.includes(pos));
    if (!canPlay) return null;
    const penalty = isMain ? 0 : 2;
    return {
      canPlay: true,
      isMain,
      effectiveRating: Math.max(50, player.fifaRating - penalty),
    };
  };

  const getAvailableSlots = useCallback(
    (player: Player): string[] => {
      if (draftedNames.includes(player.name)) return [];
      return activeFormation.slots
        .filter((slot) => !lineup[slot.id] && getSlotSuitability(player, slot) !== null)
        .map((s) => s.id);
    },
    [activeFormation.slots, draftedNames, lineup]
  );

  const handlePlacePlayer = (slot: FormationSlot) => {
    if (!selectedPlayer || !currentSeason) return;
    const suitability = getSlotSuitability(selectedPlayer, slot);
    if (!suitability) return;

    const newLineup = {
      ...lineup,
      [slot.id]: {
        player: selectedPlayer,
        season: currentSeason,
        effectiveRating: suitability.effectiveRating,
        isMainPosition: suitability.isMain,
      },
    };

    setLineup(newLineup);
    setDraftedNames((prev) => [...prev, selectedPlayer.name]);
    setSelectedPlayer(null);
    setCurrentSeason(null);
    setIsDrawerOpen(false); // Oyuncu yerleştirildiğinde çekmece anında kapanır

    if (Object.values(newLineup).filter(Boolean).length === 11) {
      recordDraftCompletion(newLineup);
    }
  };

  const pulsingSlots = useMemo(() => {
    return selectedPlayer ? getAvailableSlots(selectedPlayer) : [];
  }, [selectedPlayer, getAvailableSlots]);

  const handleRollDice = () => {
    setIsRolling(true);
    safeAudio.tryAutoPlayFb(setFbAudioActive);
  };

  const handleStartDrawCeremony = () => {
    clearAllSimTimers();
    safeAudio.playUcl(setUclAudioActive);
    setFbAudioActive(false);
    setCurrentScreen("DRAW");
    runLiveDrawCeremony();
  };

  const runLiveDrawCeremony = () => {
    clearAllSimTimers();
    setIsDrawingAnimation(true);
    setDrawStep(0);

    const p1 = UCL_36_POTS.filter((c) => c.pot === 1).sort(() => 0.5 - Math.random()).slice(0, 2);
    const p2 = UCL_36_POTS.filter((c) => c.pot === 2).sort(() => 0.5 - Math.random()).slice(0, 2);
    const p3 = UCL_36_POTS.filter((c) => c.pot === 3 && c.id !== "fb").sort(() => 0.5 - Math.random()).slice(0, 2);
    const p4 = UCL_36_POTS.filter((c) => c.pot === 4).sort(() => 0.5 - Math.random()).slice(0, 2);

    const pool = [
      { opponent: p1[0], isHome: true }, { opponent: p1[1], isHome: false },
      { opponent: p2[0], isHome: true }, { opponent: p2[1], isHome: false },
      { opponent: p3[0], isHome: true }, { opponent: p3[1], isHome: false },
      { opponent: p4[0], isHome: true }, { opponent: p4[1], isHome: false },
    ];

    const randomizedFixtures: FixtureMatch[] = pool
      .sort(() => 0.5 - Math.random())
      .map((item, idx) => ({
        matchday: idx + 1,
        opponent: item.opponent,
        isHome: item.isHome,
        played: false,
      }));

    setFixtures(randomizedFixtures);

    const generatedSchedule: Record<number, LeagueMatchdayMatch[]> = {};
    for (let w = 1; w <= 8; w++) {
      const curOpponentId = randomizedFixtures[w - 1].opponent.id;
      const otherTeams = UCL_36_POTS.filter((c) => c.id !== "fb" && c.id !== curOpponentId).sort(
        () => 0.5 - Math.random()
      );

      const matchdayMatches: LeagueMatchdayMatch[] = [];
      for (let i = 0; i < otherTeams.length; i += 2) {
        if (otherTeams[i + 1]) {
          matchdayMatches.push({
            homeClub: otherTeams[i],
            awayClub: otherTeams[i + 1],
            homeScore: 0,
            awayScore: 0,
            played: false,
          });
        }
      }
      generatedSchedule[w] = matchdayMatches;
    }
    setLeagueFullSchedule(generatedSchedule);

    const initTable: SwissTableRow[] = UCL_36_POTS.map((c) => ({
      id: c.id,
      name: c.id === "fb" ? `Fenerbahçe SK (${teamOvr})` : c.name,
      shortName: c.shortName,
      country: c.country,
      logoUrl: c.logoUrl,
      rating: c.id === "fb" ? rawTeamOvr : c.rating,
      played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, points: 0,
    }));

    setSwissTable(initTable);
    setCurrentFixtureIndex(0);
    resetMatchBoard();
    setLeagueFinished(false);
    setTournamentWinner(null);

    let step = 0;
    drawIntervalRef.current = setInterval(() => {
      step++;
      setDrawStep(step);
      const randClub = UCL_36_POTS[Math.floor(Math.random() * UCL_36_POTS.length)];
      setFlashingName(`⚽ ${randClub.name} (${randClub.country})`);

      if (step >= 8) {
        if (drawIntervalRef.current) clearInterval(drawIntervalRef.current);
        drawIntervalRef.current = null;
        setIsDrawingAnimation(false);
        setFlashingName("Kura Çekimi Tamamlandı");
      }
    }, 350);
  };

  const handleSkipDrawAnimation = () => {
    if (drawIntervalRef.current) { clearInterval(drawIntervalRef.current); drawIntervalRef.current = null; }
    setIsDrawingAnimation(false);
    setDrawStep(8);
    setFlashingName("Kura Çekimi Tamamlandı");
  };

  // Tek tıkla maç simülasyonu başlatıcı
  const playFixtureAtIndex = useCallback((fixIndex: number) => {
    if (fixIndex >= fixtures.length) return;
    clearAllSimTimers();
    resetMatchBoard();
    setMatchState("PLAYING");

    const curFix = fixtures[fixIndex];
    const isFbHome = curFix.isHome;
    const matchday = curFix.matchday;

    const fbRes = isFbHome
      ? calculateMatchGoals(rawTeamOvr, curFix.opponent.rating, activeFormation.modifiers.attackXgMult, activeFormation.modifiers.defenseXgMult)
      : calculateMatchGoals(curFix.opponent.rating, rawTeamOvr, activeFormation.modifiers.defenseXgMult, activeFormation.modifiers.attackXgMult);

    const fbGoals = isFbHome ? fbRes.homeGoals : fbRes.awayGoals;
    const oppGoals = isFbHome ? fbRes.awayGoals : fbRes.homeGoals;

    const activeFb = Object.values(lineup).filter(Boolean) as DraftedSlotData[];
    const plannedEvents: { minute: number; name: string; isHome: boolean }[] = [];

    for (let i = 0; i < fbGoals; i++) {
      const min = Math.floor(Math.random() * 88) + 2;
      const scorer = pickRealisticFbScorer(activeFb);
      plannedEvents.push({ minute: min, name: scorer, isHome: isFbHome });
    }

    for (let i = 0; i < oppGoals; i++) {
      const min = Math.floor(Math.random() * 88) + 2;
      const oppScorer = getOpponentScorer(curFix.opponent.id, curFix.opponent.name);
      plannedEvents.push({ minute: min, name: oppScorer, isHome: !isFbHome });
    }

    plannedEvents.sort((a, b) => a.minute - b.minute);

    const thisWeekOtherMatches = (leagueFullSchedule[matchday] || []).map((m) => {
      const res = calculateMatchGoals(m.homeClub.rating, m.awayClub.rating);
      return { ...m, homeScore: res.homeGoals, awayScore: res.awayGoals, played: true };
    });

    setConcurrentMatches(thisWeekOtherMatches.slice(0, 3));

    if (simSpeed === 100) {
      instantTimerRef.current = setTimeout(() => {
        finishFixture(fixIndex, fbGoals, oppGoals, plannedEvents, isFbHome, thisWeekOtherMatches);
      }, 50);
      return;
    }

    let min = 0;
    const intervalMs = Math.max(18, Math.floor(70 / simSpeed));

    timerRef.current = setInterval(() => {
      min += 1;
      setMatchMin(min);

      if (min === 45) {
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = null;
        setIsHalftime(true);
        const halftimeWaitMs = Math.max(40, Math.floor(1000 / simSpeed));

        secondHalfTimerRef.current = setTimeout(() => {
          setIsHalftime(false);
          resumeLeagueSecondHalf(fixIndex, min, plannedEvents, isFbHome, fbGoals, oppGoals, thisWeekOtherMatches, intervalMs);
        }, halftimeWaitMs);
        return;
      }

      const past = plannedEvents.filter((e) => e.minute <= min);
      setLiveGoalScorers(past);
      setHomeLiveGoals(past.filter((e) => e.isHome).length);
      setAwayLiveGoals(past.filter((e) => !e.isHome).length);
    }, intervalMs);
  }, [fixtures, rawTeamOvr, activeFormation, lineup, leagueFullSchedule, simSpeed, clearAllSimTimers, resetMatchBoard]);

  // Düzeltme 2: Çift tıklamayı kaldıran "Sonraki Maçı Oyna" fonksiyonu
  const proceedAndPlayNextFixture = () => {
    if (currentFixtureIndex + 1 >= fixtures.length) return;
    const nextIdx = currentFixtureIndex + 1;
    setCurrentFixtureIndex(nextIdx);
    resetMatchBoard();
    playFixtureAtIndex(nextIdx);
  };

  // Düzeltme: İlk 8'e girildiğinde doğrudan Son 16'ya geçiş motoru
  const setupRealUclBracket = () => {
    const sorted = [...swissTable].sort((a, b) => b.points - a.points || b.gd - a.gd || b.gf - a.gf);
    const top8 = sorted.slice(0, 8);
    const rest24 = sorted.slice(8, 32);

    const isFbTop8 = top8.some((r) => r.id === "fb");

    if (isFbTop8) {
      const poTeams = rest24.slice(0, 16);
      const poWinners: BracketTeam[] = [];

      for (let i = 0; i < 8; i++) {
  const t1 = poTeams[15 - i];
  const t2 = poTeams[i];
  const sim = calculateMatchGoals(t1.rating, t2.rating);
  const winner = sim.homeGoals >= sim.awayGoals ? t1 : t2;

  poWinners.push({
    id: winner.id,
    name: winner.id === "fb" ? "Fenerbahçe SK" : winner.name,
    shortName: winner.shortName,
    country: winner.country,
    rating: winner.id === "fb" ? rawTeamOvr : winner.rating,
    logoUrl: winner.logoUrl,
    isUser: winner.id === "fb",
  });
}


      generateRoundOf16Bracket(top8, poWinners);
    } else {
      const fbRank = sorted.findIndex((r) => r.id === "fb") + 1;
      if (fbRank <= 24) {
        const poMatches: BracketMatch[] = [];

        for (let i = 0; i < 8; i++) {
          const t1 = rest24[15 - i];
          const t2 = rest24[i];
          const isThisUser = t1.id === "fb" || t2.id === "fb";

          poMatches.push({
            id: `po_${i + 1}`,
            stage: "PLAYOFF",
            stageTitle: "Play-Off Turu",
            teamHome: {
              id: t1.id,
              name: t1.id === "fb" ? "Fenerbahçe SK" : t1.name,
              shortName: t1.shortName,
              rating: t1.id === "fb" ? rawTeamOvr : t1.rating,
              logoUrl: t1.logoUrl,
              isUser: t1.id === "fb",
            },
            teamAway: {
              id: t2.id,
              name: t2.id === "fb" ? "Fenerbahçe SK" : t2.name,
              shortName: t2.shortName,
              rating: t2.id === "fb" ? rawTeamOvr : t2.rating,
              logoUrl: t2.logoUrl,
              isUser: t2.id === "fb",
            },
            leg1: { homeScore: 0, awayScore: 0, played: false },
            leg2: { homeScore: 0, awayScore: 0, played: false },
            isUserMatch: isThisUser,
          });
        }

        setBracketMatches(poMatches);
        const userM = poMatches.find((m) => m.isUserMatch);
        setActiveBracketId(userM?.id || "po_1");
        setBracketLeg(1);
        resetBracketLiveBoard();
        setCurrentScreen("BRACKET");
      }
    }
  };

  const playLiveBracketLeg = () => {
    if (bracketMatchState === "PLAYING" || bracketMatchState === "PENALTIES") return;
    clearAllSimTimers();

    const curM = bracketMatches.find((m) => m.id === activeBracketId);
    if (!curM) return;

    setMatchMin(0);
    setIsHalftime(false);
    setHomeLiveGoals(0);
    setAwayLiveGoals(0);
    setLiveGoalScorers([]);
    setLivePenaltyStatus(null);
    setBracketMatchState("PLAYING");

    const isLeg2 = bracketLeg === 2 || curM.stage === "FINAL";
    const homeTeam = isLeg2 ? curM.teamAway : curM.teamHome;
    const awayTeam = isLeg2 ? curM.teamHome : curM.teamAway;

    const res = calculateMatchGoals(homeTeam.rating, awayTeam.rating);
    const targetHome = res.homeGoals;
    const targetAway = res.awayGoals;

    const plannedEvents: { minute: number; name: string; isHome: boolean }[] = [];
    const activeFb = Object.values(lineup).filter(Boolean) as DraftedSlotData[];

    for (let i = 0; i < targetHome; i++) {
      const min = Math.floor(Math.random() * 88) + 2;
      const scorer = homeTeam.isUser
        ? pickRealisticFbScorer(activeFb)
        : getOpponentScorer(homeTeam.id, homeTeam.name);
      plannedEvents.push({ minute: min, name: scorer, isHome: true });
    }

    for (let i = 0; i < targetAway; i++) {
      const min = Math.floor(Math.random() * 88) + 2;
      const scorer = awayTeam.isUser
        ? pickRealisticFbScorer(activeFb)
        : getOpponentScorer(awayTeam.id, awayTeam.name);
      plannedEvents.push({ minute: min, name: scorer, isHome: false });
    }

    plannedEvents.sort((a, b) => a.minute - b.minute);

    if (simSpeed === 100) {
      instantTimerRef.current = setTimeout(() => {
        setHomeLiveGoals(targetHome);
        setAwayLiveGoals(targetAway);
        setLiveGoalScorers(plannedEvents);
        setBracketMatchState("FINISHED");

        if (curM.stage === "FINAL" || bracketLeg === 2) {
          const outcome = checkLeg2Outcome(curM, targetHome, targetAway);
          if (!outcome.isDraw) {
            finalizeBracketMatch(curM, targetHome, targetAway, outcome.winnerId, outcome.winnerName, false);
          } else {
            runAutomatedPenaltyShootout(curM, targetHome, targetAway);
          }
        } else {
          setBracketMatches((prev) =>
            prev.map((m) => (m.id === curM.id ? { ...m, leg1: { homeScore: targetHome, awayScore: targetAway, played: true } } : m))
          );
        }
      }, 50);
      return;
    }

    let min = 0;
    const intervalMs = Math.max(18, Math.floor(70 / simSpeed));

    timerRef.current = setInterval(() => {
      min += 1;
      setMatchMin(min);

      if (min === 45) {
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = null;
        setIsHalftime(true);
        const halftimeWaitMs = Math.max(40, Math.floor(1000 / simSpeed));

        secondHalfTimerRef.current = setTimeout(() => {
          setIsHalftime(false);
          resumeBracketSecondHalf(min, plannedEvents, curM, targetHome, targetAway, intervalMs);
        }, halftimeWaitMs);
        return;
      }

      const past = plannedEvents.filter((e) => e.minute <= min);
      setLiveGoalScorers(past);
      setHomeLiveGoals(past.filter((e) => e.isHome).length);
      setAwayLiveGoals(past.filter((e) => !e.isHome).length);
    }, intervalMs);
  };

  const advanceBracketRound = () => {
    clearAllSimTimers();
    const curM = bracketMatches.find((m) => m.id === activeBracketId);
    if (!curM) return;

    if (bracketLeg === 1 && curM.stage !== "FINAL") {
      setBracketLeg(2);
      resetBracketLiveBoard();
    } else {
      if (curM.winnerId === "fb") {
        if (curM.stage === "PLAYOFF") {
          const winners = bracketMatches.map((m) => (m.winnerId === m.teamHome.id ? m.teamHome : m.teamAway));
          generateRoundOf16Bracket(swissTable.slice(0, 8), winners);
        } else if (curM.stage === "R16") {
          const r16Winners = bracketMatches.map((m) => {
            const hGoals = (m.leg1?.homeScore || 0) + (m.leg2?.awayScore || 0);
            const aGoals = (m.leg1?.awayScore || 0) + (m.leg2?.homeScore || 0);
            return hGoals > aGoals ? m.teamHome : m.teamAway;
          });
          const qf: BracketMatch[] = [];
          for (let i = 0; i < 4; i++) {
            const t1 = r16Winners[i * 2];
            const t2 = r16Winners[i * 2 + 1];
            const isUser = t1.isUser || t2.isUser;
            qf.push({
              id: `qf_${i + 1}`, stage: "QF", stageTitle: "Çeyrek Final", teamHome: t1, teamAway: t2,
              leg1: { homeScore: 0, awayScore: 0, played: false }, leg2: { homeScore: 0, awayScore: 0, played: false },
              isUserMatch: isUser,
            });
          }
          setBracketMatches(qf);
          const userM = qf.find((m) => m.isUserMatch);
          setActiveBracketId(userM?.id || "qf_1");
          setBracketLeg(1);
          resetBracketLiveBoard();
        } else if (curM.stage === "QF") {
          const qfWinners = bracketMatches.map((m) => {
            const hGoals = (m.leg1?.homeScore || 0) + (m.leg2?.awayScore || 0);
            const aGoals = (m.leg1?.awayScore || 0) + (m.leg2?.homeScore || 0);
            return hGoals > aGoals ? m.teamHome : m.teamAway;
          });
          const sf: BracketMatch[] = [
            {
              id: "sf_1", stage: "SF", stageTitle: "Yarı Final", teamHome: qfWinners[0], teamAway: qfWinners[1],
              leg1: { homeScore: 0, awayScore: 0, played: false }, leg2: { homeScore: 0, awayScore: 0, played: false },
              isUserMatch: qfWinners[0].isUser || qfWinners[1].isUser,
            },
            {
              id: "sf_2", stage: "SF", stageTitle: "Yarı Final", teamHome: qfWinners[2], teamAway: qfWinners[3],
              leg1: { homeScore: 0, awayScore: 0, played: false }, leg2: { homeScore: 0, awayScore: 0, played: false },
              isUserMatch: qfWinners[2].isUser || qfWinners[3].isUser,
            },
          ];
          setBracketMatches(sf);
          const userM = sf.find((m) => m.isUserMatch);
          setActiveBracketId(userM?.id || "sf_1");
          setBracketLeg(1);
          resetBracketLiveBoard();
        } else if (curM.stage === "SF") {
          const sfWinners = bracketMatches.map((m) => {
            const hGoals = (m.leg1?.homeScore || 0) + (m.leg2?.awayScore || 0);
            const aGoals = (m.leg1?.awayScore || 0) + (m.leg2?.homeScore || 0);
            return hGoals > aGoals ? m.teamHome : m.teamAway;
          });
          const finalMatch: BracketMatch = {
            id: "final_1", stage: "FINAL", stageTitle: "Final (Münih)", teamHome: sfWinners[0], teamAway: sfWinners[1],
            leg1: { homeScore: 0, awayScore: 0, played: false }, isUserMatch: sfWinners[0].isUser || sfWinners[1].isUser,
          };
          setBracketMatches([finalMatch]);
          setActiveBracketId("final_1");
          setBracketLeg(1);
          resetBracketLiveBoard();
        } else if (curM.stage === "FINAL") {
          setCampaignTrophy("Şampiyon");
          setTournamentWinner("Fenerbahçe SK");
          recordTrophyInHallOfFame("Şampiyon");
          confetti({ particleCount: 400, spread: 140, origin: { y: 0.6 } });
          setCurrentScreen("SUMMARY");
        }
      } else {
        setCampaignTrophy(`${curM.stageTitle} Aşamasında Veda`);
        recordTrophyInHallOfFame(`${curM.stageTitle} Aşamasında Veda`);
        simulateRestOfTournament(bracketMatches);
        setCurrentScreen("SUMMARY");
      }
    }
  };

  const activeBracketMatch = bracketMatches.find((m) => m.id === activeBracketId);
  const activeBracketHome =
    bracketLeg === 2 && activeBracketMatch?.stage !== "FINAL" ? activeBracketMatch?.teamAway : activeBracketMatch?.teamHome;
  const activeBracketAway =
    bracketLeg === 2 && activeBracketMatch?.stage !== "FINAL" ? activeBracketMatch?.teamHome : activeBracketMatch?.teamAway;

  const simulateRestOfTournament = (matches: BracketMatch[]) => {
    const remainingTeams: { name: string; rating: number }[] = [];
    matches.forEach((m) => {
      if (m.winnerName) {
        const isHomeWinner = m.winnerId === m.teamHome.id;
        remainingTeams.push({
          name: isHomeWinner ? m.teamHome.name : m.teamAway.name,
          rating: isHomeWinner ? m.teamHome.rating : m.teamAway.rating,
        });
      }
    });

    if (remainingTeams.length > 0) {
      remainingTeams.sort((a, b) => b.rating - a.rating);
      setTournamentWinner(remainingTeams[0].name);
    } else {
      setTournamentWinner("Real Madrid");
    }
  };

  const userRank = useMemo(() => {
    const sorted = [...swissTable].sort((a, b) => b.points - a.points || b.gd - a.gd || b.gf - a.gf);
    const idx = sorted.findIndex((r) => r.id === "fb");
    return idx !== -1 ? idx + 1 : 15;
  }, [swissTable]);

  const isEliminatedInLeague = leagueFinished && userRank > 24;
  const isDirectR16 = leagueFinished && userRank <= 8;

  const handleRestartCampaign = () => {
    clearAllSimTimers();
    safeAudio.stopAll(setUclAudioActive, setFbAudioActive);
    setLineup({});
    setDraftedNames([]);
    setCurrentSeason(null);
    setSelectedPlayer(null);
    setIsDrawerOpen(false);
    setFixtures([]);
    setSwissTable([]);
    setBracketMatches([]);
    setPlayerGoalCounts({});
    setPassJokers(1);
    setMemorableMatch(null);
    setLeagueFinished(false);
    setTournamentWinner(null);
    resetMatchBoard();
    setCurrentScreen("LANDING");
  };

  // Şeref Kürsüsü Filtrelemesi (Haftalık / Günlük)
  const filteredLeaderboard = useMemo(() => {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    
    // Pazartesi başlangıcı
    const day = now.getDay();
    const diffToMonday = (day === 0 ? -6 : 1) - day;
    const monday = new Date(now.getFullYear(), now.getMonth(), now.getDate() + diffToMonday);
    const startOfWeek = monday.getTime();

    return globalLeaderboard.filter((item) => {
      const itemTime = item.created_at ? new Date(item.created_at).getTime() : Date.now();
      if (leaderboardTab === "DAILY") return itemTime >= startOfToday;
      return itemTime >= startOfWeek;
    });
  }, [globalLeaderboard, leaderboardTab]);

  // =================================================================
  // EKRAN 1: KARŞILAMA EKRANI
  // =================================================================
  if (currentScreen === "LANDING") {
    return (
      <div className="h-[100dvh] max-h-[100dvh] bg-[#00001f] text-white flex flex-col justify-between p-3 sm:p-6 select-none font-sans relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,240,255,0.1)_0%,transparent_70%)] pointer-events-none" />

        <div className="w-full max-w-4xl mx-auto z-20 shrink-0">
          <div className="bg-[#000030]/90 border border-cyan-500/40 rounded-xl px-3 py-1 flex items-center gap-2 overflow-hidden shadow-lg">
            <span className="bg-red-600 text-white text-[8px] font-black px-1.5 py-0.5 rounded animate-pulse shrink-0">HABERLER</span>
            <p className="text-[11px] sm:text-xs text-cyan-200 font-bold truncate">{tickerEvents[tickerIndex]}</p>
          </div>
        </div>

        <header className="w-full max-w-4xl mx-auto flex items-center justify-between z-10 border-b border-cyan-500/20 pb-2 shrink-0">
          <div className="flex items-center gap-2">
            <div className="bg-[#000038] border-2 border-cyan-400 p-1.5 rounded-xl shadow-[0_0_15px_rgba(0,240,255,0.4)]">
              <OfficialUCLLogo className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs sm:text-sm font-extrabold text-white tracking-wide block">FENERBAHÇE SK</span>
              <span className="text-[9px] text-cyan-400 font-bold block">CHAMPIONS LEAGUE</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={() => setIsQuestsModalOpen(true)}
              className="px-2 sm:px-3 py-1 rounded-xl text-[10px] sm:text-xs font-black border bg-slate-900 border-slate-700 text-emerald-300 hover:border-emerald-400"
            >
              🎯 Görevler
            </button>
            <button
              type="button"
              onClick={() => setIsStatsModalOpen(true)}
              className="px-2 sm:px-3 py-1 rounded-xl text-[10px] sm:text-xs font-black border bg-slate-900 border-slate-700 text-yellow-300 hover:border-yellow-400"
            >
              📊 Kariyer
            </button>
            <button
              type="button"
              onClick={() => {
                fetchGlobalLeaderboard();
                setIsLeaderboardOpen(true);
              }}
              className="px-2 sm:px-3 py-1 rounded-xl text-[10px] sm:text-xs font-black border bg-slate-900 border-slate-700 text-cyan-300 hover:border-cyan-400"
            >
              👑 Kürsü
            </button>
            <button
              type="button"
              onClick={() => safeAudio.toggleUcl(setUclAudioActive)}
              className={`px-2 sm:px-3 py-1 rounded-xl text-[10px] sm:text-xs font-black border transition-all ${
                uclAudioActive ? "bg-cyan-950 border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(0,240,255,0.7)]" : "bg-slate-900 border-slate-750 text-slate-400"
              }`}
            >
              {uclAudioActive ? "🔊 Marş" : "🔇 Marş"}
            </button>
          </div>
        </header>

        <main className="w-full max-w-2xl mx-auto flex flex-col items-center text-center z-10 my-auto py-2">
          <div className="flex items-center justify-center gap-4 sm:gap-8 mb-2">
            <OfficialFBCrest className="w-16 h-16 sm:w-24 sm:h-24 drop-shadow-[0_0_20px_rgba(254,241,0,0.5)]" />
            <div className="text-xl sm:text-3xl font-black text-cyan-400 opacity-60">✕</div>
            <OfficialUCLLogo className="w-16 h-16 sm:w-24 sm:h-24 drop-shadow-[0_0_20px_rgba(0,240,255,0.5)]" />
          </div>

          <h1 className="text-xl sm:text-4xl font-black tracking-wider uppercase bg-gradient-to-r from-white via-cyan-200 to-yellow-300 bg-clip-text text-transparent">
            FENERBAHÇE SK
          </h1>
          <p className="text-[11px] sm:text-sm font-bold text-cyan-300 tracking-wide mt-0.5">
            17 Efsane Kadro • 36 Takımlı Yeni Lig • Münih Finali
          </p>

          <div className="w-full max-w-sm bg-[#00003c]/90 border border-cyan-400/50 rounded-xl p-2.5 my-3 shadow-xl text-left">
            <label className="text-[10px] font-black text-cyan-300 uppercase tracking-wider block mb-1">
              👤 Menajer Adı:
            </label>
            <input
              type="text"
              value={managerName}
              onChange={(e) => handleManagerNameChange(e.target.value)}
              placeholder="Adını yaz..."
              maxLength={20}
              className="w-full bg-slate-950 border border-cyan-500/50 px-2.5 py-1.5 rounded-lg text-xs text-yellow-300 font-bold focus:outline-none focus:border-yellow-400"
            />
          </div>

          <div className="grid grid-cols-4 gap-1.5 w-full max-w-md my-2 text-center">
            <div className="bg-[#000038]/80 border border-yellow-500/30 p-1.5 rounded-xl">
              <span className="text-[9px] text-slate-400 font-bold block">Kupa</span>
              <span className="text-sm sm:text-base font-black text-yellow-400">🏆 {careerStats.trophies}</span>
            </div>
            <div className="bg-[#000038]/80 border border-cyan-500/30 p-1.5 rounded-xl">
              <span className="text-[9px] text-slate-400 font-bold block">Gol (GMB)</span>
              <span className="text-sm sm:text-base font-black text-cyan-300">{careerStats.goalsScored} <span className="text-[8px] text-slate-400">({gmb})</span></span>
            </div>
            <div className="bg-[#000038]/80 border border-blue-500/30 p-1.5 rounded-xl">
              <span className="text-[9px] text-slate-400 font-bold block">Albüm</span>
              <span className="text-sm sm:text-base font-black text-emerald-400">%{albumPercentage}</span>
            </div>
            <div className="bg-[#000038]/80 border border-purple-500/30 p-1.5 rounded-xl">
              <span className="text-[9px] text-slate-400 font-bold block">Zirve OVR</span>
              <span className="text-sm sm:text-base font-black text-purple-300">{careerStats.maxOvr || "--"}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full justify-center max-w-sm mt-3">
            <button
              type="button"
              onClick={() => setMemoryMode((m) => !m)}
              className={`px-3 py-2.5 rounded-xl text-xs font-black border transition-all flex items-center justify-center gap-1 ${
                memoryMode ? "bg-purple-950 border-purple-400 text-purple-300" : "bg-slate-900 border-slate-750 text-slate-400"
              }`}
            >
              🧠 {memoryMode ? "Hafıza: Açık" : "Hafıza: Kapalı"}
            </button>

            <button
              type="button"
              onClick={() => setCurrentScreen("DRAFT")}
              className="flex-1 bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 text-slate-950 font-black text-xs sm:text-sm py-2.5 rounded-xl shadow-[0_0_20px_rgba(254,241,0,0.5)] active:scale-95 transition-all flex items-center justify-center gap-1.5 uppercase"
            >
              <OfficialUCLLogo className="w-4 h-4" /> Kadro Kur
            </button>
          </div>
        </main>

        <footer className="text-center text-[10px] text-slate-500 font-medium z-10 border-t border-cyan-500/10 pt-1.5 w-full max-w-4xl mx-auto flex justify-between shrink-0">
          <span>Fenerbahçe SK • UEFA Champions League Simulator</span>
          <span className="text-cyan-400 font-bold">Menajer: {managerName}</span>
        </footer>

        {/* MODAL: HAFTALIK GÖREVLER */}
        {isQuestsModalOpen && (
          <div className="fixed inset-0 z-50 bg-[#000028]/95 backdrop-blur-md flex items-center justify-center p-3">
            <div className="w-full max-w-md bg-[#00003c] border-2 border-emerald-400/70 rounded-2xl p-4 shadow-2xl flex flex-col text-left">
              <div className="flex justify-between items-center border-b border-emerald-500/30 pb-2 mb-3">
                <span className="text-sm font-black text-emerald-400 uppercase">🎯 Kadıköy Haftalık Hedefleri</span>
                <button type="button" onClick={() => setIsQuestsModalOpen(false)} className="text-slate-400 hover:text-white font-bold">✕</button>
              </div>

              <div className="space-y-2">
                {weeklyQuests.map((q) => {
                  const bestVal = bestQuestValues[q.progressKey] || 0;
                  const currentVal = Math.min(q.target, bestVal);
                  const isDone = currentVal >= q.target;
                  const pct = Math.min(100, Math.round((currentVal / q.target) * 100));

                  return (
                    <div key={q.id} className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-xs">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-white">{isDone ? "✅" : "📌"} {q.title}</span>
                        <span className={`font-black ${isDone ? "text-emerald-400" : "text-yellow-400"}`}>
                          {currentVal} / {q.target}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 mb-1.5">{q.desc}</p>
                      <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                        <div className={`h-full ${isDone ? "bg-emerald-400" : "bg-cyan-500"}`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* MODAL: KARİYER & ŞAMPİYONLAR MÜZESİ */}
        {isStatsModalOpen && (
          <div className="fixed inset-0 z-50 bg-[#000028]/95 backdrop-blur-md flex items-center justify-center p-3">
            <div className="w-full max-w-xl bg-[#00003c] border-2 border-yellow-400/70 rounded-2xl p-4 shadow-2xl flex flex-col max-h-[85vh] overflow-y-auto text-left">
              <div className="flex justify-between items-center border-b border-yellow-500/30 pb-2 mb-3">
                <span className="text-sm font-black text-yellow-400 uppercase">🏆 Kariyer & Müze ({managerName})</span>
                <button type="button" onClick={() => setIsStatsModalOpen(false)} className="text-slate-400 hover:text-white font-bold">✕</button>
              </div>

              <div className="grid grid-cols-4 gap-1.5 mb-3 text-center">
                <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                  <span className="text-[9px] text-slate-400 block">Galibiyet %</span>
                  <span className="text-xs font-black text-emerald-400">%{careerStats.matchesPlayed > 0 ? Math.round((careerStats.wins / careerStats.matchesPlayed) * 100) : 0}</span>
                </div>
                <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                  <span className="text-[9px] text-slate-400 block">Albüm</span>
                  <span className="text-xs font-black text-cyan-300">%{albumPercentage}</span>
                </div>
                <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                  <span className="text-[9px] text-slate-400 block">GMB</span>
                  <span className="text-xs font-black text-yellow-400">{gmb}</span>
                </div>
                <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                  <span className="text-[9px] text-slate-400 block">Kupalar</span>
                  <span className="text-xs font-black text-yellow-300">{careerStats.trophies}</span>
                </div>
              </div>

              <div className="border-t border-slate-800 pt-2">
                <span className="text-xs font-black text-yellow-400 block mb-2">🏛️ Şampiyon Kadrolar</span>
                {hallOfFame.length > 0 ? (
                  <div className="space-y-1.5 max-h-48 overflow-y-auto">
                    {hallOfFame.map((entry) => (
                      <div key={entry.id} className="bg-slate-950 p-2 rounded-lg border border-yellow-500/30 text-[11px]">
                        <div className="flex justify-between items-center text-yellow-400 font-bold">
                          <span>{entry.trophy}</span>
                          <span className="text-[9px] text-slate-400">{entry.date} • {entry.ovr} OVR</span>
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5 truncate">
                          {entry.formationName} | Yıldız: {entry.topScorerName} ({entry.topScorerGoals} Gol)
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <span className="text-slate-500 text-xs">Turnuvayı tamamlayarak ilk efsane kadronu müzeye ekle!</span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* MODAL: ŞEREF KÜRSÜSÜ (HAFTALIK / GÜNLÜK FİLTRELİ) */}
        {isLeaderboardOpen && (
          <div className="fixed inset-0 z-50 bg-[#000028]/95 backdrop-blur-md flex items-center justify-center p-3">
            <div className="w-full max-w-lg bg-[#00003c] border-2 border-cyan-400/70 rounded-2xl p-4 shadow-2xl flex flex-col max-h-[85vh] overflow-y-auto text-left">
              <div className="flex justify-between items-center border-b border-cyan-500/30 pb-2 mb-2.5">
                <div className="flex items-center gap-1.5">
                  <span className="text-lg">👑</span>
                  <h3 className="text-sm font-black text-cyan-400 uppercase">Kadıköy Şeref Kürsüsü</h3>
                </div>
                <button type="button" onClick={() => setIsLeaderboardOpen(false)} className="text-slate-400 hover:text-white font-bold">✕</button>
              </div>

              {/* Günlük & Haftalık Sekmeler */}
              <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 gap-1 mb-3">
                <button
                  type="button"
                  onClick={() => setLeaderboardTab("WEEKLY")}
                  className={`flex-1 py-1 text-xs font-black rounded-lg transition-all ${
                    leaderboardTab === "WEEKLY" ? "bg-cyan-500 text-slate-950" : "text-slate-400 hover:text-white"
                  }`}
                >
                  📅 Bu Hafta (Sıfırlanır)
                </button>
                <button
                  type="button"
                  onClick={() => setLeaderboardTab("DAILY")}
                  className={`flex-1 py-1 text-xs font-black rounded-lg transition-all ${
                    leaderboardTab === "DAILY" ? "bg-yellow-400 text-slate-950" : "text-slate-400 hover:text-white"
                  }`}
                >
                  ⚡ Bugün
                </button>
              </div>

              {filteredLeaderboard.length > 0 ? (
                <div className="space-y-1.5 max-h-72 overflow-y-auto pr-0.5">
                  {filteredLeaderboard
                    .sort((a, b) => (b.trophies - a.trophies) || (b.best_points - a.best_points) || (b.max_ovr - a.max_ovr))
                    .map((item, i) => {
                      const badge = i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `${i + 1}`;
                      return (
                        <div key={item.id || i} className="flex items-center justify-between p-2 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-black w-5 text-center">{badge}</span>
                            <div>
                              <span className="text-white font-bold block">{item.manager_name || "Kadıköy Fatihi"}</span>
                              <span className="text-[9px] text-slate-400">
                                {item.formation_name || "Dengeli"} • Zirve OVR: {item.max_ovr} • Lig Puanı: {item.best_points}P
                              </span>
                            </div>
                          </div>
                          <span className="text-yellow-400 font-black text-xs shrink-0">🏆 {item.trophies} Kupa</span>
                        </div>
                      );
                    })}
                </div>
              ) : (
                <div className="text-center py-6 text-slate-400 text-xs">
                  <p>Bu zaman aralığında henüz kayıt yok.</p>
                  <p className="mt-1 text-cyan-300">İlk turnuvayı bitir ve zirveye yerleş!</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  // =================================================================
  // EKRAN 2: HERO SAHA + KAYAR ALT ÇEKMECE (DRAFT EKRANI)
  // =================================================================
  return (
    <div className="h-[100dvh] max-h-[100dvh] bg-[#000028] text-white flex flex-col justify-between p-2 select-none font-sans relative overflow-hidden">
      {/* ÜST BİLGİ VE HABER BARI */}
      <div className="w-full max-w-xl mx-auto shrink-0 mb-1">
        <div className="bg-[#000030]/80 border border-cyan-500/30 rounded-lg px-2 py-0.5 flex items-center gap-1.5 overflow-hidden">
          <span className="bg-red-600 text-white text-[7.5px] font-black px-1 rounded animate-pulse shrink-0">HABER</span>
          <p className="text-[10px] text-cyan-200 font-bold truncate">{tickerEvents[tickerIndex]}</p>
        </div>
      </div>

      <header className="w-full max-w-xl mx-auto flex items-center justify-between border-b border-cyan-500/30 pb-1.5 mb-1 shrink-0">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setCurrentScreen("LANDING")}
            className="bg-[#00003c] border border-cyan-400 p-1 rounded-lg"
          >
            <OfficialFBCrest className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-xs font-black text-white flex items-center gap-1 uppercase">
              UCL <span className="text-[9px] bg-cyan-500 text-slate-950 px-1 py-0.2 rounded font-black">{managerName}</span>
            </h1>
            <span className="text-[8.5px] text-cyan-300 font-bold">ALBÜM: %{albumPercentage}</span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {filledCount === 11 && (
            <button
              type="button"
              onClick={() => setIsDuelModalOpen(true)}
              className="px-2 py-1 rounded-lg text-[10px] font-black bg-red-950 border border-red-500 text-red-300"
            >
              ⚔️ Düello
            </button>
          )}

          <button
            type="button"
            onClick={() => setMemoryMode((m) => !m)}
            className={`px-2 py-1 rounded-lg text-[10px] font-black border transition-all ${
              memoryMode ? "bg-purple-950 border-purple-400 text-purple-300" : "bg-slate-900 border-slate-750 text-slate-400"
            }`}
          >
            🧠 {memoryMode ? "Açık" : "Kapalı"}
          </button>

          <button
            type="button"
            onClick={() => safeAudio.toggleFb(setFbAudioActive)}
            className={`px-2 py-1 rounded-lg text-[10px] font-black border transition-all ${
              fbAudioActive ? "bg-yellow-950 border-yellow-400 text-yellow-300" : "bg-slate-900 border-slate-750 text-slate-400"
            }`}
          >
            🎺 FB
          </button>

          <div className="bg-[#00003c] border border-cyan-400/50 px-2 py-0.5 rounded-lg text-center shrink-0">
            <span className="text-[7.5px] text-cyan-300 block font-bold leading-none">OVR</span>
            <span className="text-sm font-black text-yellow-400 leading-none">{memoryMode ? "??.?" : teamOvr}</span>
          </div>
        </div>
      </header>

      {/* DİZİLİŞ ŞERİDİ */}
      <div className="w-full max-w-xl mx-auto flex items-center justify-between bg-[#030922] border border-cyan-900/60 rounded-xl px-2 py-1 mb-1 shrink-0">
        <span className="text-[10px] font-black text-cyan-400 uppercase flex items-center gap-1">
          <OfficialUCLLogo className="w-3.5 h-3.5" /> {activeFormation.name}
        </span>

        <div className="flex gap-1 overflow-x-auto">
          {FORMATIONS.map((form) => (
            <button
              key={form.id}
              type="button"
              onClick={() => handleFormationChange(form)}
              className={`px-2 py-0.5 rounded-lg text-[9px] font-black transition-all shrink-0 ${
                activeFormation.id === form.id ? "bg-cyan-500 text-slate-950 font-black" : "bg-slate-900 text-slate-400"
              }`}
            >
              {form.name}
            </button>
          ))}
        </div>
      </div>

      {/* 1. HERO SAHA: TAM BOY VE FERAH (EKRANI KAPLAYAN ALAN) */}
      <div className="relative w-full max-w-xl mx-auto flex-1 bg-gradient-to-b from-[#082a1a] via-[#0e462a] to-[#082a1a] rounded-2xl border-2 border-white/20 shadow-2xl overflow-hidden select-none">
        <div className="absolute inset-0 pointer-events-none flex flex-col justify-between">
          <div className="w-36 h-12 border-b-2 border-x-2 border-white/20 mx-auto rounded-b-xl" />
          <div className="w-full border-t-2 border-white/20 flex items-center justify-center">
            <div className="w-24 h-24 -my-12 rounded-full border-2 border-white/20" />
          </div>
          <div className="w-36 h-12 border-t-2 border-x-2 border-white/20 mx-auto rounded-t-xl" />
        </div>

        {activeFormation.slots.map((slot) => {
          const item = lineup[slot.id];
          const isPulsing = pulsingSlots.includes(slot.id);

          return (
            <div
              key={slot.id}
              style={{ left: `${slot.x}%`, top: `${slot.y}%`, transform: "translate(-50%, -50%)" }}
              className="absolute z-20"
            >
              <button
                type="button"
                disabled={!isPulsing && !item}
                onClick={() => handlePlacePlayer(slot)}
                className={`w-11 h-11 sm:w-14 sm:h-14 rounded-full flex flex-col items-center justify-center border-2 transition-all duration-200 relative overflow-hidden ${
                  item
                    ? "bg-[#002d72] border-[#fef100] shadow-[0_0_15px_rgba(254,241,0,0.35)]"
                    : isPulsing
                    ? "bg-cyan-500/50 border-cyan-300 animate-pulse scale-110 cursor-pointer shadow-[0_0_20px_rgba(0,240,255,0.9)]"
                    : "bg-emerald-950/70 border-white/25 opacity-55 cursor-not-allowed"
                }`}
              >
                {item ? (
                  <div className="flex flex-col items-center justify-center w-full h-full relative">
                    <div className="absolute inset-0 opacity-25 flex items-center justify-center pointer-events-none">
                      <RetroFenerbahceKit colors={item.season.kitColors} className="w-8 h-8 sm:w-10 sm:h-10" />
                    </div>
                    <span className="text-[8px] sm:text-[9.5px] font-black text-yellow-300 leading-none z-10">
                      {memoryMode ? "?" : item.effectiveRating}
                    </span>
                    <span className="text-[7px] sm:text-[8px] font-bold text-white truncate max-w-[38px] leading-tight z-10">
                      {item.player.name.split(" ").slice(-1)[0]}
                    </span>
                    <span className="text-[6px] text-blue-200 font-semibold leading-none z-10">{slot.label}</span>
                  </div>
                ) : (
                  <>
                    <span className="text-[9px] font-black text-white/90 leading-tight">{slot.label}</span>
                    <span className="text-[6px] text-white/50 font-medium leading-none">BOŞ</span>
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* ALT KONTROL BARI (PARMAK HİZASI) */}
      <div className="w-full max-w-xl mx-auto flex items-center justify-between gap-2 mt-1.5 pt-1.5 border-t border-cyan-500/20 shrink-0">
        <button
          type="button"
          onClick={() => {
            clearAllSimTimers();
            setLineup({});
            setDraftedNames([]);
            setCurrentSeason(null);
            setSelectedPlayer(null);
            setIsDrawerOpen(false);
            setPassJokers(1);
            setPlayerGoalCounts({});
          }}
          className="text-xs font-bold text-red-400 bg-red-950/60 border border-red-900 px-3 py-2 rounded-xl"
        >
          🗑️
        </button>

        {filledCount === 11 ? (
          <button
            type="button"
            onClick={handleStartDrawCeremony}
            className="flex-1 bg-gradient-to-r from-cyan-400 via-yellow-400 to-amber-500 text-slate-950 font-black py-2.5 rounded-xl text-xs sm:text-sm shadow-[0_0_20px_rgba(0,240,255,0.7)] active:scale-95 animate-pulse flex items-center justify-center gap-1.5 uppercase"
          >
            <OfficialUCLLogo className="w-4 h-4" /> Kura Çekimine Başla ➔
          </button>
        ) : currentSeason ? (
          <button
            type="button"
            onClick={() => setIsDrawerOpen(true)}
            className="flex-1 bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-950 font-black py-2.5 rounded-xl text-xs active:scale-95 shadow-lg flex items-center justify-center gap-2"
          >
            <span>📋 {currentSeason.season} Oyuncu Seç ({filledCount}/11)</span>
          </button>
        ) : (
          <button
            type="button"
            disabled={isRolling}
            onClick={handleRollDice}
            className="flex-1 bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 text-slate-950 font-black py-2.5 rounded-xl text-xs active:scale-95 shadow-lg flex items-center justify-center gap-2 disabled:opacity-40"
          >
            <span>🎲 Sezon Zarı At ({filledCount}/11)</span>
          </button>
        )}
      </div>

      {/* 2. KAYAR ALT ÇEKMECE (BOTTOM SHEET MODAL) */}
      {isDrawerOpen && currentSeason && (
        <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm flex flex-col justify-end animate-in fade-in duration-200">
          <div className="w-full max-w-xl mx-auto bg-[#00003c] border-t-2 border-yellow-400 rounded-t-3xl p-3 shadow-2xl flex flex-col max-h-[62vh] animate-in slide-in-from-bottom duration-300">
            {/* Çekmece Başlığı ve Sezon Kartı */}
            <div className="flex justify-between items-center border-b border-blue-950 pb-2 mb-2">
              <div className="flex items-center gap-2">
                <RetroFenerbahceKit colors={currentSeason.kitColors} className="w-8 h-8" />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-yellow-400 font-black text-sm">{currentSeason.season}</span>
                    <span className="text-[8px] bg-blue-950 text-cyan-300 px-1 rounded border border-blue-800 font-bold">{currentSeason.fifaEdition}</span>
                  </div>
                  <p className="text-[10px] text-slate-300 font-bold leading-none">{currentSeason.eraBadgeText}</p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={passJokers <= 0}
                  onClick={() => {
                    setPassJokers((j) => j - 1);
                    setIsDrawerOpen(false);
                    setIsRolling(true);
                  }}
                  className="bg-amber-950/60 border border-amber-500/60 text-amber-300 text-[10px] font-black px-2 py-1 rounded-lg disabled:opacity-30"
                >
                  🎲 Pas ({passJokers})
                </button>
                <button
                  type="button"
                  onClick={() => setIsDrawerOpen(false)}
                  className="text-slate-400 hover:text-white text-base font-bold px-1.5"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Mevki Sekmeleri */}
            <div className="flex bg-slate-900 rounded-lg p-0.5 border border-slate-750 text-[9.5px] font-bold overflow-x-auto mb-2 shrink-0">
              {(["ALL", "DEF", "MID", "AMC", "ATT", "GK"] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setCardFilter(tab)}
                  className={`flex-1 py-1 rounded transition-colors whitespace-nowrap ${
                    cardFilter === tab ? "bg-[#002d72] text-[#fef100]" : "text-slate-400 hover:text-white"
                  }`}
                >
                  {tab === "ALL" ? "Tümü" : tab === "DEF" ? "Def" : tab === "MID" ? "Mer" : tab === "AMC" ? "10 No" : tab === "ATT" ? "Hüc" : "Kaleci"}
                </button>
              ))}
            </div>

            {/* Oyuncu Kartları Listesi */}
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5 overflow-y-auto pr-0.5 flex-1">
              {currentSeason.players
                .filter((p) => {
                  if (cardFilter === "ALL") return true;
                  if (cardFilter === "GK") return p.positions.includes("GK");
                  if (cardFilter === "DEF") return p.positions.some((pos) => ["CB", "RB", "LB", "LWB", "RWB"].includes(pos));
                  if (cardFilter === "MID") return p.positions.some((pos) => ["CM", "CDM", "LM", "RM"].includes(pos));
                  if (cardFilter === "AMC") return p.positions.some((pos) => ["CAM", "AMC"].includes(pos));
                  if (cardFilter === "ATT") return p.positions.some((pos) => ["ST", "CF", "RW", "LW"].includes(pos));
                  return true;
                })
                .map((player) => {
                  const avail = getAvailableSlots(player);
                  const isSelectable = avail.length > 0;
                  const isSelected = selectedPlayer?.id === player.id;

                  return (
                    <button
                      key={player.id}
                      type="button"
                      disabled={!isSelectable}
                      onClick={() => {
                        setSelectedPlayer(isSelected ? null : player);
                        // Seçildiği anda çekmeceyi küçültüp sahayı göster
                        setIsDrawerOpen(false);
                      }}
                      className={`p-2 rounded-xl border text-left flex flex-col justify-between transition-all ${
                        isSelected
                          ? "bg-yellow-500/30 border-yellow-400 ring-2 ring-yellow-400"
                          : isSelectable
                          ? "bg-[#001f54] border-blue-900/80 active:scale-95"
                          : "bg-slate-950/70 border-slate-900 opacity-20 cursor-not-allowed"
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <span className="text-xs font-black text-yellow-400">{memoryMode ? "?" : player.fifaRating}</span>
                        <div className="flex gap-0.5">
                          {player.positions.slice(0, 2).map((pos) => (
                            <span key={pos} className="text-[7.5px] px-1 rounded bg-blue-950 text-blue-200 border border-blue-800">{pos}</span>
                          ))}
                        </div>
                      </div>
                      <div className="text-[11px] font-bold text-white truncate mt-1">{player.name}</div>
                    </button>
                  );
                })}
            </div>
          </div>
        </div>
      )}

      {/* SEZON ZARI ANİMASYONU */}
      {isRolling && (
        <FastSnappyWheelModal
          seasons={EXTENDED_SEASONS_DATA}
          onFinish={(season) => {
            setCurrentSeason(season);
            setIsRolling(false);
            setIsDrawerOpen(true); // Zar bitince çekmeceyi otomatik aç
          }}
        />
      )}

      {/* MODAL: DÜELLO */}
      {isDuelModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#000028]/95 backdrop-blur-md flex items-center justify-center p-3">
          <div className="w-full max-w-md bg-[#00003c] border-2 border-red-500/70 rounded-2xl p-4 shadow-2xl flex flex-col text-left">
            <div className="flex justify-between items-center border-b border-red-500/30 pb-2 mb-3">
              <span className="text-sm font-black text-red-400 uppercase">⚔️ Kadıköy Düellosu</span>
              <button type="button" onClick={() => { setIsDuelModalOpen(false); setDuelResult(null); }} className="text-slate-400 hover:text-white font-bold">✕</button>
            </div>

            <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 mb-2.5">
              <span className="text-[10px] font-bold text-slate-300 block mb-1">📋 Senin Kadro Kodun:</span>
              <div className="flex gap-1.5">
                <input
                  type="text"
                  readOnly
                  value={generateSquadShareCode()}
                  className="w-full bg-slate-900 border border-slate-700 px-2 py-1 rounded text-xs text-yellow-300 font-mono select-all truncate"
                />
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(generateSquadShareCode());
                    setCopiedCodeNotice(true);
                    setTimeout(() => setCopiedCodeNotice(false), 2000);
                  }}
                  className="bg-yellow-400 text-slate-950 font-black px-2.5 py-1 rounded text-xs shrink-0"
                >
                  {copiedCodeNotice ? "Tamam!" : "Kopyala"}
                </button>
              </div>
            </div>

            <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 mb-2.5">
              <span className="text-[10px] font-bold text-slate-300 block mb-1">🎮 Arkadaşının Kadro Kodu:</span>
              <textarea
                value={duelInputCode}
                onChange={(e) => setDuelInputCode(e.target.value)}
                placeholder="Kodu buraya yapıştır..."
                rows={2}
                className="w-full bg-slate-900 border border-slate-700 p-1.5 rounded text-xs text-white font-mono mb-2"
              />
              <button
                type="button"
                onClick={handlePlayDuel}
                className="w-full bg-gradient-to-r from-red-600 to-amber-600 text-white font-black py-2 rounded-xl text-xs"
              >
                Kapış ➔
              </button>
            </div>

            {duelResult && (
              <div className="bg-[#000020] border-2 border-yellow-400 p-3 rounded-xl text-center">
                <div className="flex justify-around items-center">
                  <div>
                    <span className="text-xs font-bold text-white block">Senin 11'in</span>
                    <span className="text-2xl font-black text-yellow-400">{duelResult.userScore}</span>
                  </div>
                  <span className="text-slate-500 font-bold">-</span>
                  <div>
                    <span className="text-xs font-bold text-white block">{duelResult.oppManager}</span>
                    <span className="text-2xl font-black text-yellow-400">{duelResult.oppScore}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* EKRAN 3: KURA ÇEKİMİ MODALI                                   */}
      {/* ============================================================= */}
      {currentScreen === "DRAW" && (
        <div className="fixed inset-0 z-50 bg-[#000028]/95 backdrop-blur-md flex flex-col items-center justify-center p-3">
          <div className="w-full max-w-4xl bg-[#00003c] border-2 border-cyan-400/60 rounded-2xl p-3 sm:p-5 shadow-2xl flex flex-col max-h-[92dvh]">
            <div className="flex justify-between items-center border-b border-cyan-500/30 pb-2 mb-2">
              <div className="flex items-center gap-1.5">
                <OfficialUCLLogo className="w-5 h-5" />
                <h3 className="text-sm sm:text-base font-black text-cyan-400 uppercase">Lig Kura Çekimi</h3>
              </div>
              {isDrawingAnimation && (
                <button
                  type="button"
                  onClick={handleSkipDrawAnimation}
                  className="bg-yellow-400 text-slate-950 font-black px-3 py-1 rounded-lg text-xs"
                >
                  ⚡ HIZLI GEÇ
                </button>
              )}
            </div>

            <div className="bg-[#000020] border border-yellow-400 py-1.5 px-3 rounded-xl text-center mb-2">
              <span className={`text-xs sm:text-sm font-black ${isDrawingAnimation ? "text-yellow-300 animate-pulse" : "text-cyan-300"}`}>
                {flashingName}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 flex-1 overflow-y-auto mb-2 pr-0.5">
              {[1, 2, 3, 4].map((potNum) => (
                <div key={potNum} className="bg-slate-950/80 border border-blue-900 rounded-xl p-2 flex flex-col">
                  <span className="text-[10px] font-black text-yellow-400 mb-1 pb-0.5 border-b border-blue-900/50">{potNum}. TORBA</span>
                  <div className="space-y-1 flex-1">
                    {UCL_36_POTS.filter((c) => c.pot === potNum).map((c) => {
                      const drawn = fixtures.find((f) => f.opponent.id === c.id);
                      const isDrawn = !!drawn && (!isDrawingAnimation || drawStep >= drawn.matchday);
                      return (
                        <div
                          key={c.id}
                          className={`p-1 rounded text-[11px] flex items-center justify-between border ${
                            c.id === "fb"
                              ? "bg-yellow-500/20 border-yellow-400 text-yellow-300 font-bold"
                              : isDrawn
                              ? "bg-blue-950 border-cyan-400 text-white font-bold"
                              : "bg-slate-900/40 border-slate-800 text-slate-500"
                          }`}
                        >
                          <div className="flex items-center gap-1 truncate">
                            <ClubLogo club={c} className="w-4 h-4 shrink-0" />
                            <span className="truncate">{c.name}</span>
                          </div>
                          {isDrawn && <span className="text-[8px] bg-cyan-500 text-slate-950 px-1 rounded font-black">{drawn?.isHome ? "EV" : "DEP"}</span>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {!isDrawingAnimation && (
              <button
                type="button"
                onClick={() => setCurrentScreen("LEAGUE")}
                className="w-full bg-gradient-to-r from-cyan-400 to-yellow-400 text-slate-950 font-black py-2.5 rounded-xl text-xs shadow-lg uppercase"
              >
                Lige Başla ➔
              </button>
            )}
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* EKRAN 4: İSVİÇRE LİGİ VE CANLI MAÇ (DÜZELTİLDİ: SIFIRLANAN SKOR) */}
      {/* ============================================================= */}
      {currentScreen === "LEAGUE" && (
        <div className="fixed inset-0 z-50 bg-[#000028]/95 backdrop-blur-md flex flex-col items-center justify-center p-3">
          <div className="w-full max-w-4xl bg-[#00003c] border-2 border-cyan-400/50 rounded-2xl p-3 sm:p-5 shadow-2xl flex flex-col max-h-[92dvh]">
            <div className="flex justify-between items-center border-b border-cyan-500/30 pb-2 mb-2">
              <div className="flex items-center gap-2">
                <OfficialUCLLogo className="w-5 h-5" />
                <div>
                  <span className="text-cyan-400 font-black text-xs sm:text-sm uppercase block">UEFA Champions League</span>
                  <span className="text-[9.5px] text-slate-400">
                    {leagueFinished ? "Lig Tamamlandı" : `Hafta ${currentFixtureIndex + 1} / ${fixtures.length}`}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                {!leagueFinished && (
                  <div className="flex items-center bg-slate-900 p-0.5 rounded-lg border border-slate-750">
                    {([1, 2, 5, 100] as const).map((spd) => (
                      <button
                        key={spd}
                        type="button"
                        onClick={() => setSimSpeed(spd)}
                        className={`px-1.5 py-0.5 rounded text-[9px] font-black ${
                          simSpeed === spd ? "bg-cyan-500 text-slate-950" : "text-slate-400 hover:text-white"
                        }`}
                      >
                        {spd === 100 ? "Hızlı" : `${spd}x`}
                      </button>
                    ))}
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => { clearAllSimTimers(); setCurrentScreen("DRAFT"); }}
                  className="text-slate-400 hover:text-white text-base px-1"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Skor Paneli */}
            {!leagueFinished && fixtures[currentFixtureIndex] && (
              <div className="bg-[#000020] border-y-2 border-cyan-400 py-2.5 px-3 rounded-xl mb-2.5 shadow-xl shrink-0">
                {(() => {
                  const fix = fixtures[currentFixtureIndex];
                  const isFbHome = fix.isHome;
                  const homeName = isFbHome ? "Fenerbahçe SK" : fix.opponent.name;
                  const awayName = isFbHome ? fix.opponent.name : "Fenerbahçe SK";
                  const homeClub = isFbHome
                    ? { shortName: "FB", primaryColor: "#002d72", secondaryColor: "#fef100", id: "fb", logoUrl: "https://crests.football-data.org/613.png" }
                    : fix.opponent;
                  const awayClub = isFbHome
                    ? fix.opponent
                    : { shortName: "FB", primaryColor: "#002d72", secondaryColor: "#fef100", id: "fb", logoUrl: "https://crests.football-data.org/613.png" };
                  const homeRating = isFbHome ? teamOvr : fix.opponent.rating;
                  const awayRating = isFbHome ? fix.opponent.rating : teamOvr;

                  return (
                    <div>
                      <div className="flex items-center justify-between gap-1">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <ClubLogo club={homeClub} className="w-7 h-7 sm:w-8 sm:h-8 shrink-0" />
                          <div className="truncate">
                            <span className="text-xs sm:text-sm font-black text-white block truncate">{homeName}</span>
                            <span className="text-[9px] text-cyan-300 font-bold block truncate">({memoryMode ? "?" : homeRating})</span>
                          </div>
                        </div>

                        <div className="bg-[#00003c] px-3 py-1 rounded-xl border border-cyan-400 flex items-center gap-2 shrink-0">
                          <span className="text-xl sm:text-2xl font-black text-white">{homeLiveGoals}</span>
                          <span className="text-cyan-500 font-bold">-</span>
                          <span className="text-xl sm:text-2xl font-black text-white">{awayLiveGoals}</span>
                          <span className="text-[9.5px] font-black text-cyan-400 border-l border-blue-900 pl-2">
                            {isHalftime ? "DVR" : matchState === "PLAYING" ? `${matchMin}'` : matchState === "FINISHED" ? "BİTTİ" : "0'"}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 flex-1 min-w-0 justify-end text-right">
                          <div className="truncate">
                            <span className="text-xs sm:text-sm font-black text-white block truncate">{awayName}</span>
                            <span className="text-[9px] text-cyan-300 font-bold block truncate">({memoryMode ? "?" : awayRating})</span>
                          </div>
                          <ClubLogo club={awayClub} className="w-7 h-7 sm:w-8 sm:h-8 shrink-0" />
                        </div>
                      </div>

                      <div className="mt-1 pt-1 border-t border-blue-900/50 flex justify-between text-[10px] min-h-[16px]">
                        <div className="text-yellow-400 font-bold truncate mr-2">
                          {liveGoalScorers.filter((s) => s.isHome).map((s, i) => (
                            <span key={i} className="mr-1.5">⚽ {s.minute}' {s.name}</span>
                          ))}
                        </div>
                        <div className="text-cyan-300 font-medium text-right truncate">
                          {liveGoalScorers.filter((s) => !s.isHome).map((s, i) => (
                            <span key={i} className="ml-1.5">⚽ {s.minute}' {s.name}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* Fikstür ve Puan Durumu Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 flex-1 overflow-y-auto mb-2 pr-0.5">
              <div className="border border-cyan-900/60 rounded-xl p-2 bg-slate-950/50 max-h-52 overflow-y-auto">
                <span className="text-[10px] font-black text-cyan-300 mb-1 block">FİKSTÜR</span>
                <div className="space-y-1">
                  {fixtures.map((f, idx) => (
                    <div
                      key={idx}
                      className={`p-1.5 rounded-lg border text-[10.5px] flex justify-between items-center ${
                        idx === currentFixtureIndex && !leagueFinished
                          ? "bg-[#001f54] border-cyan-400"
                          : f.played
                          ? "bg-slate-900/40 border-slate-800"
                          : "bg-slate-900/20 border-slate-900 text-slate-500"
                      }`}
                    >
                      <span className="truncate max-w-[140px] font-bold">
                        H{f.matchday} {f.isHome ? "Fenerbahçe" : f.opponent.shortName} vs {f.isHome ? f.opponent.shortName : "Fenerbahçe"}
                      </span>
                      <span className={f.played ? "text-yellow-400 font-black" : "text-slate-500"}>
                        {f.played ? `${f.isHome ? f.fbScore : f.oppScore} - ${f.isHome ? f.oppScore : f.fbScore}` : "Bekliyor"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border border-cyan-900/60 rounded-xl max-h-52 overflow-y-auto">
                <table className="w-full text-left text-[10.5px]">
                  <thead className="bg-[#000020] text-cyan-300 sticky top-0 font-bold">
                    <tr>
                      <th className="p-1">#</th>
                      <th className="p-1">Kulüp</th>
                      <th className="p-1">O</th>
                      <th className="p-1">G</th>
                      <th className="p-1">Av</th>
                      <th className="p-1 font-black">P</th>
                    </tr>
                  </thead>
                  <tbody>
                    {swissTable.map((row, idx) => (
                      <tr
                        key={row.id}
                        className={`border-b border-blue-950/70 ${
                          row.id === "fb"
                            ? "bg-yellow-500/25 font-black text-yellow-300"
                            : idx < 8
                            ? "bg-cyan-950/20 font-bold text-cyan-200"
                            : "opacity-60"
                        }`}
                      >
                        <td className="p-1">{idx + 1}</td>
                        <td className="p-1 truncate max-w-[110px]">{row.name}</td>
                        <td className="p-1">{row.played}</td>
                        <td className="p-1">{row.won}</td>
                        <td className="p-1">{row.gd}</td>
                        <td className="p-1 font-black text-cyan-300">{row.points}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Düzeltme 2: Tek tıkla sonraki maçı oyna butonu */}
            <div className="pt-2 border-t border-cyan-500/20 flex justify-end shrink-0">
              {!leagueFinished ? (
                matchState === "FINISHED" ? (
                  <button
                    type="button"
                    onClick={proceedAndPlayNextFixture}
                    className="w-full sm:w-auto bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-950 font-black px-6 py-2.5 rounded-xl text-xs active:scale-95 shadow-lg animate-pulse"
                  >
                    Sonraki Maçı Oyna (Hafta {currentFixtureIndex + 2}) ➔
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={matchState === "PLAYING"}
                    onClick={() => playFixtureAtIndex(currentFixtureIndex)}
                    className="w-full sm:w-auto bg-cyan-500 text-slate-950 font-black px-6 py-2.5 rounded-xl text-xs active:scale-95 disabled:opacity-40"
                  >
                    {matchState === "PLAYING" ? "Oynanıyor..." : `Hafta ${currentFixtureIndex + 1} Maçını Oyna`}
                  </button>
                )
              ) : isEliminatedInLeague ? (
                <button
                  type="button"
                  onClick={() => {
                    clearAllSimTimers();
                    setCampaignTrophy(`Lig Aşaması (${userRank}. Sıra)`);
                    recordTrophyInHallOfFame(`Lig Aşaması (${userRank}. Sıra)`);
                    simulateRestOfTournament(bracketMatches);
                    setCurrentScreen("SUMMARY");
                  }}
                  className="w-full sm:w-auto bg-red-500 text-white font-black px-6 py-2 rounded-xl text-xs"
                >
                  Elendiniz • Raporu Gör
                </button>
              ) : bracketMatches.length > 0 ? (
                <button
                  type="button"
                  onClick={() => setCurrentScreen("BRACKET")}
                  className="w-full sm:w-auto bg-yellow-400 text-slate-950 font-black px-6 py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5"
                >
                  <OfficialUCLLogo className="w-4 h-4" /> Eleme Ağacına Dön
                </button>
              ) : (
                <button
                  type="button"
                  onClick={setupRealUclBracket}
                  className="w-full sm:w-auto bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-950 font-black px-6 py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-xl animate-pulse"
                >
                  <OfficialUCLLogo className="w-4 h-4" />
                  {isDirectR16 ? "Son 16 Turuna İlerle ➔" : "Play-Off Turuna İlerle ➔"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* EKRAN 5: ELEME TURLARI VE BRACKET MAÇ EKRANI                   */}
      {/* ============================================================= */}
      {currentScreen === "BRACKET" && (
        <div className="fixed inset-0 z-50 bg-[#000028]/95 backdrop-blur-md flex flex-col items-center justify-center p-3">
          <div className="w-full max-w-4xl bg-[#00003c] border-2 border-cyan-400/50 rounded-2xl p-3 sm:p-5 shadow-2xl flex flex-col max-h-[92dvh]">
            <div className="flex justify-between items-center border-b border-cyan-500/30 pb-2 mb-2">
              <div className="flex items-center gap-1.5">
                <OfficialUCLLogo className="w-5 h-5" />
                <span className="text-cyan-400 font-black text-xs sm:text-sm uppercase">
                  {activeBracketMatch?.stageTitle || "Eleme Turları"}
                </span>
              </div>
              <button
                type="button"
                onClick={() => { clearAllSimTimers(); setCurrentScreen("LEAGUE"); }}
                className="text-slate-400 hover:text-white text-xs font-bold border border-slate-700 px-2 py-0.5 rounded"
              >
                Lig Tablosu
              </button>
            </div>

            {/* Skor Paneli */}
            {activeBracketMatch && activeBracketHome && activeBracketAway && (
              <div className="bg-[#000020] border-y-2 border-cyan-400 py-2.5 px-3 rounded-xl mb-2.5 shadow-xl shrink-0">
                <div className="flex items-center justify-between gap-1">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <ClubLogo club={activeBracketHome} className="w-7 h-7 sm:w-8 sm:h-8 shrink-0" />
                    <span className="text-xs sm:text-sm font-black text-white truncate">{activeBracketHome.name}</span>
                  </div>

                  <div className="bg-[#00003c] px-3 py-1 rounded-xl border border-cyan-400 flex items-center gap-2 shrink-0">
                    <span className="text-xl sm:text-2xl font-black text-white">{homeLiveGoals}</span>
                    <span className="text-cyan-500 font-bold">-</span>
                    <span className="text-xl sm:text-2xl font-black text-white">{awayLiveGoals}</span>
                    <span className="text-[9.5px] font-black text-cyan-400 border-l border-blue-900 pl-2">
                      {bracketMatchState === "PENALTIES" ? "PEN" : bracketMatchState === "PLAYING" ? `${matchMin}'` : bracketMatchState === "FINISHED" ? "BİTTİ" : "0'"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 flex-1 min-w-0 justify-end text-right">
                    <span className="text-xs sm:text-sm font-black text-white truncate">{activeBracketAway.name}</span>
                    <ClubLogo club={activeBracketAway} className="w-7 h-7 sm:w-8 sm:h-8 shrink-0" />
                  </div>
                </div>

                {livePenaltyStatus && (
                  <div className="mt-2 text-center text-xs font-bold text-yellow-300">
                    {livePenaltyStatus.text}
                  </div>
                )}
              </div>
            )}

            {/* Maç Kartları */}
            <div className="flex-1 overflow-y-auto grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2 pr-0.5">
              {bracketMatches.map((m) => (
                <div
                  key={m.id}
                  className={`p-2 rounded-xl border text-[11px] flex flex-col justify-between ${
                    m.isUserMatch ? "bg-blue-950 border-cyan-400 ring-1 ring-cyan-400" : "bg-slate-900/60 border-slate-800"
                  }`}
                >
                  <div className="space-y-1 font-bold">
                    <div className="flex justify-between items-center">
                      <span className={m.teamHome.isUser ? "text-yellow-400 truncate" : "truncate"}>{m.teamHome.name}</span>
                      <span>{m.leg1.played ? m.leg1.homeScore : "-"} {m.leg2?.played ? `(${m.leg2.awayScore})` : ""}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className={m.teamAway.isUser ? "text-yellow-400 truncate" : "truncate"}>{m.teamAway.name}</span>
                      <span>{m.leg1.played ? m.leg1.awayScore : "-"} {m.leg2?.played ? `(${m.leg2.homeScore})` : ""}</span>
                    </div>
                  </div>
                  {m.winnerName && <span className="text-[9px] text-emerald-400 mt-1 font-black">Geçti: {m.winnerName}</span>}
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-cyan-500/20 flex justify-end shrink-0">
              {activeBracketMatch && bracketLeg === 1 && activeBracketMatch.stage !== "FINAL" && bracketMatchState === "FINISHED" && (
                <button
                  type="button"
                  onClick={advanceBracketRound}
                  className="bg-yellow-400 text-slate-950 font-black px-6 py-2 rounded-xl text-xs"
                >
                  Rövanş Maçı ➔
                </button>
              )}

              {activeBracketMatch && (bracketLeg === 2 || activeBracketMatch.stage === "FINAL") && bracketMatchState === "FINISHED" && activeBracketMatch.winnerId === "fb" && (
                <button
                  type="button"
                  onClick={advanceBracketRound}
                  className="bg-emerald-400 text-slate-950 font-black px-6 py-2 rounded-xl text-xs animate-bounce"
                >
                  {activeBracketMatch.stage === "FINAL" ? "Kupa Töreni" : "Sonraki Tur ➔"}
                </button>
              )}

              {activeBracketMatch && (bracketLeg === 2 || activeBracketMatch.stage === "FINAL") && bracketMatchState === "FINISHED" && activeBracketMatch.winnerId !== "fb" && (
                <button
                  type="button"
                  onClick={() => {
                    clearAllSimTimers();
                    setCampaignTrophy(`${activeBracketMatch.stageTitle} Aşamasında Veda`);
                    recordTrophyInHallOfFame(`${activeBracketMatch.stageTitle} Aşamasında Veda`);
                    simulateRestOfTournament(bracketMatches);
                    setCurrentScreen("SUMMARY");
                  }}
                  className="bg-red-500 text-white font-black px-6 py-2 rounded-xl text-xs"
                >
                  Elendiniz • Raporu Gör
                </button>
              )}

              {activeBracketMatch && bracketMatchState === "IDLE" && (
                <button
                  type="button"
                  onClick={playLiveBracketLeg}
                  className="bg-cyan-400 text-slate-950 font-black px-6 py-2 rounded-xl text-xs"
                >
                  {activeBracketMatch.stage === "FINAL" ? "Finali Oyna" : bracketLeg === 1 ? "1. Maçı Oyna" : "Rövanşı Oyna"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* EKRAN 6: SEZON SONU ÖZETİ (SUMMARY CARD)                       */}
      {/* ============================================================= */}
      {currentScreen === "SUMMARY" && (
        <div className="fixed inset-0 z-50 bg-[#000028]/95 backdrop-blur-md flex flex-col items-center justify-center p-3">
          <div className="w-full max-w-sm bg-gradient-to-b from-[#002d72] via-[#00003c] to-[#01091a] border-2 border-yellow-400 rounded-2xl p-4 text-center shadow-2xl flex flex-col items-center my-auto max-h-[92dvh] overflow-y-auto">
            <OfficialFBCrest className="w-16 h-16 mb-1 drop-shadow-[0_0_15px_rgba(254,241,0,0.6)]" />

            <h2 className="text-lg font-black text-white uppercase tracking-wider">FENERBAHÇE SK</h2>
            <p className="text-[11px] text-yellow-300 font-bold mb-2">Menajer: {managerName}</p>

            <div className="w-full bg-slate-950/85 border border-yellow-500/40 rounded-xl p-3 mb-2.5 text-left space-y-1.5 text-xs">
              <div className="flex justify-between items-center pb-1 border-b border-blue-950">
                <span className="text-slate-400">Sonuç:</span>
                <span className="font-black text-yellow-400">{campaignTrophy}</span>
              </div>

              {tournamentWinner && (
                <div className="flex justify-between items-center pb-1 border-b border-blue-950">
                  <span className="text-slate-400">Turnuva Şampiyonu:</span>
                  <span className="font-black text-emerald-400">🏆 {tournamentWinner}</span>
                </div>
              )}

              <div className="flex justify-between items-center">
                <span className="text-slate-400">Kadro Gücü:</span>
                <span className="font-black text-cyan-300">{teamOvr} OVR</span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-400">Taktik:</span>
                <span className="font-bold text-white">{activeFormation.name}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-400">Lig Sıralaması:</span>
                <span className="font-bold text-white">{userRank}. Sıra</span>
              </div>

              <div className="pt-1.5 border-t border-yellow-500/30">
                <span className="text-yellow-400 font-black block mb-1">⚽ Gol Krallığı</span>
                {topScorersList.length > 0 ? (
                  <div className="space-y-0.5 max-h-16 overflow-y-auto">
                    {topScorersList.slice(0, 3).map(([name, goals], index) => (
                      <div key={name} className="flex justify-between text-[10.5px]">
                        <span className="text-white">{index + 1}. {name}</span>
                        <span className="text-yellow-400 font-black">{goals} Gol</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <span className="text-slate-400 text-[10px]">Gol atılamadı.</span>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={handleRestartCampaign}
              className="w-full bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-950 font-black py-2.5 rounded-xl text-xs uppercase tracking-wider"
            >
              Yeni Turnuva
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// =================================================================
// 5. HIZLI ÇARK BİLEŞENİ
// =================================================================
function FastSnappyWheelModal({
  seasons,
  onFinish,
}: {
  seasons: SeasonSquad[];
  onFinish: (s: SeasonSquad) => void;
}) {
  const [disp, setDisp] = useState<SeasonSquad>(seasons[0]);
  const wheelTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let frame = 0;
    const totalFrames = 15;
    let delay = 35;

    const loop = () => {
      frame++;
      const rand = seasons[Math.floor(Math.random() * seasons.length)];
      setDisp(rand);

      if (frame < totalFrames) {
        delay += 9;
        wheelTimerRef.current = setTimeout(loop, delay);
      } else {
        const chosen = seasons[Math.floor(Math.random() * seasons.length)];
        setDisp(chosen);
        wheelTimerRef.current = setTimeout(() => onFinish(chosen), 160);
      }
    };

    loop();

    return () => {
      if (wheelTimerRef.current) {
        clearTimeout(wheelTimerRef.current);
        wheelTimerRef.current = null;
      }
    };
  }, [seasons, onFinish]);

  return (
    <div className="fixed inset-0 z-50 bg-[#000028]/92 backdrop-blur-md flex items-center justify-center p-3">
      <div className="w-full max-w-xs bg-[#00003c] border-2 border-yellow-400 rounded-2xl p-4 text-center shadow-[0_0_40px_rgba(254,241,0,0.5)] flex flex-col items-center">
        <span className="text-[10px] font-black uppercase text-cyan-400 block mb-1">🎲 SEZON ZARI</span>
        <div className="w-full bg-[#000020] border-2 border-blue-900 rounded-xl py-3 px-2 my-2 flex flex-col items-center">
          <RetroFenerbahceKit colors={disp.kitColors} className="w-10 h-10 mb-1" />
          <span className="text-xl font-black text-yellow-400">{disp.season}</span>
          <span className="text-[11px] text-blue-200 font-semibold">{disp.eraBadgeText}</span>
        </div>
        <div className="text-[10px] text-slate-400">Sezon belirleniyor...</div>
      </div>
    </div>
  );
}
