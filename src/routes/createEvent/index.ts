import { createFileRoute } from '@tanstack/react-router'
import CreateEvent from '@/pages/CreateEvent'

export const Route = createFileRoute('/createEvent/')({
  component: CreateEvent,
  staticData: {
    title: "Create Event",
  },
})

