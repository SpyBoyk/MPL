import React, { useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Camera, Loader2 } from 'lucide-react';
import { apiClient } from '../../api/client';
import { useAuth, type PlayerProfile } from '../../context/AuthContext';

const MAX_PHOTO_SIZE = 5 * 1024 * 1024; // 5MB

interface PlayerPhotoUploaderProps {
  playerId: string;
}

/** Camera-icon overlay shown only on a player's own profile page. Uploads a
 * new photo to the authenticated "me" endpoint and refreshes both the
 * cached auth profile and the player-detail query on success. */
export const PlayerPhotoUploader: React.FC<PlayerPhotoUploaderProps> = ({ playerId }) => {
  const { updateProfile } = useAuth();
  const queryClient = useQueryClient();
  const inputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setStatus('error');
      setError('Please choose an image file.');
      return;
    }
    if (file.size > MAX_PHOTO_SIZE) {
      setStatus('error');
      setError('Photo must be 5MB or smaller.');
      return;
    }

    setStatus('uploading');
    setError(null);

    try {
      const formData = new FormData();
      formData.append('photo', file);
      const res = await apiClient.patch<PlayerProfile>('/player/profile/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      updateProfile(res.data);
      await queryClient.invalidateQueries({ queryKey: ['player-detail', playerId] });
      setStatus('idle');
    } catch {
      setStatus('error');
      setError('Upload failed. Please try again.');
    }
  };

  return (
    <div className="absolute -top-1 -right-1">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={status === 'uploading'}
        aria-label="Update profile picture"
        className="flex items-center justify-center w-7 h-7 rounded-full bg-[#174478] dark:bg-sky-600 text-white border-2 border-white dark:border-[#0b1329] shadow-md hover:bg-[#123660] dark:hover:bg-sky-500 transition cursor-pointer disabled:opacity-70"
      >
        {status === 'uploading' ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : (
          <Camera className="w-3.5 h-3.5" />
        )}
      </button>
      {error && (
        <span className="absolute top-full right-0 mt-1 w-40 text-[10px] font-semibold text-rose-600 dark:text-rose-400 bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-800 rounded-md px-2 py-1 shadow-sm">
          {error}
        </span>
      )}
    </div>
  );
};
