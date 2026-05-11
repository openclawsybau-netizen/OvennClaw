// ── Bypassed Login ──
currentUser = { username: 'guest', is_admin: true, is_active: true, token: 'bypassed' };
isAdmin = true;
showApp();

// ── API Helper ──
async function apiFetch(url, options = {}) {
  const resp = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    credentials: 'include',
  });
  if (!resp.ok) throw new Error(`API error: ${resp.status}`);
  return resp;
}

async function logout() {
  try { await fetch('/auth/logout', { method: 'POST', credentials: 'include' }); } catch {}
  currentUser = null;
  location.reload();
}

async function loadUserData() {
  try {
    const resp = await apiFetch('/auth/me');
    const data = await resp.json();
    currentUser = data;
    isAdmin = data.is_admin;

    document.getElementById('sidebar-subtitle').textContent = data.username;
    document.getElementById('user-summary').textContent = `User: ${data.username}\nRole: ${data.is_admin ? 'Admin' : 'User'}\nActive: ${data.is_active}`;
    document.getElementById('role-chip').textContent = data.is_admin ? 'Admin' : 'User';

    if (isAdmin) {
      document.getElementById('admin-panel').style.display = 'block';
      loadAdminUsers();
    }

    loadConnections();
    loadConversations();
  } catch (err) {
    document.getElementById('user-summary').textContent = `Error: ${err.message}`;
  }
}

// ── Connection Health ──
async function loadConnections() {
  try {
    const resp = await fetch('/health');
    const data = await resp.json();
    document.getElementById('connection-status').textContent = data.status === 'ok' ? 'RAG backend connected' : 'RAG backend offline';
    if (data.model) document.getElementById('model-chip').textContent = data.model;
  } catch {
    document.getElementById('connection-status').textContent = 'RAG backend offline';
  }
}

// ── Conversations ──
async function loadConversations() {
  try {
    const resp = await apiFetch('/conversations');
    const data = await resp.json();
    const list = document.getElementById('conversation-list');
    list.innerHTML = '';
    data.conversations.forEach(conv => {
      const item = document.createElement('div');
      item.className = 'source-item';
      item.innerHTML = `<strong>${escapeHtml(conv.title)}</strong><div class="source-actions"><button class="small-btn" onclick="loadConversation(${conv.id})">Load</button><button class="small-btn" onclick="deleteConversation(${conv.id})">Delete</button></div>`;
      list.appendChild(item);
    });
    document.getElementById('conversation-status').textContent = `Found ${data.conversations.length} chats.`;
  } catch (err) {
    document.getElementById('conversation-status').textContent = `Error: ${err.message}`;
  }
}

async function newChat() {
  try {
    const resp = await apiFetch('/conversations', { method: 'POST', body: JSON.stringify({ title: 'New chat' }) });
    const data = await resp.json();
    currentChatId = data.id;
    document.getElementById('chat-inner').innerHTML = `
      <div class="welcome"><h1>Hello, I'm Ambi</h1><p>I can chat directly with Ollama, or answer from your business documents using your local RAG backend.</p>
      <div class="quick-actions">
        <button class="quick-btn" onclick="fillPrompt('What does the return policy say about damaged stock?')"><strong>Ask from documents</strong><span>Use document-grounded answers with file references.</span></button>
        <button class="quick-btn" onclick="fillPrompt('Summarise the warranty terms in plain English')"><strong>Summarise a policy</strong><span>Turn long documents into quick readable answers.</span></button>
        <button class="quick-btn" onclick="fillPrompt('Give me 5 creative app ideas')"><strong>Direct Ollama chat</strong><span>Toggle document mode off for normal chat.</span></button>
      </div></div>`;
    loadConversations();
  } catch (err) {
    alert(`Error: ${err.message}`);
  }
}

