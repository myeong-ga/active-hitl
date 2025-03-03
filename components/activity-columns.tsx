import { ActivityColumn } from "./activity-visualization"

interface Activity {
  type: string
  count: number
  color: string
  timestamp: number
}

export function ActivityColumns({
  activities,
  isMessageUpdated,
}: { activities: Activity[]; isMessageUpdated: boolean }) {
  const baseSpeed = 0.2 // 기본 속도 (20%)
  const updatedSpeed = 3 // 메시지 업데이트 시 속도 (300%)

  return (
    <group position={[0, 0, 0]}>
      {activities.map((item, index) => (
        <ActivityColumn
          key={item.type + item.timestamp}
          position={[index - (activities.length - 1) / 2, 0, 0]}
          color={item.color}
          height={Math.max(0.1, item.count * 0.1)}
          speed={(isMessageUpdated ? updatedSpeed : baseSpeed) * (1 + index * 0.1)}
        />
      ))}
    </group>
  )
}

