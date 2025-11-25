# Icarus - Invite Only File Distribution System

Welcome to Icarus, an elegant invite-only file distribution platform inspired by the Greek myth of Icarus who flew too close to the sun. This system allows you to distribute files exclusively to invited users with key-based access control.

## Features

- Beautiful, modern UI with Icarus-themed design
- Invite-only access system
- Key-based file download authorization
- Admin panel for generating invites and monitoring statistics
- Responsive design that works on all devices

## Getting Started

1. Install dependencies:
   ```
   npm install
   ```

2. Start the server:
   ```
   node server.js
   ```

3. Access the application:
   - Main site: http://localhost:3000
   - Admin panel: http://localhost:3000/admin

## How It Works

1. **Admin generates invites**: Using the admin panel, generate invite codes that can be distributed to users.

2. **Users register with invites**: Users enter their invite codes on the main site to receive a download key.

3. **Users download files**: Users enter their download key to access the file.

## Admin Functions

To access admin functions, you'll need the admin key which is set in the `.env` file (`ADMIN_KEY`).

### Generate Invites
- Go to http://localhost:3000/admin
- Enter your admin key
- Click "Generate Invite Code"
- Distribute the generated code to users

### View Statistics
- Go to http://localhost:3000/admin
- Enter your admin key
- Click "Load Statistics"
- View system usage metrics

## Customization

### Changing the Downloadable File
1. Replace `download/icarus-app.exe` with your actual file
2. Update the filename in `server.js` in the download endpoint

### Modifying the Theme
- Colors can be changed in `public/styles.css` under the `:root` section
- Fonts can be modified in the `<head>` section of HTML files

## Security Notes

- The default admin key is `admin_icarus_2023` - change this in `.env` for production
- Data is stored in memory only - for production use, implement a database
- HTTPS is recommended for production deployments

## Technologies Used

- Node.js with Express.js
- Vanilla JavaScript frontend
- CSS3 with modern styling techniques
- Responsive design principles

## Support

For issues or feature requests, please open an issue on the repository."# Icarus" 
"# Icarus" 
"# Icarus.now" 
