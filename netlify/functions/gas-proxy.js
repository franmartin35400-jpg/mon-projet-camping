export async function handler(event) {
  const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxunhJr8J2-Y3C0N4ecPbPZ-G_SzOjdB7jWVf5OC8P1BTZ4GHECteSMemZdW_tsdvhv/exec";

  const init = { method: event.httpMethod };
  if (event.httpMethod === "POST") {
    init.headers = { "Content-Type": "application/json" };
    init.body = event.body;
  }

  try {
    const r = await fetch(SCRIPT_URL, init);
    const text = await r.text();
    return {
      statusCode: r.status,
      headers: { "Access-Control-Allow-Origin": "*", "Content-Type": "application/json" },
      body: text
    };
  } catch (e) {
    return {
      statusCode: 500,
      headers: { "Access-Control-Allow-Origin": "*", "Content-Type": "application/json" },
      body: JSON.stringify({ ok:false, error:String(e) })
    };
  }
}