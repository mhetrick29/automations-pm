# Work IQ Prompts for Action Items

These prompts are used by the action-items.js automation to query Work IQ. Edit these to improve action item extraction.

**Philosophy: BIAS TOWARD FALSE POSITIVES.** It's better to have too many action items than to miss something important. When in doubt, include it.

---

## meetings

Search through Teams meetings I **actually attended or accepted** {{dateDescription}} and extract action items. 

IMPORTANT FILTER: Only include meetings where:
- I was marked as "Accepted" or "Organizer"
- OR there is a transcript/recording showing I attended
- EXCLUDE meetings I declined, didn't respond to, or marked as tentative
- EXCLUDE meetings that were cancelled

Extract action items from:
- ANY task mentioned that I could be responsible for
- Things I said I would do, might do, or could do
- Things others asked me to do, even casually
- Topics where I was asked for input, opinions, or decisions
- Follow-ups from discussions I participated in
- Questions asked of me or the group I'm part of
- Reviews, approvals, or feedback mentioned
- Anything I need to prepare, create, update, send, check, schedule, or coordinate
- Blockers I said I would help unblock
- Items where my name was mentioned in context of work
- Decisions that were deferred and need my follow-up
- Any "let's sync later" or "we should discuss" that involves me
- Information I agreed to find out or share
- People I said I would loop in or follow up with

Be AGGRESSIVE on action items - I want false positives rather than missing something. But be STRICT on the meeting filter - only meetings I actually attended.

For each action item, provide ONLY a JSON array with objects containing:
- "item": the specific action or task (string, be very detailed about what needs to be done)
- "from": the meeting name or who assigned it (string)
- "deadline": any deadline mentioned (string, or "None" if not specified)

Example: [{"item": "Review the design doc and provide feedback on the API section", "from": "Brain Experience Standup", "deadline": "Friday"}]
Return ONLY valid JSON array, no other text.

---

## chats

Search through ALL Teams chat messages and channel posts I received {{dateDescription}} and extract ANYTHING that could possibly require my action. Be AGGRESSIVE - I want false positives rather than missing something.

Extract action items from:
- ANY message that asks me something, even simple questions
- Requests using words like: can you, could you, would you, please, need, want, help, check, look at, review, send, share, update, confirm, let me know, thoughts?, what do you think, FYI (that needs response)
- Messages where I'm @mentioned
- Questions in chats I'm part of that I could answer
- Unanswered messages in my "to do" section of teams chats
- Threads where someone is waiting for a response
- Links shared that I should review
- Requests for meetings, calls, or quick syncs
- Asks for documents, code, information, or status updates
- Bug reports or issues assigned to me or my team
- Pull request reviews or code review requests
- Approval requests of any kind
- Messages that end with a question mark directed at me
- "Bumping this" or follow-up messages on previous asks
- Anything where my response or action would move something forward

IMPORTANT: Read the actual chat messages. Even casual asks count. If someone might be waiting on me, include it.

For each action item, provide ONLY a JSON array with objects containing:
- "item": the specific request or action needed (string, include context about what was asked)
- "from": who sent it (string)
- "deadline": any deadline or urgency mentioned (string, or "None" if not specified)

Example: [{"item": "Reply to question about SLO configuration in Brain team chat", "from": "Shane Hu", "deadline": "None"}]
Return ONLY valid JSON array, no other text.

---

## emails

Search through ALL emails I received {{dateDescription}} and extract ANYTHING that could possibly require my action. Be AGGRESSIVE - I want false positives rather than missing something.

Extract action items from:
- ANY email in my inbox that isn't purely informational
- Emails where I'm in TO (not just CC) - assume these need attention
- Requests using words like: please, need, want, can you, could you, review, approve, sign off, feedback, thoughts, input, update, confirm, action required, action needed, response needed
- Meeting invites that need RSVP
- Calendar invites that require preparation
- Document review requests
- PR/code review requests sent via email
- Approval workflows
- Questions asked directly to me
- Thread replies waiting for my response
- FYIs that actually need me to do something
- Newsletters or announcements with deadlines or registrations
- Training or compliance items
- Expense reports or administrative tasks
- Any email from my manager or skip-level
- Emails with attachments I should review
- Escalations or urgent items

IMPORTANT: Read the actual email content. When in doubt, include it as an action item. I will filter - you should capture.

For each action item, provide ONLY a JSON array with objects containing:
- "item": the specific action or request (string, include email subject and what needs to be done)
- "from": who sent the email (string)
- "deadline": any deadline mentioned (string, or "None" if not specified)

Example: [{"item": "Reply to 'Q3 Planning' thread - answer question about budget allocation", "from": "Finance Team", "deadline": "Tomorrow"}]
Return ONLY valid JSON array, no other text.

---

## calendar

List meetings I have today or tomorrow that I've **accepted or organized** and that require preparation.

IMPORTANT FILTER: Only include meetings where:
- I accepted the invite or I'm the organizer
- EXCLUDE meetings I declined, haven't responded to, or marked tentative
- EXCLUDE cancelled meetings

For each meeting, provide ONLY a JSON array with objects containing:
- "item": meeting title and what prep is needed (string)
- "from": meeting organizer (string, or "Unknown" if not clear)
- "deadline": meeting date/time (string)

Example format: [{"item": "Prep for Design Review - review slides", "from": "Product Team", "deadline": "Tomorrow 2pm"}]
Return ONLY valid JSON array, no other text. Return [] if truly no action items found.
