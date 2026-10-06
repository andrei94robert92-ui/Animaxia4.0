import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface Episode {
  id: string;
  seasonNumber: number;
  episodeNumber: number;
  title: string;
  romajiTitle?: string;
  description: string;
  thumbnail: string;
  duration: string;
  durationSeconds: number;
  videoUrl: string;
  subtitlesUrl?: string;
  introStart?: number;
  introEnd?: number;
  outroStart?: number;
}

export interface Anime {
  id: string;
  title: string;
  romajiTitle: string;
  englishTitle: string;
  description: string;
  coverImage: string;
  bannerImage: string;
  genres: string[];
  rating: number;
  totalRatings: number;
  releaseYear: number;
  season: 'Iarnă' | 'Primăvară' | 'Vară' | 'Toamnă';
  status: 'În difuzare' | 'Finalizat' | 'În curând';
  studio: string;
  ageRating: string;
  featured: boolean;
  trendingRank?: number;
  totalEpisodes: number;
  episodes: Episode[];
  createdAt: string;
}

export interface WatchHistoryItem {
  userId: string;
  animeId: string;
  episodeId: string;
  progressSeconds: number;
  durationSeconds: number;
  completed: boolean;
  updatedAt: string;
}

export interface WatchlistItem {
  userId: string;
  animeId: string;
  status: 'watching' | 'plan_to_watch' | 'completed' | 'on_hold' | 'dropped';
  favorite: boolean;
  updatedAt: string;
}

export interface CommentItem {
  id: string;
  animeId: string;
  episodeId?: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  timestampVideo?: number;
  isSpoiler: boolean;
  likes: number;
  likedBy: string[];
  createdAt: string;
}

export interface UserRating {
  userId: string;
  animeId: string;
  score: number;
  updatedAt: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  tag: string;
  role: 'admin' | 'user' | 'vip';
  joinedDate: string;
}

export interface DatabaseSchema {
  animes: Anime[];
  watchHistory: WatchHistoryItem[];
  watchlist: WatchlistItem[];
  comments: CommentItem[];
  userRatings: UserRating[];
  users: UserProfile[];
  settings: {
    siteName: string;
    announcement: string;
    version: string;
    lastBackup: string;
  };
}

// Sample video streams (high quality, reliable public domain / open-film / CDN video streams)
const SAMPLE_VIDEOS = {
  action: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  fantasy: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
  sciFi: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
  drama: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
  adventure: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  chill: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
};

