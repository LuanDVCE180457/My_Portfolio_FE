import { useCallback, useEffect, useRef, useState } from 'react';
import { cvData } from '../data/cvData';

const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;
const PLAYER_SIZE = 36;
const SPEED = 4;

type ZoneId = 'profile' | 'skills' | 'experience' | 'projects';
type ModalId = ZoneId | 'portal' | null;

interface Zone {
  id: ZoneId;
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  code: string;
}

interface Shard {
  id: string;
  label: string;
  x: number;
  y: number;
}

const ZONES: Zone[] = [
  { id: 'profile', x: 50, y: 28, w: 230, h: 195, label: 'Identity Archive', code: '01' },
  { id: 'skills', x: 520, y: 28, w: 230, h: 195, label: 'Skill Forge', code: '02' },
  { id: 'experience', x: 40, y: 355, w: 245, h: 210, label: 'Quest Records', code: '03' },
  { id: 'projects', x: 510, y: 350, w: 250, h: 215, label: 'Build Vault', code: '04' },
];

const SHARDS: Shard[] = [
  { id: 'unity', label: 'Unity', x: 374, y: 64 },
  { id: 'fusion', label: 'Fusion', x: 266, y: 275 },
  { id: 'dotnet', label: '.NET', x: 505, y: 275 },
  { id: 'git', label: 'Git', x: 374, y: 496 },
  { id: 'ai', label: 'AI', x: 374, y: 172 },
];

const PORTAL = { x: 338, y: 238, w: 124, h: 124 };

