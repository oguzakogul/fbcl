// =================================================================
// 1. TİPLER VE TAKTİK MODELLERİ
// =================================================================
export type AppScreen = "LANDING" | "DRAFT" | "DRAW" | "LEAGUE" | "BRACKET" | "SUMMARY";
export type TacticMentality = "DEFENSIVE" | "BALANCED" | "ATTACKING";

export interface FormationSlot {
  id: string;
  label: string;
  roleName: string;
  x: number;
  y: number;
  accepts: string[];
}

export interface Formation {
  id: string;
  name: string;
  mentality: TacticMentality;
  mentalityTitle: string;
  description: string;
  modifiers: { attackXgMult: number; defenseXgMult: number };
  slots: FormationSlot[];
}

export interface Player {
  id: string;
  name: string;
  positions: string[];
  fifaRating: number;
}

export interface SeasonSquad {
  id: string;
  season: string;
  tournament: string;
  fifaEdition: string;
  eraBadgeText: string;
  kitEraName: string;
  kitColors: { primary: string; secondary: string; stripe: string; collar: string };
  players: Player[];
}

export interface UCLClub {
  id: string;
  name: string;
  shortName: string;
  country: string;
  rating: number;
  pot: 1 | 2 | 3 | 4;
  logoUrl: string;
  primaryColor: string;
  secondaryColor: string;
  scorersPool: string[];
}

export interface FixtureMatch {
  matchday: number;
  opponent: UCLClub;
  isHome: boolean;
  played: boolean;
  fbScore?: number;
  oppScore?: number;
  scorers?: { minute: number; name: string; isFb: boolean }[];
}

export interface LeagueMatchdayMatch {
  homeClub: UCLClub;
  awayClub: UCLClub;
  homeScore: number;
  awayScore: number;
  played: boolean;
}

export interface SwissTableRow {
  id: string;
  name: string;
  shortName: string;
  country: string;
  logoUrl: string;
  rating: number;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  gf: number;
  ga: number;
  gd: number;
  points: number;
}

export interface BracketTeam {
  id: string;
  name: string;
  shortName: string;
  country?: string;
  rating: number;
  logoUrl: string;
  isUser: boolean;
}

export interface PenaltyShot {
  shooter: string;
  scored: boolean;
}

export interface BracketMatch {
  id: string;
  stage: "PLAYOFF" | "R16" | "QF" | "SF" | "FINAL";
  stageTitle: string;
  teamHome: BracketTeam;
  teamAway: BracketTeam;
  leg1: { homeScore: number; awayScore: number; played: boolean };
  leg2?: { homeScore: number; awayScore: number; played: boolean };
  extraTime?: boolean;
  penalties?: {
    homePens: number;
    awayPens: number;
    homeShots: PenaltyShot[];
    awayShots: PenaltyShot[];
  };
  winnerId?: string;
  winnerName?: string;
  isUserMatch: boolean;
}

export interface DraftedSlotData {
  player: Player;
  season: SeasonSquad;
  effectiveRating: number;
  isMainPosition: boolean;
}

export interface UserCareerStats {
  matchesPlayed: number;
  wins: number;
  draws: number;
  losses: number;
  goalsScored: number;
  goalsConceded: number;
  trophies: number;
  maxOvr: number;
  highestLeaguePoints: number;
}

export interface HallOfFameEntry {
  id: string;
  date: string;
  trophy: string;
  ovr: number;
  formationName: string;
  topScorerName: string;
  topScorerGoals: number;
  lineupList: { slotLabel: string; playerName: string; rating: number }[];
}

export interface DuelOpponentSquad {
  managerName: string;
  formationName: string;
  teamOvr: number;
  players: { slotLabel: string; playerName: string; rating: number }[];
}

