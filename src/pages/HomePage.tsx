import { useEffect, useRef, useState } from 'react';
import { getFullCv } from '../api/cvApi';

// Constants for game world
const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;
const PLAYER_SIZE = 40;
const SPEED = 4;

type ZoneId = 'profile' | 'skills' | 'experience' | 'projects' | null;

interface Zone {
  id: NonNullable<ZoneId>;
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
}

const ZONES: Zone[] = [
  { id: 'profile', x: 100, y: 100, w: 100, h: 100, label: 'Profile' },
  { id: 'skills', x: 600, y: 100, w: 100, h: 100, label: 'Skills' },
  { id: 'experience', x: 100, y: 400, w: 100, h: 100, label: 'Experience' },
  { id: 'projects', x: 600, y: 400, w: 100, h: 100, label: 'Projects' },
];

export default function HomePage() {
  const [cvData, setCvData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Game state
  const [playerPos, setPlayerPos] = useState({ x: 380, y: 280 });
  const [activeZone, setActiveZone] = useState<Zone | null>(null);
  const [openedModal, setOpenedModal] = useState<ZoneId>(null);

  // Use refs for mutable values that shouldn't trigger re-renders in the loop
  const posRef = useRef({ x: 380, y: 280 });
  const keys = useRef<{ [key: string]: boolean }>({});
  const modalOpenRef = useRef(false);
  const activeZoneRef = useRef<Zone | null>(null);

  useEffect(() => {
    getFullCv().then((data) => {
      setCvData(data);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    modalOpenRef.current = openedModal !== null;
  }, [openedModal]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keys.current[e.key.toLowerCase()] = true;
      
      // Interaction
      if (e.key === 'Enter' || e.key.toLowerCase() === 'e') {
        if (!modalOpenRef.current && activeZoneRef.current) {
          setOpenedModal(activeZoneRef.current.id);
        }
      }
      
      // Close modal
      if (e.key === 'Escape') {
        setOpenedModal(null);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keys.current[e.key.toLowerCase()] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Game Loop
  useEffect(() => {
    let animationFrameId: number;

    const gameLoop = () => {
      // Stop moving if modal is open
      if (!modalOpenRef.current) {
        let dx = 0;
        let dy = 0;

        if (keys.current['w'] || keys.current['arrowup']) dy -= SPEED;
        if (keys.current['s'] || keys.current['arrowdown']) dy += SPEED;
        if (keys.current['a'] || keys.current['arrowleft']) dx -= SPEED;
        if (keys.current['d'] || keys.current['arrowright']) dx += SPEED;

        if (dx !== 0 || dy !== 0) {
          let newX = posRef.current.x + dx;
          let newY = posRef.current.y + dy;

          // Boundaries
          if (newX < 0) newX = 0;
          if (newY < 0) newY = 0;
          if (newX > GAME_WIDTH - PLAYER_SIZE) newX = GAME_WIDTH - PLAYER_SIZE;
          if (newY > GAME_HEIGHT - PLAYER_SIZE) newY = GAME_HEIGHT - PLAYER_SIZE;

          posRef.current = { x: newX, y: newY };
          setPlayerPos({ x: newX, y: newY });

          // Collision check
          let currentZone: Zone | null = null;
          for (const zone of ZONES) {
            // Simple AABB collision
            if (
              newX < zone.x + zone.w &&
              newX + PLAYER_SIZE > zone.x &&
              newY < zone.y + zone.h &&
              newY + PLAYER_SIZE > zone.y
            ) {
              currentZone = zone;
              break;
            }
          }

          if (currentZone !== activeZoneRef.current) {
            activeZoneRef.current = currentZone;
            setActiveZone(currentZone);
          }
        }
      }
      animationFrameId = requestAnimationFrame(gameLoop);
    };

    animationFrameId = requestAnimationFrame(gameLoop);

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  if (loading) {
    return (
      <div className="game-container">
        <h1>LOADING GAME WORLD...</h1>
      </div>
    );
  }

  // Modals Content
  const renderModalContent = () => {
    if (!openedModal || !cvData) return null;

    if (openedModal === 'profile') {
      const { profile } = cvData;
      return (
        <div>
          <h2>Player Profile</h2>
          <div className="info-row"><span className="info-label">Name:</span> <span className="info-value">{profile.name}</span></div>
          <div className="info-row"><span className="info-label">Date of Birth:</span> <span className="info-value">{profile.dob}</span></div>
          <div className="info-row"><span className="info-label">Class:</span> <span className="info-value">{profile.roleClass}</span></div>
          <div className="info-row"><span className="info-label">Bio:</span> <span className="info-value">{profile.bio}</span></div>
          <div className="info-row"><span className="info-label">Education:</span> <span className="info-value">{profile.education}</span></div>
          <div className="info-row"><span className="info-label">Email:</span> <span className="info-value">{profile.email}</span></div>
          <div className="info-row"><span className="info-label">Location:</span> <span className="info-value">{profile.location}</span></div>
        </div>
      );
    }

    if (openedModal === 'skills') {
      return (
        <div>
          <h2>Tech Stats</h2>
          {cvData.skills.map((categoryGroup: any, idx: number) => (
            <div key={idx} className="card">
              <h3>{categoryGroup.category}</h3>
              {categoryGroup.items.map((s: any, itemIdx: number) => (
                <div key={itemIdx} className="info-row" style={{ marginTop: '10px' }}>
                  <span className="info-label" style={{ fontSize: '1.2rem' }}>{s.name}</span>
                  <div className="skill-item__bar" style={{ marginTop: '5px' }}>
                    <span style={{ width: `${s.level}%` }}></span>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      );
    }

    if (openedModal === 'experience') {
      return (
        <div>
          <h2>Quest Log (Experience)</h2>
          {cvData.experiences.map((exp: any) => (
            <div key={exp.id} className="card">
              <h3>{exp.position}</h3>
              <h4>{exp.company}</h4>
              <p><strong>Duration:</strong> {new Date(exp.startDate).toLocaleDateString('en-GB')} - {exp.isCurrent ? 'Present' : new Date(exp.endDate).toLocaleDateString('en-GB')}</p>
              <p>{exp.description}</p>
            </div>
          ))}
        </div>
      );
    }

    if (openedModal === 'projects') {
      return (
        <div>
          <h2>Inventory (Projects)</h2>
          {cvData.projects.map((proj: any) => (
            <div key={proj.id} className="card">
              <h3>{proj.title}</h3>
              <p><strong>Description:</strong> {proj.description}</p>
              {proj.role && <p><strong>Role:</strong> {proj.role}</p>}
              <div style={{ marginTop: '10px' }}>
                {proj.techStack?.map((t: string) => (
                  <span key={t} className="tag">{t}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      );
    }

    return null;
  };

  return (
    <div className="game-container">
      <div className="game-header">
        <h1>MYSTIC CV ADVENTURE</h1>
        <p className="controls-hint">Use <strong>W A S D</strong> or <strong>Arrows</strong> to move. Walk to a zone and press <strong>E</strong> or <strong>Enter</strong> to interact.</p>
      </div>

      <div className="game-world">
        {ZONES.map(zone => (
          <div
            key={zone.id}
            className={`zone-sprite zone-${zone.id}`}
            style={{ left: zone.x, top: zone.y, width: zone.w, height: zone.h }}
          >
            {zone.label}
          </div>
        ))}

        <div
          className="player-sprite"
          style={{ transform: `translate(${playerPos.x}px, ${playerPos.y}px)` }}
        >
          {activeZone && (
            <div className="interaction-prompt">Press E</div>
          )}
        </div>
      </div>

      {openedModal && (
        <div className="modal-overlay" onClick={() => setOpenedModal(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setOpenedModal(null)}>X</button>
            <div className="modal-body">
              {renderModalContent()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}