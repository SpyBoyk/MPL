import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Upload, CheckCircle2 } from 'lucide-react';
import { apiClient } from '../api/client';
import { useToast } from '../context/ToastContext';

const ink = 'text-slate-900 dark:text-chalk';
const inkSoft = 'text-slate-600 dark:text-chalk/50';
const ruleBorder = 'border-slate-300/80 dark:border-chalk/15';
const panelBg = 'bg-[#f7f4ed] dark:bg-[#080f1a]';
const asideBg = 'bg-[#efeadd] dark:bg-[#060b13]';

const inputCls =
  'w-full px-4 py-3 bg-transparent border border-slate-400/60 dark:border-chalk/20 text-slate-900 dark:text-chalk placeholder-slate-400/80 dark:placeholder-chalk/25 text-sm font-medium focus:outline-none focus:border-sodium-deep dark:focus:border-sodium focus:bg-slate-900/[0.03] dark:focus:bg-chalk/[0.03] transition-colors';
const labelCls =
  'block text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-chalk/50 mb-2';
const selectCls =
  'w-full px-3 py-3 bg-transparent border border-slate-400/60 dark:border-chalk/20 text-slate-900 dark:text-chalk text-sm focus:outline-none focus:border-sodium-deep dark:focus:border-sodium transition-colors appearance-none truncate';

function IdentityAside() {
  return (
    <div className={`relative hidden lg:flex flex-col justify-end overflow-hidden border-r ${ruleBorder} ${asideBg}`}>
      <img
        src="/images/bg3.jpg"
        alt=""
        aria-hidden
        className="absolute inset-0 w-full h-full object-cover object-center"
      />
      <div className="absolute inset-0 bg-white/40 dark:bg-pitch/55" />
      <div className="absolute inset-0 dark:hidden bg-gradient-to-r from-white/55 via-transparent to-[#efeadd]/80" />
      <div className="absolute inset-0 hidden dark:block bg-gradient-to-r from-pitch/70 via-transparent to-[#080f1a]" />

      <div className="relative p-12 lg:p-16 pb-10">
        <h2 className={`mpl-display text-5xl xl:text-6xl font-semibold ${ink} leading-[0.96] max-w-md drop-shadow-md`}>
          Take your place in the record book.
        </h2>
        <p className={`mt-4 ${inkSoft} text-sm max-w-sm leading-relaxed drop-shadow-md`}>
          Registration puts your name into the official squad list — every innings you play from
          then on is kept on record.
        </p>
      </div>

      <ol className={`relative mt-10 border-t ${ruleBorder} backdrop-blur-sm bg-white/50 dark:bg-pitch/65 px-12 lg:px-16 py-8 space-y-3.5 text-sm`}>
        {[
          'Create your profile with playing role and shirt number.',
          'A committee captain adds you to one of the six squads.',
          'Scorecards, stats and history follow your name automatically.',
        ].map((step, i) => (
          <li key={step} className={`flex gap-3.5 ${inkSoft}`}>
            <span className="mpl-num text-sodium-deep dark:text-sodium shrink-0">
              {String(i + 1).padStart(2, '0')}
            </span>
            {step}
          </li>
        ))}
      </ol>
    </div>
  );
}

