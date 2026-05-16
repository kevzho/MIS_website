export async function onRequest(context) {
  const url = new URL(context.request.url);
  const host = url.hostname.toLowerCase();
  const isHackathonHost = host.startsWith("hackathon.") || host.startsWith("ai-x-stem-hackathon.");

  if (isHackathonHost && url.pathname === "/") {
    url.pathname = "/hackathon/";
    return context.env.ASSETS.fetch(new Request(url, context.request));
  }

  return context.next();
}
