# Attendance Tracker

A simple and modern web application for tracking student attendance built with Next.js 14, TypeScript, and Tailwind CSS.

## Features

- **Student Check-in**: Students can record their attendance by entering their school ID and name
- **Real-time Clock**: Current time and date display on the student check-in page
- **Admin Dashboard**: View attendance statistics and records
- **CSV Export**: Download attendance records as CSV files with event name in filename (all records or today's records)
- **Clear Records**: Clear all attendance records with confirmation dialog
- **Event Name Customization**: Edit the event/class name displayed throughout the app
- **Modern UI**: Clean, responsive design with white, black, and blue color scheme
- **Real-time Updates**: Live data fetching and updates
- **File-based Storage**: Simple JSON file storage for attendance records

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm, yarn, or pnpm

### Installation

1. Clone the repository or download the source code
2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

### For Students

1. Go to the home page
2. Click "Check In" to access the attendance form
3. View the current time and date displayed on the page
4. Enter your school ID and full name
5. Click "Record Attendance"
6. You'll receive a confirmation message when your attendance is recorded

### For Administrators

1. Go to the home page
2. Click "Admin Panel" to access the admin dashboard
3. View attendance statistics including:
   - Total records
   - Today's attendance count
   - Number of unique students
4. Download attendance records:
   - Click "Download All Records" for complete data (filename: EventName-attendance-all.csv)
   - Click "Download Today's Records" for current day only (filename: EventName-attendance-YYYY-MM-DD.csv)
5. View recent attendance records in the table
6. Clear all records:
   - Click "Clear All Records" to delete all attendance data
   - Confirm the action in the dialog (this cannot be undone)
7. Edit event name:
   - Click "Edit" next to the event name in the Event Settings section
   - Enter the new event name and click "Save"
   - The new name will appear throughout the application

## Project Structure

```
attendance-tracker/
├── app/
│   ├── api/
│   │   ├── attendance/
│   │   │   └── route.ts          # API for attendance CRUD operations
│   │   └── download/
│   │       └── route.ts          # API for CSV download
│   ├── attendance/
│   │   └── page.tsx              # Student check-in page
│   ├── admin/
│   │   └── page.tsx              # Admin dashboard page
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Home page
├── lib/
│   └── attendance.ts             # Attendance data management utilities
├── data/
│   └── attendance.json           # JSON file for storing attendance records
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── next.config.js
```

## Data Storage

The application uses a simple file-based storage system:

- Attendance records are stored in `data/attendance.json`
- Each record includes:
  - Unique ID
  - School ID
  - Student name
  - Timestamp
  - Date

## Customization

### Styling

The application uses Tailwind CSS with a custom design system:

- Primary colors: Blue (#2563eb)
- Background: White with blue gradient
- Text: Gray scale
- Components: Rounded corners, shadows, and smooth transitions

### CSV Download Format

Downloaded CSV files include the event name in the filename:
- **All Records**: `EventName-attendance-all.csv`
- **Today's Records**: `EventName-attendance-2024-01-15.csv`

Special characters in event names are sanitized (removed or replaced with hyphens) to ensure valid filenames.

### Adding Features

To extend the application:

1. **Authentication**: Add admin authentication for the admin panel
2. **Database**: Replace file storage with a database (PostgreSQL, MongoDB, etc.)
3. **Email Notifications**: Send attendance confirmations via email
4. **Reports**: Add more detailed reporting features
5. **Student Management**: Add student registration and management

## API Endpoints

### POST `/api/attendance`

Record new attendance entry.

**Request Body:**
```json
{
  "schoolId": "string",
  "name": "string"
}
```

**Response:**
```json
{
  "success": true,
  "record": {
    "id": "string",
    "schoolId": "string",
    "name": "string",
    "timestamp": "string",
    "date": "string"
  },
  "message": "Attendance recorded successfully"
}
```

### GET `/api/attendance`

Get all attendance records.

**Response:**
```json
{
  "records": [
    {
      "id": "string",
      "schoolId": "string",
      "name": "string",
      "timestamp": "string",
      "date": "string"
    }
  ]
}
```

### GET `/api/download?filter=all|today`

Download attendance records as CSV with event name in filename.

**Query Parameters:**
- `filter`: "all" for all records or "today" for today's records only

**Response:** CSV file download with filename format:
- All records: `EventName-attendance-all.csv`
- Today's records: `EventName-attendance-YYYY-MM-DD.csv`

### DELETE `/api/attendance`

Clear all attendance records.

**Response:**
```json
{
  "success": true,
  "message": "All attendance records cleared successfully"
}
```

### GET `/api/event`

Get the current event name.

**Response:**
```json
{
  "eventName": "string"
}
```

### PUT `/api/event`

Update the event name.

**Request Body:**
```json
{
  "eventName": "string"
}
```

**Response:**
```json
{
  "success": true,
  "eventName": "string",
  "message": "Event name updated successfully"
}
```

## Build for Production

```bash
npm run build
npm start
```

## License

This project is open source and available under the [MIT License](LICENSE).

## Contributing

Feel free to contribute to this project by:

1. Reporting bugs
2. Suggesting new features
3. Submitting pull requests
4. Improving documentation

## Support

For support or questions about this application, please create an issue in the repository. 