// =================================================================
// 2. FORMASYONLAR VE TAKTİK ÇARPANLARI
// =================================================================
export const FORMATIONS: Formation[] = [
  {
    id: "5-3-2-kontra",
    name: "5-3-2 Kontra",
    mentality: "DEFENSIVE",
    mentalityTitle: "Defansif / Kontra",
    description: "3 Stoper, Kanat Bekler, Çift DMC ve AMC ile Ani Kontra",
    modifiers: { attackXgMult: 0.8, defenseXgMult: 0.65 },
    slots: [
      { id: "GK", label: "GK", roleName: "Kaleci", x: 50, y: 91, accepts: ["GK"] },
      { id: "DL", label: "LWB", roleName: "Sol Kanat Bek", x: 13, y: 65, accepts: ["LB", "LWB", "LM"] },
      { id: "DC1", label: "DC", roleName: "Sol Stoper", x: 31, y: 78, accepts: ["CB"] },
      { id: "DC2", label: "DC", roleName: "Merkez Stoper", x: 50, y: 80, accepts: ["CB"] },
      { id: "DC3", label: "DC", roleName: "Sağ Stoper", x: 69, y: 78, accepts: ["CB"] },
      { id: "DR", label: "RWB", roleName: "Sağ Kanat Bek", x: 87, y: 65, accepts: ["RB", "RWB", "RM"] },
      { id: "DMC1", label: "DMC", roleName: "Ön Libero", x: 38, y: 55, accepts: ["CDM", "CM"] },
      { id: "DMC2", label: "DMC", roleName: "Ön Libero", x: 62, y: 55, accepts: ["CDM", "CM"] },
      { id: "AMC", label: "AMC", roleName: "Kontra Beyni", x: 50, y: 36, accepts: ["CAM", "AMC", "CF", "CM"] },
      { id: "FC1", label: "FC", roleName: "Sol Santrfor", x: 38, y: 16, accepts: ["ST", "CF"] },
      { id: "FC2", label: "FC", roleName: "Sağ Santrfor", x: 62, y: 16, accepts: ["ST", "CF"] },
    ],
  },
  {
    id: "5-4-1-duvar",
    name: "5-4-1 Kadıköy Duvarı",
    mentality: "DEFENSIVE",
    mentalityTitle: "Katı Savunma",
    description: "5'li Hat ve Kalabalık Orta Saha ile Kalesini Gole Kapatan Düzen",
    modifiers: { attackXgMult: 0.65, defenseXgMult: 0.55 },
    slots: [
      { id: "GK", label: "GK", roleName: "Kaleci", x: 50, y: 91, accepts: ["GK"] },
      { id: "DL", label: "LWB", roleName: "Sol Bek", x: 13, y: 68, accepts: ["LB", "LWB"] },
      { id: "DC1", label: "DC", roleName: "Stoper", x: 31, y: 79, accepts: ["CB"] },
      { id: "DC2", label: "DC", roleName: "Stoper", x: 50, y: 81, accepts: ["CB"] },
      { id: "DC3", label: "DC", roleName: "Stoper", x: 69, y: 79, accepts: ["CB"] },
      { id: "DR", label: "RWB", roleName: "Sağ Bek", x: 87, y: 68, accepts: ["RB", "RWB"] },
      { id: "ML", label: "ML", roleName: "Sol Kanat", x: 18, y: 45, accepts: ["LM", "LW"] },
      { id: "MC1", label: "MC", roleName: "Orta Saha", x: 38, y: 50, accepts: ["CM", "CDM"] },
      { id: "MC2", label: "MC", roleName: "Orta Saha", x: 62, y: 50, accepts: ["CM", "CDM"] },
      { id: "MR", label: "MR", roleName: "Sağ Kanat", x: 82, y: 45, accepts: ["RM", "RW"] },
      { id: "FC", label: "FC", roleName: "Tek Forvet", x: 50, y: 18, accepts: ["ST", "CF"] },
    ],
  },
  {
    id: "4-2-3-1-kati",
    name: "4-2-3-1 Emniyetli",
    mentality: "DEFENSIVE",
    mentalityTitle: "Korumacı Blok",
    description: "Çift Çapa ile Sahayı Daraltan, AMC Destekli Emniyetli Kurgu",
    modifiers: { attackXgMult: 0.85, defenseXgMult: 0.75 },
    slots: [
      { id: "GK", label: "GK", roleName: "Kaleci", x: 50, y: 91, accepts: ["GK"] },
      { id: "DL", label: "DL", roleName: "Sol Bek", x: 14, y: 75, accepts: ["LB", "LWB"] },
      { id: "DC1", label: "DC", roleName: "Sol Stoper", x: 38, y: 78, accepts: ["CB"] },
      { id: "DC2", label: "DC", roleName: "Sağ Stoper", x: 62, y: 78, accepts: ["CB"] },
      { id: "DR", label: "DR", roleName: "Sağ Bek", x: 86, y: 75, accepts: ["RB", "RWB"] },
      { id: "DMC1", label: "DMC", roleName: "Ön Libero", x: 36, y: 59, accepts: ["CDM", "CM"] },
      { id: "DMC2", label: "DMC", roleName: "Ön Libero", x: 64, y: 59, accepts: ["CDM", "CM"] },
      { id: "ML", label: "ML", roleName: "Sol Kanat", x: 16, y: 40, accepts: ["LM", "LW"] },
      { id: "AMC", label: "AMC", roleName: "10 Numara", x: 50, y: 37, accepts: ["CAM", "AMC", "CM", "CF"] },
      { id: "MR", label: "MR", roleName: "Sağ Kanat", x: 84, y: 40, accepts: ["RM", "RW"] },
      { id: "FC", label: "FC", roleName: "Santrfor", x: 50, y: 16, accepts: ["ST", "CF"] },
    ],
  },
  {
    id: "4-2-3-1-zico",
    name: "4-2-3-1 Zico Klasiği",
    mentality: "BALANCED",
    mentalityTitle: "Dengeli",
    description: "2007-08 Kadıköy Efsanesi: Aurelio + Appiah Arkada, Alex AMC'de Özgür",
    modifiers: { attackXgMult: 1.05, defenseXgMult: 0.95 },
    slots: [
      { id: "GK", label: "GK", roleName: "Kaleci", x: 50, y: 91, accepts: ["GK"] },
      { id: "DL", label: "DL", roleName: "Sol Bek", x: 14, y: 74, accepts: ["LB", "LWB"] },
      { id: "DC1", label: "DC", roleName: "Sol Stoper", x: 38, y: 77, accepts: ["CB"] },
      { id: "DC2", label: "DC", roleName: "Sağ Stoper", x: 62, y: 77, accepts: ["CB"] },
      { id: "DR", label: "DR", roleName: "Sağ Bek", x: 86, y: 74, accepts: ["RB", "RWB"] },
      { id: "DMC", label: "DMC", roleName: "Ön Libero", x: 36, y: 58, accepts: ["CDM", "CM"] },
      { id: "MC", label: "MC", roleName: "İki Yönlü", x: 64, y: 56, accepts: ["CM", "CDM"] },
      { id: "AML", label: "AML", roleName: "Sol Forvet", x: 16, y: 36, accepts: ["LW", "LM"] },
      { id: "AMC", label: "AMC", roleName: "Kaptan Alex", x: 50, y: 35, accepts: ["CAM", "AMC", "CF"] },
      { id: "AMR", label: "AMR", roleName: "Sağ Forvet", x: 84, y: 36, accepts: ["RW", "RM", "ST"] },
      { id: "FC", label: "FC", roleName: "Santrfor", x: 50, y: 15, accepts: ["ST", "CF"] },
    ],
  },
  {
    id: "4-4-2-daum",
    name: "4-4-2 Daum Klasiği",
    mentality: "BALANCED",
    mentalityTitle: "Dengeli",
    description: "Orta Sahayı Parselleyen, Çift Santrforlu Klasik Avrupa Düzeni",
    modifiers: { attackXgMult: 1.08, defenseXgMult: 0.98 },
    slots: [
      { id: "GK", label: "GK", roleName: "Kaleci", x: 50, y: 91, accepts: ["GK"] },
      { id: "DL", label: "DL", roleName: "Sol Bek", x: 14, y: 74, accepts: ["LB", "LWB"] },
      { id: "DC1", label: "DC", roleName: "Sol Stoper", x: 38, y: 77, accepts: ["CB"] },
      { id: "DC2", label: "DC", roleName: "Sağ Stoper", x: 62, y: 77, accepts: ["CB"] },
      { id: "DR", label: "DR", roleName: "Sağ Bek", x: 86, y: 74, accepts: ["RB", "RWB"] },
      { id: "ML", label: "ML", roleName: "Sol Kanat", x: 15, y: 48, accepts: ["LM", "LW"] },
      { id: "MC1", label: "MC", roleName: "Merkez Orta Saha", x: 38, y: 50, accepts: ["CM", "CDM"] },
      { id: "MC2", label: "MC", roleName: "Merkez Orta Saha", x: 62, y: 50, accepts: ["CM", "CDM"] },
      { id: "MR", label: "MR", roleName: "Sağ Kanat", x: 85, y: 48, accepts: ["RM", "RW"] },
      { id: "FC1", label: "FC", roleName: "Sol Santrfor", x: 36, y: 17, accepts: ["ST", "CF"] },
      { id: "FC2", label: "FC", roleName: "Sağ Santrfor", x: 64, y: 17, accepts: ["ST", "CF"] },
    ],
  },
  {
    id: "4-3-3-kontrollu",
    name: "4-3-3 Kontrollü",
    mentality: "BALANCED",
    mentalityTitle: "Dengeli",
    description: "Merkezde Üçgen Orta Saha, Çizgide Açıklar ve Geniş Alan Oyunu",
    modifiers: { attackXgMult: 1.04, defenseXgMult: 0.96 },
    slots: [
      { id: "GK", label: "GK", roleName: "Kaleci", x: 50, y: 91, accepts: ["GK"] },
      { id: "DL", label: "DL", roleName: "Sol Bek", x: 14, y: 74, accepts: ["LB", "LWB"] },
      { id: "DC1", label: "DC", roleName: "Sol Stoper", x: 38, y: 77, accepts: ["CB"] },
      { id: "DC2", label: "DC", roleName: "Sağ Stoper", x: 62, y: 77, accepts: ["CB"] },
      { id: "DR", label: "DR", roleName: "Sağ Bek", x: 86, y: 74, accepts: ["RB", "RWB"] },
      { id: "DMC", label: "DMC", roleName: "Çapa", x: 50, y: 59, accepts: ["CDM", "CM"] },
      { id: "MC1", label: "MC", roleName: "Sol İç", x: 33, y: 45, accepts: ["CM", "CAM"] },
      { id: "MC2", label: "MC", roleName: "Sağ İç", x: 67, y: 45, accepts: ["CM", "CAM"] },
      { id: "AML", label: "AML", roleName: "Sol Açık", x: 18, y: 24, accepts: ["LW", "LM"] },
      { id: "AMR", label: "AMR", roleName: "Sağ Açık", x: 82, y: 24, accepts: ["RW", "RM"] },
      { id: "FC", label: "FC", roleName: "Bitirici", x: 50, y: 15, accepts: ["ST", "CF"] },
    ],
  },
  {
    id: "4-1-2-1-2-elmas",
    name: "4-1-2-1-2 Elmas",
    mentality: "ATTACKING",
    mentalityTitle: "Hücum / Elmas",
    description: "Elmasın Zirvesinde AMC, Kanatlardan Destek ve Çift Santrfor Kuşatması",
    modifiers: { attackXgMult: 1.25, defenseXgMult: 1.2 },
    slots: [
      { id: "GK", label: "GK", roleName: "Kaleci", x: 50, y: 91, accepts: ["GK"] },
      { id: "DL", label: "DL", roleName: "Sol Bek", x: 14, y: 74, accepts: ["LB", "LWB"] },
      { id: "DC1", label: "DC", roleName: "Sol Stoper", x: 38, y: 77, accepts: ["CB"] },
      { id: "DC2", label: "DC", roleName: "Sağ Stoper", x: 62, y: 77, accepts: ["CB"] },
      { id: "DR", label: "DR", roleName: "Sağ Bek", x: 86, y: 74, accepts: ["RB", "RWB"] },
      { id: "DMC", label: "DMC", roleName: "Tek Çapa", x: 50, y: 62, accepts: ["CDM", "CM"] },
      { id: "ML", label: "ML", roleName: "Sol İç Kanat", x: 22, y: 46, accepts: ["LM", "CM", "LW"] },
      { id: "MR", label: "MR", roleName: "Sağ İç Kanat", x: 78, y: 46, accepts: ["RM", "CM", "RW"] },
      { id: "AMC", label: "AMC", roleName: "Elmasın Zirvesi", x: 50, y: 34, accepts: ["CAM", "AMC", "CF"] },
      { id: "FC1", label: "FC", roleName: "Sol Santrfor", x: 36, y: 16, accepts: ["ST", "CF"] },
      { id: "FC2", label: "FC", roleName: "Sağ Santrfor", x: 64, y: 16, accepts: ["ST", "CF"] },
    ],
  },
  {
    id: "4-3-1-2-kadikoy",
    name: "4-3-1-2 Kadıköy Baskısı",
    mentality: "ATTACKING",
    mentalityTitle: "Hücum / 10 Numara",
    description: "Üçlü Savaşçı Merkez, Önlerinde Serbest AMC ve Çift Yırtıcı Forvet",
    modifiers: { attackXgMult: 1.22, defenseXgMult: 1.18 },
    slots: [
      { id: "GK", label: "GK", roleName: "Kaleci", x: 50, y: 91, accepts: ["GK"] },
      { id: "DL", label: "DL", roleName: "Bek", x: 13, y: 72, accepts: ["LB", "LWB"] },
      { id: "DC1", label: "DC", roleName: "Stoper", x: 38, y: 77, accepts: ["CB"] },
      { id: "DC2", label: "DC", roleName: "Stoper", x: 62, y: 77, accepts: ["CB"] },
      { id: "DR", label: "DR", roleName: "Bek", x: 87, y: 72, accepts: ["RB", "RWB"] },
      { id: "MC1", label: "MC", roleName: "Sol Merkez", x: 26, y: 54, accepts: ["CM", "CDM"] },
      { id: "DMC", label: "DMC", roleName: "Merkez Çapa", x: 50, y: 56, accepts: ["CDM", "CM"] },
      { id: "MC2", label: "MC", roleName: "Sağ Merkez", x: 74, y: 54, accepts: ["CM", "CDM"] },
      { id: "AMC", label: "AMC", roleName: "Serbest Maestro", x: 50, y: 35, accepts: ["CAM", "AMC", "CF"] },
      { id: "FC1", label: "FC", roleName: "Forvet", x: 35, y: 16, accepts: ["ST", "CF"] },
      { id: "FC2", label: "FC", roleName: "Forvet", x: 65, y: 16, accepts: ["ST", "CF"] },
    ],
  },
  {
    id: "3-4-3-total",
    name: "3-4-3 Total Hücum",
    mentality: "ATTACKING",
    mentalityTitle: "Ultra Hücum",
    description: "Tam Saha Pres, 3 Hücumcu ile Rakip Sahada Kesintisiz Kuşatma",
    modifiers: { attackXgMult: 1.45, defenseXgMult: 1.4 },
    slots: [
      { id: "GK", label: "GK", roleName: "Kaleci", x: 50, y: 91, accepts: ["GK"] },
      { id: "DC1", label: "DC", roleName: "Sol Stoper", x: 25, y: 77, accepts: ["CB"] },
      { id: "DC2", label: "DC", roleName: "Merkez Stoper", x: 50, y: 80, accepts: ["CB"] },
      { id: "DC3", label: "DC", roleName: "Sağ Stoper", x: 75, y: 77, accepts: ["CB"] },
      { id: "ML", label: "ML", roleName: "Sol Koridor", x: 14, y: 50, accepts: ["LM", "LWB", "LB"] },
      { id: "MC1", label: "MC", roleName: "Orta Saha", x: 38, y: 52, accepts: ["CM", "CDM"] },
      { id: "MC2", label: "MC", roleName: "Orta Saha", x: 62, y: 52, accepts: ["CM", "CDM"] },
      { id: "MR", label: "MR", roleName: "Sağ Koridor", x: 86, y: 50, accepts: ["RM", "RWB", "RB"] },
      { id: "AML", label: "AML", roleName: "Sol Forvet", x: 20, y: 22, accepts: ["LW", "LM", "ST"] },
      { id: "AMR", label: "AMR", roleName: "Sağ Forvet", x: 80, y: 22, accepts: ["RW", "RM", "ST"] },
      { id: "FC", label: "FC", roleName: "Bitirici Forvet", x: 50, y: 15, accepts: ["ST", "CF"] },
    ],
  },
];

