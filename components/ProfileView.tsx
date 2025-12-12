import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { User, Mail, Calendar, Bell, Moon, LogOut, Save, Edit2, Shield, Download } from 'lucide-react';

interface ProfileData {
  username: string;
  email: string;
  avatar_url: string | null;
  notification_enabled: boolean;
  timezone: string;
  created_at: string;
}

export const ProfileView: React.FC = () => {
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form state
  const [username, setUsername] = useState('');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [timezone, setTimezone] = useState('UTC');

  useEffect(() => {
    if (user && supabase) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase!
        .from('profiles')
        .select('*')
        .eq('id', user!.id)
        .single();

      if (error) throw error;

      if (data) {
        setProfile(data);
        setUsername(data.username || '');
        setNotificationsEnabled(data.notification_enabled);
        setTimezone(data.timezone || 'UTC');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!user || !supabase) return;

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          username,
          notification_enabled: notificationsEnabled,
          timezone,
        })
        .eq('id', user.id);

      if (error) throw error;

      setSuccess('Profile updated successfully');
      setEditing(false);
      fetchProfile();

      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    if (window.confirm('Exit the Fastlandz? Your progress is saved.')) {
      try {
        await signOut();
      } catch (err: any) {
        setError(err.message);
      }
    }
  };

  const handleExportData = async () => {
    if (!user || !supabase) return;

    try {
      // Fetch all user data
      const [progressData, journalData, sessionsData] = await Promise.all([
        supabase.from('user_progress').select('*').eq('user_id', user.id).single(),
        supabase.from('journal_entries').select('*').eq('user_id', user.id),
        supabase.from('fast_sessions').select('*').eq('user_id', user.id),
      ]);

      const exportData = {
        profile: profile,
        progress: progressData.data,
        journal: journalData.data,
        sessions: sessionsData.data,
        exported_at: new Date().toISOString(),
      };

      // Create download link
      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `fastlandz-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setSuccess('Data exported successfully');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError('Failed to export data');
    }
  };

  if (loading) {
    return (
      <div className="w-full max-w-2xl mx-auto p-4 md:p-8 pb-24 animate-fade-in">
        <div className="text-center text-stone-500 font-mono">
          <div className="animate-pulse">Loading profile data...</div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="w-full max-w-2xl mx-auto p-4 md:p-8 pb-24">
        <div className="bg-blood/20 border border-blood p-4 text-blood font-mono">
          <span className="font-bold">[ERROR]</span> Profile not found
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-4 md:p-8 pb-24 animate-fade-in">
      {/* Header */}
      <div className="border-l-4 border-rust pl-4 mb-8">
        <h2 className="font-display text-3xl md:text-4xl text-white uppercase">Profile</h2>
        <p className="text-stone-400 font-body">Survivor Identity & Settings</p>
      </div>

      {/* Status Messages */}
      {error && (
        <div className="bg-blood/20 border border-blood text-blood p-3 mb-4 text-sm font-mono">
          <span className="font-bold">[ERROR]</span> {error}
        </div>
      )}

      {success && (
        <div className="bg-toxic/20 border border-toxic text-toxic p-3 mb-4 text-sm font-mono">
          <span className="font-bold">[SUCCESS]</span> {success}
        </div>
      )}

      {/* Profile Card */}
      <div className="bg-stone-900/50 border border-stone-800 p-1 mb-6">
        <div className="bg-stone-950 p-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center">
              <div className="w-16 h-16 bg-stone-900 border-2 border-rust rounded-full flex items-center justify-center mr-4">
                <User className="w-8 h-8 text-rust" />
              </div>
              <div>
                <h3 className="font-display text-2xl text-white uppercase">{profile.username || 'Survivor'}</h3>
                <p className="text-stone-500 text-sm font-mono">{profile.email}</p>
                <p className="text-stone-600 text-xs font-mono mt-1">
                  Joined: {new Date(profile.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
            <button
              onClick={() => setEditing(!editing)}
              className="text-stone-500 hover:text-rust transition-colors"
            >
              <Edit2 className="w-5 h-5" />
            </button>
          </div>

          {editing ? (
            <div className="space-y-4 border-t border-stone-900 pt-6">
              <div>
                <label className="block text-stone-500 text-xs uppercase mb-2 font-bold tracking-wider">
                  Username / Callsign
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-stone-900 border border-stone-700 text-white p-3 focus:border-rust outline-none font-mono"
                  placeholder="survivor_001"
                  minLength={3}
                />
              </div>

              <div>
                <label className="block text-stone-500 text-xs uppercase mb-2 font-bold tracking-wider">
                  Timezone
                </label>
                <select
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="w-full bg-stone-900 border border-stone-700 text-white p-3 focus:border-rust outline-none font-mono"
                >
                  <option value="UTC">UTC</option>
                  <option value="America/New_York">Eastern Time</option>
                  <option value="America/Chicago">Central Time</option>
                  <option value="America/Denver">Mountain Time</option>
                  <option value="America/Los_Angeles">Pacific Time</option>
                  <option value="Europe/London">London</option>
                  <option value="Europe/Paris">Paris</option>
                  <option value="Asia/Tokyo">Tokyo</option>
                  <option value="Australia/Sydney">Sydney</option>
                </select>
              </div>

              <div className="flex items-center justify-between bg-stone-900 p-4 border border-stone-800">
                <div className="flex items-center">
                  <Bell className="w-5 h-5 text-rust mr-3" />
                  <div>
                    <p className="text-white text-sm font-bold">Notifications</p>
                    <p className="text-stone-500 text-xs">Receive fast reminders</p>
                  </div>
                </div>
                <button
                  onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    notificationsEnabled ? 'bg-toxic' : 'bg-stone-700'
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full transform transition-transform ${
                      notificationsEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  ></div>
                </button>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={handleSaveProfile}
                  disabled={saving}
                  className="flex-1 bg-rust hover:bg-orange-600 text-black font-display uppercase py-3 tracking-wider disabled:opacity-50 flex items-center justify-center"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  onClick={() => {
                    setEditing(false);
                    setUsername(profile.username || '');
                    setNotificationsEnabled(profile.notification_enabled);
                    setTimezone(profile.timezone || 'UTC');
                  }}
                  disabled={saving}
                  className="flex-1 bg-stone-800 hover:bg-stone-700 text-white font-display uppercase py-3 tracking-wider disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-stone-900 pt-6">
              <div className="bg-stone-900 p-4 border border-stone-800">
                <div className="flex items-center text-stone-600 mb-2">
                  <Mail className="w-4 h-4 mr-2" />
                  <span className="text-xs uppercase font-bold">Email</span>
                </div>
                <p className="text-white font-mono text-sm">{profile.email}</p>
              </div>

              <div className="bg-stone-900 p-4 border border-stone-800">
                <div className="flex items-center text-stone-600 mb-2">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span className="text-xs uppercase font-bold">Timezone</span>
                </div>
                <p className="text-white font-mono text-sm">{profile.timezone}</p>
              </div>

              <div className="bg-stone-900 p-4 border border-stone-800">
                <div className="flex items-center text-stone-600 mb-2">
                  <Bell className="w-4 h-4 mr-2" />
                  <span className="text-xs uppercase font-bold">Notifications</span>
                </div>
                <p className="text-white font-mono text-sm">
                  {profile.notification_enabled ? 'Enabled' : 'Disabled'}
                </p>
              </div>

              <div className="bg-stone-900 p-4 border border-stone-800">
                <div className="flex items-center text-stone-600 mb-2">
                  <Shield className="w-4 h-4 mr-2" />
                  <span className="text-xs uppercase font-bold">Account Status</span>
                </div>
                <p className="text-toxic font-mono text-sm">Active</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <button
          onClick={handleExportData}
          className="w-full bg-stone-900 hover:bg-stone-800 border border-stone-700 text-white font-display uppercase py-3 tracking-wider flex items-center justify-center transition-colors"
        >
          <Download className="w-4 h-4 mr-2" />
          Export My Data
        </button>

        <button
          onClick={handleSignOut}
          className="w-full bg-blood/20 hover:bg-blood/30 border border-blood text-blood font-display uppercase py-3 tracking-wider flex items-center justify-center transition-colors"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </button>
      </div>

      {/* Account Info */}
      <div className="mt-8 p-4 border border-stone-900 bg-stone-950">
        <p className="text-stone-600 text-xs font-mono mb-2">
          <span className="text-stone-500 font-bold">ACCOUNT ID:</span> {user?.id.slice(0, 8)}...
        </p>
        <p className="text-stone-600 text-xs font-mono">
          <span className="text-stone-500 font-bold">AUTH METHOD:</span>{' '}
          {user?.app_metadata.provider === 'google' ? 'Google OAuth' : 'Email/Password'}
        </p>
      </div>
    </div>
  );
};
