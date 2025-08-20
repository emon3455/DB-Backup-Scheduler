# Backup Scheduler

Backup Scheduler is a Node.js application that automates MongoDB database backups on a scheduled basis. It creates timestamped folders containing JSON exports of all collections, and automatically cleans up old backups.

## Features
- Automated MongoDB backups (all collections to JSON)
- Runs every minute by default (configurable in code)
- Stores backups in timestamped folders under `backups/`
- Automatically deletes backups older than retention period
- Easy setup: just configure `.env` and run

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB instance

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/backup-scheduler.git
   cd backup-scheduler
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env` and fill in your configuration:
   ```bash
   cp .env.example .env
   # Edit .env with your MongoDB URI and DB name
   ```

### Usage
Run the scheduler:
```bash
node index.js
```

To run a backup immediately:
```bash
node index.js backup-now
```

## Configuration
Edit the `.env` file to set up your environment variables:
- `MONGO_URI`: MongoDB connection URI
- `DB_NAME`: MongoDB database name
- `RETENTION_DAYS`: Number of days to keep backups (older backups are deleted)

## Folder Structure
- `backups/`: Contains all backup folders, each named with a timestamp
- `index.js`: Main entry point
- `scheduler.js`: Schedules backups using cron
- `backup.js`: Backup logic (MongoDB export, cleanup)

## Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License
MIT
