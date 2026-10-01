// ============ Auth & User ============
export interface User {
  id: number
  username: string
  email: string
  avatar: string | null
  fullName: string | null
  mobileNumber: string | null
  dateOfBirth: string | null
  age: number | null
  preferredVenue: Venue | null
  profileComplete: boolean
}

export interface LoginResponse {
  data: {
    user: User
    token: string
  }
}

// ============ Catalogue ============
export interface Venue {
  id: number
  slug: string
  name: string
  city: string
  formats: Format[]
}

export interface Format {
  id: number
  slug: string
  name: string
  priceUplift: number
}

export interface Language {
  id: number
  slug: string
  name: string
}

export interface Genre {
  id: number
  slug: string
  name: string
}

export interface AgeRating {
  code: 'G' | 'PG' | '12+' | '16+' | '18+'
  minAge: number
  description: string
}

export interface Movie {
  id: number
  slug: string
  title: string
  kind: 'film' | 'event'
  runtimeMinutes: number
  posterUrl: string | null
  backdropUrl: string | null
  releaseDate: string
  isComingSoon: boolean
  isFeatured: boolean
  fromPrice: number
  ageRating: AgeRating
  genres: Genre[]
  formats: Format[]
}

export interface MovieDetail extends Movie {
  synopsis: string
  director: string | null
  cast: string | null
  availableDates: string[]
}

// ============ Sessions ============
export interface Session {
  id: number
  startsAt: string
  date: string
  time: string
  timeBand: 'morning' | 'afternoon' | 'evening'
  price: number
  seatsLeft: number
  isSoldOut: boolean
  hall: { id: number; name: string }
  venue: Venue
  format: Format
  language: Language
  movie: Movie
}

export interface SessionsGroup {
  movie: Movie
  sessions: Session[]
}

export interface SessionsResponse {
  data: SessionsGroup[]
  meta: {
    currentPage: number
    lastPage: number
    perPage: number
    totalSessions: number
    totalMovies: number
    date: string
  }
}

// ============ Filter Options ============
export interface TicketType {
  id: number
  slug: 'adult' | 'child' | 'student'
  name: string
  priceRatio: number
  note: string | null
  blockedFromRatingAge: number | null
}

export interface FilterOptions {
  venues: Venue[]
  formats: Format[]
  languages: Language[]
  timeBands: { id: string; label: string }[]
  sorts: { id: string; label: string }[]
  ticketTypes: TicketType[]
  ageRatings: AgeRating[]
  maxSeatsPerOrder: number
  holdMinutes: number
}

// ============ Seats ============
export type SeatState = 'available' | 'sold' | 'held' | 'unavailable'

export interface Seat {
  id: number
  code: string
  label: string
  state: SeatState
  aisleAfter: boolean
  isMine: boolean
}

export interface SeatRow {
  label: string
  seats: Seat[]
}

export interface SeatSection {
  name: string
  rows: SeatRow[]
}

export interface SeatMap {
  sessionId: number
  hall: { id: number; name: string; venue: Venue }
  sections: SeatSection[]
}

// ============ Booking ============
export interface SeatHold {
  holdId: string
  sessionId: number
  expiresAt: string
  secondsRemaining: number
  isLive: boolean
  subtotal: number
  seats: {
    seatId: number
    code: string
    ticketType: { slug: string; name: string }
    price: number
  }[]
}

export interface Order {
  id: number
  reference: string
  status: 'paid' | 'refunded'
  totalPrice: number
  paidAt: string
  refundedAt: string | null
  isUpcoming: boolean
  isRefundable: boolean
  cardLastFour: string
  contact: {
    fullName: string
    email: string
    mobileNumber: string
  }
  session: Session
  tickets: {
    id: number
    seatCode: string
    ticketType: { slug: string; name: string }
    price: number
  }[]
}

// ============ API Errors ============
export interface ValidationError {
  message: string
  errors: Record<string, string[]>
}

export interface ApiError {
  message: string
  status?: number
  errors?: Record<string, string[]>
  contested?: string[]
}