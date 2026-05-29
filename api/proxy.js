// Vercel 서버리스 프록시 — CORS 없이 Apps Script 호출
module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const { scriptUrl, ...params } = req.query;

  if (!scriptUrl) {
    return res.status(400).json({ success: false, error: 'scriptUrl 파라미터가 없습니다.' });
  }

  try {
    const url = new URL(scriptUrl);
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null) url.searchParams.set(k, v);
    });

    const response = await fetch(url.toString(), {
      redirect: 'follow',
      headers:  { Accept: 'application/json' }
    });

    const text = await response.text();
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.status(200).send(text);
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
};