async function loadConversation(id) {
  try {
    const resp = await apiFetch(`/conversations/${id}`);
    const data = await resp.json();
    currentChatId = id;
    const inner = document.getElementById('chat-inner');
    inner.innerHTML = '';
    data.messages.forEach(msg => addMessageToChat(msg.role, msg.content, false));
    scrollToBottom();
  } catch (err) {
    alert(`Error: ${err.message}`);
  }
}

async function deleteConversation(id) {
  try {
    await fetch(`/conversations/${id}`, { method: 'DELETE', credentials: 'include' });
    loadConversations();
  } catch (err) {
    alert(`Error: ${err.message}`);
  }
}

// ── Chat ──
async function sendMessage() {
  const input = document.getElementById('user-input');
  const text = input.value.trim();
  if (!text || !currentChatId) return;

  addMessageToChat('user', text, true);
  input.value = '';
  input.style.height = 'auto';

  // Show typing indicator
  const typingDiv = document.createElement('div');
  typingDiv.className = 'message-row assistant';
  typingDiv.innerHTML = `<div class="avatar assistant">A</div><div class="bubble-wrap"><div class="typing"><span></span><span></span><span></span></div></div>`;
  document.getElementById('chat-inner').appendChild(typingDiv);
  scrollToBottom();

  try {
    const url = isRagMode ? `/rag/chat/${currentChatId}` : `/ollama/chat/${currentChatId}`;
    const resp = await apiFetch(url, {
      method: 'POST',
      body: JSON.stringify({ message: text }),
    });
    const data = await resp.json();
    typingDiv.remove();

    if (data.sources && data.sources.length > 0) {
      let sourcesHtml = '<div class="bubble-sources">';
      data.sources.forEach(src => {
        sourcesHtml += `<div class="bubble-source"><strong>${escapeHtml(src.filename)}</strong>${escapeHtml(src.content.substring(0, 200))}...</div>`;
      });
      sourcesHtml += '</div>';
      addMessageToChat('assistant', data.message + sourcesHtml, true);
    } else {
      addMessageToChat('assistant', data.message, true);
    }
    scrollToBottom();
  } catch (err) {
    typingDiv.remove();
    addMessageToChat('system', `Error: ${err.message}`, true);
  }
}

function addMessageToChat(role, content, appendToChat) {
  const inner = document.getElementById('chat-inner');
  if (appendToChat) {
    const welcome = document.getElementById('welcome');
    if (welcome) welcome.style.display = 'none';
  }

  const div = document.createElement('div');
  div.className = `message-row ${role}`;
  div.innerHTML = `
    ${role !== 'user' ? '<div class="avatar assistant">A</div>' : ''}
    <div class="bubble-wrap">
      <div class="bubble">${escapeHtml(content)}</div>
    </div>
    ${role === 'user' ? '<div class="avatar user">U</div>' : ''}`;
  inner.appendChild(div);
  scrollToBottom();
}

function scrollToBottom() {
  const box = document.getElementById('chat-box');
  box.scrollTop = box.scrollHeight;
}

function fillPrompt(text) {
  document.getElementById('user-input').value = text;
  document.getElementById('user-input').focus();
  autoResize(document.getElementById('user-input'));
}

function handleKey(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
}

function autoResize(el) {
  el.style.height = 'auto';
  el.style.height = el.scrollHeight + 'px';
}

// ── RAG ──
function toggleRagMode() {
  isRagMode = !isRagMode;
  const btn = document.getElementById('rag-toggle');
  const chip = document.getElementById('mode-chip');
  const label = document.getElementById('mode-label');
  btn.classList.toggle('active');
  chip.classList.toggle('chip-live');
  chip.textContent = isRagMode ? 'RAG mode' : 'Direct mode';
  label.textContent = isRagMode ? 'Document-grounded answers' : 'Direct Ollama chat';
}

