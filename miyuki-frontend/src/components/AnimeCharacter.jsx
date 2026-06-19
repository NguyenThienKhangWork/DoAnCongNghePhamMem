export default function AnimeCharacter() {
  return (
    <svg width="100%" viewBox="0 0 440 500" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Night sky backdrop */}
      <ellipse cx="220" cy="460" rx="200" ry="40" fill="rgba(255,107,157,0.08)"/>

      {/* Moon */}
      <circle cx="340" cy="60" r="38" fill="#FFF8DC" opacity="0.9"/>
      <circle cx="326" cy="52" r="32" fill="#2D1B69"/>
      <circle cx="345" cy="58" r="34" fill="none" stroke="#FFF8DC" strokeWidth="1" opacity="0.3"/>

      {/* Stars */}
      <circle cx="290" cy="45" r="2" fill="#FFD700" opacity="0.8"/>
      <circle cx="310" cy="25" r="1.5" fill="white" opacity="0.7"/>
      <circle cx="370" cy="30" r="2.5" fill="#FFD700" opacity="0.9"/>
      <circle cx="390" cy="65" r="1.5" fill="white" opacity="0.6"/>
      <circle cx="365" cy="100" r="2" fill="#FFB3CC" opacity="0.8"/>

      {/* Bus body */}
      <rect x="30" y="300" width="380" height="130" rx="22" fill="#1E3A5F"/>
      <rect x="30" y="300" width="380" height="130" rx="22" stroke="rgba(255,107,157,0.5)" strokeWidth="1.5"/>
      <rect x="30" y="340" width="380" height="18" fill="rgba(255,107,157,0.25)"/>
      <rect x="30" y="355" width="380" height="4" fill="rgba(255,107,157,0.5)"/>

      {/* Windshield */}
      <rect x="320" y="312" width="72" height="55" rx="8" fill="rgba(135,206,250,0.35)" stroke="rgba(135,206,250,0.6)" strokeWidth="1"/>
      <line x1="330" y1="320" x2="345" y2="360" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" strokeLinecap="round"/>

      {/* Windows */}
      <rect x="50" y="312" width="52" height="45" rx="6" fill="rgba(135,206,250,0.25)" stroke="rgba(135,206,250,0.5)" strokeWidth="1"/>
      <rect x="115" y="312" width="52" height="45" rx="6" fill="rgba(135,206,250,0.25)" stroke="rgba(135,206,250,0.5)" strokeWidth="1"/>
      <rect x="180" y="312" width="52" height="45" rx="6" fill="rgba(135,206,250,0.25)" stroke="rgba(135,206,250,0.5)" strokeWidth="1"/>
      <rect x="245" y="312" width="52" height="45" rx="6" fill="rgba(135,206,250,0.25)" stroke="rgba(135,206,250,0.5)" strokeWidth="1"/>

      {/* Passenger silhouettes */}
      <ellipse cx="76" cy="330" rx="10" ry="10" fill="rgba(255,107,157,0.3)"/>
      <ellipse cx="141" cy="333" rx="8" ry="8" fill="rgba(192,132,252,0.35)"/>
      <ellipse cx="206" cy="331" rx="9" ry="9" fill="rgba(255,215,0,0.25)"/>

      {/* Bus door */}
      <rect x="265" y="355" width="35" height="72" rx="4" fill="rgba(255,107,157,0.12)" stroke="rgba(255,107,157,0.4)" strokeWidth="1"/>
      <line x1="282" y1="358" x2="282" y2="424" stroke="rgba(255,107,157,0.3)" strokeWidth="0.8"/>

      {/* Wheels */}
      <circle cx="100" cy="430" r="28" fill="#0D1B2A" stroke="rgba(255,107,157,0.4)" strokeWidth="2"/>
      <circle cx="100" cy="430" r="18" fill="#1E3A5F" stroke="rgba(255,107,157,0.3)" strokeWidth="1"/>
      <circle cx="100" cy="430" r="7" fill="rgba(255,107,157,0.6)"/>
      <circle cx="330" cy="430" r="28" fill="#0D1B2A" stroke="rgba(255,107,157,0.4)" strokeWidth="2"/>
      <circle cx="330" cy="430" r="18" fill="#1E3A5F" stroke="rgba(255,107,157,0.3)" strokeWidth="1"/>
      <circle cx="330" cy="430" r="7" fill="rgba(255,107,157,0.6)"/>

      {/* License plate */}
      <rect x="160" y="412" width="80" height="20" rx="3" fill="rgba(255,255,255,0.9)"/>
      <text x="200" y="426" textAnchor="middle" fontSize="9" fontWeight="700" fill="#0D1B2A" fontFamily="Nunito, sans-serif">51B – 88888</text>

      {/* Headlights */}
      <ellipse cx="408" cy="365" rx="8" ry="12" fill="rgba(255,240,150,0.7)" stroke="rgba(255,240,150,0.5)" strokeWidth="1"/>
      <ellipse cx="408" cy="385" rx="6" ry="8" fill="rgba(255,200,100,0.6)"/>

      {/* Bus logo */}
      <text x="180" y="338" textAnchor="middle" fontSize="11" fontWeight="900" fill="rgba(255,107,157,0.9)" fontFamily="Nunito, sans-serif">🌸 MiYuki Express</text>

      {/* Anime girl — body */}
      <ellipse cx="195" cy="285" rx="28" ry="45" fill="#FF6B9D" opacity="0.9"/>
      <ellipse cx="195" cy="305" rx="22" ry="32" fill="#FF85AD"/>
      <ellipse cx="195" cy="320" rx="26" ry="12" fill="#FFB3CC" opacity="0.8"/>
      <path d="M182 268 Q195 273 208 268 Q195 263 182 268Z" fill="#7B2FBE" opacity="0.9"/>

      {/* Neck */}
      <rect x="190" y="240" width="10" height="15" rx="5" fill="#FFD5B5"/>

      {/* Head */}
      <ellipse cx="195" cy="228" rx="26" ry="28" fill="#FFD5B5"/>
      {/* Hair */}
      <ellipse cx="195" cy="210" rx="27" ry="20" fill="#1A1A2E"/>
      <path d="M168 215 Q155 250 162 290 Q170 295 175 285 Q172 255 178 235Z" fill="#1A1A2E"/>
      <path d="M222 215 Q235 250 228 290 Q220 295 215 285 Q218 255 212 235Z" fill="#1A1A2E"/>
      <path d="M168 215 Q180 200 195 198 Q210 200 222 215 Q215 205 195 202 Q175 205 168 215Z" fill="#2D1B69"/>
      {/* Hair clip */}
      <circle cx="175" cy="210" r="7" fill="#FF6B9D"/>
      <circle cx="175" cy="210" r="4" fill="#FFB3CC"/>

      {/* Eyes */}
      <ellipse cx="183" cy="228" rx="7" ry="8" fill="white"/>
      <ellipse cx="183" cy="230" rx="5" ry="6" fill="#7B2FBE"/>
      <ellipse cx="183" cy="230" rx="3" ry="4" fill="#2D1B69"/>
      <circle cx="185" cy="227" r="1.5" fill="white"/>
      <ellipse cx="207" cy="228" rx="7" ry="8" fill="white"/>
      <ellipse cx="207" cy="230" rx="5" ry="6" fill="#7B2FBE"/>
      <ellipse cx="207" cy="230" rx="3" ry="4" fill="#2D1B69"/>
      <circle cx="209" cy="227" r="1.5" fill="white"/>

      {/* Eyelashes */}
      <path d="M176 222 Q180 219 184 221" stroke="#1A1A2E" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      <path d="M200 222 Q204 219 208 221" stroke="#1A1A2E" strokeWidth="1.5" fill="none" strokeLinecap="round"/>

      {/* Blush */}
      <ellipse cx="175" cy="237" rx="7" ry="4" fill="rgba(255,107,157,0.4)"/>
      <ellipse cx="215" cy="237" rx="7" ry="4" fill="rgba(255,107,157,0.4)"/>

      {/* Nose & mouth */}
      <circle cx="195" cy="234" r="2" fill="rgba(255,150,120,0.5)"/>
      <path d="M189 242 Q195 247 201 242" stroke="#FF6B9D" strokeWidth="1.5" fill="none" strokeLinecap="round"/>

      {/* Eyebrows */}
      <path d="M176 220 Q183 217 189 219" stroke="#1A1A2E" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
      <path d="M200 219 Q206 217 213 220" stroke="#1A1A2E" strokeWidth="1.8" fill="none" strokeLinecap="round"/>

      {/* Arm with ticket */}
      <path d="M168 270 Q148 275 138 285" stroke="#FFD5B5" strokeWidth="12" strokeLinecap="round" fill="none"/>
      <rect x="108" y="278" width="50" height="32" rx="5" fill="white" opacity="0.95"/>
      <rect x="108" y="278" width="50" height="10" rx="3" fill="#FF6B9D"/>
      <text x="133" y="287" textAnchor="middle" fontSize="6" fontWeight="700" fill="white" fontFamily="Nunito, sans-serif">VÉ XE</text>
      <line x1="114" y1="294" x2="152" y2="294" stroke="#DDD" strokeWidth="0.8"/>
      <text x="133" y="302" textAnchor="middle" fontSize="5.5" fill="#555" fontFamily="Nunito, sans-serif">HN → HCM</text>
      <text x="133" y="308" textAnchor="middle" fontSize="5" fill="#888" fontFamily="Nunito, sans-serif">19/06/2026</text>

      {/* Speech bubble */}
      <rect x="230" y="165" width="145" height="55" rx="14" fill="white" opacity="0.95"/>
      <path d="M238 220 L226 232 L248 220Z" fill="white" opacity="0.95"/>
      <text x="302" y="188" textAnchor="middle" fontSize="9.5" fontWeight="700" fill="#FF6B9D" fontFamily="Nunito, sans-serif">いらっしゃいませ！</text>
      <text x="302" y="203" textAnchor="middle" fontSize="9" fontWeight="600" fill="#333" fontFamily="Nunito, sans-serif">Đặt vé dễ dàng!</text>
      <text x="302" y="214" textAnchor="middle" fontSize="8" fill="#888" fontFamily="Nunito, sans-serif">🌸 Giá tốt nhất hôm nay</text>

      {/* Floating sakura */}
      <g transform="rotate(-15, 135, 200)">
        <ellipse cx="135" cy="200" rx="6" ry="4" fill="rgba(255,179,204,0.8)"/>
        <ellipse cx="139" cy="203" rx="6" ry="4" fill="rgba(255,209,224,0.7)"/>
      </g>
      <g transform="rotate(20, 255, 160)">
        <ellipse cx="255" cy="160" rx="5" ry="3" fill="rgba(255,179,204,0.8)"/>
        <ellipse cx="259" cy="163" rx="5" ry="3" fill="rgba(255,209,224,0.7)"/>
      </g>
      <g transform="rotate(-30, 145, 250)">
        <ellipse cx="145" cy="250" rx="5" ry="3.5" fill="rgba(255,179,204,0.7)"/>
        <ellipse cx="149" cy="253" rx="5" ry="3.5" fill="rgba(255,209,224,0.6)"/>
      </g>
    </svg>
  )
}
