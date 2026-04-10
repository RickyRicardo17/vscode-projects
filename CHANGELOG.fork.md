# Fork change log

Release notes for **this fork** only. The main [CHANGELOG.md](CHANGELOG.md) follows upstream Teamwork history so merges stay simple. Entries are grouped by **commit date** (newest first).

## 2026-04-10

- Fixed crash when opening a task if cached data was stale (older than 30 minutes) but the extension did not refetch, leaving task data undefined (`Cannot read properties of undefined (reading 'created-on')`).
- Validate task API responses and show a clear error when a task cannot be loaded or the payload shape is unexpected; skip optional string formatting when fields are missing.
- Guard comments, attachments, and time-entry requests so a failed follow-up call does not crash task preview.
- Quick Add: if the new task is created but details cannot be loaded, skip editor snippet insertion instead of throwing.

## 2026-04-09

- Fixed task preview not working in recent VS Code or when using Remote - SSH.
- Fixed subtasks not showing in the task tree.
- Fixed wrong task preview after logging time with an invalid number of minutes (greater than 59).