export const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({
    full_name: '',
    username: '',
    email: '',
    phone_number: '',
    password: '',
    password_confirm: '',
    playing_role: 'all_rounder',
    batting_style: 'right_hand',
    bowling_style: 'right_arm_medium',
    jersey_number: '',
  });

  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [paymentScreenshot, setPaymentScreenshot] = useState<File | null>(null);

  useEffect(() => {
    if (!photo) {
      setPhotoPreview(null);
      return;
    }
    const url = URL.createObjectURL(photo);
    setPhotoPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [photo]);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.password_confirm) {
      showToast('Passwords do not match. Please re-enter.', 'error');
      return;
    }

    if (!photo) {
      showToast('Please choose a profile photo.', 'error');
      return;
    }

    if (!paymentScreenshot) {
      showToast('Please upload a screenshot of your payment.', 'error');
      return;
    }

    setLoading(true);

    try {
      const payload = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'jersey_number') {
          if (value) payload.append(key, value);
        } else {
          payload.append(key, value);
        }
      });
      payload.append('photo', photo);
      payload.append('payment_screenshot', paymentScreenshot);

      await apiClient.post('/auth/register/', payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setSuccess(true);
      showToast('Registration successful. Redirecting to sign in…', 'success');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err: any) {
      const respData = err.response?.data;
      let message = 'Registration failed. Please check your details and try again.';
      if (respData) {
        const firstKey = Object.keys(respData)[0];
        const val = respData[firstKey];
        message = Array.isArray(val) ? `${firstKey}: ${val[0]}` : String(val);
      }
      showToast(message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] grid grid-cols-1 lg:grid-cols-2 bg-[#f7f4ed] dark:bg-pitch">
      <IdentityAside />

      {/* Form side */}
      <div className={`relative ${panelBg}`}>
        <div className="max-w-md mx-auto lg:max-w-2xl lg:mx-0 lg:ml-auto lg:pr-8 px-6 sm:px-12 lg:px-16 py-12 sm:py-16 lg:py-20">
          <span className="mpl-rule-label">Player registration</span>
          <h1 className={`mpl-display mt-4 text-4xl sm:text-5xl font-semibold ${ink} leading-[0.98]`}>
            Register to portal
          </h1>
          <p className={`mt-3 text-sm ${inkSoft} leading-relaxed`}>
            Your details go into the official tournament roster for the coming season.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label className={labelCls}>Profile photo</label>
              <label
                htmlFor="reg-photo"
                className={`flex items-center gap-4 border ${ruleBorder} px-4 py-3 cursor-pointer hover:border-sodium-deep dark:hover:border-sodium transition-colors`}
              >
                {photoPreview ? (
                  <img
                    src={photoPreview}
                    alt="Selected profile"
                    className="w-12 h-12 rounded-full object-cover shrink-0"
                  />
                ) : (
                  <span className="w-12 h-12 rounded-full border border-dashed border-slate-400/60 dark:border-chalk/25 flex items-center justify-center shrink-0 text-slate-400 dark:text-chalk/40">
                    <Upload className="w-4 h-4" />
                  </span>
                )}
                <span className={`text-sm font-medium ${inkSoft}`}>
                  {photo ? photo.name : 'Choose a photo to put on your profile'}
                </span>
              </label>
              <input
                id="reg-photo"
                type="file"
                accept="image/*"
                required
                className="hidden"
                onChange={(e) => setPhoto(e.target.files?.[0] || null)}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor="reg-name" className={labelCls}>
                  Full name
                </label>
                <input
                  id="reg-name"
                  type="text"
                  name="full_name"
                  required
                  placeholder="e.g. Rahul Patil"
                  value={formData.full_name}
                  onChange={handleChange}
                  className={inputCls}
                />
              </div>
              <div>
                <label htmlFor="reg-username" className={labelCls}>
                  Username
                </label>
                <input
                  id="reg-username"
                  type="text"
                  name="username"
                  required
                  placeholder="e.g. rahulp"
                  value={formData.username}
                  onChange={handleChange}
                  className={inputCls}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor="reg-email" className={labelCls}>
                  Email address
                </label>
                <input
                  id="reg-email"
                  type="email"
                  name="email"
                  required
                  autoComplete="email"
                  placeholder="rahul@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className={inputCls}
                />
              </div>
              <div>
                <label htmlFor="reg-phone" className={labelCls}>
                  Phone number
                </label>
                <input
                  id="reg-phone"
                  type="tel"
                  name="phone_number"
                  required
                  autoComplete="tel"
                  placeholder="98230 00000"
                  value={formData.phone_number}
                  onChange={handleChange}
                  className={inputCls}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor="reg-password" className={labelCls}>
                  Password
                </label>
                <input
                  id="reg-password"
                  type="password"
                  name="password"
                  required
                  autoComplete="new-password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className={inputCls}
                />
              </div>
              <div>
                <label htmlFor="reg-password-confirm" className={labelCls}>
                  Confirm password
                </label>
                <input
                  id="reg-password-confirm"
                  type="password"
                  name="password_confirm"
                  required
                  autoComplete="new-password"
                  placeholder="••••••••"
                  value={formData.password_confirm}
                  onChange={handleChange}
                  className={inputCls}
                />
              </div>
            </div>

            {/* Cricketing details, as a ruled sub-ledger */}
            <fieldset className={`border ${ruleBorder} px-4 sm:px-5 pt-4 pb-5`}>
              <legend className={`text-[10px] font-semibold uppercase tracking-[0.28em] text-slate-500 dark:text-chalk/40 px-1.5`}>
                Cricketing details
              </legend>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                <div>
                  <label htmlFor="reg-role" className={labelCls}>
                    Playing role
                  </label>
                  <select
                    id="reg-role"
                    name="playing_role"
                    value={formData.playing_role}
                    onChange={handleChange}
                    className={selectCls}
                  >
                    <option value="batter">Batter</option>
                    <option value="bowler">Bowler</option>
                    <option value="all_rounder">All-rounder</option>
                    <option value="wk_batter">Wicket-keeper batter</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="reg-batting" className={labelCls}>
                    Batting style
                  </label>
                  <select
                    id="reg-batting"
                    name="batting_style"
                    value={formData.batting_style}
                    onChange={handleChange}
                    className={selectCls}
                  >
                    <option value="right_hand">Right-hand</option>
                    <option value="left_hand">Left-hand</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="reg-jersey" className={labelCls}>
                    Shirt number
                  </label>
                  <input
                    id="reg-jersey"
                    type="number"
                    name="jersey_number"
                    min={1}
                    max={99}
                    placeholder="e.g. 18"
                    value={formData.jersey_number}
                    onChange={handleChange}
                    className={inputCls}
                  />
                </div>
              </div>
              <p className={`mt-3 text-[11px] text-slate-400 dark:text-chalk/35`}>
                You can update these from your profile dashboard once on record.
              </p>
            </fieldset>

            {/* Payment proof, as its own ruled sub-ledger — required to register */}
            <fieldset className={`border ${ruleBorder} px-4 sm:px-5 pt-4 pb-5`}>
              <legend className={`text-[10px] font-semibold uppercase tracking-[0.28em] text-slate-500 dark:text-chalk/40 px-1.5`}>
                Registration payment
              </legend>

              <label className={labelCls}>Payment screenshot</label>
              <label
                htmlFor="reg-payment-screenshot"
                className={`flex items-center gap-3 border ${ruleBorder} px-4 py-3 cursor-pointer hover:border-sodium-deep dark:hover:border-sodium transition-colors`}
              >
                {paymentScreenshot ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                ) : (
                  <Upload className="w-5 h-5 text-slate-400 dark:text-chalk/40 shrink-0" />
                )}
                <span className={`text-sm font-medium ${inkSoft}`}>
                  {paymentScreenshot ? paymentScreenshot.name : 'Upload a screenshot of your payment'}
                </span>
              </label>
              <input
                id="reg-payment-screenshot"
                type="file"
                accept="image/*"
                required
                className="hidden"
                onChange={(e) => setPaymentScreenshot(e.target.files?.[0] || null)}
              />
              <p className={`mt-3 text-[11px] text-slate-400 dark:text-chalk/35`}>
                An admin verifies every payment manually before it's marked complete on your profile.
              </p>
            </fieldset>

            <button
              type="submit"
              disabled={loading || success}
              className="w-full inline-flex items-center justify-center gap-2 bg-sodium hover:bg-sodium-deep text-pitch font-bold text-sm px-8 py-4 transition-colors cursor-pointer disabled:opacity-60"
            >
              {loading ? 'Registering…' : 'Create player account'}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          <div className={`mt-6 pt-5 border-t ${ruleBorder}`}>
            <p className={`text-sm ${inkSoft}`}>
              Already on record?{' '}
              <Link
                to="/login"
                className="text-sodium-deep dark:text-sodium font-semibold border-b border-sodium-deep/40 dark:border-sodium/40 hover:border-current transition-colors"
              >
                Sign in to your dashboard
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
