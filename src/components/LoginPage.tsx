import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export function LoginPage() {
  const { login } = useAuth();
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId.trim()) {
      setError('Vui lòng nhập tài khoản');
      return;
    }
    if (!password) {
      setError('Vui lòng nhập mật khẩu');
      return;
    }
    const success = login(userId.trim().toLowerCase(), password);
    if (!success) {
      setError('Tài khoản hoặc mật khẩu không đúng');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-energy-purple/10 to-energy-orange/10 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 w-full max-w-sm">
        <div className="text-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-energy-purple to-energy-orange bg-clip-text text-transparent">
            Lịch Năng Lượng
          </h1>
          <p className="text-slate-500 mt-2">Gia đình</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Tài khoản
            </label>
            <input
              type="text"
              value={userId}
              onChange={(e) => {
                setUserId(e.target.value);
                setError('');
              }}
              placeholder="Nhập tài khoản"
              autoComplete="username"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-energy-purple focus:ring-2 focus:ring-energy-purple/20 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Mật khẩu
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              placeholder="Nhập mật khẩu"
              autoComplete="current-password"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-energy-purple focus:ring-2 focus:ring-energy-purple/20 outline-none transition-all"
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-energy-purple to-energy-orange text-white font-semibold rounded-xl hover:opacity-90 transition-opacity"
          >
            Đăng nhập
          </button>
        </form>

        <p className="text-xs text-slate-400 text-center mt-6">
          Đăng nhập một lần, ghi nhớ vĩnh viễn
        </p>
      </div>
    </div>
  );
}
