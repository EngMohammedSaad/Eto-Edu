/* Cloudflare Worker: يجيب ملف PDF من Google Drive ويرجعه للموقع مع CORS
   الاستخدام:  https://YOUR-WORKER.workers.dev/?id=FILE_ID
              https://YOUR-WORKER.workers.dev/?id=DOC_ID&k=document|presentation|spreadsheets */
const ALLOWED_ORIGINS = []; // اختياري: ["https://موقعك.com"]  (فاضي = أي موقع)

export default {
  async fetch(req) {
    const origin = req.headers.get("Origin") || "";
    const allow = !ALLOWED_ORIGINS.length || ALLOWED_ORIGINS.includes(origin);
    const cors = { "Access-Control-Allow-Origin": allow ? (origin || "*") : "null", "Vary": "Origin" };
    if (req.method === "OPTIONS") return new Response(null, { headers: { ...cors, "Access-Control-Allow-Methods": "GET", "Access-Control-Allow-Headers": "*" } });
    if (!allow) return new Response("forbidden", { status: 403, headers: cors });

    const u = new URL(req.url), id = u.searchParams.get("id") || "", k = u.searchParams.get("k") || "";
    if (!/^[\w-]{10,}$/.test(id)) return new Response("bad id", { status: 400, headers: cors });

    const src = ["document", "spreadsheets", "presentation"].includes(k)
      ? `https://docs.google.com/${k}/d/${id}/export?format=pdf`
      : `https://drive.usercontent.google.com/download?id=${id}&export=download&confirm=t`;
    const r = await fetch(src, { redirect: "follow" });
    if (!r.ok) return new Response("upstream " + r.status, { status: 502, headers: cors });
    const ct = r.headers.get("content-type") || "";
    if (!/pdf|octet-stream/i.test(ct)) return new Response("not a pdf", { status: 415, headers: cors });
    return new Response(r.body, { headers: { ...cors, "Content-Type": "application/pdf", "Cache-Control": "public, max-age=3600" } });
  }
};
