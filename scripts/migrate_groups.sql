-- Migration: Add group support columns to the events table.
-- is_group marks an event as a container for child events.
-- parent_event_id links a child event to its group.

ALTER TABLE events ADD COLUMN IF NOT EXISTS is_group BOOLEAN DEFAULT FALSE;
ALTER TABLE events ADD COLUMN IF NOT EXISTS parent_event_id UUID REFERENCES events(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS idx_events_parent ON events(parent_event_id);