// =================================================================
// 3. 36 UCL KULÜBÜ (RESMİ LOGOLAR & SKORER HAVUZLARI)
// =================================================================
export const UCL_36_POTS: UCLClub[] = [
  { id: "rma", name: "Real Madrid CF", shortName: "RMA", country: "ESP", rating: 91, pot: 1, logoUrl: "https://crests.football-data.org/86.png", primaryColor: "#ffffff", secondaryColor: "#febe10", scorersPool: ["Kylian Mbappé", "Vinícius Jr.", "Jude Bellingham", "Rodrygo", "Endrick", "Arda Güler", "Fede Valverde"] },
  { id: "mci", name: "Manchester City", shortName: "MCI", country: "ENG", rating: 89, pot: 1, logoUrl: "https://crests.football-data.org/65.png", primaryColor: "#6cabdd", secondaryColor: "#1c2c5b", scorersPool: ["Erling Haaland", "Phil Foden", "Savinho", "Jérémy Doku", "Jamal Musiala", "Rodri", "Oscar Bobb"] },
  { id: "ars", name: "Arsenal FC", shortName: "ARS", country: "ENG", rating: 88, pot: 1, logoUrl: "https://crests.football-data.org/57.png", primaryColor: "#db0007", secondaryColor: "#9c824a", scorersPool: ["Viktor Gyökeres", "Bukayo Saka", "Kai Havertz", "Martin Ødegaard", "Ethan Nwaneri", "Declan Rice", "Leandro Trossard"] },
  { id: "bay", name: "Bayern München", shortName: "BAY", country: "GER", rating: 88, pot: 1, logoUrl: "https://crests.football-data.org/5.png", primaryColor: "#dc052d", secondaryColor: "#0066b2", scorersPool: ["Harry Kane", "Michael Olise", "Mathys Tel", "Serge Gnabry", "Paul Wanner", "Aleksandar Pavlović"] },
  { id: "bar", name: "FC Barcelona", shortName: "BAR", country: "ESP", rating: 88, pot: 1, logoUrl: "https://crests.football-data.org/81.png", primaryColor: "#a50044", secondaryColor: "#004d98", scorersPool: ["Lamine Yamal", "Raphinha", "Dani Olmo", "Pedri", "Gavi", "Fermín López", "Pau Víctor"] },
  { id: "psg", name: "Paris Saint-Germain", shortName: "PSG", country: "FRA", rating: 88, pot: 1, logoUrl: "https://crests.football-data.org/524.png", primaryColor: "#004170", secondaryColor: "#da291c", scorersPool: ["Ousmane Dembélé", "Bradley Barcola", "Khvicha Kvaratskhelia", "Désiré Doué", "Gonçalo Ramos", "João Neves", "Vitinha"] },
  { id: "liv", name: "Liverpool FC", shortName: "LIV", country: "ENG", rating: 88, pot: 1, logoUrl: "https://crests.football-data.org/64.png", primaryColor: "#c8102e", secondaryColor: "#00b2a9", scorersPool: ["Florian Wirtz", "Alexander Isak", "Federico Chiesa", "Cody Gakpo", "Luis Díaz", "Dominik Szoboszlai"] },
  { id: "int", name: "Inter Milan", shortName: "INT", country: "ITA", rating: 86, pot: 1, logoUrl: "https://crests.football-data.org/108.png", primaryColor: "#001489", secondaryColor: "#000000", scorersPool: ["Lautaro Martínez", "Marcus Thuram", "Hakan Çalhanoğlu", "Nicolò Barella", "Davide Frattesi"] },
  { id: "dor", name: "Borussia Dortmund", shortName: "BVB", country: "GER", rating: 84, pot: 1, logoUrl: "https://crests.football-data.org/4.png", primaryColor: "#fde100", secondaryColor: "#000000", scorersPool: ["Serhou Guirassy", "Maximilian Beier", "Julian Brandt", "Karim Adeyemi", "Jamie Gittens"] },
  { id: "atm", name: "Atlético Madrid", shortName: "ATM", country: "ESP", rating: 86, pot: 2, logoUrl: "https://crests.football-data.org/78.png", primaryColor: "#cb3524", secondaryColor: "#272e61", scorersPool: ["Julián Alvarez", "Antoine Griezmann", "Alexander Sørloth", "Conor Gallagher", "Giuliano Simeone"] },
  { id: "nap", name: "Napoli", shortName: "NAP", country: "ITA", rating: 84, pot: 2, logoUrl: "https://crests.football-data.org/113.png", primaryColor: "#12a0d7", secondaryColor: "#ffffff", scorersPool: ["David Neres", "Giacomo Raspadori", "Matteo Politano", "Cyril Ngonge", "Giovanni Simeone"] },
  { id: "avl", name: "Aston Villa", shortName: "AVL", country: "ENG", rating: 85, pot: 2, logoUrl: "https://crests.football-data.org/58.png", primaryColor: "#670e36", secondaryColor: "#95bfe5", scorersPool: ["Ollie Watkins", "Jhon Durán", "Morgan Rogers", "Leon Bailey", "John McGinn"] },
  { id: "asr", name: "AS Roma", shortName: "ASR", country: "ITA", rating: 83, pot: 2, logoUrl: "https://crests.football-data.org/100.png", primaryColor: "#8e1f2f", secondaryColor: "#f0bc42", scorersPool: ["Artem Dovbyk", "Paulo Dybala", "Matías Soulé", "Tommaso Baldanzi"] },
  { id: "vil", name: "Villarreal CF", shortName: "VIL", country: "ESP", rating: 83, pot: 2, logoUrl: "https://crests.football-data.org/94.png", primaryColor: "#ffe600", secondaryColor: "#00519e", scorersPool: ["Ayoze Pérez", "Nicolas Pépé", "Thierno Barry", "Álex Baena"] },
  { id: "spo", name: "Sporting CP", shortName: "SPO", country: "POR", rating: 81, pot: 2, logoUrl: "https://crests.football-data.org/498.png", primaryColor: "#008057", secondaryColor: "#ffffff", scorersPool: ["Geovany Quenda", "Francisco Trincão", "Pedro Gonçalves", "Conrad Harder"] },
  { id: "por", name: "FC Porto", shortName: "POR", country: "POR", rating: 82, pot: 2, logoUrl: "https://crests.football-data.org/503.png", primaryColor: "#003882", secondaryColor: "#ffffff", scorersPool: ["Samu Omorodion", "Galeno", "Pepê", "Nico González"] },
  { id: "mun", name: "Manchester United", shortName: "MUN", country: "ENG", rating: 82, pot: 2, logoUrl: "https://crests.football-data.org/66.png", primaryColor: "#da291c", secondaryColor: "#ffe500", scorersPool: ["Bruno Fernandes", "Rasmus Højlund", "Joshua Zirkzee", "Alejandro Garnacho", "Amad Diallo"] },
  { id: "rbl", name: "RB Leipzig", shortName: "RBL", country: "GER", rating: 82, pot: 2, logoUrl: "https://crests.football-data.org/721.png", primaryColor: "#ffffff", secondaryColor: "#dd0741", scorersPool: ["Benjamin Šeško", "Loïs Openda", "Xavi Simons", "Antonio Nusa"] },
  { id: "fb", name: "Fenerbahçe SK", shortName: "FB", country: "TUR", rating: 83, pot: 3, logoUrl: "https://crests.football-data.org/613.png", primaryColor: "#002d72", secondaryColor: "#fef100", scorersPool: [] },
  { id: "gal", name: "Galatasaray SK", shortName: "GS", country: "TUR", rating: 84, pot: 3, logoUrl: "https://crests.football-data.org/610.png", primaryColor: "#a90432", secondaryColor: "#fdb913", scorersPool: ["Victor Osimhen", "Leroy Sané", "Rafael Leão", "Gabriel Sara", "Barış Alper Yılmaz", "Roland Sallai", "Lucas Torreira"] },
  { id: "psv", name: "PSV Eindhoven", shortName: "PSV", country: "NED", rating: 81, pot: 3, logoUrl: "https://crests.football-data.org/674.png", primaryColor: "#ed1c24", secondaryColor: "#ffffff", scorersPool: ["Luuk de Jong", "Johan Bakayoko", "Noa Lang", "Malik Tillman", "Ricardo Pepi"] },
  { id: "fey", name: "Feyenoord", shortName: "FEY", country: "NED", rating: 80, pot: 3, logoUrl: "https://crests.football-data.org/675.png", primaryColor: "#ffffff", secondaryColor: "#e41b13", scorersPool: ["Santiago Giménez", "Igor Paixão", "Quinten Timber", "Ayase Ueda"] },
  { id: "shk", name: "Shakhtar Donetsk", shortName: "SHK", country: "UKR", rating: 80, pot: 3, logoUrl: "https://crests.football-data.org/654.png", primaryColor: "#f36523", secondaryColor: "#000000", scorersPool: ["Georgiy Sudakov", "Danylo Sikan", "Kevin", "Eguinaldo"] },
  { id: "bet", name: "Real Betis", shortName: "BET", country: "ESP", rating: 80, pot: 3, logoUrl: "https://crests.football-data.org/90.png", primaryColor: "#00954c", secondaryColor: "#ffffff", scorersPool: ["Vitor Roque", "Giovani Lo Celso", "Abde Ezzalzouli", "Pablo Fornals"] },
  { id: "lil", name: "Lille OSC", shortName: "LIL", country: "FRA", rating: 79, pot: 3, logoUrl: "https://crests.football-data.org/521.png", primaryColor: "#e01e13", secondaryColor: "#16284a", scorersPool: ["Jonathan David", "Edon Zhegrova", "Osame Sahraoui", "Angel Gomes"] },
  { id: "bru", name: "Club Brugge", shortName: "BRU", country: "BEL", rating: 78, pot: 3, logoUrl: "https://crests.football-data.org/851.png", primaryColor: "#000000", secondaryColor: "#006db7", scorersPool: ["Christos Tzolis", "Andreas Skov Olsen", "Hans Vanaken", "Gustaf Nilsson"] },
  { id: "bod", name: "Bodø/Glimt", shortName: "BOD", country: "NOR", rating: 76, pot: 3, logoUrl: "https://crests.football-data.org/924.png", primaryColor: "#ffe500", secondaryColor: "#000000", scorersPool: ["Jens Petter Hauge", "Kasper Høgh", "Philip Zinckernagel"] },
  { id: "com", name: "Como 1907", shortName: "COM", country: "ITA", rating: 78, pot: 4, logoUrl: "https://crests.football-data.org/1073.png", primaryColor: "#003366", secondaryColor: "#ffffff", scorersPool: ["Nico Paz", "Patrick Cutrone", "Gabriel Strefezza", "Andrea Belotti"] },
  { id: "stu", name: "VfB Stuttgart", shortName: "STU", country: "GER", rating: 79, pot: 4, logoUrl: "https://crests.football-data.org/10.png", primaryColor: "#ffffff", secondaryColor: "#e32219", scorersPool: ["Deniz Undav", "Ermedin Demirović", "Enzo Millot", "El Bilal Touré"] },
  { id: "sla", name: "Slavia Praha", shortName: "SLA", country: "CZE", rating: 79, pot: 4, logoUrl: "https://crests.football-data.org/1107.png", primaryColor: "#d71920", secondaryColor: "#ffffff", scorersPool: ["Tomáš Chorý", "Lukáš Provod", "Mojmír Chytil"] },
  { id: "len", name: "RC Lens", shortName: "LEN", country: "FRA", rating: 77, pot: 4, logoUrl: "https://crests.football-data.org/546.png", primaryColor: "#ec1c24", secondaryColor: "#fff200", scorersPool: ["M'Bala Nzola", "Florian Sotoca", "Wesley Saïd"] },
  { id: "lask", name: "LASK Linz", shortName: "LASK", country: "AUT", rating: 76, pot: 4, logoUrl: "https://crests.football-data.org/209.png", primaryColor: "#000000", secondaryColor: "#ffffff", scorersPool: ["Marin Ljubičić", "Robert Žulj", "Valon Berisha"] },
  { id: "slo", name: "Slovan Bratislava", shortName: "SLO", country: "SVK", rating: 74, pot: 4, logoUrl: "https://crests.football-data.org/5463.png", primaryColor: "#74aee2", secondaryColor: "#ffffff", scorersPool: ["David Strelec", "Marko Tolić", "Tigran Barseghyan"] },
  { id: "aek", name: "AEK Athens", shortName: "AEK", country: "GRE", rating: 75, pot: 4, logoUrl: "https://crests.football-data.org/592.png", primaryColor: "#ffcc00", secondaryColor: "#000000", scorersPool: ["Levi García", "Erik Lamela", "Anthony Martial", "Orbelín Pineda"] },
  { id: "vik", name: "Viking FK", shortName: "VIK", country: "NOR", rating: 73, pot: 4, logoUrl: "https://upload.wikimedia.org/wikipedia/en/thumb/0/07/Viking_FK_logo.svg/400px-Viking_FK_logo.svg.png", primaryColor: "#0d2b45", secondaryColor: "#ffffff", scorersPool: ["Zlatko Tripic", "Lars-Jørgen Salvesen", "Sander Svendsen"] },
  { id: "sab", name: "Sabah FK", shortName: "SAB", country: "AZE", rating: 72, pot: 4, logoUrl: "https://upload.wikimedia.org/wikipedia/en/thumb/5/58/Sabah_FK_logo.svg/400px-Sabah_FK_logo.svg.png", primaryColor: "#004b87", secondaryColor: "#e30613", scorersPool: ["Joy-Lance Mickels", "Emmanuel Apeh", "Pavol Šafranko"] },
];

