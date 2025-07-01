
import { useState } from 'react';
import './App.css';

// 企业基础信息（可后续从后端获取）
const companyInfo = {
  name: '新优态科技',
  logo: '', // 可替换为企业LOGO图片地址
  description: '新优态科技致力于AI驱动的企业数字化转型。',
  contact: 'contact@xinyoutai.com',
};

function App() {
  const [messages, setMessages] = useState([
    { role: 'ai', content: '您好，我是新优态科技的数字员工，有什么可以帮您？' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  // 发送消息到后端（后续对接新优态AI API）
  const sendMessage = async () => {
    if (!input.trim()) return;
    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);
    try {
      // TODO: 替换为后端API地址
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      });
      const data = await res.json();
      setMessages([...newMessages, { role: 'ai', content: data.reply }]);
    } catch {
      setMessages([...newMessages, { role: 'ai', content: '抱歉，服务暂时不可用。' }]);
    }
    setLoading(false);
  };

  return (
    <div className="business-card-container">
      <div className="company-info">
        {companyInfo.logo && <img src={companyInfo.logo} alt="logo" className="company-logo" />}
        <h2>{companyInfo.name}</h2>
        <p>{companyInfo.description}</p>
        <p>联系方式：{companyInfo.contact}</p>
      </div>
      <div className="chat-section">
        <div className="chat-messages">
          {messages.map((msg, idx) => (
            <div key={idx} className={`msg msg-${msg.role}`}>
              <b>{msg.role === 'ai' ? '数字员工' : '我'}：</b> {msg.content}
            </div>
          ))}
          {loading && <div className="msg msg-ai">数字员工正在输入...</div>}
        </div>
        <div className="chat-input-row">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
            placeholder="请输入您的问题..."
            disabled={loading}
          />
          <button onClick={sendMessage} disabled={loading || !input.trim()}>发送</button>
        </div>
      </div>
    </div>
  );
}

export default App;
