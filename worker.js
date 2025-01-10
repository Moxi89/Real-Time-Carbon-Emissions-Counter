addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url)
  
  // Serve static files from the static directory
  if (url.pathname.startsWith('/static/')) {
    const response = await fetch(request)
    if (response.ok) return response
  }

  // Serve index.html for the root path
  if (url.pathname === '/') {
    return fetch('/static/index.html')
  }

  // Handle other routes
  try {
    const response = await fetch(request)
    if (response.ok) return response
  } catch (e) {
    // If route not found, return 404
    return new Response('Not Found', { status: 404 })
  }
}