export default function HomePage() {
  const [playerPos, setPlayerPos] = useState({ x: 382, y: 340 });
  const [facing, setFacing] = useState<'left' | 'right'>('right');
  const [moving, setMoving] = useState(false);
  const [activeZone, setActiveZone] = useState<Zone | null>(null);
  const [nearPortal, setNearPortal] = useState(false);
  const [openedModal, setOpenedModal] = useState<ModalId>(null);
  const [collectedShardIds, setCollectedShardIds] = useState<string[]>([]);
  const [visitedZoneIds, setVisitedZoneIds] = useState<ZoneId[]>([]);
  const [notice, setNotice] = useState('SIGNAL FOUND: RECOVER THE DATA SHARDS');
  const [scale, setScale] = useState(1);

  const posRef = useRef({ x: 382, y: 340 });
  const keys = useRef<Record<string, boolean>>({});
  const modalOpenRef = useRef(false);
  const activeZoneRef = useRef<Zone | null>(null);
  const nearPortalRef = useRef(false);
  const collectedRef = useRef(new Set<string>());
  const noticeTimerRef = useRef<number | null>(null);

  const portalUnlocked = collectedShardIds.length === SHARDS.length;

  const showNotice = useCallback((message: string) => {
    setNotice(message);
    if (noticeTimerRef.current !== null) {
      window.clearTimeout(noticeTimerRef.current);
    }
    noticeTimerRef.current = window.setTimeout(() => {
      setNotice('EXPLORE THE ARCHIVES. THE PORTAL IS WAITING.');
    }, 2400);
  }, []);

  const openZone = useCallback((id: ZoneId) => {
    setOpenedModal(id);
    setVisitedZoneIds((current) => current.includes(id) ? current : [...current, id]);
  }, []);

  const interact = useCallback(() => {
    if (modalOpenRef.current) return;

    if (activeZoneRef.current) {
      openZone(activeZoneRef.current.id);
      return;
    }

    if (nearPortalRef.current) {
      if (collectedRef.current.size === SHARDS.length) {
        setOpenedModal('portal');
      } else {
        showNotice(`PORTAL LOCKED: ${SHARDS.length - collectedRef.current.size} SHARDS MISSING`);
      }
    }
  }, [openZone, showNotice]);

  useEffect(() => {
    const handleResize = () => {
      const desktop = window.innerWidth >= 1080;
      const availableWidth = desktop ? window.innerWidth - 354 : window.innerWidth - 24;
      const widthScale = Math.min(availableWidth / GAME_WIDTH, 1);
      const heightScale = desktop ? Math.min((window.innerHeight - 168) / GAME_HEIGHT, 1) : 1;
      setScale(Math.max(0.36, Math.min(widthScale, heightScale)));
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    modalOpenRef.current = openedModal !== null;
  }, [openedModal]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' ', 'enter'].includes(key)) {
        event.preventDefault();
      }
      keys.current[key] = true;

      if (key === 'e' || key === 'enter' || key === ' ') interact();
      if (key === 'escape') setOpenedModal(null);
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      keys.current[event.key.toLowerCase()] = false;
    };

    const clearKeys = () => {
      keys.current = {};
      setMoving(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', clearKeys);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', clearKeys);
    };
  }, [interact]);

  useEffect(() => () => {
    if (noticeTimerRef.current !== null) window.clearTimeout(noticeTimerRef.current);
  }, []);

  const setControl = (key: string, pressed: boolean) => {
    keys.current[key] = pressed;
    if (pressed && key === 'interact') interact();
  };

  useEffect(() => {
    let animationFrameId: number;

    const gameLoop = () => {
      if (!modalOpenRef.current) {
        let dx = 0;
        let dy = 0;
        if (keys.current.w || keys.current.arrowup) dy -= SPEED;
        if (keys.current.s || keys.current.arrowdown) dy += SPEED;
        if (keys.current.a || keys.current.arrowleft) dx -= SPEED;
        if (keys.current.d || keys.current.arrowright) dx += SPEED;

        const isMoving = dx !== 0 || dy !== 0;
        setMoving((current) => current === isMoving ? current : isMoving);

        if (isMoving) {
          if (dx !== 0) setFacing(dx < 0 ? 'left' : 'right');
          const diagonalFactor = dx !== 0 && dy !== 0 ? Math.SQRT1_2 : 1;
          const newX = Math.max(8, Math.min(GAME_WIDTH - PLAYER_SIZE - 8, posRef.current.x + dx * diagonalFactor));
          const newY = Math.max(8, Math.min(GAME_HEIGHT - PLAYER_SIZE - 8, posRef.current.y + dy * diagonalFactor));

          posRef.current = { x: newX, y: newY };
          setPlayerPos({ x: newX, y: newY });

          const playerCenterX = newX + PLAYER_SIZE / 2;
          const playerCenterY = newY + PLAYER_SIZE / 2;
          const currentZone = ZONES.find((zone) => {
            const normalizedX = (playerCenterX - (zone.x + zone.w / 2)) / (zone.w / 2);
            const normalizedY = (playerCenterY - (zone.y + zone.h / 2)) / (zone.h / 2);
            return normalizedX ** 2 + normalizedY ** 2 <= 1;
          }) ?? null;

          if (currentZone?.id !== activeZoneRef.current?.id) {
            activeZoneRef.current = currentZone;
            setActiveZone(currentZone);
          }

          const portalCollision = (
            newX < PORTAL.x + PORTAL.w &&
            newX + PLAYER_SIZE > PORTAL.x &&
            newY < PORTAL.y + PORTAL.h &&
            newY + PLAYER_SIZE > PORTAL.y
          );
          if (portalCollision !== nearPortalRef.current) {
            nearPortalRef.current = portalCollision;
            setNearPortal(portalCollision);
          }

          for (const shard of SHARDS) {
            if (collectedRef.current.has(shard.id)) continue;
            const shardCollision = (
              newX < shard.x + 28 &&
              newX + PLAYER_SIZE > shard.x &&
              newY < shard.y + 28 &&
              newY + PLAYER_SIZE > shard.y
            );

            if (shardCollision) {
              collectedRef.current.add(shard.id);
              setCollectedShardIds(Array.from(collectedRef.current));
              const remaining = SHARDS.length - collectedRef.current.size;
              showNotice(remaining === 0 ? 'ALL SHARDS RECOVERED: PORTAL ONLINE' : `${shard.label.toUpperCase()} SHARD RECOVERED: ${remaining} REMAIN`);
            }
          }
        }
      }

      animationFrameId = window.requestAnimationFrame(gameLoop);
    };

    animationFrameId = window.requestAnimationFrame(gameLoop);
    return () => window.cancelAnimationFrame(animationFrameId);
  }, [showNotice]);

  const resetGame = () => {
    const start = { x: 382, y: 340 };
    posRef.current = start;
    collectedRef.current = new Set();
    activeZoneRef.current = null;
    nearPortalRef.current = false;
    keys.current = {};
    setPlayerPos(start);
    setCollectedShardIds([]);
    setVisitedZoneIds([]);
    setActiveZone(null);
    setNearPortal(false);
    setOpenedModal(null);
    setNotice('SIGNAL RESET: RECOVER THE DATA SHARDS');
  };

  const renderModalContent = () => {
    if (!openedModal) return null;

    if (openedModal === 'portal') {
      return (
        <div className="ending-panel">
          <span className="modal-kicker">RECRUITER CACHE // ACCESS GRANTED</span>
          <h2>Quest Complete</h2>
          <p className="ending-lead">You found the developer behind the build.</p>
          <div className="ending-snapshot">
            <span>UNITY</span><span>PHOTON FUSION</span><span>.NET 8</span><span>REMOTE READY</span>
          </div>
          <p>{cvData.profile.name} is available for Unity Game Developer and Junior Game Developer opportunities.</p>
          <div className="modal-actions">
            <a href={`mailto:${cvData.profile.email}`}>SEND MESSAGE</a>
            <a href={`tel:${cvData.profile.phone}`}>CALL PLAYER</a>
          </div>
        </div>
      );
    }

    if (openedModal === 'profile') {
      const { profile } = cvData;
      return (
        <div>
          <span className="modal-kicker">ARCHIVE 01 // IDENTITY</span>
          <h2>Player Profile</h2>
          <div className="profile-summary">
            <div className="profile-avatar" aria-hidden="true">DL</div>
            <div><strong>{profile.name}</strong><span>{profile.roleClass}</span></div>
          </div>
          <div className="info-grid">
            <div className="info-row"><span className="info-label">Phone</span><a className="info-value" href={`tel:${profile.phone}`}>{profile.phone}</a></div>
            <div className="info-row"><span className="info-label">Email</span><a className="info-value" href={`mailto:${profile.email}`}>{profile.email}</a></div>
            <div className="info-row"><span className="info-label">Location</span><span className="info-value">{profile.location}</span></div>
            <div className="info-row"><span className="info-label">Born</span><span className="info-value">{profile.dob}</span></div>
            <div className="info-row"><span className="info-label">Gender</span><span className="info-value">{profile.gender}</span></div>
          </div>
          <div className="info-row"><span className="info-label">Objective</span><span className="info-value">{profile.bio}</span></div>
          <div className="info-row"><span className="info-label">Education</span><span className="info-value">{profile.education}</span></div>
          <div className="info-row"><span className="info-label">Award</span><span className="info-value">{profile.awards.join(', ')}</span></div>
          <a className="text-link" href={profile.githubUrl} target="_blank" rel="noreferrer">OPEN GITHUB PROFILE</a>
        </div>
      );
    }

    if (openedModal === 'skills') {
      return (
        <div>
          <span className="modal-kicker">ARCHIVE 02 // LOADOUT</span>
          <h2>Technical Arsenal</h2>
          <div className="skill-grid">
            {cvData.skills.map((group) => (
              <section key={group.category} className="skill-group">
                <h3>{group.category}</h3>
                <div>{group.items.map((skill) => <span key={skill.name} className="tag">{skill.name}</span>)}</div>
              </section>
            ))}
          </div>
        </div>
      );
    }

    if (openedModal === 'experience') {
      return (
        <div>
          <span className="modal-kicker">ARCHIVE 03 // QUEST LOG</span>
          <h2>Project Experience</h2>
          <div className="timeline">
            {cvData.experiences.map((experience) => (
              <article key={experience.id} className="timeline-entry">
                <span className="timeline-period">{experience.period}</span>
                <h3>{experience.position}</h3>
                <h4>{experience.company}</h4>
                <p>{experience.description}</p>
              </article>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div>
        <span className="modal-kicker">ARCHIVE 04 // BUILD VAULT</span>
        <h2>Selected Projects</h2>
        {cvData.projects.map((project) => (
          <article key={project.id} className="project-entry">
            <div className="project-heading">
              <div><span>{project.period}</span><h3>{project.title}</h3></div>
              {project.featured && <strong>FEATURED</strong>}
            </div>
            <p>{project.description}</p>
            {project.role && <p><b>Role:</b> {project.role}</p>}
            <div className="project-meta">
              {project.platform && <span>{project.platform}</span>}
              {project.team && <span>{project.team}</span>}
            </div>
            <div className="tag-list">{project.techStack?.map((tech) => <span key={tech} className="tag">{tech}</span>)}</div>
            {project.trailerUrl && (
              <section className="project-demo project-trailer" aria-label={`${project.title} trailer`}>
                <div className="project-demo-heading">
                  <div>
                    <span>OFFICIAL TRAILER</span>
                    <h4>Mystic Journey — Game Trailer</h4>
                  </div>
                  <a href={project.trailerUrl} download>DOWNLOAD TRAILER</a>
                </div>
                <video
                  controls
                  playsInline
                  preload="metadata"
                  poster="/assets/cv-dungeon-map-v2.jpg"
                  aria-label="Mystic Journey game trailer"
                >
                  <source src={project.trailerUrl} type="video/mp4" />
                  Your browser does not support HTML video. You can download the trailer using the link above.
                </video>
              </section>
            )}
            {project.videoUrl && (
              <section className="project-demo" aria-label={`${project.title} gameplay demo`}>
                <div className="project-demo-heading">
                  <div>
                    <span>GAMEPLAY FOOTAGE</span>
                    <h4>Mystic Journey — Full Demo</h4>
                  </div>
                  <a href={project.videoUrl} download>DOWNLOAD VIDEO</a>
                </div>
                <video
                  controls
                  playsInline
                  preload="metadata"
                  poster="/assets/cv-dungeon-map-v2.jpg"
                  aria-label="Mystic Journey full gameplay demo"
                >
                  <source src={project.videoUrl} type="video/mp4" />
                  Your browser does not support HTML video. You can download the demo using the link above.
                </video>
              </section>
            )}
            <details>
              <summary>KEY CONTRIBUTIONS ({project.highlights.length})</summary>
              <ul className="project-highlights">{project.highlights.map((item) => <li key={item}>{item}</li>)}</ul>
            </details>
          </article>
        ))}
      </div>
    );
  };

  const interactionLabel = activeZone ? `OPEN ${activeZone.label}` : nearPortal ? (portalUnlocked ? 'ENTER PORTAL' : 'PORTAL LOCKED') : null;

  return (
    <main className="game-container">
      <header className="topbar">
        <div className="brand-block">
          <span className="brand-mark" aria-hidden="true">DL</span>
          <div><h1>LUAN.DEV // MYSTIC ARCHIVE</h1><p>UNITY GAME DEVELOPER</p></div>
        </div>
        <div className="hud-progress">
          <div><span>DATA SHARDS</span><strong>{collectedShardIds.length}/{SHARDS.length}</strong></div>
          <div className="progress-track"><span style={{ width: `${(collectedShardIds.length / SHARDS.length) * 100}%` }} /></div>
        </div>
      </header>

      <div className="game-layout">
        <section className="world-stage" aria-label="Interactive CV game world">
          <div className="world-topline"><span>{notice}</span><button type="button" onClick={resetGame}>RESET RUN</button></div>
          <div className="game-world-wrapper" style={{ width: GAME_WIDTH * scale, height: GAME_HEIGHT * scale }}>
            <div className="game-world" style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}>
              <div className="world-atmosphere" aria-hidden="true" />
              {ZONES.map((zone) => (
                <button
                  type="button"
                  key={zone.id}
                  className={`zone-sprite zone-${zone.id}${activeZone?.id === zone.id ? ' is-active' : ''}${visitedZoneIds.includes(zone.id) ? ' is-visited' : ''}`}
                  style={{ left: zone.x, top: zone.y, width: zone.w, height: zone.h }}
                  onClick={() => openZone(zone.id)}
                >
                  <span>{zone.code}</span><strong>{zone.label}</strong>
                </button>
              ))}

              <div className={`portal${portalUnlocked ? ' is-unlocked' : ''}${nearPortal ? ' is-near' : ''}`} style={{ left: PORTAL.x, top: PORTAL.y }}>
                <span>{portalUnlocked ? 'ONLINE' : `${collectedShardIds.length}/${SHARDS.length}`}</span>
              </div>

              {SHARDS.map((shard) => !collectedShardIds.includes(shard.id) && (
                <div key={shard.id} className="data-shard" style={{ left: shard.x, top: shard.y }}>
                  <span>{shard.label}</span>
                </div>
              ))}

              <div className="player-sprite" style={{ transform: `translate(${playerPos.x}px, ${playerPos.y}px)` }}>
                {interactionLabel && <div className="interaction-prompt">{interactionLabel}<kbd>E</kbd></div>}
                <div className={`player-character facing-${facing}${moving ? ' is-moving' : ''}`} aria-label="Player character">
                  <span className="player-head" /><span className="player-body" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <aside className="mission-panel">
          <div className="panel-heading"><span>ACTIVE QUEST</span><strong>CV-001</strong></div>
          <h2>Decode the Developer</h2>
          <p>Recover five tech shards and activate the portal at the heart of the archive.</p>
          <div className="mission-list">
            {ZONES.map((zone) => (
              <button type="button" key={zone.id} onClick={() => openZone(zone.id)}>
                <span>{zone.code}</span><b>{zone.label}</b><i>{visitedZoneIds.includes(zone.id) ? 'READ' : 'NEW'}</i>
              </button>
            ))}
          </div>
          <div className={`portal-status${portalUnlocked ? ' is-ready' : ''}`}>
            <span>FINAL GATE</span><strong>{portalUnlocked ? 'PORTAL READY' : 'ENCRYPTED'}</strong>
          </div>
        </aside>
      </div>

      <div className="mobile-controls" aria-label="Movement controls">
        <div className="d-pad">
          <button type="button" className="control-btn d-up" aria-label="Move up" onPointerDown={() => setControl('w', true)} onPointerUp={() => setControl('w', false)} onPointerLeave={() => setControl('w', false)}><span aria-hidden="true">&#8593;</span></button>
          <button type="button" className="control-btn d-left" aria-label="Move left" onPointerDown={() => setControl('a', true)} onPointerUp={() => setControl('a', false)} onPointerLeave={() => setControl('a', false)}><span aria-hidden="true">&#8592;</span></button>
          <button type="button" className="control-btn d-down" aria-label="Move down" onPointerDown={() => setControl('s', true)} onPointerUp={() => setControl('s', false)} onPointerLeave={() => setControl('s', false)}><span aria-hidden="true">&#8595;</span></button>
          <button type="button" className="control-btn d-right" aria-label="Move right" onPointerDown={() => setControl('d', true)} onPointerUp={() => setControl('d', false)} onPointerLeave={() => setControl('d', false)}><span aria-hidden="true">&#8594;</span></button>
        </div>
        <button type="button" className="control-btn action-btn" aria-label="Interact" onPointerDown={() => setControl('interact', true)} onPointerUp={() => setControl('interact', false)}>E</button>
      </div>

      {openedModal && (
        <div className="modal-overlay" role="presentation" onMouseDown={() => setOpenedModal(null)}>
          <section className="modal-content" role="dialog" aria-modal="true" aria-label="CV archive" onMouseDown={(event) => event.stopPropagation()}>
            <button type="button" className="modal-close" aria-label="Close archive" onClick={() => setOpenedModal(null)}>X</button>
            <div className="modal-body">{renderModalContent()}</div>
          </section>
        </div>
      )}
    </main>
  );
}
