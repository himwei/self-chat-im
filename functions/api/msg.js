// functions/api/msg.js

/**
 * 辅助函数：从 User-Agent 解析设备名称
 * 用于当用户未输入昵称时的自动兜底
 */
function getDeviceName(userAgent) {
  if (!userAgent) return "Unknown Device";
  // 简单的正则判断
  const type = /Mobile|Android|iPhone|iPad/i.test(userAgent) ? "Mobile" : "PC";
  let os = "Device";
  if (userAgent.includes("Windows")) os = "Windows";
  else if (userAgent.includes("Macintosh")) os = "Mac";
  else if (userAgent.includes("iPhone")) os = "iPhone";
  else if (userAgent.includes("iPad")) os = "iPad";
  else if (userAgent.includes("Android")) os = "Android";
  else if (userAgent.includes("Linux")) os = "Linux";
  
  return `${os} ${type}`;
}

export async function onRequest(context) {
  const { request, env } = context;

  // --- 1. 安全鉴权 (Security Gate) ---
  // 从请求头获取 token，从环境变量获取密码
  const userToken = request.headers.get("x-auth-token");
  const sysToken = env.SECRET_PASSWORD; 

  // 如果未配置密码或密码错误，直接拦截
  if (!sysToken || userToken !== sysToken) {
    return new Response(JSON.stringify({ error: "Unauthorized: Access Denied" }), {
      status: 401,
      headers: { "Content-Type": "application/json" }
    });
  }

  // --- 2. 发送消息 (POST) ---
  if (request.method === "POST") {
    try {
      const data = await request.json();
      let { content, nickname } = data;

      // 校验：内容不能为空
      if (!content || content.trim() === "") {
        return new Response(JSON.stringify({ error: "Empty Content" }), { status: 400 });
      }
      // 校验：内容不能过长 (Metadata 限制 1KB，中文保险起见限制 300 字)
      if (content.length > 300) {
        return new Response(JSON.stringify({ error: "Content too long (max 300 chars)" }), { status: 400 });
      }

      // 逻辑：如果没填昵称，自动获取设备名
      if (!nickname || nickname.trim() === "") {
        nickname = getDeviceName(request.headers.get("User-Agent") || "");
      }

      const timestamp = Date.now();
      // Key 设计：msg_时间戳_随机数 (虽然 List 默认按 Key 排序，但在 Metadata 方案中 Key 不关键)
      const key = `msg_${timestamp}_${Math.random().toString(36).substring(7)}`;

      const msgObj = {
        ts: timestamp,
        text: content,
        user: nickname
      };

      // ★★★ 核心优化 ★★★
      // 将数据直接存入 metadata，Value 留空。
      // 这样 List 操作时可以直接获取所有数据，无需再调用 Get，极大节省费用。
      await env.IM_KV.put(key, "", { 
        metadata: msgObj 
      });

      return new Response(JSON.stringify({ success: true }), {
        headers: { "Content-Type": "application/json" }
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
  }

  // --- 3. 获取消息 (GET) ---
  if (request.method === "GET") {
    try {
      // 只调用 list，获取最新的 20 条
      // 因为数据都在 metadata 里，所以这就够了
      const list = await env.IM_KV.list({ limit: 20 });
      
      // 提取 metadata，如果某条数据坏了给个默认值
      const messages = list.keys.map(k => k.metadata || { text: "Data Error", ts: 0, user: "System" });
      
      // 内存排序：按时间倒序 (新的在上)
      messages.sort((a, b) => b.ts - a.ts);

      return new Response(JSON.stringify(messages), {
        headers: { "Content-Type": "application/json" }
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
  }

  return new Response("Method Not Allowed", { status: 405 });
}