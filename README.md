# Carbon Emissions Counter

A real-time carbon emissions counter that tracks global CO₂ emissions. Visit the live site at [www.carbonemissionscounter.com](https://www.carbonemissionscounter.com).

## Features

- Real-time global CO₂ emissions tracking
- Country-specific emissions data
- Interactive charts and visualizations
- Mobile-responsive design
- SEO optimized

## Project Structure

```
.
├── css/              # Stylesheets
├── js/              # JavaScript files
├── _headers         # Cloudflare headers configuration
├── _routes.json     # Cloudflare routing configuration
├── build.sh         # Build script
├── index.html       # Main HTML file
├── package.json     # Project configuration
└── wrangler.toml    # Cloudflare Pages configuration
```

## Development

1. Clone the repository
2. Make your changes
3. Test locally by opening `index.html` in a browser
4. Push changes to trigger automatic deployment

## Deployment

The site is automatically deployed to Cloudflare Pages when changes are pushed to the main branch.

Build settings:
- Build command: `chmod +x build.sh && ./build.sh`
- Build output directory: `dist`
- Node.js version: 18.x

## License

MIT License - See LICENSE file for details
