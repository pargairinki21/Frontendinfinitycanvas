import React, { useState } from 'react';
import EllipseCurveRight from './EllipseCurveRight';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden"
      style={{ minHeight: '100vh', minWidth: '100vw', background: '#3B36B4', boxSizing: 'border-box' }}
    >
      {/* Figma-style background images */}
      {/* Bottom left large orange circle */}
      {/* <img src="/Group 1.png" alt="bg-circle" className="absolute left-[-80px] bottom-[-80px] z-0" style={{ width: 240, height: 240 }} /> */}
      {/* Right-side ellipses as a separate component */}
      <EllipseCurveRight />
      {/* Welcome text above card */}
      <div
        className="relative z-10"
        style={{
          marginTop: 40,
          marginBottom: 32,
        }}
      >
        <h1
          className="text-white text-center"
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: 32,
            fontWeight: 900,
            lineHeight: 'normal',
            color: '#FFF',
            textShadow: '0 2px 8px #0002',
          }}
        >
          Welcome to AI Portal of IIA
        </h1>
      </div>
      {/* Centered login card */}
      <div
        className="relative z-10 flex flex-col items-center justify-center"
        style={{
          width: 480,
          height: 360,
          borderRadius: 40,
          marginLeft: 20,
          marginRight: 20,
          marginBottom: 40,
          marginTop: 0,
        }}
      >
        <div
          className="flex flex-col items-center justify-center w-full h-full shadow-2xl border bg-white/10 backdrop-blur-[12.5px]"
          style={{
            borderRadius: 60,
            background: 'rgba(255,255,255,0.01)',
            boxShadow: `
              0 39px 56px -36px rgba(255, 255, 255, 0.50) inset,
              0 7px 11px -4px #FFF inset,
              0 -82px 68px -64px rgba(14, 78, 114, 0.30) inset,
              0 98px 100px -48px rgba(0, 161, 253, 0.30) inset,
              0 4px 18px 0 rgba(8, 59, 88, 0.30) inset,
              0 1px 40px 0 rgba(13, 137, 207, 0.20) inset
            `,
            backdropFilter: 'blur(12.5px)',
            border: '1.5px solid #EDEBF0',
          }}
        >
          <h2 className="text-white text-2xl font-extrabold mb-6 mt-6 tracking-wide" style={{textShadow:'0 2px 8px #0002'}}>LOGIN</h2>
          <input
            type="email"
            placeholder="msme@gmail.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-[85%] mb-4 px-6 py-3 rounded-full bg-transparent text-white placeholder-white/70 border border-[#EDEBF0] focus:outline-none focus:ring-2 focus:ring-[#FF7A2F] text-base font-medium"
            style={{ boxShadow: '0 2px 8px 0 #FFFFFF1A inset' }}
          />
          <input
            type="password"
            placeholder="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-[85%] mb-6 px-6 py-3 rounded-full bg-transparent text-white placeholder-white/70 border border-[#EDEBF0] focus:outline-none focus:ring-2 focus:ring-[#FF7A2F] text-base font-medium"
            style={{ boxShadow: '0 2px 8px 0 #FFFFFF1A inset' }}
          />
          <div className="flex w-[85%] gap-4 mb-4">
            <button
              className="flex-1 py-2 rounded-full bg-[#00E18F] text-white font-bold text-base shadow-md hover:bg-[#00b97a] transition shadow-lg"
              style={{ boxShadow: '0 4px 16px 0 #00E18F55' }}
              onClick={onLogin}
            >
              Login
            </button>
            <button
              className="flex-1 py-2 rounded-full bg-[#FF3B3B] text-white font-bold text-base shadow-md hover:bg-[#d32f2f] transition shadow-lg"
              style={{ boxShadow: '0 4px 16px 0 #FF3B3B55' }}
            >
              SignUp
            </button>
          </div>
          <button
            className="w-[85%] py-2 rounded-full border border-[#EDEBF0] text-white/80 text-base font-medium hover:underline mt-1 bg-transparent"
            style={{ boxShadow: '0 2px 8px 0 #FFFFFF1A inset' }}
          >
            Add as supplier
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;