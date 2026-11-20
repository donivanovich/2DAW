import { Plus, X } from 'lucide-react'
import type { Player } from '#/types/Player'
import type { Team } from '#/types/Team'
import { getSeasonPlayerPhoto } from '#/utils/getSeasonPlayerPhoto'

export type PositionKey =
    | 'Point Guard'
    | 'Shooting Guard'
    | 'Small Forward'
    | 'Power Forward'
    | 'Center'

export interface CourtPositionConfig {
    key: PositionKey
    short: string
    label: string
    top: string
    left: string
}

export const COURT_POSITIONS: CourtPositionConfig[] = [
    {
        key: 'Point Guard',
        short: 'PG',
        label: 'Point Guard',
        top: '76%',
        left: '50%',
    },
    {
        key: 'Shooting Guard',
        short: 'SG',
        label: 'Shooting Guard',
        top: '56%',
        left: '18%',
    },
    {
        key: 'Small Forward',
        short: 'SF',
        label: 'Small Forward',
        top: '56%',
        left: '82%',
    },
    {
        key: 'Power Forward',
        short: 'PF',
        label: 'Power Forward',
        top: '28%',
        left: '27%',
    },
    {
        key: 'Center',
        short: 'C',
        label: 'Center',
        top: '22%',
        left: '68%',
    },
]

interface DreamCourtProps {
    season: string
    lineup: Partial<Record<PositionKey, Player>>
    teams: Team[]
    activePosition: PositionKey
    onSelectPosition: (position: PositionKey) => void
    onClearPosition: (position: PositionKey) => void
}

