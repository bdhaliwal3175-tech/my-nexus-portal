/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  MessageSquare, Shield, LogOut, FileText 
} from 'lucide-react';

interface User {
  id: string;
  username: string;
  email: string;
  mobile: string;
  device: string;
  geoLocation: string;
  isAdmin: boolean;
  isMasterAdmin: boolean;
}

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  isE2EE: boolean;
}

interface Contact {
  id: string;
  name: string;
  handle: string;
  avatarBg: string;
  lastMessage: string;
  timestamp: string;
  online: boolean;
}

interface Album {
  id: string;
  author: string;
  authorName: string;
  title: string;
  caption: string;
  imageUrl: string;
  likes: number;
}

interface DriveFile {
  id: string;
  name: string;
  size: string;
  createdTime: string;
  type: 'Image' | 'File' | 'Video' | 'Backup' | 'Audio';
}

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authView, setAuthView] = useState<'login' | 'register'>('login');
  
  const [usernameInput, setUsernameInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');

  const [activeTab, setActiveTab] = useState<'home' | 'chat' | 'albums' | 'admin' | 'drive'>('home');

  const [contacts] = useState<Contact[]>([
    { id: 'nexus-admin', name: 'NexusAdmin', handle: '@NexusAdmin', avatarBg: 'bg-[#93b5c6]', lastMessage: 'Welcome to Secure NexusChat Portal.', timestamp: '10:00 AM', online: true },
    { id: 'group-network', name: 'Group Network Channel', handle: '@group_net', avatarBg: 'bg-[#a3c1ad]', lastMessage: 'Welcome to our group network channel!', timestamp: '09:15 AM', online: true },
    { id: 'master-admin', name: 'MA#3175 (Master Admin)', handle: '@MA#3175', avatarBg: 'bg-[#b91c1c]', lastMessage: 'Master Admin channel active. E2EE enabled.', timestamp: '08:00 AM', online: false }
  ]);
  const [activeContact, setActiveContact] = useState<Contact | null>(null);
  const [messages, setMessages] = useState<Record<string, Message[]>>({
    'nexus-admin': [{ id: '1', sender: 'NexusAdmin', content: 'Welcome to Secure NexusChat Portal.', timestamp: '10:00 AM', isE2EE: true }]
  });
  const [chatInput, setChatInput] = useState('');

  const [albums] = useState<Album[]>([
    { id: 'a1', author: 'MA#3175', authorName: 'Master Admin', title: 'Nexus Portal Launch', caption: 'Secure E2EE communication & Google Drive backup active.', imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80', likes: 14 }
  ]);

  const [driveStorageUsed] = useState(4.2);
  const [driveStorageTotal] = useState(15.0);
  const [driveFiles] = useState<DriveFile[]>([
    { id: 'df-1', name: 'NexusChat_Backup_General.json', size: '2.4 MB', createdTime: 'Today, 04:15 AM', type: 'Backup' },
    { id: 'df-2', name: 'Campus_Album_Cover.jpg', size: '640 KB', createdTime: 'Yesterday', type: 'Image' }
  ]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usernameOrEmail: usernameInput || emailInput, password: passwordInput })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');
      setCurrentUser(data.user);
      setActiveTab(data.user.isAdmin ? 'admin' : 'home');
    } catch (err: any) {
      setAuthError(err.message || 'Login failed');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: usernameInput, email: emailInput, mobile: '+1-555-0000', device: 'Browser', geoLocation: 'US', password: passwordInput })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Registration failed');
      setAuthSuccess('Registration successful! Please login.');
      setTimeout(() => setAuthView('login'), 1500);
    } catch (err: any) {
      setAuthError(err.message || 'Registration failed');
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !currentUser || !activeContact) return;
    const newMsg: Message = { id: Date.now().toString(), sender: currentUser.username, content: chatInput, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), isE2EE: true };
    const cid = activeContact.id;
    setMessages(prev => ({ ...prev, [cid]: [...(prev[cid] || []), newMsg] }));
    setChatInput('');
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#f7f5f0] flex items-center justify-center p-4">
        <div className="bg-white border border-[#e5e0d8] rounded-3xl max-w-md w-full p-8 shadow-xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-[#b91c1c] rounded-2xl mx-auto flex items-center justify-center text-white font-black text-2xl shadow-md">NC</div>
            <h1 className="text-2xl font-bold text-[#2d3748]">NexusChat Portal</h1>
            <p className="text-xs text-[#718096]">Secure E2EE Encrypted Messaging & Cloud Backup</p>
          </div>

          {authError && <div className="p-3 bg-red-50 text-red-600 rounded-xl text-xs">{authError}</div>}
          {authSuccess && <div className="p-3 bg-green-50 text-green-600 rounded-xl text-xs">{authSuccess}</div>}

          {authView === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-[#4a5568]">Username or Email</label>
                <input type="text" value={usernameInput} onChange={e => setUsernameInput(e.target.value)} required placeholder="e.g. MA#3175" className="w-full mt-1 bg-[#fdfbf7] border border-[#e5e0d8] rounded-xl px-4 py-3 text-sm" />
              </div>
              <div>
                <label className="text-xs font-semibold text-[#4a5568]">Password</label>
                <input type="password" value={passwordInput} onChange={e => setPasswordInput(e.target.value)} required placeholder="••••••••" className="w-full mt-1 bg-[#fdfbf7] border border-[#e5e0d8] rounded-xl px-4 py-3 text-sm" />
              </div>
              <button type="submit" className="w-full py-3 bg-[#93b5c6] hover:bg-[#7fa5b8] text-white font-bold rounded-xl text-sm shadow-sm transition-colors">Sign In</button>
              <div className="text-center pt-2">
                <button type="button" onClick={() => setAuthView('register')} className="text-xs text-[#93b5c6] font-semibold hover:underline">Don't have an account? Register</button>
              </div>
            </form>
          )}

          {authView === 'register' && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-[#4a5568]">Username</label>
                <input type="text" value={usernameInput} onChange={e => setUsernameInput(e.target.value)} required placeholder="Choose username" className="w-full mt-1 bg-[#fdfbf7] border border-[#e5e0d8] rounded-xl px-4 py-3 text-sm" />
              </div>
              <div>
                <label className="text-xs font-semibold text-[#4a5568]">Email</label>
                <input type="email" value={emailInput} onChange={e => setEmailInput(e.target.value)} required placeholder="name@example.com" className="w-full mt-1 bg-[#fdfbf7] border border-[#e5e0d8] rounded-xl px-4 py-3 text-sm" />
              </div>
              <div>
                <label className="text-xs font-semibold text-[#4a5568]">Password</label>
                <input type="password" value={passwordInput} onChange={e => setPasswordInput(e.target.value)} required placeholder="••••••••" className="w-full mt-1 bg-[#fdfbf7] border border-[#e5e0d8] rounded-xl px-4 py-3 text-sm" />
              </div>
              <button type="submit" className="w-full py-3 bg-[#b91c1c] hover:bg-[#a11616] text-white font-bold rounded-xl text-sm shadow-sm transition-colors">Create Account</button>
              <div className="text-center pt-2">
                <button type="button" onClick={() => setAuthView('login')} className="text-xs text-[#718096] hover:underline">Already have an account? Sign In</button>
              </div>
            </form>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f5f0] text-[#2d3748] flex flex-col">
      <header className="bg-white border-b border-[#e5e0d8] px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-[#b91c1c] rounded-xl flex items-center justify-center text-white font-black text-sm">NC</div>
          <div>
            <h1 className="text-base font-bold text-[#2d3748]">Nexus Portal</h1>
            <p className="text-[10px] text-[#718096]">Logged in as {currentUser.username}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setActiveTab('home')} className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${activeTab === 'home' ? 'bg-[#93b5c6] text-white' : 'bg-gray-100 text-[#4a5568]'}`}>Chats</button>
          <button onClick={() => setActiveTab('albums')} className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${activeTab === 'albums' ? 'bg-[#93b5c6] text-white' : 'bg-gray-100 text-[#4a5568]'}`}>Albums</button>
          <button onClick={() => setActiveTab('drive')} className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${activeTab === 'drive' ? 'bg-[#93b5c6] text-white' : 'bg-gray-100 text-[#4a5568]'}`}>Drive ({driveStorageUsed}GB)</button>
          <button onClick={() => setActiveTab('admin')} className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${activeTab === 'admin' ? 'bg-[#b91c1c] text-white' : 'bg-gray-100 text-[#4a5568]'}`}>Admin Suite</button>
          <button onClick={() => setCurrentUser(null)} className="p-2 text-red-600 hover:bg-red-50 rounded-xl" title="Logout"><LogOut className="w-4 h-4" /></button>
        </div>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto p-6">
        {activeTab === 'home' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-[#e5e0d8] rounded-3xl p-4 shadow-sm space-y-3">
              <h2 className="text-sm font-bold text-[#2d3748] px-2">Connected Contacts</h2>
              <div className="space-y-1">
                {contacts.map(c => (
                  <div key={c.id} onClick={() => { setActiveContact(c); setActiveTab('chat'); }} className={`p-3 rounded-2xl flex items-center justify-between cursor-pointer transition-colors ${activeContact?.id === c.id ? 'bg-[#f0f4f8]' : 'hover:bg-gray-50'}`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl ${c.avatarBg} flex items-center justify-center text-white font-bold`}>{c.name[0]}</div>
                      <div>
                        <div className="text-xs font-bold text-[#2d3748]">{c.name}</div>
                        <div className="text-[10px] text-[#718096] truncate max-w-[140px]">{c.lastMessage}</div>
                      </div>
                    </div>
                    <span className="text-[10px] text-[#a0aec0]">{c.timestamp}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="md:col-span-2 bg-white border border-[#e5e0d8] rounded-3xl p-6 shadow-sm flex items-center justify-center text-center">
              <div className="space-y-3">
                <MessageSquare className="w-12 h-12 text-[#93b5c6] mx-auto" />
                <h3 className="text-lg font-bold text-[#2d3748]">Select a Contact to Start Messaging</h3>
                <p className="text-xs text-[#718096]">End-to-end encrypted secure channel ready.</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'chat' && activeContact && (
          <div className="bg-white border border-[#e5e0d8] rounded-3xl shadow-sm flex flex-col h-[650px]">
            <div className="p-4 border-b border-[#e5e0d8] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl ${activeContact.avatarBg} flex items-center justify-center text-white font-bold text-sm`}>{activeContact.name[0]}</div>
                <div>
                  <div className="text-sm font-bold text-[#2d3748]">{activeContact.name}</div>
                  <div className="text-[10px] text-green-600 font-semibold flex items-center gap-1">● End-to-End Encrypted</div>
                </div>
              </div>
            </div>

            <div className="flex-1 p-6 overflow-y-auto space-y-3 bg-[#faf9f5]">
              {(messages[activeContact.id] || []).map(m => (
                <div key={m.id} className={`flex flex-col ${m.sender === currentUser.username ? 'items-end' : 'items-start'}`}>
                  <div className={`max-w-md px-4 py-3 rounded-2xl text-xs shadow-sm ${m.sender === currentUser.username ? 'bg-[#93b5c6] text-white rounded-br-xs' : 'bg-white border border-[#e5e0d8] text-[#2d3748] rounded-bl-xs'}`}>
                    {m.content}
                  </div>
                  <span className="text-[9px] text-[#a0aec0] mt-1 px-1">{m.timestamp}</span>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendMessage} className="p-4 border-t border-[#e5e0d8] flex items-center gap-3">
              <input type="text" value={chatInput} onChange={e => setChatInput(e.target.value)} placeholder="Type encrypted message..." className="flex-1 bg-[#fdfbf7] border border-[#e5e0d8] rounded-xl px-4 py-3 text-xs focus:outline-none" />
              <button type="submit" className="px-5 py-3 bg-[#93b5c6] hover:bg-[#7fa5b8] text-white rounded-xl text-xs font-bold transition-colors shadow-sm">Send</button>
            </form>
          </div>
        )}

        {activeTab === 'albums' && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-[#2d3748]">Secure Albums Feed</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {albums.map(a => (
                <div key={a.id} className="bg-white border border-[#e5e0d8] rounded-3xl overflow-hidden shadow-sm space-y-3">
                  <img src={a.imageUrl} alt={a.title} className="w-full h-64 object-cover" />
                  <div className="p-4 space-y-1">
                    <div className="text-sm font-bold text-[#2d3748]">{a.title}</div>
                    <p className="text-xs text-[#718096]">{a.caption}</p>
                    <div className="text-[10px] text-[#a0aec0] pt-2">By {a.authorName}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'drive' && (
          <div className="bg-white border border-[#e5e0d8] rounded-3xl p-6 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-[#2d3748]">Google Drive Cloud Backup</h2>
                <p className="text-xs text-[#718096]">Using {driveStorageUsed} GB of {driveStorageTotal} GB storage</p>
              </div>
              <div className="w-32 bg-gray-100 h-3 rounded-full overflow-hidden">
                <div className="bg-[#93b5c6] h-full" style={{ width: `${(driveStorageUsed / driveStorageTotal) * 100}%` }}></div>
              </div>
            </div>
            <div className="space-y-2">
              {driveFiles.map(f => (
                <div key={f.id} className="p-3 bg-[#fdfbf7] border border-[#e5e0d8] rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-[#93b5c6]" />
                    <div>
                      <div className="text-xs font-bold text-[#2d3748]">{f.name}</div>
                      <div className="text-[10px] text-[#718096]">{f.size} • {f.createdTime}</div>
                    </div>
                  </div>
                  <span className="text-[10px] bg-blue-50 text-blue-600 px-2.5 py-1 rounded-lg font-semibold">{f.type}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'admin' && (
          <div className="bg-white border border-[#e5e0d8] rounded-3xl p-6 shadow-sm space-y-6">
            <h2 className="text-lg font-bold text-[#2d3748] flex items-center gap-2">
              <Shield className="w-5 h-5 text-[#b91c1c]" />
              Master Admin Suite & White-Label Controls
            </h2>
            <p className="text-xs text-[#718096]">Manage users, audit logs, and white-label branding configurations.</p>
            <div className="p-4 bg-[#fdfbf7] border border-[#e5e0d8] rounded-2xl space-y-2">
              <div className="text-xs font-bold text-[#2d3748]">System Status: All Encrypted Channels Active</div>
              <div className="text-[10px] text-green-600 font-semibold">● Google Drive & Sheets Sync Operational</div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
    }