const SEED_DATA: DatabaseSchema = {
  animes: [
    {
      id: 'shingeki-no-kyojin',
      title: 'Atacul Titanilor',
      romajiTitle: 'Shingeki no Kyojin',
      englishTitle: 'Attack on Titan',
      description: 'După ce orașul său natal este distrus și mama sa ucisă de titani înspăimântători, tânărul Eren Yeager jură să curețe pământul de giganții care au adus omenirea în pragul dispariției.',
      coverImage: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80',
      bannerImage: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1600&auto=format&fit=crop&q=80',
      genres: ['Acțiune', 'Fantezie Întunecată', 'Mister', 'Dramă'],
      rating: 9.8,
      totalRatings: 14200,
      releaseYear: 2023,
      season: 'Toamnă',
      status: 'Finalizat',
      studio: 'MAPPA / Wit Studio',
      ageRating: '16+',
      featured: true,
      trendingRank: 1,
      totalEpisodes: 4,
      createdAt: new Date().toISOString(),
      episodes: [
        {
          id: 'snk-s1-ep1',
          seasonNumber: 1,
          episodeNumber: 1,
          title: 'Către tine, peste 2000 de ani',
          romajiTitle: 'Ni-sen Nen-go no Kimi e',
          description: 'Omenirea a trăit timp de un secol protejată de ziduri colosale. Dar o zi obișnuită este spulberată de apariția Titanului Colosal.',
          thumbnail: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400&auto=format&fit=crop&q=80',
          duration: '24m',
          durationSeconds: 1440,
          videoUrl: SAMPLE_VIDEOS.sciFi,
          introStart: 90,
          introEnd: 175,
        },
        {
          id: 'snk-s1-ep2',
          seasonNumber: 1,
          episodeNumber: 2,
          title: 'Acea zi: Căderea Shiganshinei',
          romajiTitle: 'Sono Hi',
          description: 'Refugiații fug spre Zidul Rose în timp ce Titanul Blindat pătrunde prin poarta fortificată.',
          thumbnail: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&auto=format&fit=crop&q=80',
          duration: '23m',
          durationSeconds: 1380,
          videoUrl: SAMPLE_VIDEOS.action,
          introStart: 70,
          introEnd: 155,
        },
        {
          id: 'snk-s1-ep3',
          seasonNumber: 1,
          episodeNumber: 3,
          title: 'O licărire palidă în mijlocul disperării',
          romajiTitle: 'Zetsubou no Naka de Nibuku Hikaru',
          description: 'Eren, Mikasa și Armin se înrolează în Corpul de Cadeți 104 pentru antrenamente de supraviețuire.',
          thumbnail: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=400&auto=format&fit=crop&q=80',
          duration: '24m',
          durationSeconds: 1440,
          videoUrl: SAMPLE_VIDEOS.drama,
          introStart: 85,
          introEnd: 170,
        },
        {
          id: 'snk-s1-ep4',
          seasonNumber: 1,
          episodeNumber: 4,
          title: 'Noaptea ceremoniei de absolvire',
          romajiTitle: 'Kaisan no Yoru',
          description: 'Cadeții își aleg regimentele, dar o nouă surpriză terifiantă zguduie districtul Trost.',
          thumbnail: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=400&auto=format&fit=crop&q=80',
          duration: '24m',
          durationSeconds: 1440,
          videoUrl: SAMPLE_VIDEOS.adventure,
          introStart: 60,
          introEnd: 145,
        },
      ],
    },
    {
      id: 'kimetsu-no-yaiba',
      title: 'Vânătorul de Demoni',
      romajiTitle: 'Kimetsu no Yaiba',
      englishTitle: 'Demon Slayer',
      description: 'Tanjiro Kamado pornește într-o călătorie periculoasă pentru a-și răzbuna familia masacrată de un demon și pentru a găsi un leac pentru sora sa transformată, Nezuko.',
      coverImage: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop&q=80',
      bannerImage: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=1600&auto=format&fit=crop&q=80',
      genres: ['Acțiune', 'Supranatural', 'Fantezie', 'Istoric'],
      rating: 9.6,
      totalRatings: 11890,
      releaseYear: 2024,
      season: 'Primăvară',
      status: 'În difuzare',
      studio: 'ufotable',
      ageRating: '16+',
      featured: true,
      trendingRank: 2,
      totalEpisodes: 3,
      createdAt: new Date().toISOString(),
      episodes: [
        {
          id: 'kny-s1-ep1',
          seasonNumber: 1,
          episodeNumber: 1,
          title: 'Cruzime',
          romajiTitle: 'Zankoku',
          description: 'O călătorie obișnuită până în sat pentru a vinde cărbune se transformă într-o tragedie fără margini.',
          thumbnail: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=400&auto=format&fit=crop&q=80',
          duration: '24m',
          durationSeconds: 1440,
          videoUrl: SAMPLE_VIDEOS.action,
          introStart: 75,
          introEnd: 160,
        },
        {
          id: 'kny-s1-ep2',
          seasonNumber: 1,
          episodeNumber: 2,
          title: 'Antrenorul Sakonji Urokodaki',
          romajiTitle: 'Ikuseishu Urokodaki Sakonji',
          description: 'Giyu îl trimite pe Tanjiro la Muntele Sagiri pentru a învăța respirația apei.',
          thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&auto=format&fit=crop&q=80',
          duration: '23m',
          durationSeconds: 1380,
          videoUrl: SAMPLE_VIDEOS.drama,
          introStart: 70,
          introEnd: 155,
        },
        {
          id: 'kny-s1-ep3',
          seasonNumber: 1,
          episodeNumber: 3,
          title: 'Sabito și Makomo',
          romajiTitle: 'Sabito to Makomo',
          description: 'Tanjiro înfruntă stânca uriașă cu ajutorul a doi mentori misterioși.',
          thumbnail: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=400&auto=format&fit=crop&q=80',
          duration: '24m',
          durationSeconds: 1440,
          videoUrl: SAMPLE_VIDEOS.sciFi,
          introStart: 65,
          introEnd: 150,
        },
      ],
    },
    {
      id: 'frieren-beyond-journeys-end',
      title: 'Frieren: Dincolo de Sfârșitul Călătoriei',
      romajiTitle: 'Sousou no Frieren',
      englishTitle: "Frieren: Beyond Journey's End",
      description: 'Vrăjitoarea elfă Frieren și tovarășii ei au învins Regele Demon. Dar în timp ce viețile oamenilor sunt scurte, Frieren trăiește milenii întregi și începe o nouă călătorie pentru a înțelege sufletul omenesc.',
      coverImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
      bannerImage: 'https://images.unsplash.com/photo-1519638399535-1b036603ac77?w=1600&auto=format&fit=crop&q=80',
      genres: ['Fantezie', 'Aventură', 'Dramă', 'Filosofic'],
      rating: 9.9,
      totalRatings: 18450,
      releaseYear: 2024,
      season: 'Iarnă',
      status: 'Finalizat',
      studio: 'Madhouse',
      ageRating: '13+',
      featured: true,
      trendingRank: 3,
      totalEpisodes: 3,
      createdAt: new Date().toISOString(),
      episodes: [
        {
          id: 'frieren-ep1',
          seasonNumber: 1,
          episodeNumber: 1,
          title: 'Sfârșitul aventurii',
          romajiTitle: 'Bouken no Owari',
          description: 'După 10 ani de bătălii, echipa eroului Himmel se întoarce triumfătoare în capitală.',
          thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&auto=format&fit=crop&q=80',
          duration: '24m',
          durationSeconds: 1440,
          videoUrl: SAMPLE_VIDEOS.fantasy,
          introStart: 80,
          introEnd: 165,
        },
        {
          id: 'frieren-ep2',
          seasonNumber: 1,
          episodeNumber: 2,
          title: 'Nu a fost chiar o magie necesară',
          romajiTitle: 'Betsu ni Mahou de Naku temo',
          description: 'Frieren o acceptă pe tânăra Fern ca ucenică și își continuă periplul prin ținuturile nordice.',
          thumbnail: 'https://images.unsplash.com/photo-1519638399535-1b036603ac77?w=400&auto=format&fit=crop&q=80',
          duration: '24m',
          durationSeconds: 1440,
          videoUrl: SAMPLE_VIDEOS.chill,
          introStart: 70,
          introEnd: 155,
        },
        {
          id: 'frieren-ep3',
          seasonNumber: 1,
          episodeNumber: 3,
          title: 'Magie pentru uciderea demonilor',
          romajiTitle: 'Zoltraak',
          description: 'Frieren investighează pecetea lui Qual, Demonul Corupției, învins cu decenii în urmă.',
          thumbnail: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400&auto=format&fit=crop&q=80',
          duration: '24m',
          durationSeconds: 1440,
          videoUrl: SAMPLE_VIDEOS.sciFi,
          introStart: 75,
          introEnd: 160,
        },
      ],
    },
    {
      id: 'cyberpunk-edgerunners',
      title: 'Cyberpunk: Edgerunners',
      romajiTitle: 'Cyberpunk: Edgerunners',
      englishTitle: 'Cyberpunk: Edgerunners',
      description: 'Într-o metropolă coruptă de tehnologie și modificări corporale, un tânăr de pe stradă decide să devină un Edgerunner — un mercenar haiduc gata să riște totul pentru un vis.',
      coverImage: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80',
      bannerImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1600&auto=format&fit=crop&q=80',
      genres: ['Cyberpunk', 'Acțiune', 'Sci-Fi', 'Tragedie'],
      rating: 9.3,
      totalRatings: 9200,
      releaseYear: 2022,
      season: 'Vară',
      status: 'Finalizat',
      studio: 'Studio Trigger',
      ageRating: '18+',
      featured: true,
      trendingRank: 4,
      totalEpisodes: 2,
      createdAt: new Date().toISOString(),
      episodes: [
        {
          id: 'cbr-ep1',
          seasonNumber: 1,
          episodeNumber: 1,
          title: 'Let You Down',
          romajiTitle: 'Let You Down',
          description: 'David Martinez încearcă să supraviețuiască la prestigioasa Academie Arasaka în ciuda sărăciei sale extreme.',
          thumbnail: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=400&auto=format&fit=crop&q=80',
          duration: '25m',
          durationSeconds: 1500,
          videoUrl: SAMPLE_VIDEOS.sciFi,
          introStart: 60,
          introEnd: 145,
        },
        {
          id: 'cbr-ep2',
          seasonNumber: 1,
          episodeNumber: 2,
          title: 'Like a Boy',
          romajiTitle: 'Like a Boy',
          description: 'David își instalează implantul militar Sandevistan și o întâlnește în metrou pe misterioasa Lucy.',
          thumbnail: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&auto=format&fit=crop&q=80',
          duration: '24m',
          durationSeconds: 1440,
          videoUrl: SAMPLE_VIDEOS.action,
          introStart: 55,
          introEnd: 140,
        },
      ],
    },
    {
      id: 'jujutsu-kaisen',
      title: 'Jujutsu Kaisen',
      romajiTitle: 'Jujutsu Kaisen',
      englishTitle: 'Jujutsu Kaisen',
      description: 'Yuji Itadori înghite un deget blestemat legendar aparținând lui Ryomen Sukuna, regele blestemelor, devenind gazda acestuia și intrând în lumea secretă a vrăjitorilor Jujutsu.',
      coverImage: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=600&auto=format&fit=crop&q=80',
      bannerImage: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1600&auto=format&fit=crop&q=80',
      genres: ['Acțiune', 'Supranatural', 'Shounen', 'Mister'],
      rating: 9.5,
      totalRatings: 13100,
      releaseYear: 2023,
      season: 'Vară',
      status: 'În difuzare',
      studio: 'MAPPA',
      ageRating: '16+',
      featured: false,
      trendingRank: 5,
      totalEpisodes: 2,
      createdAt: new Date().toISOString(),
      episodes: [
        {
          id: 'jjk-ep1',
          seasonNumber: 1,
          episodeNumber: 1,
          title: 'Ryomen Sukuna',
          romajiTitle: 'Ryomen Sukuna',
          description: 'Clubul de cercetări oculte desigilează un talisman periculos în miezul nopții.',
          thumbnail: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=400&auto=format&fit=crop&q=80',
          duration: '24m',
          durationSeconds: 1440,
          videoUrl: SAMPLE_VIDEOS.adventure,
          introStart: 70,
          introEnd: 155,
        },
        {
          id: 'jjk-ep2',
          seasonNumber: 1,
          episodeNumber: 2,
          title: 'Pentru mine însumi',
          romajiTitle: 'Jibun no Tameni',
          description: 'Gojo Satoru îi prezintă lui Yuji cele două opțiuni: execuție imediată sau colectarea tuturor degetelor.',
          thumbnail: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&auto=format&fit=crop&q=80',
          duration: '23m',
          durationSeconds: 1380,
          videoUrl: SAMPLE_VIDEOS.action,
          introStart: 65,
          introEnd: 150,
        },
      ],
    },
    {
      id: 'solo-leveling',
      title: 'Solo Leveling',
      romajiTitle: 'Ore dake Level Up na Ken',
      englishTitle: 'Solo Leveling',
      description: 'Într-o lume unde porți magice leagă pământul de temnițe cu monștri, cel mai slab vânător al omenirii, Sung Jinwoo, primește o a doua șansă și o interfață misterioasă care îi permite doar lui să crească în nivel.',
      coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
      bannerImage: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1600&auto=format&fit=crop&q=80',
      genres: ['Acțiune', 'Fantezie', 'RPG', 'Aventură'],
      rating: 9.4,
      totalRatings: 10400,
      releaseYear: 2024,
      season: 'Iarnă',
      status: 'În difuzare',
      studio: 'A-1 Pictures',
      ageRating: '16+',
      featured: false,
      trendingRank: 6,
      totalEpisodes: 2,
      createdAt: new Date().toISOString(),
      episodes: [
        {
          id: 'sl-ep1',
          seasonNumber: 1,
          episodeNumber: 1,
          title: 'Sunt obișnuit cu asta',
          romajiTitle: 'I\'m Used to It',
          description: 'O expediție de rutină într-o temniță de rang D dezvăluie o cameră secretă terifiantă.',
          thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80',
          duration: '24m',
          durationSeconds: 1440,
          videoUrl: SAMPLE_VIDEOS.fantasy,
          introStart: 85,
          introEnd: 170,
        },
        {
          id: 'sl-ep2',
          seasonNumber: 1,
          episodeNumber: 2,
          title: 'Dacă aș avea o altă șansă',
          romajiTitle: 'If I Had One More Chance',
          description: 'Statuile gigantice încep să se miște și impun regulile Templului Cartenon.',
          thumbnail: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=400&auto=format&fit=crop&q=80',
          duration: '24m',
          durationSeconds: 1440,
          videoUrl: SAMPLE_VIDEOS.action,
          introStart: 80,
          introEnd: 165,
        },
      ],
    },
    {
      id: 'spirited-away',
      title: 'Călătoria lui Chihiro',
      romajiTitle: 'Sen to Chihiro no Kamikakushi',
      englishTitle: 'Spirited Away',
      description: 'O fetiță de 10 ani se rătăcește într-o lume guvernată de zei, vrăjitoare și spirite, unde părinții ei sunt transformați în porci, fiind nevoită să lucreze într-o baie publică mistică pentru a-și recăpăta libertatea.',
      coverImage: 'https://images.unsplash.com/photo-1519638399535-1b036603ac77?w=600&auto=format&fit=crop&q=80',
      bannerImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1600&auto=format&fit=crop&q=80',
      genres: ['Aventură', 'Supranatural', 'Ghibli', 'Clasic'],
      rating: 9.7,
      totalRatings: 16700,
      releaseYear: 2001,
      season: 'Vară',
      status: 'Finalizat',
      studio: 'Studio Ghibli',
      ageRating: 'Toate vârstele',
      featured: false,
      trendingRank: 7,
      totalEpisodes: 1,
      createdAt: new Date().toISOString(),
      episodes: [
        {
          id: 'sa-film',
          seasonNumber: 1,
          episodeNumber: 1,
          title: 'Filmul Complet (Remasterizat HD)',
          romajiTitle: 'Eiga',
          description: 'Capodopera premiată cu Oscar a regizorului Hayao Miyazaki.',
          thumbnail: 'https://images.unsplash.com/photo-1519638399535-1b036603ac77?w=400&auto=format&fit=crop&q=80',
          duration: '2h 5m',
          durationSeconds: 7500,
          videoUrl: SAMPLE_VIDEOS.drama,
          introStart: 0,
          introEnd: 45,
        },
      ],
    },
    {
      id: 'bocchi-the-rock',
      title: 'Bocchi the Rock!',
      romajiTitle: 'Bocchi za Rokku!',
      englishTitle: 'Bocchi the Rock!',
      description: 'Hitori Gotoh este o elevă de liceu extrem de anxioasă social, dar chitaristă genială pe internet sub pseudonimul guitarhero. Destinul o aduce în trupa Kessoku Band.',
      coverImage: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
      bannerImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1600&auto=format&fit=crop&q=80',
      genres: ['Comedie', 'Muzică', 'Slice of Life'],
      rating: 9.2,
      totalRatings: 7800,
      releaseYear: 2022,
      season: 'Toamnă',
      status: 'Finalizat',
      studio: 'CloverWorks',
      ageRating: '13+',
      featured: false,
      trendingRank: 8,
      totalEpisodes: 2,
      createdAt: new Date().toISOString(),
      episodes: [
        {
          id: 'btr-ep1',
          seasonNumber: 1,
          episodeNumber: 1,
          title: 'Singuraticul rostogolitor',
          romajiTitle: 'Korogaru Bocchi',
          description: 'Hitori ia chitara la școală sperând cu disperare că cineva o va invita într-o trupă.',
          thumbnail: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&auto=format&fit=crop&q=80',
          duration: '24m',
          durationSeconds: 1440,
          videoUrl: SAMPLE_VIDEOS.chill,
          introStart: 60,
          introEnd: 145,
        },
        {
          id: 'btr-ep2',
          seasonNumber: 1,
          episodeNumber: 2,
          title: 'Până mâine',
          romajiTitle: 'Mata Ashita',
          description: 'Prima slujbă part-time a lui Bocchi la clubul de muzică live Starry.',
          thumbnail: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&auto=format&fit=crop&q=80',
          duration: '23m',
          durationSeconds: 1380,
          videoUrl: SAMPLE_VIDEOS.fantasy,
          introStart: 70,
          introEnd: 155,
        },
      ],
    },
  ],
  watchHistory: [
    {
      userId: 'user-1',
      animeId: 'shingeki-no-kyojin',
      episodeId: 'snk-s1-ep1',
      progressSeconds: 840,
      durationSeconds: 1440,
      completed: false,
      updatedAt: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      userId: 'user-1',
      animeId: 'frieren-beyond-journeys-end',
      episodeId: 'frieren-ep1',
      progressSeconds: 1210,
      durationSeconds: 1440,
      completed: false,
      updatedAt: new Date(Date.now() - 86400000).toISOString(),
    },
  ],
  watchlist: [
    {
      userId: 'user-1',
      animeId: 'kimetsu-no-yaiba',
      status: 'watching',
      favorite: true,
      updatedAt: new Date().toISOString(),
    },
    {
      userId: 'user-1',
      animeId: 'cyberpunk-edgerunners',
      status: 'plan_to_watch',
      favorite: true,
      updatedAt: new Date().toISOString(),
    },
    {
      userId: 'user-1',
      animeId: 'frieren-beyond-journeys-end',
      status: 'watching',
      favorite: true,
      updatedAt: new Date().toISOString(),
    },
  ],
  comments: [
    {
      id: 'c-1',
      animeId: 'shingeki-no-kyojin',
      episodeId: 'snk-s1-ep1',
      userId: 'user-2',
      userName: 'Sakura_Yuki',
      userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      content: 'Episodul 1 te prinde instantaneu! Coloana sonoră compusă de Hiroyuki Sawano dă fiori de fiecare dată.',
      timestampVideo: 180,
      isSpoiler: false,
      likes: 24,
      likedBy: ['user-1', 'user-3'],
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
    {
      id: 'c-2',
      animeId: 'shingeki-no-kyojin',
      episodeId: 'snk-s1-ep1',
      userId: 'user-3',
      userName: 'Radu Sensei',
      userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      content: 'Atenție la secvența din vis de la început, are semnificații enorme pentru întregul final al seriei!',
      timestampVideo: 45,
      isSpoiler: true,
      likes: 18,
      likedBy: ['user-1'],
      createdAt: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: 'c-3',
      animeId: 'frieren-beyond-journeys-end',
      episodeId: 'frieren-ep1',
      userId: 'user-1',
      userName: 'Alexandru Otaku',
      userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      content: 'Frieren este pură poezie vizuală. Ritmul lent și emoția pură sunt exact ceea ce lipsea din anime-urile actuale.',
      isSpoiler: false,
      likes: 31,
      likedBy: ['user-2'],
      createdAt: new Date().toISOString(),
    },
  ],
  userRatings: [
    {
      userId: 'user-1',
      animeId: 'shingeki-no-kyojin',
      score: 10,
      updatedAt: new Date().toISOString(),
    },
    {
      userId: 'user-1',
      animeId: 'frieren-beyond-journeys-end',
      score: 10,
      updatedAt: new Date().toISOString(),
    },
  ],
  users: [
    {
      id: 'user-1',
      name: 'Alexandru Otaku',
      email: 'alex@animaxia.local',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      tag: '@alex_otaku',
      role: 'admin',
      joinedDate: '2024-01-15',
    },
    {
      id: 'user-2',
      name: 'Sakura_Yuki',
      email: 'sakura@animaxia.local',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      tag: '@sakura_yuki',
      role: 'vip',
      joinedDate: '2024-03-20',
    },
    {
      id: 'user-3',
      name: 'Radu Sensei',
      email: 'radu@animaxia.local',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      tag: '@radu_sensei',
      role: 'user',
      joinedDate: '2024-04-02',
    },
  ],
  settings: {
    siteName: 'Animaxia',
    announcement: 'Bun venit pe Animaxia! Streaming 100% local, fără reclame, cu redare instantanee HD.',
    version: '2.5.0-local',
    lastBackup: new Date().toISOString(),
  },
};

class LocalDatabase {
  private filePath: string;
  private data: DatabaseSchema;

  constructor() {
    const dataDir = path.resolve(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    this.filePath = path.resolve(dataDir, 'animaxia-db.json');
    this.data = this.loadDatabase();
  }

  private loadDatabase(): DatabaseSchema {
    try {
      if (fs.existsSync(this.filePath)) {
        const fileContent = fs.readFileSync(this.filePath, 'utf-8');
        const parsed = JSON.parse(fileContent);
        if (parsed && Array.isArray(parsed.animes) && parsed.animes.length > 0) {
          return parsed;
        }
      }
    } catch (err) {
      console.error('[Animaxia DB] Eroare la citirea fișierului local. Se va crea baza de date nouă:', err);
    }

    // Save initial seed data
    this.saveToDisk(SEED_DATA);
    return JSON.parse(JSON.stringify(SEED_DATA));
  }

  private saveToDisk(data: DatabaseSchema) {
    try {
      const json = JSON.stringify(data, null, 2);
      fs.writeFileSync(this.filePath, json, 'utf-8');
    } catch (err) {
      console.error('[Animaxia DB] Eroare la scrierea pe disc:', err);
    }
  }

  private persist() {
    this.saveToDisk(this.data);
  }

  // --- STATS & MANAGEMENT ---
  public getStats() {
    const totalEpisodes = this.data.animes.reduce((acc, a) => acc + (a.episodes?.length || 0), 0);
    const totalMinutes = this.data.animes.reduce((acc, a) => {
      return acc + (a.episodes || []).reduce((epAcc, ep) => epAcc + Math.floor(ep.durationSeconds / 60), 0);
    }, 0);

    return {
      totalAnimes: this.data.animes.length,
      totalEpisodes,
      totalMinutes,
      totalComments: this.data.comments.length,
      totalUsers: this.data.users.length,
      activeWatchHistory: this.data.watchHistory.length,
      databaseFile: this.filePath,
      fileSizeBytes: fs.existsSync(this.filePath) ? fs.statSync(this.filePath).size : 0,
      settings: this.data.settings,
    };
  }

  public exportDatabase(): string {
    return JSON.stringify(this.data, null, 2);
  }

  public importDatabase(newData: any) {
    if (!newData || !Array.isArray(newData.animes)) {
      throw new Error('Structura fișierului JSON este invalidă.');
    }
    this.data = newData;
    this.data.settings.lastBackup = new Date().toISOString();
    this.persist();
  }

  public resetToDefault() {
    this.data = JSON.parse(JSON.stringify(SEED_DATA));
    this.persist();
  }

  // --- ANIMES ---
  public getAnimes(filters?: {
    search?: string;
    genre?: string;
    status?: string;
    sort?: string;
    season?: string;
    year?: number;
  }): Anime[] {
    let result = [...this.data.animes];

    if (filters?.search) {
      const q = filters.search.toLowerCase().trim();
      result = result.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.romajiTitle.toLowerCase().includes(q) ||
          a.englishTitle.toLowerCase().includes(q) ||
          a.description.toLowerCase().includes(q) ||
          a.genres.some((g) => g.toLowerCase().includes(q))
      );
    }

    if (filters?.genre && filters.genre !== 'Toate') {
      result = result.filter((a) =>
        a.genres.some((g) => g.toLowerCase() === filters.genre!.toLowerCase())
      );
    }

    if (filters?.status && filters.status !== 'Toate') {
      result = result.filter((a) => a.status === filters.status);
    }

    if (filters?.season && filters.season !== 'Toate') {
      result = result.filter((a) => a.season === filters.season);
    }

    if (filters?.year) {
      result = result.filter((a) => a.releaseYear === filters.year);
    }

    // Sort
    if (filters?.sort) {
      switch (filters.sort) {
        case 'rating':
          result.sort((a, b) => b.rating - a.rating);
          break;
        case 'year_desc':
          result.sort((a, b) => b.releaseYear - a.releaseYear);
          break;
        case 'year_asc':
          result.sort((a, b) => a.releaseYear - b.releaseYear);
          break;
        case 'title':
          result.sort((a, b) => a.title.localeCompare(b.title));
          break;
        case 'episodes':
          result.sort((a, b) => (b.episodes?.length || 0) - (a.episodes?.length || 0));
          break;
        default:
          // Default popular/trending
          result.sort((a, b) => (a.trendingRank || 99) - (b.trendingRank || 99));
      }
    }

    return result;
  }

  public getFeaturedAnimes(): Anime[] {
    return this.data.animes.filter((a) => a.featured);
  }

  public getTrendingAnimes(): Anime[] {
    return [...this.data.animes]
      .sort((a, b) => (a.trendingRank || 99) - (b.trendingRank || 99))
      .slice(0, 8);
  }

  public getAnimeById(id: string): Anime | undefined {
    return this.data.animes.find((a) => a.id === id);
  }

  public createAnime(animeData: Partial<Anime>): Anime {
    const id =
      animeData.id ||
      animeData.title
        ?.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '') ||
      `anime-${Date.now()}`;

    const newAnime: Anime = {
      id,
      title: animeData.title || 'Anime Nou',
      romajiTitle: animeData.romajiTitle || animeData.title || '',
      englishTitle: animeData.englishTitle || animeData.title || '',
      description: animeData.description || 'Fără descriere.',
      coverImage:
        animeData.coverImage ||
        'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80',
      bannerImage:
        animeData.bannerImage ||
        animeData.coverImage ||
        'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1600&auto=format&fit=crop&q=80',
      genres: animeData.genres?.length ? animeData.genres : ['Acțiune'],
      rating: animeData.rating || 9.0,
      totalRatings: animeData.totalRatings || 1,
      releaseYear: animeData.releaseYear || new24Year(),
      season: animeData.season || 'Iarnă',
      status: animeData.status || 'În difuzare',
      studio: animeData.studio || 'Studio Animație',
      ageRating: animeData.ageRating || '13+',
      featured: !!animeData.featured,
      trendingRank: animeData.trendingRank || this.data.animes.length + 1,
      totalEpisodes: animeData.episodes?.length || 0,
      episodes: animeData.episodes || [],
      createdAt: new Date().toISOString(),
    };

    this.data.animes.unshift(newAnime);
    this.persist();
    return newAnime;
  }

  public updateAnime(id: string, update: Partial<Anime>): Anime | null {
    const idx = this.data.animes.findIndex((a) => a.id === id);
    if (idx === -1) return null;

    const current = this.data.animes[idx];
    const updated = {
      ...current,
      ...update,
      totalEpisodes: update.episodes ? update.episodes.length : current.episodes.length,
    };
    this.data.animes[idx] = updated;
    this.persist();
    return updated;
  }

  public deleteAnime(id: string): boolean {
    const initialLen = this.data.animes.length;
    this.data.animes = this.data.animes.filter((a) => a.id !== id);
    // Cascade delete comments and history
    this.data.comments = this.data.comments.filter((c) => c.animeId !== id);
    this.data.watchHistory = this.data.watchHistory.filter((h) => h.animeId !== id);
    this.data.watchlist = this.data.watchlist.filter((w) => w.animeId !== id);
    this.data.userRatings = this.data.userRatings.filter((r) => r.animeId !== id);

    this.persist();
    return this.data.animes.length < initialLen;
  }

  // --- EPISODES ---
  public addEpisode(animeId: string, episodeData: Partial<Episode>): Episode | null {
    const anime = this.data.animes.find((a) => a.id === animeId);
    if (!anime) return null;

    const epNumber = episodeData.episodeNumber || anime.episodes.length + 1;
    const epId = episodeData.id || `${anime.id}-s${episodeData.seasonNumber || 1}-ep${epNumber}`;

    const newEpisode: Episode = {
      id: epId,
      seasonNumber: episodeData.seasonNumber || 1,
      episodeNumber: epNumber,
      title: episodeData.title || `Episodul ${epNumber}`,
      romajiTitle: episodeData.romajiTitle,
      description: episodeData.description || 'Descrierea episodului...',
      thumbnail: episodeData.thumbnail || anime.coverImage,
      duration: episodeData.duration || '24m',
      durationSeconds: episodeData.durationSeconds || 1440,
      videoUrl: episodeData.videoUrl || SAMPLE_VIDEOS.action,
      introStart: episodeData.introStart || 75,
      introEnd: episodeData.introEnd || 160,
      outroStart: episodeData.outroStart,
    };

    anime.episodes.push(newEpisode);
    anime.totalEpisodes = anime.episodes.length;
    this.persist();
    return newEpisode;
  }

  public updateEpisode(animeId: string, episodeId: string, update: Partial<Episode>): Episode | null {
    const anime = this.data.animes.find((a) => a.id === animeId);
    if (!anime) return null;

    const epIdx = anime.episodes.findIndex((e) => e.id === episodeId);
    if (epIdx === -1) return null;

    anime.episodes[epIdx] = { ...anime.episodes[epIdx], ...update };
    this.persist();
    return anime.episodes[epIdx];
  }

  public deleteEpisode(animeId: string, episodeId: string): boolean {
    const anime = this.data.animes.find((a) => a.id === animeId);
    if (!anime) return false;

    const initialLen = anime.episodes.length;
    anime.episodes = anime.episodes.filter((e) => e.id !== episodeId);
    anime.totalEpisodes = anime.episodes.length;

    this.data.watchHistory = this.data.watchHistory.filter(
      (h) => !(h.animeId === animeId && h.episodeId === episodeId)
    );

    this.persist();
    return anime.episodes.length < initialLen;
  }

  // --- WATCH HISTORY ---
  public getWatchHistory(userId: string) {
    const items = this.data.watchHistory
      .filter((h) => h.userId === userId)
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

    // Enrich with anime & episode metadata
    return items
      .map((item) => {
        const anime = this.data.animes.find((a) => a.id === item.animeId);
        if (!anime) return null;
        const episode = anime.episodes.find((e) => e.id === item.episodeId);
        return {
          ...item,
          animeTitle: anime.title,
          animeCover: anime.coverImage,
          animeBanner: anime.bannerImage,
          episodeTitle: episode ? episode.title : `Episod`,
          episodeNumber: episode ? episode.episodeNumber : 1,
          episodeThumbnail: episode ? episode.thumbnail : anime.coverImage,
          progressPercent: item.durationSeconds
            ? Math.min(100, Math.round((item.progressSeconds / item.durationSeconds) * 100))
            : 0,
        };
      })
      .filter(Boolean);
  }

  public saveWatchProgress(item: {
    userId: string;
    animeId: string;
    episodeId: string;
    progressSeconds: number;
    durationSeconds: number;
    completed: boolean;
  }): WatchHistoryItem {
    const idx = this.data.watchHistory.findIndex(
      (h) => h.userId === item.userId && h.animeId === item.animeId
    );

    const historyItem: WatchHistoryItem = {
      userId: item.userId,
      animeId: item.animeId,
      episodeId: item.episodeId,
      progressSeconds: item.progressSeconds,
      durationSeconds: item.durationSeconds,
      completed: item.completed,
      updatedAt: new Date().toISOString(),
    };

    if (idx >= 0) {
      this.data.watchHistory[idx] = historyItem;
    } else {
      this.data.watchHistory.unshift(historyItem);
    }

    this.persist();
    return historyItem;
  }

  public removeWatchHistory(userId: string, animeId: string) {
    this.data.watchHistory = this.data.watchHistory.filter(
      (h) => !(h.userId === userId && h.animeId === animeId)
    );
    this.persist();
  }

  public clearWatchHistory(userId: string) {
    this.data.watchHistory = this.data.watchHistory.filter((h) => h.userId !== userId);
    this.persist();
  }

  // --- WATCHLIST ---
  public getWatchlist(userId: string) {
    const list = this.data.watchlist.filter((w) => w.userId === userId);
    return list
      .map((w) => {
        const anime = this.data.animes.find((a) => a.id === w.animeId);
        if (!anime) return null;
        return {
          ...w,
          anime,
        };
      })
      .filter(Boolean);
  }

  public updateWatchlist(params: {
    userId: string;
    animeId: string;
    status?: 'watching' | 'plan_to_watch' | 'completed' | 'on_hold' | 'dropped';
    favorite?: boolean;
  }): WatchlistItem {
    const idx = this.data.watchlist.findIndex(
      (w) => w.userId === params.userId && w.animeId === params.animeId
    );

    if (idx >= 0) {
      const existing = this.data.watchlist[idx];
      this.data.watchlist[idx] = {
        ...existing,
        status: params.status !== undefined ? params.status : existing.status,
        favorite: params.favorite !== undefined ? params.favorite : existing.favorite,
        updatedAt: new Date().toISOString(),
      };
      this.persist();
      return this.data.watchlist[idx];
    } else {
      const newItem: WatchlistItem = {
        userId: params.userId,
        animeId: params.animeId,
        status: params.status || 'plan_to_watch',
        favorite: !!params.favorite,
        updatedAt: new Date().toISOString(),
      };
      this.data.watchlist.unshift(newItem);
      this.persist();
      return newItem;
    }
  }

  public removeFromWatchlist(userId: string, animeId: string) {
    this.data.watchlist = this.data.watchlist.filter(
      (w) => !(w.userId === userId && w.animeId === animeId)
    );
    this.persist();
  }

  // --- RATINGS ---
  public rateAnime(userId: string, animeId: string, score: number) {
    const idx = this.data.userRatings.findIndex(
      (r) => r.userId === userId && r.animeId === animeId
    );

    if (idx >= 0) {
      this.data.userRatings[idx].score = score;
      this.data.userRatings[idx].updatedAt = new Date().toISOString();
    } else {
      this.data.userRatings.push({
        userId,
        animeId,
        score,
        updatedAt: new Date().toISOString(),
      });
    }

    // Recalculate anime average rating
    const anime = this.data.animes.find((a) => a.id === animeId);
    if (anime) {
      const allRatings = this.data.userRatings.filter((r) => r.animeId === animeId);
      const sum = allRatings.reduce((acc, curr) => acc + curr.score, 0);
      const baseWeighted = (anime.rating * 10 + sum) / (10 + allRatings.length);
      anime.rating = parseFloat(baseWeighted.toFixed(1));
      anime.totalRatings += 1;
    }

    this.persist();
    return { score, newAverage: anime?.rating || score };
  }

  public getUserRating(userId: string, animeId: string): number | null {
    const rating = this.data.userRatings.find(
      (r) => r.userId === userId && r.animeId === animeId
    );
    return rating ? rating.score : null;
  }

  // --- COMMENTS ---
  public getComments(animeId: string, episodeId?: string): CommentItem[] {
    return this.data.comments
      .filter((c) => {
        if (episodeId) {
          return c.animeId === animeId && c.episodeId === episodeId;
        }
        return c.animeId === animeId;
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public addComment(comment: Omit<CommentItem, 'id' | 'likes' | 'likedBy' | 'createdAt'>): CommentItem {
    const newComment: CommentItem = {
      ...comment,
      id: `c-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      likes: 0,
      likedBy: [],
      createdAt: new Date().toISOString(),
    };
    this.data.comments.unshift(newComment);
    this.persist();
    return newComment;
  }

  public toggleLikeComment(commentId: string, userId: string): CommentItem | null {
    const comment = this.data.comments.find((c) => c.id === commentId);
    if (!comment) return null;

    const likedIndex = comment.likedBy.indexOf(userId);
    if (likedIndex >= 0) {
      comment.likedBy.splice(likedIndex, 1);
      comment.likes = Math.max(0, comment.likes - 1);
    } else {
      comment.likedBy.push(userId);
      comment.likes += 1;
    }
    this.persist();
    return comment;
  }

  public deleteComment(commentId: string): boolean {
    const initialLen = this.data.comments.length;
    this.data.comments = this.data.comments.filter((c) => c.id !== commentId);
    this.persist();
    return this.data.comments.length < initialLen;
  }

  // --- USERS ---
  public getUsers(): UserProfile[] {
    return this.data.users;
  }

  public createUser(user: Partial<UserProfile>): UserProfile {
    const newUser: UserProfile = {
      id: `user-${Date.now()}`,
      name: user.name || 'Otaku Nou',
      email: user.email || 'fan@animaxia.local',
      avatar:
        user.avatar ||
        'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=150&auto=format&fit=crop&q=80',
      tag: user.tag || `@user_${Math.floor(Math.random() * 1000)}`,
      role: (user.role as any) || 'user',
      joinedDate: new Date().toISOString().split('T')[0],
    };
    this.data.users.push(newUser);
    this.persist();
    return newUser;
  }
}

function new24Year() {
  return 2024;
}

export const db = new LocalDatabase();
