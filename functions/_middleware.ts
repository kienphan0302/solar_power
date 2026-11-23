const destinationOrigin = 'https://water-heater-e3j.pages.dev';

export const onRequest = ({ request }: { request: Request }) => {
  const source = new URL(request.url);
  const headers = { 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex, nofollow' };
  // Never replay submissions from cached forms into either database.
  if (source.pathname === '/api' || source.pathname.startsWith('/api/')) {
    return new Response(JSON.stringify({
      success: false, retired: true, formReady: false, website: destinationOrigin,
      message: 'Website đã chuyển. Vui lòng mở website mới và gửi lại yêu cầu tư vấn.',
    }), { status: 410, headers: { ...headers, 'Content-Type': 'application/json; charset=utf-8' } });
  }
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    return new Response(null, { status: 405, headers: { ...headers, Allow: 'GET, HEAD' } });
  }
  const destination = new URL(destinationOrigin);
  destination.pathname = source.pathname;
  destination.search = source.search;
  return new Response(null, { status: 302, headers: { ...headers, Location: destination.href } });
};
