import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Shuffle, Trash2 } from 'lucide-react'

import BackButton from '#/components/shared/BackButton'
import DreamCourt, {
    COURT_POSITIONS,
    type PositionKey,
} from '#/components/build/DreamCourt'
import PlayerPicker from '#/components/build/PlayerPicker'
import { getSeasonData } from '#/data/seasons'
import type { Player } from '#/types/Player'

const BUILD_SEASON = '26-27'

export const Route = createFileRoute('/build')({
    component: BuildDreamFivePage,
})

function BuildDreamFivePage() {
    const seasonData = getSeasonData(BUILD_SEASON)
    const players = seasonData?.players ?? []
    const teams = seasonData?.teams ?? []
    const stats = seasonData?.stats ?? []

    const [activePosition, setActivePosition] =
        useState<PositionKey>('Point Guard')
    const [lineup, setLineup] = useState<Partial<Record<PositionKey, Player>>>(
        {},
    )

    const selectedCount = Object.keys(lineup).length

    const handleSelectPlayer = (position: PositionKey, player: Player) => {
        setLineup((prev) => ({
            ...prev,
            [position]: player,
        }))
    }

    const handleClearPosition = (position: PositionKey) => {
        setLineup((prev) => {
            const next = { ...prev }
            delete next[position]
            return next
        })
    }

    const handleClearAll = () => {
        setLineup({})
    }

    const handleRandomFive = () => {
        const nextLineup: Partial<Record<PositionKey, Player>> = {}
        for (const pos of COURT_POSITIONS) {
            const candidates = players.filter(
                (p) =>
                    p.position === pos.key &&
                    (p.status === 'Superstar' ||
                        p.status === 'Star' ||
                        p.status === 'Starter'),
            )
            const pool =
                candidates.length > 0
                    ? candidates
                    : players.filter((p) => p.position === pos.key)
            if (pool.length > 0) {
                const randomIndex = Math.floor(Math.random() * pool.length)
                nextLineup[pos.key] = pool[randomIndex]
            }
        }
        setLineup(nextLineup)
    }

    return (
        <main className="flex flex-col gap-8">
            <div className="flex items-center justify-between gap-4">
                <BackButton label="HOME" />
                <span className="rounded-4xl border border-orange-400/40 bg-orange-400/10 px-4 py-1.5 text-xs font-bold tracking-wider uppercase text-orange-400">
                    SEASON {BUILD_SEASON}
                </span>
            </div>

            <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                <div className="flex flex-col gap-2">
                    <h1>BUILD YOUR DREAM FIVE</h1>
                    <p>
                        Season {BUILD_SEASON} · Click a court position and choose
                        your player ({selectedCount}/5 selected)
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <button
                        type="button"
                        onClick={handleRandomFive}
                        className="rounded-4xl border border-orange-400 bg-orange-400 px-4 py-2 text-sm font-bold text-black transition-transform duration-200 hover:scale-105"
                    >
                        <Shuffle size={16} />
                        RANDOM FIVE
                    </button>

                    <button
                        type="button"
                        onClick={handleClearAll}
                        disabled={selectedCount === 0}
                        className="rounded-4xl border border-gray-500 bg-transparent px-4 py-2 text-sm font-semibold text-white hover:border-orange-500"
                    >
                        <Trash2 size={16} />
                        CLEAR
                    </button>
                </div>
            </header>

            <DreamCourt
                season={BUILD_SEASON}
                lineup={lineup}
                teams={teams}
                activePosition={activePosition}
                onSelectPosition={setActivePosition}
                onClearPosition={handleClearPosition}
            />

            <PlayerPicker
                season={BUILD_SEASON}
                players={players}
                teams={teams}
                stats={stats}
                activePosition={activePosition}
                lineup={lineup}
                onPositionChange={setActivePosition}
                onSelectPlayer={handleSelectPlayer}
            />
        </main>
    )
}
