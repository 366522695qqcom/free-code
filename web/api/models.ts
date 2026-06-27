// Vercel serverless function — 代理模型列表请求，自动添加正确后缀。
// 前端请求同源 /api/models（避免 CORS），由本函数转发到上游 API。
//
// Anthropic: GET {baseURL}/v1/models（浏览器直接请求会被 CORS 拦截，
//   anthropic-dangerous-direct-browser-access 只对 /v1/messages 生效）
// OpenAI:    GET {baseURL}/models（baseURL 已含 /v1）

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const { apiType, baseURL, apiKey } = req.body || {}

  if (!apiType || !baseURL || !apiKey) {
    res.status(400).json({ error: '缺少 apiType、baseURL 或 apiKey' })
    return
  }

  const isAnthropic = apiType === 'anthropic'
  // 自动添加正确后缀
  const url = isAnthropic
    ? `${baseURL.replace(/\/$/, '')}/v1/models`
    : `${baseURL.replace(/\/$/, '')}/models`

  const headers = isAnthropic
    ? {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      }
    : {
        authorization: `Bearer ${apiKey}`,
      }

  try {
    const upstream = await fetch(url, { method: 'GET', headers })
    const text = await upstream.text()
    if (!upstream.ok) {
      res.status(upstream.status).json({ error: `上游 ${upstream.status}：${text}` })
      return
    }
    // 直接透传上游 JSON（含 data[].id）
    res.status(200).json(JSON.parse(text))
  } catch (err) {
    res.status(502).json({
      error: `代理错误：${err instanceof Error ? err.message : String(err)}`,
    })
  }
}