async function ingestDocs() {
  const path = document.getElementById('docs-path').value;
  const url = document.getElementById('rag-url').value;
  const status = document.getElementById('rag-status');

  if (!path) { status.textContent = 'Please enter a document folder path.'; return; }

  status.textContent = 'Ingesting documents...';
  try {
    const resp = await apiFetch(`${url}/ingest`, {
      method: 'POST',
      body: JSON.stringify({ path }),
    });
    const data = await resp.json();
    status.textContent = `Done! Indexed ${data.documents?.length || 0} documents.`;
  } catch (err) {
    status.textContent = `Error: ${err.message}`;
  }
}

// ── Admin ──
async function loadAdminUsers() {
  try {
    const resp = await apiFetch('/admin/users');
    const data = await resp.json();
    const list = document.getElementById('user-list');
    list.innerHTML = '';
    data.users.forEach(user => {
      const item = document.createElement('div');
      item.className = 'source-item';
      item.innerHTML = `<strong>${escapeHtml(user.username)}</strong><div>Role: ${user.is_admin ? 'Admin' : 'User'}</div><div>Status: ${user.is_active ? 'Active' : 'Disabled'}</div><div class="source-actions"><button class="small-btn" onclick="resetPassword(${user.id}, '${escapeHtml(user.username)}')">Reset Password</button><button class="small-btn" onclick="deleteUser(${user.id}, '${escapeHtml(user.username)}')">Delete</button></div>`;
      list.appendChild(item);
    });
    document.getElementById('admin-status').textContent = `Admin tools ready. ${data.users.length} users.`;
  } catch (err) {
    document.getElementById('admin-status').textContent = `Error: ${err.message}`;
  }
}

async function createUser() {
  const username = document.getElementById('new-username').value.trim();
  const password = document.getElementById('new-user-password').value;
  const admin = document.getElementById('new-admin-toggle').classList.contains('active');
  const status = document.getElementById('admin-status');

  if (!username || !password) { status.textContent = 'Enter both username and password.'; return; }

  try {
    const resp = await apiFetch('/admin/users', {
      method: 'POST',
      body: JSON.stringify({ username, password, is_admin: admin }),
    });
    await resp.json();
    document.getElementById('new-username').value = '';
    document.getElementById('new-user-password').value = '';
    document.getElementById('new-admin-toggle').classList.remove('active');
    status.textContent = `Created user ${username}.`;
    loadAdminUsers();
  } catch (err) {
    status.textContent = `Error: ${err.message}`;
  }
}

async function resetPassword(userId, username) {
  const newPass = prompt(`Enter new password for ${username}`);
  if (!newPass) return;
  try {
    await apiFetch(`/admin/users/${userId}/password`, {
      method: 'PATCH',
      body: JSON.stringify({ new_password: newPass }),
    });
    document.getElementById('admin-status').textContent = `Password changed for ${username}.`;
  } catch (err) {
    document.getElementById('admin-status').textContent = `Error: ${err.message}`;
  }
}

async function deleteUser(userId, username) {
  if (!confirm(`Delete user "${username}"?`)) return;
  try {
    await apiFetch(`/admin/users/${userId}`, { method: 'DELETE' });
    document.getElementById('admin-status').textContent = `Deleted ${username}.`;
    loadAdminUsers();
  } catch (err) {
    document.getElementById('admin-status').textContent = `Error: ${err.message}`;
  }
}

function toggleNewAdmin() {
  document.getElementById('new-admin-toggle').classList.toggle('active');
}

function changeOwnPassword() {
  const current = document.getElementById('current-password').value;
  const newPw = document.getElementById('new-password-self').value;
  if (!current || !newPw) { document.getElementById('user-summary').textContent = 'Enter both current and new password.'; return; }
  apiFetch('/auth/password', { method: 'PATCH', body: JSON.stringify({ current_password: current, new_password: newPw }) })
    .then(() => { document.getElementById('user-summary').textContent = 'Password changed successfully!'; })
    .catch(err => { document.getElementById('user-summary').textContent = `Error: ${err.message}`; });
}

// ── Utilities ──
function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
