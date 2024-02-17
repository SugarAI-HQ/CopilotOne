export function response404(message = "Not Found") {
  return new Response(message, {
    status: 404,
  });
}
