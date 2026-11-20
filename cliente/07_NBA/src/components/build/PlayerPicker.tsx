import { useMemo, useState } from 'react'
import { Check } from 'lucide-react'
import type { Player } from '#/types/Player'
import type { Stat } from '#/types/Stat'
import type { Team } from '#/types/Team'
import { getSeasonPlayerPhoto } from '#/utils/getSeasonPlayerPhoto'
import { COURT_POSITIONS, type PositionKey } from './DreamCourt'

interface PlayerPickerProps {
    season: string
    players: Player[]
    teams: Team[]
    stats: Stat[]
    activePosition: PositionKey
    lineup: Partial<Record<PositionKey, Player>>
    onPositionChange: (position: PositionKey) => void
    onSelectPlayer: (position: PositionKey, player: Player) => void
}

const STATUS_PRIORITY: Record<string, number> = {
    Superstar: 1,
    Star: 2,
    Starter: 3,
    'Sixth Man': 4,
    'Role Player': 5,
    Sophomore: 6,
    Rookie: 7,
    Prospect: 8,
}

export default function PlayerPicker({
    season,
    players,
    teams,
    stats,
    activePosition,
    lineup,
    onPositionChange,
    onSelectPlayer,
}: PlayerPickerProps) {
    const [query, setQuery] = useState('')
    const [teamFilter, setTeamFilter] = useState<string>('ALL')

    const teamsById = useMemo(() => {
        return new Map(teams.map((team) => [team.id, team]))
    }, [teams])

    const statsByPlayerId = useMemo(() => {
        return new Map(stats.map((stat) => [stat.playerId, stat]))
    }, [stats])

    const sortedTeams = useMemo(() => {
        return [...teams].sort((a, b) =>
            `${a.name1} ${a.name2}`.localeCompare(`${b.name1} ${b.name2}`),
        )
    }, [teams])

    const positionPlayers = useMemo(() => {
        const normalizedQuery = query.trim().toLowerCase()

        return players
            .filter((player) => {
                if (player.position !== activePosition) return false
                if (teamFilter !== 'ALL' && player.teamId !== Number(teamFilter)) {
                    return false
                }
                if (!normalizedQuery) return true

                const team = teamsById.get(player.teamId)
                const teamName = team ? `${team.name1} ${team.name2}` : ''
                return (
                    `${player.name} ${player.surname}`
                        .toLowerCase()
                        .includes(normalizedQuery) ||
                    player.fullname.toLowerCase().includes(normalizedQuery) ||
                    teamName.toLowerCase().includes(normalizedQuery)
                )
            })
            .sort((a, b) => {
                const rankA = STATUS_PRIORITY[a.status] ?? 99
                const rankB = STATUS_PRIORITY[b.status] ?? 99
                if (rankA !== rankB) return rankA - rankB
                const ptsA = statsByPlayerId.get(a.id)?.points ?? 0
                const ptsB = statsByPlayerId.get(b.id)?.points ?? 0
                return ptsB - ptsA
            })
    }, [players, activePosition, teamFilter, query, teamsById, statsByPlayerId])

    const selectedForPosition = lineup[activePosition]

    return (
        <section
            aria-label="Player selector by position"
            className="flex flex-col gap-6"
        >
            {/* Position selector tabs */}
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <nav
                    aria-label="Court positions"
                    className="flex flex-wrap gap-2"
                >
                    {COURT_POSITIONS.map((pos) => {
                        const isSelected = activePosition === pos.key
                        const assigned = lineup[pos.key]
                        return (
                            <button
                                key={pos.key}
                                type="button"
                                aria-pressed={isSelected}
                                onClick={() => onPositionChange(pos.key)}
                                className={`w-fit rounded-4xl border px-4 py-2 transition-colors ${
                                    isSelected
                                        ? 'border-orange-400 bg-orange-400 font-bold text-black'
                                        : 'border-gray-500 bg-transparent text-white hover:border-orange-500'
                                }`}
                            >
                                <span>{pos.short}</span>
                                <span className="hidden sm:inline"> · {pos.label}</span>
                                {assigned && (
                                    <span
                                        className={`ml-1 inline-block h-2 w-2 rounded-full ${
                                            isSelected ? 'bg-black' : 'bg-orange-400'
                                        }`}
                                    />
                                )}
                            </button>
                        )
                    })}
                </nav>

                {/* Filters: Team & Search */}
                <div className="flex flex-wrap items-center gap-3">
                    <select
                        aria-label="Filter by team"
                        value={teamFilter}
                        onChange={(e) => setTeamFilter(e.target.value)}
                        className="rounded-4xl border border-gray-500 bg-[#15181e] px-4 py-2 text-sm text-white"
                    >
                        <option value="ALL">All Teams (30)</option>
                        {sortedTeams.map((team) => (
                            <option key={team.id} value={team.id}>
                                {team.name1} {team.name2}
                            </option>
                        ))}
                    </select>

                    <input
                        aria-label={`Search ${activePosition} players`}
                        type="search"
                        placeholder={`Search ${activePosition}...`}
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="w-full rounded-4xl border border-gray-500 bg-black px-4 py-2 text-sm text-white sm:w-60"
                    />
                </div>
            </div>

            {/* Header info for current position */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
                <div>
                    <h2 className="text-xl font-bold uppercase">
                        Select {activePosition}{' '}
                        <span className="text-sm font-normal text-secondary">
                            ({positionPlayers.length} available in {season})
                        </span>
                    </h2>
                </div>
                {selectedForPosition && (
                    <p className="text-sm text-secondary">
                        Selected:{' '}
                        <span className="font-bold text-orange-400">
                            {selectedForPosition.name} {selectedForPosition.surname}
                        </span>
                    </p>
                )}
            </div>

            {/* Grid of players for the selected position */}
            <div className="grid max-h-[540px] grid-cols-1 gap-4 overflow-y-auto pr-1 sm:grid-cols-2 lg:grid-cols-3">
                {positionPlayers.length ? (
                    positionPlayers.map((player) => {
                        const team = teamsById.get(player.teamId)
                        const playerStat = statsByPlayerId.get(player.id)
                        const isPicked = selectedForPosition?.id === player.id
                        const games = playerStat?.gamesPlayed ?? 0
                        const ppg =
                            games > 0
                                ? ((playerStat?.points ?? 0) / games).toFixed(1)
                                : '0.0'
                        const rpg =
                            games > 0
                                ? ((playerStat?.rebounds ?? 0) / games).toFixed(1)
                                : '0.0'
                        const apg =
                            games > 0
                                ? ((playerStat?.assists ?? 0) / games).toFixed(1)
                                : '0.0'

                        return (
                            <button
                                key={player.id}
                                type="button"
                                onClick={() => onSelectPlayer(activePosition, player)}
                                style={
                                    {
                                        '--team-primary':
                                            team?.backgroundcolorPrimary ?? '#fb923c',
                                        '--team-secondary':
                                            team?.backgroundcolorSecondary ?? '#15181e',
                                    } as React.CSSProperties
                                }
                                className={`surface-card relative isolate flex w-full items-center gap-4 overflow-hidden p-3.5 text-left transition-all duration-200 before:absolute before:inset-x-0 before:top-0 before:h-1 before:bg-[linear-gradient(90deg,var(--team-primary),var(--team-secondary))] hover:-translate-y-0.5 hover:border-orange-400 ${
                                    isPicked
                                        ? 'border-orange-400 ring-2 ring-orange-400/40'
                                        : ''
                                }`}
                            >
                                {/* Player Face Avatar */}
                                <div
                                    className="relative flex h-16 w-16 shrink-0 items-end justify-center overflow-hidden rounded-2xl border border-white/15"
                                    style={{
                                        background: `linear-gradient(135deg, ${team?.backgroundcolorPrimary ?? '#21242a'}, ${team?.backgroundcolorSecondary ?? '#15181e'})`,
                                    }}
                                >
                                    {player.photo ? (
                                        <img
                                            src={getSeasonPlayerPhoto(
                                                player.photo,
                                                season,
                                            )}
                                            alt={player.fullname}
                                            className="h-full w-full object-cover object-top"
                                        />
                                    ) : (
                                        <span className="self-center text-lg font-black text-white/60">
                                            {player.name[0]}
                                            {player.surname[0]}
                                        </span>
                                    )}
                                </div>

                                {/* Player Info */}
                                <div className="flex min-w-0 flex-1 flex-col gap-1">
                                    <div className="flex items-center justify-between gap-2">
                                        <span className="truncate text-base font-bold text-white">
                                            {player.name} {player.surname}
                                        </span>
                                        <span className="shrink-0 text-xs font-bold text-orange-400">
                                            #{player.number}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2 text-xs text-secondary">
                                        {team && (
                                            <img
                                                src={team.logo}
                                                alt={team.abbreviation}
                                                className="h-4 w-4 object-contain"
                                            />
                                        )}
                                        <span className="truncate">
                                            {team
                                                ? `${team.name1} ${team.name2}`
                                                : ''}
                                        </span>
                                        <span>·</span>
                                        <span className="shrink-0">{player.status}</span>
                                    </div>

                                    <div className="mt-1 flex items-center gap-3 text-xs text-secondary">
                                        <span>
                                            <strong className="text-white">{ppg}</strong> PPG
                                        </span>
                                        <span>
                                            <strong className="text-white">{rpg}</strong> RPG
                                        </span>
                                        <span>
                                            <strong className="text-white">{apg}</strong> APG
                                        </span>
                                    </div>
                                </div>

                                {isPicked && (
                                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-orange-400 text-black">
                                        <Check size={16} strokeWidth={3} />
                                    </div>
                                )}
                            </button>
                        )
                    })
                ) : (
                    <p
                        className="col-span-full py-8 text-center text-secondary"
                        role="status"
                    >
                        No {activePosition} players match your search.
                    </p>
                )}
            </div>
        </section>
    )
}
