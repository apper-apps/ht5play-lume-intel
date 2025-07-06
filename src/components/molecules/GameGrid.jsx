import GameCard from '@/components/atoms/GameCard'
import Loading from '@/components/ui/Loading'
import Empty from '@/components/ui/Empty'
import Error from '@/components/ui/Error'

const GameGrid = ({ games, loading, error, onRetry }) => {
  if (loading) {
    return <Loading type="games" />
  }

  if (error) {
    return <Error message={error} onRetry={onRetry} />
  }

  if (!games || games.length === 0) {
    return (
      <Empty
        title="No games found"
        description="No games match your current search or filter criteria."
        icon="Gamepad2"
      />
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
      {games.map((game, index) => (
        <GameCard key={game.id} game={game} index={index} />
      ))}
    </div>
  )
}

export default GameGrid