export default function DreamCourt({
    season,
    lineup,
    teams,
    activePosition,
    onSelectPosition,
    onClearPosition,
}: DreamCourtProps) {
    return (
        <div className="surface-card relative w-full overflow-hidden p-4 sm:p-6">
            <div className="relative mx-auto aspect-[16/13] w-full max-w-[780px] select-none overflow-hidden rounded-2xl border-2 border-orange-400/40 bg-[radial-gradient(circle_at_50%_15%,#261e17_0%,#15181e_70%,#0f1116_100%)] shadow-2xl">
                {/* Half-court SVG markings */}
                <svg
                    viewBox="0 0 500 420"
                    className="pointer-events-none absolute inset-0 h-full w-full"
                    aria-hidden="true"
                >
                    <defs>
                        <linearGradient id="paintGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#fb923c" stopOpacity="0.22" />
                            <stop offset="100%" stopColor="#fb923c" stopOpacity="0.05" />
                        </linearGradient>
                    </defs>

                    {/* Subtle hardwood court plank lines */}
                    <g stroke="rgba(255,255,255,0.03)" strokeWidth="1">
                        <line x1="0" y1="60" x2="500" y2="60" />
                        <line x1="0" y1="120" x2="500" y2="120" />
                        <line x1="0" y1="180" x2="500" y2="180" />
                        <line x1="0" y1="240" x2="500" y2="240" />
                        <line x1="0" y1="300" x2="500" y2="300" />
                        <line x1="0" y1="360" x2="500" y2="360" />
                    </g>

                    {/* Outer court boundary (Baseline at top, Sidelines, Half-court line at bottom) */}
                    <rect
                        x="15"
                        y="15"
                        width="470"
                        height="390"
                        fill="none"
                        stroke="rgba(255,255,255,0.22)"
                        strokeWidth="3"
                    />

                    {/* The Paint / Key */}
                    <rect
                        x="170"
                        y="15"
                        width="160"
                        height="190"
                        fill="url(#paintGrad)"
                        stroke="rgba(251,146,60,0.55)"
                        strokeWidth="2.5"
                    />

                    {/* Free throw circle (bottom solid half + top dashed half) */}
                    <path
                        d="M 190 205 A 60 60 0 0 0 310 205"
                        fill="none"
                        stroke="rgba(255,255,255,0.28)"
                        strokeWidth="2.5"
                    />
                    <path
                        d="M 190 205 A 60 60 0 0 1 310 205"
                        fill="none"
                        stroke="rgba(255,255,255,0.2)"
                        strokeWidth="2"
                        strokeDasharray="6 6"
                    />

                    {/* 3-Point Line (corner straight lines + arc) */}
                    <path
                        d="M 45 15 L 45 140 A 215 215 0 0 0 455 140 L 455 15"
                        fill="none"
                        stroke="rgba(255,255,255,0.3)"
                        strokeWidth="2.5"
                    />

                    {/* Restricted area arc */}
                    <path
                        d="M 210 55 A 40 40 0 0 0 290 55"
                        fill="none"
                        stroke="rgba(251,146,60,0.5)"
                        strokeWidth="2"
                    />

                    {/* Backboard and Rim */}
                    <line
                        x1="220"
                        y1="40"
                        x2="280"
                        y2="40"
                        stroke="rgba(255,255,255,0.75)"
                        strokeWidth="4"
                        strokeLinecap="round"
                    />
                    <circle
                        cx="250"
                        cy="53"
                        r="11"
                        fill="none"
                        stroke="#fb923c"
                        strokeWidth="3"
                    />

                    {/* Key hash marks */}
                    <line x1="162" y1="85" x2="170" y2="85" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
                    <line x1="162" y1="115" x2="170" y2="115" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
                    <line x1="162" y1="145" x2="170" y2="145" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
                    <line x1="162" y1="175" x2="170" y2="175" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
                    <line x1="330" y1="85" x2="338" y2="85" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
                    <line x1="330" y1="115" x2="338" y2="115" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
                    <line x1="330" y1="145" x2="338" y2="145" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
                    <line x1="330" y1="175" x2="338" y2="175" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />

                    {/* Half-court center circle arc at bottom */}
                    <path
                        d="M 190 405 A 60 60 0 0 1 310 405"
                        fill="none"
                        stroke="rgba(251,146,60,0.4)"
                        strokeWidth="2.5"
                    />
                    <path
                        d="M 230 405 A 20 20 0 0 1 270 405"
                        fill="none"
                        stroke="rgba(255,255,255,0.25)"
                        strokeWidth="2"
                    />
                </svg>

                {/* Season watermark on court */}
                <div className="pointer-events-none absolute bottom-3 left-4 text-xs font-black tracking-widest uppercase text-white/20">
                    NBA {season} · HALF COURT
                </div>

                {/* Distributed 5 positions */}
                {COURT_POSITIONS.map((pos) => {
                    const player = lineup[pos.key]
                    const team = player
                        ? teams.find((t) => t.id === player.teamId)
                        : undefined
                    const isActive = activePosition === pos.key

                    return (
                        <div
                            key={pos.key}
                            style={{ top: pos.top, left: pos.left }}
                            className="absolute -translate-x-1/2 -translate-y-1/2"
                        >
                            <div className="relative flex flex-col items-center">
                                {player && (
                                    <button
                                        type="button"
                                        aria-label={`Remove ${player.fullname} from ${pos.label}`}
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            onClearPosition(pos.key)
                                        }}
                                        className="absolute -top-2 -right-2 z-20 flex h-6 w-6 items-center justify-center rounded-full border border-white/20 bg-[#0b0d12] p-0 text-white shadow-md hover:border-red-400 hover:bg-red-500 hover:text-white"
                                    >
                                        <X size={13} />
                                    </button>
                                )}

                                <button
                                    type="button"
                                    onClick={() => onSelectPosition(pos.key)}
                                    aria-pressed={isActive}
                                    className={`group relative flex flex-col items-center rounded-2xl bg-transparent p-0 transition-transform duration-200 hover:scale-105 ${
                                        isActive ? 'scale-105' : ''
                                    }`}
                                >
                                    {/* Avatar Circle with Player Face */}
                                    <div
                                        className={`relative flex h-16 w-16 items-end justify-center overflow-hidden rounded-full border-2 shadow-lg transition-all sm:h-24 sm:w-24 ${
                                            isActive
                                                ? 'border-orange-400 ring-4 ring-orange-400/30'
                                                : player
                                                  ? 'border-white/40 group-hover:border-orange-400'
                                                  : 'border-dashed border-white/30 bg-[#15181e]/90 group-hover:border-orange-400'
                                        }`}
                                        style={
                                            player && team
                                                ? {
                                                      background: `linear-gradient(135deg, ${team.backgroundcolorPrimary}, ${team.backgroundcolorSecondary})`,
                                                  }
                                                : undefined
                                        }
                                    >
                                        {player ? (
                                            player.photo ? (
                                                <img
                                                    src={getSeasonPlayerPhoto(player.photo, season)}
                                                    alt={player.fullname}
                                                    className="h-full w-full object-cover object-top"
                                                />
                                            ) : (
                                                <span className="self-center text-xl font-black text-white sm:text-2xl">
                                                    {player.name[0]}
                                                    {player.surname[0]}
                                                </span>
                                            )
                                        ) : (
                                            <div className="flex h-full w-full flex-col items-center justify-center gap-0.5 text-secondary group-hover:text-orange-400">
                                                <Plus size={22} />
                                                <span className="text-xs font-black">{pos.short}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Label Pill under face */}
                                    <div
                                        className={`mt-1.5 flex flex-col items-center rounded-xl border px-2.5 py-1 text-center shadow-md backdrop-blur-md transition-colors ${
                                            isActive
                                                ? 'border-orange-400 bg-orange-400 text-black'
                                                : 'border-white/15 bg-[#0b0d12]/90 text-white group-hover:border-orange-400/60'
                                        }`}
                                    >
                                        <div className="flex items-center gap-1.5">
                                            <span
                                                className={`rounded px-1 text-[10px] font-black uppercase ${
                                                    isActive
                                                        ? 'bg-black/20 text-black'
                                                        : 'bg-orange-400/20 text-orange-400'
                                                }`}
                                            >
                                                {pos.short}
                                            </span>
                                            <span className="max-w-[96px] truncate text-xs font-bold sm:max-w-[130px] sm:text-sm">
                                                {player
                                                    ? `${player.name[0]}. ${player.surname}`
                                                    : pos.label}
                                            </span>
                                        </div>
                                        {player && team && (
                                            <span
                                                className={`text-[10px] font-semibold ${
                                                    isActive ? 'text-black/80' : 'text-secondary'
                                                }`}
                                            >
                                                #{player.number} · {team.abbreviation}
                                            </span>
                                        )}
                                    </div>
                                </button>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
