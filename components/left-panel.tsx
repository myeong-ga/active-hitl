import { Avatar } from "@/components/ui/avatar"
import { Canvas } from "@react-three/fiber"
import { Environment, OrthographicCamera } from "@react-three/drei"
import { ActivityColumns } from "./activity-columns"
import { AnimatedNumber } from "./animated-number"

interface Developer {
  id: number
  name: string
  avatar: string
  color: string
}

interface Activity {
  type: string
  count: number
  color: string
  timestamp: number
}

export function LeftPanel({
  forkedProjects,
  trendingDevelopers,
  activities,
  isMessageUpdated,
  totalInput,
  totalOutput,
}: {
  forkedProjects: number
  trendingDevelopers: Developer[]
  activities: Activity[]
  isMessageUpdated: boolean
  totalInput: number
  totalOutput: number
}) {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h2 className="text-sm text-blue-400/80">Prompt Tokens</h2>
          <p className="text-2xl font-light tracking-wider mt-2">
            <AnimatedNumber value={totalInput} duration={1500} />
          </p>
        </div>
        <div>
          <h2 className="text-sm text-blue-400/80">Completion Tokens</h2>
          <p className="text-2xl font-light tracking-wider mt-2">
            <AnimatedNumber value={totalOutput} duration={1500} />
          </p>
        </div>
        <div>
          <h2 className="text-sm text-blue-400/80">Total Tokens</h2>
          <p className="text-2xl font-light tracking-wider mt-2">
            <AnimatedNumber value={totalInput+totalOutput} duration={1500} />
          </p>
        </div>
     
      </div>

      <div className="h-64">
        <Canvas>
          <OrthographicCamera makeDefault position={[0, 0, 5]} zoom={50} near={0.1} far={1000} />
          <ActivityColumns activities={activities} isMessageUpdated={isMessageUpdated} />
          <Environment preset="night" />
          <ambientLight intensity={0.1} />
          <pointLight position={[10, 10, 10]} intensity={0.5} />
          <color attach="background" args={["#000510"]} />
        </Canvas>
      </div>

      <div>
        <h2 className="text-sm text-blue-400/80 mb-4">Trending Developers</h2>
        <div className="space-y-3">
          {trendingDevelopers.map((dev) => (
            <div key={dev.id} className="flex items-center gap-3">
              <div className="relative">
                <Avatar className="w-8 h-8">
                  <img src={dev.avatar || "/placeholder.svg"} alt={dev.name} />
                </Avatar>
                <div className="absolute inset-0 rounded-full ring-2" style={{ borderColor: dev.color }} />
              </div>
              <span className="text-sm">{dev.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