// =================================================================
// 4. 17 EFSANE FENERBAHÇE SEZONU (18'ER OYUNCU)
// =================================================================
export const EXTENDED_SEASONS_DATA: SeasonSquad[] = [
  {
    id: "1988-89", season: "1988-1989", tournament: "Süper Lig Şampiyonu (103 Gol Rekoru)", fifaEdition: "Retro Nostalji", eraBadgeText: "1988-89", kitEraName: "1988-89 Efsane Çubuklu",
    kitColors: { primary: "#002d72", secondary: "#fef100", stripe: "#fef100", collar: "#ffffff" },
    players: [
      { id: "schumacher_88", name: "Toni Schumacher", positions: ["GK"], fifaRating: 86 }, { id: "murat_88", name: "Murat Aydın", positions: ["GK"], fifaRating: 72 },
      { id: "mujdat_88", name: "Müjdat Yetkiner", positions: ["CB", "SW", "CDM"], fifaRating: 80 }, { id: "nezihi_88", name: "Nezihi Tosuncuk", positions: ["CB"], fifaRating: 78 },
      { id: "ismail_88", name: "İsmail Kartal", positions: ["RB", "RWB"], fifaRating: 80 }, { id: "senol_88", name: "Şenol Ustaömer", positions: ["LB", "LWB"], fifaRating: 79 },
      { id: "erhan_88", name: "Erhan Altın", positions: ["CB", "CDM"], fifaRating: 75 }, { id: "sedat_88", name: "Sedat Karaoğlu", positions: ["CB", "RB"], fifaRating: 74 },
      { id: "oguz_88", name: "Oğuz Çetin", positions: ["CM", "CAM"], fifaRating: 85 }, { id: "turhan_88", name: "Turhan Sofuoğlu", positions: ["CM", "CDM"], fifaRating: 80 },
      { id: "hakan_88", name: "Hakan Tecimer", positions: ["CAM", "CM"], fifaRating: 80 }, { id: "serdar_88", name: "Serdar Şenkaya", positions: ["RM", "RW"], fifaRating: 76 },
      { id: "durmus_88", name: "Durmuş Çolak", positions: ["CM", "CDM"], fifaRating: 75 }, { id: "bilal_88", name: "Bilal Şar", positions: ["LM", "LW"], fifaRating: 74 },
      { id: "ridvan_88", name: "Rıdvan Dilmen", positions: ["RW", "ST", "CAM"], fifaRating: 87 }, { id: "aykut_88", name: "Aykut Kocaman", positions: ["ST", "CF"], fifaRating: 85 },
      { id: "hasan_88", name: "Hasan Vezir", positions: ["ST", "CF"], fifaRating: 82 }, { id: "taygun_88", name: "Taygun Erdem", positions: ["ST", "RW"], fifaRating: 74 }
    ],
  },
  {
    id: "1996-97", season: "1996-1997", tournament: "UEFA Şampiyonlar Ligi (Old Trafford Zaferi)", fifaEdition: "FIFA 97 Retro", eraBadgeText: "1996-97", kitEraName: "1996-97 Klasik Çubuklu",
    kitColors: { primary: "#002d72", secondary: "#fef100", stripe: "#fef100", collar: "#ffffff" },
    players: [
      { id: "rustu_96", name: "Rüştü Reçber", positions: ["GK"], fifaRating: 85 }, { id: "engin_96", name: "Engin İpekoğlu", positions: ["GK"], fifaRating: 77 },
      { id: "uche_96", name: "Uche Okechukwu", positions: ["CB"], fifaRating: 83 }, { id: "hogh_96", name: "Jes Högh", positions: ["CB"], fifaRating: 81 },
      { id: "mustafa_96", name: "Mustafa Doğan", positions: ["CB", "RB"], fifaRating: 76 }, { id: "saffet_a_96", name: "Saffet Akbaş", positions: ["CB"], fifaRating: 76 },
      { id: "ilker_96", name: "İlker Yağcıoğlu", positions: ["RB", "RWB", "RM"], fifaRating: 78 }, { id: "erol_96", name: "Erol Bulut", positions: ["LB", "LWB", "LM"], fifaRating: 77 },
      { id: "halil_96", name: "Halil İbrahim Kara", positions: ["LB", "LM"], fifaRating: 74 }, { id: "kemalettin_96", name: "Kemalettin Şentürk", positions: ["CDM", "CM"], fifaRating: 78 },
      { id: "tayfun_96", name: "Tayfun Korkut", positions: ["CM", "RM"], fifaRating: 79 }, { id: "okocha_96", name: "Jay-Jay Okocha", positions: ["CAM", "AMC", "RM", "RW"], fifaRating: 87 },
      { id: "tarik_96", name: "Tarık Daşgün", positions: ["CAM", "RW"], fifaRating: 76 }, { id: "aygun_96", name: "Aygün Taşkıran", positions: ["CM", "CDM"], fifaRating: 73 },
      { id: "bolic_96", name: "Elvir Boliç", positions: ["ST", "CF"], fifaRating: 82 }, { id: "kostadinov_96", name: "Emil Kostadinov", positions: ["ST", "CF", "RW"], fifaRating: 80 },
      { id: "saffet_s_96", name: "Saffet Sancaklı", positions: ["ST", "CF"], fifaRating: 79 }, { id: "aykut_96", name: "Aykut Kocaman", positions: ["ST", "CF"], fifaRating: 78 }
    ],
  },
  {
    id: "2000-01", season: "2000-2001", tournament: "Süper Lig Şampiyonu", fifaEdition: "FIFA 2001 Retro", eraBadgeText: "2000-01", kitEraName: "2000-01 Telsim Çubuklu",
    kitColors: { primary: "#00204d", secondary: "#fed800", stripe: "#fed800", collar: "#00204d" },
    players: [
      { id: "rustu_00", name: "Rüştü Reçber", positions: ["GK"], fifaRating: 84 }, { id: "oguz_00", name: "Oğuz Dağlaroğlu", positions: ["GK"], fifaRating: 73 },
      { id: "mirkovic_00", name: "Zoran Mirković", positions: ["CB", "RB"], fifaRating: 80 }, { id: "ogun_00", name: "Ogün Temizkanoğlu", positions: ["CB", "SW", "CDM"], fifaRating: 80 },
      { id: "meric_00", name: "Mert Meriç", positions: ["CB"], fifaRating: 76 }, { id: "mustafa_00", name: "Mustafa Doğan", positions: ["CB", "RB"], fifaRating: 76 },
      { id: "ali_g_00", name: "Ali Güneş", positions: ["RB", "RWB", "RM"], fifaRating: 76 }, { id: "abdullah_00", name: "Abdullah Ercan", positions: ["LB", "LWB", "LM"], fifaRating: 79 },
      { id: "johnson_00", name: "Samuel Johnson", positions: ["CDM", "CM"], fifaRating: 80 }, { id: "lazetic_00", name: "Nikola Lazetić", positions: ["RM", "RW"], fifaRating: 79 },
      { id: "revivo_00", name: "Haim Revivo", positions: ["CAM", "AMC", "LW"], fifaRating: 85 }, { id: "rapaic_00", name: "Milan Rapaić", positions: ["LW", "LM", "ST"], fifaRating: 84 },
      { id: "balic_00", name: "Elvir Baljić", positions: ["LW", "LM", "CF"], fifaRating: 82 }, { id: "yusuf_00", name: "Yusuf Şimşek", positions: ["CAM", "CM"], fifaRating: 77 },
      { id: "ali_akd_00", name: "Ali Akdeniz", positions: ["RM", "RWB"], fifaRating: 74 }, { id: "andersson_00", name: "Kennet Andersson", positions: ["ST", "CF"], fifaRating: 81 },
      { id: "serhat_00", name: "Serhat Akın", positions: ["ST", "RW", "CF"], fifaRating: 78 }, { id: "gokhan_00", name: "Gökhan Bozkaya", positions: ["ST", "CF"], fifaRating: 71 }
    ],
  },
  {
    id: "2002-03", season: "2002-2003", tournament: "Süper Lig (Ortega & 6-0 Zaferi)", fifaEdition: "FIFA Football 2003", eraBadgeText: "2002-03", kitEraName: "2002-03 Aria Çubuklu",
    kitColors: { primary: "#001d4a", secondary: "#fce300", stripe: "#fce300", collar: "#001d4a" },
    players: [
      { id: "rustu_02", name: "Rüştü Reçber", positions: ["GK"], fifaRating: 84 }, { id: "recep_02", name: "Recep Biler", positions: ["GK"], fifaRating: 71 },
      { id: "ozit_02", name: "Ümit Özat", positions: ["LB", "CB", "CM"], fifaRating: 78 }, { id: "ogun_02", name: "Ogün Temizkanoğlu", positions: ["CB", "CDM"], fifaRating: 79 },
      { id: "mirkovic_02", name: "Zoran Mirković", positions: ["CB", "RB"], fifaRating: 78 }, { id: "fatih_02", name: "Fatih Akyel", positions: ["RB", "RWB"], fifaRating: 77 },
      { id: "cem_02", name: "Cem Karaca", positions: ["LB", "LM"], fifaRating: 74 }, { id: "johnson_02", name: "Samuel Johnson", positions: ["CDM", "CM"], fifaRating: 79 },
      { id: "stevic_02", name: "Miroslav Stević", positions: ["CM", "CDM"], fifaRating: 77 }, { id: "ali_g_02", name: "Ali Güneş", positions: ["RM", "RB"], fifaRating: 76 },
      { id: "ortega_02", name: "Ariel Ortega", positions: ["CAM", "AMC", "RW"], fifaRating: 86 }, { id: "revivo_02", name: "Haim Revivo", positions: ["CAM", "LW"], fifaRating: 83 },
      { id: "ceyhun_02", name: "Ceyhun Eriş", positions: ["CAM", "AMC", "CM"], fifaRating: 79 }, { id: "tuncay_02", name: "Tuncay Şanlı", positions: ["LW", "ST", "CAM"], fifaRating: 78 },
      { id: "washington_02", name: "Washington", positions: ["ST", "CF"], fifaRating: 81 }, { id: "serhat_02", name: "Serhat Akın", positions: ["ST", "RW"], fifaRating: 78 },
      { id: "beschastnykh_02", name: "Vladimir Beschastnykh", positions: ["ST", "CF"], fifaRating: 75 }, { id: "semih_02", name: "Semih Şentürk", positions: ["ST", "CF"], fifaRating: 72 }
    ],
  },
  {
    id: "2003-04", season: "2003-2004", tournament: "Süper Lig Şampiyonu", fifaEdition: "FIFA Football 2004", eraBadgeText: "2003-04", kitEraName: "2003-04 Fenerium Çubuklu",
    kitColors: { primary: "#001d4a", secondary: "#fce300", stripe: "#fce300", collar: "#ffffff" },
    players: [
      { id: "volkan_03", name: "Volkan Demirel", positions: ["GK"], fifaRating: 76 }, { id: "recep_03", name: "Recep Biler", positions: ["GK"], fifaRating: 72 },
      { id: "luciano_03", name: "Fábio Luciano", positions: ["CB"], fifaRating: 80 }, { id: "servet_03", name: "Servet Çetin", positions: ["CB"], fifaRating: 76 },
      { id: "ismail_03", name: "İsmail Güldüren", positions: ["CB", "LB"], fifaRating: 74 }, { id: "fatih_03", name: "Fatih Akyel", positions: ["RB", "RWB"], fifaRating: 77 },
      { id: "ali_g_03", name: "Ali Güneş", positions: ["RB", "RM"], fifaRating: 76 }, { id: "ozit_03", name: "Ümit Özat", positions: ["LB", "LWB", "CM"], fifaRating: 78 },
      { id: "aurelio_03", name: "Mehmet Aurélio", positions: ["CDM", "CM"], fifaRating: 80 }, { id: "selcuk_03", name: "Selçuk Şahin", positions: ["CDM", "CM"], fifaRating: 75 },
      { id: "kemal_03", name: "Kemal Aslan", positions: ["CM", "CAM"], fifaRating: 75 }, { id: "petre_03", name: "Ovidiu Petre", positions: ["CDM", "CM"], fifaRating: 76 },
      { id: "tuncay_03", name: "Tuncay Şanlı", positions: ["LW", "LM", "ST", "CF"], fifaRating: 81 }, { id: "serhat_03", name: "Serhat Akın", positions: ["RW", "RM", "ST"], fifaRating: 78 },
      { id: "rebrov_03", name: "Serhiy Rebrov", positions: ["CAM", "ST"], fifaRating: 77 }, { id: "pvh_03", name: "Pierre van Hooijdonk", positions: ["ST", "CF"], fifaRating: 85 },
      { id: "nobre_03", name: "Mert Nobre", positions: ["ST", "CF"], fifaRating: 80 }, { id: "semih_03", name: "Semih Şentürk", positions: ["ST", "CF"], fifaRating: 74 }
    ],
  },
  {
    id: "2004-05", season: "2004-2005", tournament: "UEFA Şampiyonlar Ligi", fifaEdition: "FIFA Football 2005", eraBadgeText: "2004-05", kitEraName: "2004-05 Avea Çubuklu",
    kitColors: { primary: "#002244", secondary: "#fce300", stripe: "#fce300", collar: "#002244" },
    players: [
      { id: "rustu_04", name: "Rüştü Reçber", positions: ["GK"], fifaRating: 83 }, { id: "volkan_04", name: "Volkan Demirel", positions: ["GK"], fifaRating: 77 },
      { id: "luciano_04", name: "Fábio Luciano", positions: ["CB"], fifaRating: 80 }, { id: "servet_04", name: "Servet Çetin", positions: ["CB"], fifaRating: 77 },
      { id: "onder_04", name: "Önder Turacı", positions: ["RB", "CB"], fifaRating: 77 }, { id: "deniz_04", name: "Deniz Barış", positions: ["CB", "CDM"], fifaRating: 76 },
      { id: "ozit_04", name: "Ümit Özat", positions: ["LB", "LWB", "CM"], fifaRating: 78 }, { id: "mahmut_04", name: "Mahmut Hanefi Erdoğdu", positions: ["LB"], fifaRating: 72 },
      { id: "aurelio_04", name: "Mehmet Aurélio", positions: ["CDM", "CM"], fifaRating: 81 }, { id: "selcuk_04", name: "Selçuk Şahin", positions: ["CDM", "CM"], fifaRating: 76 },
      { id: "kemal_04", name: "Kemal Aslan", positions: ["CM", "CAM"], fifaRating: 75 }, { id: "alex_04", name: "Alex de Souza", positions: ["CAM", "AMC", "CF"], fifaRating: 86 },
      { id: "tuncay_04", name: "Tuncay Şanlı", positions: ["LW", "LM", "ST", "CAM"], fifaRating: 82 }, { id: "serhat_04", name: "Serhat Akın", positions: ["RW", "RM", "ST"], fifaRating: 78 },
      { id: "murat_04", name: "Murat Hacıoğlu", positions: ["LW", "LM"], fifaRating: 74 }, { id: "anelka_04", name: "Nicolas Anelka", positions: ["ST", "CF", "RW"], fifaRating: 85 },
      { id: "pvh_04", name: "Pierre van Hooijdonk", positions: ["ST", "CF"], fifaRating: 82 }, { id: "nobre_04", name: "Mert Nobre", positions: ["ST", "CF"], fifaRating: 80 }
    ],
  },
  {
    id: "2006-07", season: "2006-2007", tournament: "Süper Lig 100. Yıl Şampiyonu", fifaEdition: "FIFA 07", eraBadgeText: "2006-07", kitEraName: "2006-07 100. Yıl Çubuklu",
    kitColors: { primary: "#001d4a", secondary: "#d4af37", stripe: "#fef100", collar: "#d4af37" },
    players: [
      { id: "volkan_06", name: "Volkan Demirel", positions: ["GK"], fifaRating: 78 }, { id: "serdar_06", name: "Serdar Kulbilge", positions: ["GK"], fifaRating: 75 },
      { id: "rustu_06", name: "Rüştü Reçber", positions: ["GK"], fifaRating: 80 }, { id: "lugano_06", name: "Diego Lugano", positions: ["CB"], fifaRating: 81 },
      { id: "edu_06", name: "Edu Dracena", positions: ["CB"], fifaRating: 80 }, { id: "onder_06", name: "Önder Turacı", positions: ["RB", "CB"], fifaRating: 77 },
      { id: "can_06", name: "Can Arat", positions: ["CB"], fifaRating: 74 }, { id: "ozit_06", name: "Ümit Özat", positions: ["LB", "LWB"], fifaRating: 77 },
      { id: "ugur_06", name: "Uğur Boral", positions: ["LB", "LM", "LW"], fifaRating: 76 }, { id: "aurelio_06", name: "Mehmet Aurélio", positions: ["CDM", "CM"], fifaRating: 82 },
      { id: "appiah_06", name: "Stephen Appiah", positions: ["CM", "CDM"], fifaRating: 84 }, { id: "selcuk_06", name: "Selçuk Şahin", positions: ["CDM", "CM"], fifaRating: 75 },
      { id: "tumer_06", name: "Tümer Metin", positions: ["CAM", "AMC", "LM"], fifaRating: 80 }, { id: "tuncay_06", name: "Tuncay Şanlı", positions: ["LW", "LM", "ST"], fifaRating: 82 },
      { id: "alex_06", name: "Alex de Souza", positions: ["CAM", "AMC", "CF"], fifaRating: 87 }, { id: "deivid_06", name: "Deivid de Souza", positions: ["RW", "RM", "ST"], fifaRating: 79 },
      { id: "kezman_06", name: "Mateja Kežman", positions: ["ST", "CF"], fifaRating: 81 }, { id: "semih_06", name: "Semih Şentürk", positions: ["ST", "CF"], fifaRating: 77 }
    ],
  },
  {
    id: "2007-08", season: "2007-2008", tournament: "UEFA Şampiyonlar Ligi Çeyrek Final", fifaEdition: "FIFA 08", eraBadgeText: "2007-08", kitEraName: "2007-08 Altın Nakışlı Çubuklu",
    kitColors: { primary: "#001d4a", secondary: "#e5a93c", stripe: "#fef100", collar: "#e5a93c" },
    players: [
      { id: "volkan_07", name: "Volkan Demirel", positions: ["GK"], fifaRating: 80 }, { id: "serdar_07", name: "Serdar Kulbilge", positions: ["GK"], fifaRating: 75 },
      { id: "lugano_07", name: "Diego Lugano", positions: ["CB"], fifaRating: 83 }, { id: "edu_07", name: "Edu Dracena", positions: ["CB"], fifaRating: 81 },
      { id: "gonul_07", name: "Gökhan Gönül", positions: ["RB", "RWB"], fifaRating: 80 }, { id: "onder_07", name: "Önder Turacı", positions: ["RB", "CB"], fifaRating: 77 },
      { id: "carlos_07", name: "Roberto Carlos", positions: ["LB", "LWB"], fifaRating: 84 }, { id: "vederson_07", name: "Gökçek Vederson", positions: ["LB", "LM"], fifaRating: 77 },
      { id: "aurelio_07", name: "Mehmet Aurélio", positions: ["CDM", "CM"], fifaRating: 83 }, { id: "appiah_07", name: "Stephen Appiah", positions: ["CM", "CDM"], fifaRating: 83 },
      { id: "selcuk_07", name: "Selçuk Şahin", positions: ["CDM", "CM"], fifaRating: 76 }, { id: "maldonado_07", name: "Claudio Maldonado", positions: ["CDM", "CM"], fifaRating: 75 },
      { id: "kemal_07", name: "Kemal Aslan", positions: ["CM", "CAM"], fifaRating: 75 }, { id: "alex_07", name: "Alex de Souza", positions: ["CAM", "AMC", "CF"], fifaRating: 87 },
      { id: "deivid_07", name: "Deivid de Souza", positions: ["RW", "RM", "ST"], fifaRating: 80 }, { id: "ugur_07", name: "Uğur Boral", positions: ["LW", "LM"], fifaRating: 78 },
      { id: "kazim_07", name: "Colin Kâzım-Richards", positions: ["RW", "RM", "ST"], fifaRating: 78 }, { id: "kezman_07", name: "Mateja Kežman", positions: ["ST", "CF"], fifaRating: 81 }
    ],
  },
  {
    id: "2010-11", season: "2010-2011", tournament: "Süper Lig Şampiyonu", fifaEdition: "FIFA 11", eraBadgeText: "2010-11", kitEraName: "2010-11 Avea Çubuklu",
    kitColors: { primary: "#001a3a", secondary: "#ffe600", stripe: "#ffe600", collar: "#001a3a" },
    players: [
      { id: "volkan_10", name: "Volkan Demirel", positions: ["GK"], fifaRating: 82 }, { id: "mert_10", name: "Mert Günok", positions: ["GK"], fifaRating: 74 },
      { id: "lugano_10", name: "Diego Lugano", positions: ["CB"], fifaRating: 83 }, { id: "yobo_10", name: "Joseph Yobo", positions: ["CB"], fifaRating: 81 },
      { id: "bekir_10", name: "Bekir İrtegün", positions: ["CB", "RB"], fifaRating: 76 }, { id: "bilica_10", name: "Fábio Bilica", positions: ["CB"], fifaRating: 76 },
      { id: "gonul_10", name: "Gökhan Gönül", positions: ["RB", "RWB"], fifaRating: 81 }, { id: "santos_10", name: "André Santos", positions: ["LB", "LWB", "LM"], fifaRating: 80 },
      { id: "caner_10", name: "Caner Erkin", positions: ["LB", "LM", "LW"], fifaRating: 77 }, { id: "emre_10", name: "Emre Belözoğlu", positions: ["CM", "CDM"], fifaRating: 82 },
      { id: "baroni_10", name: "Cristian Baroni", positions: ["CM", "CDM"], fifaRating: 78 }, { id: "selcuk_10", name: "Selçuk Şahin", positions: ["CDM", "CM"], fifaRating: 75 },
      { id: "topuz_10", name: "Mehmet Topuz", positions: ["RM", "RW", "CM"], fifaRating: 79 }, { id: "alex_10", name: "Alex de Souza", positions: ["CAM", "AMC", "CF"], fifaRating: 87 },
      { id: "stoch_10", name: "Miroslav Stoch", positions: ["LW", "LM"], fifaRating: 80 }, { id: "dia_10", name: "Issiar Dia", positions: ["RW", "RM"], fifaRating: 78 },
      { id: "niang_10", name: "Mamadou Niang", positions: ["ST", "CF"], fifaRating: 83 }, { id: "semih_10", name: "Semih Şentürk", positions: ["ST", "CF"], fifaRating: 79 }
    ],
  },
  {
    id: "2012-13", season: "2012-2013", tournament: "UEFA Avrupa Ligi Yarı Final", fifaEdition: "FIFA 13", eraBadgeText: "2012-13", kitEraName: "2012-13 Türk Telekom Çubuklu",
    kitColors: { primary: "#002855", secondary: "#ffd100", stripe: "#ffd100", collar: "#002855" },
    players: [
      { id: "volkan_12", name: "Volkan Demirel", positions: ["GK"], fifaRating: 82 }, { id: "mert_12", name: "Mert Günok", positions: ["GK"], fifaRating: 75 },
      { id: "yobo_12", name: "Joseph Yobo", positions: ["CB"], fifaRating: 80 }, { id: "egemen_12", name: "Egemen Korkmaz", positions: ["CB"], fifaRating: 79 },
      { id: "bekir_12", name: "Bekir İrtegün", positions: ["CB", "RB"], fifaRating: 77 }, { id: "gonul_12", name: "Gökhan Gönül", positions: ["RB", "RWB"], fifaRating: 81 },
      { id: "orhan_12", name: "Orhan Şam", positions: ["RB"], fifaRating: 73 }, { id: "hasan_12", name: "Hasan Ali Kaldırım", positions: ["LB", "LWB"], fifaRating: 76 },
      { id: "ziegler_12", name: "Reto Ziegler", positions: ["LB", "LWB"], fifaRating: 76 }, { id: "meireles_12", name: "Raul Meireles", positions: ["CM", "CDM"], fifaRating: 82 },
      { id: "topal_12", name: "Mehmet Topal", positions: ["CDM", "CM", "CB"], fifaRating: 80 }, { id: "baroni_12", name: "Cristian Baroni", positions: ["CM", "CDM"], fifaRating: 78 },
      { id: "salih_12", name: "Salih Uçan", positions: ["CAM", "AMC", "CM"], fifaRating: 76 }, { id: "topuz_12", name: "Mehmet Topuz", positions: ["RM", "CM"], fifaRating: 77 },
      { id: "kuyt_12", name: "Dirk Kuyt", positions: ["RW", "RM", "ST", "CF"], fifaRating: 82 }, { id: "caner_12", name: "Caner Erkin", positions: ["LW", "LM", "LB"], fifaRating: 78 },
      { id: "sow_12", name: "Moussa Sow", positions: ["ST", "CF", "LW"], fifaRating: 83 }, { id: "webo_12", name: "Pierre Webó", positions: ["ST", "CF"], fifaRating: 79 }
    ],
  },
  {
    id: "2013-14", season: "2013-2014", tournament: "Süper Lig Şampiyonu", fifaEdition: "FIFA 14", eraBadgeText: "2013-14", kitEraName: "2013-14 Türk Telekom Çubuklu",
    kitColors: { primary: "#001d4a", secondary: "#ffe600", stripe: "#ffe600", collar: "#001d4a" },
    players: [
      { id: "volkan_13", name: "Volkan Demirel", positions: ["GK"], fifaRating: 81 }, { id: "mert_13", name: "Mert Günok", positions: ["GK"], fifaRating: 75 },
      { id: "alves_13", name: "Bruno Alves", positions: ["CB"], fifaRating: 81 }, { id: "egemen_13", name: "Egemen Korkmaz", positions: ["CB"], fifaRating: 79 },
      { id: "bekir_13", name: "Bekir İrtegün", positions: ["CB", "RB"], fifaRating: 76 }, { id: "kadlec_13", name: "Michal Kadlec", positions: ["CB", "LB"], fifaRating: 77 },
      { id: "gonul_13", name: "Gökhan Gönül", positions: ["RB", "RWB"], fifaRating: 80 }, { id: "caner_13", name: "Caner Erkin", positions: ["LB", "LWB", "LM"], fifaRating: 80 },
      { id: "hasan_13", name: "Hasan Ali Kaldırım", positions: ["LB"], fifaRating: 75 }, { id: "topal_13", name: "Mehmet Topal", positions: ["CDM", "CM"], fifaRating: 80 },
      { id: "emre_13", name: "Emre Belözoğlu", positions: ["CM", "CDM"], fifaRating: 81 }, { id: "meireles_13", name: "Raul Meireles", positions: ["CM", "CDM"], fifaRating: 80 },
      { id: "baroni_13", name: "Cristian Baroni", positions: ["CM", "CAM"], fifaRating: 77 }, { id: "alper_13", name: "Alper Potuk", positions: ["CM", "CAM", "LM"], fifaRating: 78 },
      { id: "kuyt_13", name: "Dirk Kuyt", positions: ["RW", "RM", "ST"], fifaRating: 81 }, { id: "sow_13", name: "Moussa Sow", positions: ["LW", "LM", "ST"], fifaRating: 82 },
      { id: "emenike_13", name: "Emmanuel Emenike", positions: ["ST", "CF", "RW"], fifaRating: 81 }, { id: "webo_13", name: "Pierre Webó", positions: ["ST", "CF"], fifaRating: 79 }
    ],
  },
  {
    id: "2015-16", season: "2015-2016", tournament: "UEFA Avrupa Ligi", fifaEdition: "FIFA 16", eraBadgeText: "2015-16", kitEraName: "2015-16 Yandex Çubuklu",
    kitColors: { primary: "#001a3a", secondary: "#fdd835", stripe: "#fdd835", collar: "#ffffff" },
    players: [
      { id: "volkan_15", name: "Volkan Demirel", positions: ["GK"], fifaRating: 80 }, { id: "fabiano_15", name: "Fabiano Ribeiro", positions: ["GK"], fifaRating: 76 },
      { id: "kjaer_15", name: "Simon Kjær", positions: ["CB"], fifaRating: 82 }, { id: "alves_15", name: "Bruno Alves", positions: ["CB"], fifaRating: 80 },
      { id: "ba_15", name: "Abdoulaye Ba", positions: ["CB"], fifaRating: 75 }, { id: "gonul_15", name: "Gökhan Gönül", positions: ["RB", "RWB"], fifaRating: 80 },
      { id: "sener_15", name: "Şener Özbayraklı", positions: ["RB", "RWB"], fifaRating: 76 }, { id: "caner_15", name: "Caner Erkin", positions: ["LB", "LWB"], fifaRating: 79 },
      { id: "hasan_15", name: "Hasan Ali Kaldırım", positions: ["LB"], fifaRating: 76 }, { id: "topal_15", name: "Mehmet Topal", positions: ["CDM", "CM"], fifaRating: 80 },
      { id: "souza_15", name: "Josef de Souza", positions: ["CDM", "CM"], fifaRating: 80 }, { id: "ozan_15", name: "Ozan Tufan", positions: ["CM", "RM", "RB"], fifaRating: 77 },
      { id: "diego_15", name: "Diego Ribas", positions: ["CAM", "AMC", "CM"], fifaRating: 80 }, { id: "alper_15", name: "Alper Potuk", positions: ["LM", "CAM", "CM"], fifaRating: 77 },
      { id: "nani_15", name: "Nani", positions: ["RW", "RM", "LW"], fifaRating: 83 }, { id: "volkan_s_15", name: "Volkan Şen", positions: ["LW", "LM", "RW"], fifaRating: 78 },
      { id: "rvp_15", name: "Robin van Persie", positions: ["ST", "CF"], fifaRating: 84 }, { id: "fernandao_15", name: "Fernandão", positions: ["ST", "CF"], fifaRating: 79 }
    ],
  },
  {
    id: "2016-17", season: "2016-2017", tournament: "UEFA Avrupa Ligi", fifaEdition: "FIFA 17", eraBadgeText: "2016-17", kitEraName: "2016-17 Adidas Çubuklu",
    kitColors: { primary: "#001a3a", secondary: "#fed100", stripe: "#fed100", collar: "#ffffff" },
    players: [
      { id: "volkan_16", name: "Volkan Demirel", positions: ["GK"], fifaRating: 79 }, { id: "fabiano_16", name: "Fabiano Ribeiro", positions: ["GK"], fifaRating: 75 },
      { id: "kjaer_16", name: "Simon Kjær", positions: ["CB"], fifaRating: 81 }, { id: "skrtel_16", name: "Martin Škrtel", positions: ["CB"], fifaRating: 81 },
      { id: "neustadter_16", name: "Roman Neustädter", positions: ["CB", "CDM"], fifaRating: 77 }, { id: "vdw_16", name: "Gregory van der Wiel", positions: ["RB", "RWB"], fifaRating: 77 },
      { id: "sener_16", name: "Şener Özbayraklı", positions: ["RB"], fifaRating: 75 }, { id: "hasan_16", name: "Hasan Ali Kaldırım", positions: ["LB", "LWB"], fifaRating: 76 },
      { id: "ismail_k_16", name: "İsmail Köybaşı", positions: ["LB"], fifaRating: 74 }, { id: "topal_16", name: "Mehmet Topal", positions: ["CDM", "CM"], fifaRating: 79 },
      { id: "souza_16", name: "Josef de Souza", positions: ["CDM", "CM"], fifaRating: 80 }, { id: "ozan_16", name: "Ozan Tufan", positions: ["CM", "RM"], fifaRating: 76 },
      { id: "alper_16", name: "Alper Potuk", positions: ["CAM", "CM", "LM"], fifaRating: 77 }, { id: "salih_16", name: "Salih Uçan", positions: ["CAM", "CM"], fifaRating: 74 },
      { id: "lens_16", name: "Jeremain Lens", positions: ["RW", "RM", "LW"], fifaRating: 82 }, { id: "aatif_16", name: "Aatif Chahechouhe", positions: ["LW", "CAM"], fifaRating: 77 },
      { id: "sow_16", name: "Moussa Sow", positions: ["LW", "ST", "CF"], fifaRating: 80 }, { id: "rvp_16", name: "Robin van Persie", positions: ["ST", "CF"], fifaRating: 81 }
    ],
  },
  {
    id: "2021-22", season: "2021-2022", tournament: "Süper Lig & UEFA Avrupa Ligi", fifaEdition: "FIFA 22", eraBadgeText: "2021-22", kitEraName: "2021-22 Puma Çubuklu",
    kitColors: { primary: "#001a3a", secondary: "#ffe600", stripe: "#ffe600", collar: "#001a3a" },
    players: [
      { id: "altay_21", name: "Altay Bayındır", positions: ["GK"], fifaRating: 79 }, { id: "berke_21", name: "Berke Özer", positions: ["GK"], fifaRating: 73 },
      { id: "kim_21", name: "Kim Min-jae", positions: ["CB"], fifaRating: 82 }, { id: "szalai_21", name: "Attila Szalai", positions: ["CB", "LB"], fifaRating: 78 },
      { id: "serdar_a_21", name: "Serdar Aziz", positions: ["CB"], fifaRating: 76 }, { id: "tisserand_21", name: "Marcel Tisserand", positions: ["CB"], fifaRating: 76 },
      { id: "osayi_21", name: "Bright Osayi-Samuel", positions: ["RB", "RWB", "RM"], fifaRating: 75 }, { id: "nazim_21", name: "Nazım Sangaré", positions: ["RB"], fifaRating: 73 },
      { id: "ferdi_21", name: "Ferdi Kadıoğlu", positions: ["LB", "RB", "LM", "CM"], fifaRating: 77 }, { id: "novak_21", name: "Filip Novák", positions: ["LB", "CB"], fifaRating: 75 },
      { id: "crespo_21", name: "Miguel Crespo", positions: ["CM", "CDM"], fifaRating: 77 }, { id: "zajc_21", name: "Miha Zajc", positions: ["CM", "CAM"], fifaRating: 77 },
      { id: "mhy_21", name: "Mert Hakan Yandaş", positions: ["CM", "CAM"], fifaRating: 76 }, { id: "irfan_21", name: "İrfan Can Kahveci", positions: ["RW", "CAM", "CM"], fifaRating: 79 },
      { id: "arda_21", name: "Arda Güler", positions: ["CAM", "AMC", "RW"], fifaRating: 77 }, { id: "pelkas_21", name: "Dimitris Pelkas", positions: ["LW", "CAM"], fifaRating: 77 },
      { id: "valencia_21", name: "Enner Valencia", positions: ["ST", "CF", "LW"], fifaRating: 79 }, { id: "dursun_21", name: "Serdar Dursun", positions: ["ST", "CF"], fifaRating: 77 }
    ],
  },
  {
    id: "2022-23", season: "2022-2023", tournament: "Türkiye Kupası Şampiyonu (Valencia 29 Gol)", fifaEdition: "FIFA 23", eraBadgeText: "2022-23", kitEraName: "2022-23 Puma Çubuklu",
    kitColors: { primary: "#001a3a", secondary: "#ffe600", stripe: "#ffe600", collar: "#ffffff" },
    players: [
      { id: "altay_22", name: "Altay Bayındır", positions: ["GK"], fifaRating: 78 }, { id: "irfan_egri_22", name: "İrfan Can Eğribayat", positions: ["GK"], fifaRating: 74 },
      { id: "szalai_22", name: "Attila Szalai", positions: ["CB"], fifaRating: 78 }, { id: "peres_22", name: "Luan Peres", positions: ["CB", "LB"], fifaRating: 76 },
      { id: "serdar_a_22", name: "Serdar Aziz", positions: ["CB"], fifaRating: 76 }, { id: "samet_22", name: "Samet Akaydin", positions: ["CB"], fifaRating: 74 },
      { id: "osayi_22", name: "Bright Osayi-Samuel", positions: ["RB", "RWB"], fifaRating: 76 }, { id: "ferdi_22", name: "Ferdi Kadıoğlu", positions: ["LB", "RB", "LWB", "RWB"], fifaRating: 79 },
      { id: "alioski_22", name: "Ezgjan Alioski", positions: ["LB", "LWB", "LM"], fifaRating: 76 }, { id: "arao_22", name: "Willian Arão", positions: ["CDM", "CM", "CB"], fifaRating: 78 },
      { id: "ismail_22", name: "İsmail Yüksek", positions: ["CDM", "CM"], fifaRating: 76 }, { id: "crespo_22", name: "Miguel Crespo", positions: ["CM", "CDM"], fifaRating: 77 },
      { id: "zajc_22", name: "Miha Zajc", positions: ["CM", "CAM"], fifaRating: 77 }, { id: "irfan_22", name: "İrfan Can Kahveci", positions: ["RW", "RM", "CAM"], fifaRating: 79 },
      { id: "arda_22", name: "Arda Güler", positions: ["CAM", "AMC", "RW"], fifaRating: 80 }, { id: "rossi_22", name: "Diego Rossi", positions: ["LW", "LM", "RW"], fifaRating: 77 },
      { id: "valencia_22", name: "Enner Valencia", positions: ["ST", "CF", "LW"], fifaRating: 81 }, { id: "bats_22", name: "Michy Batshuayi", positions: ["ST", "CF"], fifaRating: 79 }
    ],
  },
  {
    id: "2023-24", season: "2023-2024", tournament: "UEFA Konferans Ligi Çeyrek Final (99 Puan)", fifaEdition: "EA SPORTS FC 24", eraBadgeText: "2023-24", kitEraName: "2023-24 Puma Otokoç Çubuklu",
    kitColors: { primary: "#001a3a", secondary: "#ffe600", stripe: "#ffe600", collar: "#ffffff" },
    players: [
      { id: "livakovic_23", name: "Dominik Livaković", positions: ["GK"], fifaRating: 82 }, { id: "irfan_egri_23", name: "İrfan Can Eğribayat", positions: ["GK"], fifaRating: 75 },
      { id: "djiku_23", name: "Alexander Djiku", positions: ["CB"], fifaRating: 80 }, { id: "becao_23", name: "Rodrigo Becão", positions: ["CB"], fifaRating: 79 },
      { id: "caglar_23", name: "Çağlar Söyüncü", positions: ["CB"], fifaRating: 78 }, { id: "bonucci_23", name: "Leonardo Bonucci", positions: ["CB"], fifaRating: 78 },
      { id: "oosterwolde_23", name: "Jayden Oosterwolde", positions: ["LB", "CB", "LWB"], fifaRating: 78 }, { id: "ferdi_23", name: "Ferdi Kadıoğlu", positions: ["LB", "RB", "CM", "LWB"], fifaRating: 82 },
      { id: "osayi_23", name: "Bright Osayi-Samuel", positions: ["RB", "RWB", "RM"], fifaRating: 77 }, { id: "muldur_23", name: "Mert Müldür", positions: ["RB", "LB"], fifaRating: 76 },
      { id: "ismail_23", name: "İsmail Yüksek", positions: ["CDM", "CM"], fifaRating: 78 }, { id: "krunic_23", name: "Rade Krunić", positions: ["CDM", "CM"], fifaRating: 76 },
      { id: "fred_23", name: "Fred", positions: ["CM", "CDM"], fifaRating: 82 }, { id: "szymanski_23", name: "Sebastian Szymański", positions: ["CAM", "AMC", "CM"], fifaRating: 81 },
      { id: "irfan_23", name: "İrfan Can Kahveci", positions: ["RW", "RM", "CAM"], fifaRating: 81 }, { id: "tadic_23", name: "Dušan Tadić", positions: ["LW", "LM", "CAM"], fifaRating: 82 },
      { id: "dzeko_23", name: "Edin Džeko", positions: ["ST", "CF"], fifaRating: 83 }, { id: "bats_23", name: "Michy Batshuayi", positions: ["ST", "CF"], fifaRating: 79 }
    ],
  },
  {
    id: "2026-27", season: "2026-2027", tournament: "UEFA Şampiyonlar Ligi", fifaEdition: "EA SPORTS FC 27", eraBadgeText: "2026-27", kitEraName: "2026-27 Puma Altın Şeritli Çubuklu",
    kitColors: { primary: "#051630", secondary: "#ffd700", stripe: "#ffd700", collar: "#ffd700" },
    players: [
      { id: "ederson_26", name: "Ederson", positions: ["GK"], fifaRating: 87 }, { id: "tarik_26", name: "Tarık Çetin", positions: ["GK"], fifaRating: 74 },
      { id: "skriniar_26", name: "Milan Škriniar", positions: ["CB"], fifaRating: 84 }, { id: "ake_26", name: "Nathan Aké", positions: ["CB", "LB"], fifaRating: 83 },
      { id: "djiku_26", name: "Alexander Djiku", positions: ["CB"], fifaRating: 79 }, { id: "brown_26", name: "Archie Brown", positions: ["LB", "LWB"], fifaRating: 80 },
      { id: "mercan_26", name: "Levent Mercan", positions: ["LB", "LWB"], fifaRating: 76 }, { id: "semedo_26", name: "Nélson Semedo", positions: ["RB", "RWB"], fifaRating: 81 },
      { id: "muldur_26", name: "Mert Müldür", positions: ["RB", "LB"], fifaRating: 77 }, { id: "kante_26", name: "N'Golo Kanté", positions: ["CDM", "CM"], fifaRating: 84 },
      { id: "ismail_26", name: "İsmail Yüksek", positions: ["CDM", "CM"], fifaRating: 78 }, { id: "guendouzi_26", name: "Mattéo Guendouzi", positions: ["CM", "CDM"], fifaRating: 82 },
      { id: "szymanski_26", name: "Sebastian Szymański", positions: ["CAM", "CM"], fifaRating: 81 }, { id: "asensio_26", name: "Marco Asensio", positions: ["CAM", "AMC", "RW"], fifaRating: 83 },
      { id: "greenwood_26", name: "Mason Greenwood", positions: ["RW", "RM", "ST"], fifaRating: 84 }, { id: "irfan_26", name: "İrfan Can Kahveci", positions: ["RW", "CAM"], fifaRating: 80 },
      { id: "kerem_26", name: "Kerem Aktürkoğlu", positions: ["LW", "LM"], fifaRating: 81 }, { id: "lukaku_26", name: "Romelu Lukaku", positions: ["ST", "CF"], fifaRating: 84 }
    ],
  },
];
