type Motif = 'coil' | 'connector' | 'core' | 'plug' | 'spool' | 'strand' | 'terminal' | 'wave' | 'link' | 'pylon' | 'insulator' | 'junction' | 'gland' | 'lug' | 'braid' | 'switch' | 'shield' | 'bolt'

const motifs: Motif[] = ['coil', 'connector', 'core', 'strand', 'terminal', 'spool', 'plug', 'wave', 'link', 'pylon', 'insulator', 'junction', 'gland', 'lug', 'braid', 'switch', 'shield', 'bolt']

function WiringIcon({ motif }: { motif: Motif }) {
  switch (motif) {
    case 'coil':
      return <><circle cx="40" cy="40" r="23" /><circle cx="40" cy="40" r="15" /><path d="M40 17c15-6 27-2 31 9s-2 18-12 20M17 40C9 48 8 60 16 67s20 3 25-4" /></>
    case 'connector':
      return <><path d="M17 29h27v22H17zM44 34h12v12H44zM56 31v18M62 34v12M68 34v12M17 34H9m8 12H9" /><path d="M24 35h13m-13 10h13" /></>
    case 'core':
      return <><circle cx="40" cy="40" r="29" /><circle cx="40" cy="40" r="22" /><circle cx="31" cy="34" r="7" /><circle cx="49" cy="34" r="7" /><circle cx="40" cy="51" r="7" /></>
    case 'plug':
      return <><path d="M20 27h35v26H20zM55 32h13v16H55zM24 27v-9m10 9v-9m10 9v-9M15 35H8m7 10H8" /><path d="M26 38h24M26 44h24" /></>
    case 'spool':
      return <><circle cx="40" cy="40" r="17" /><circle cx="40" cy="40" r="7" /><path d="M20 19h40v42H20zM20 25h40M20 55h40M26 19v42m28-42v42" /></>
    case 'strand':
      return <><path d="M9 52c16-25 26-25 42 0M17 59c16-25 26-25 42 0M25 66c16-25 26-25 42 0" /><path d="M9 52l9-5m-1 12 9-5m-1 12 9-5M51 52l9-5m-1 12 9-5" /></>
    case 'terminal':
      return <><path d="M12 42h42M12 49h42M54 36h13v19H54zM17 42V28m12 14V22m12 20V28" /><circle cx="17" cy="23" r="5" /><circle cx="29" cy="17" r="5" /><circle cx="41" cy="23" r="5" /></>
    case 'wave':
      return <><path d="M7 42c10-20 20-20 30 0s20 20 30 0M7 54c10-20 20-20 30 0s20 20 30 0M10 23h13m35 42h13" /><circle cx="11" cy="23" r="3" /><circle cx="69" cy="65" r="3" /></>
    case 'link':
      return <><path d="M14 43c0-13 9-22 22-22h10M66 37c0 13-9 22-22 22H34M24 40h32M24 47h32" /><circle cx="14" cy="43" r="5" /><circle cx="66" cy="37" r="5" /></>
    case 'pylon':
      return <><path d="M36 9h8l10 62H26L36 9ZM30 35h20M27 53h26M33 22h14M30 35l20 18m0-18L30 53M9 25h62M15 25l-3 8m53-8 3 8" /><circle cx="12" cy="35" r="2" /><circle cx="68" cy="35" r="2" /></>
    case 'insulator':
      return <><path d="M40 9v13m0 38v11M23 22h34l-4 8H27l-4-8Zm2 14h30l-4 8H29l-4-8Zm4 14h22l-4 8H33l-4-8Z" /><path d="M40 30v6m0 8v6M16 71h48" /></>
    case 'junction':
      return <><rect x="18" y="18" width="44" height="44" rx="5" /><circle cx="40" cy="40" r="10" /><path d="M40 30V7m10 33h23M40 50v23M30 40H7M30 18l-7-7m27 7 7-7m-7 51 7 7m-27-7-7 7" /></>
    case 'gland':
      return <><path d="M8 36h19l8-9h22l7 9h8v16h-8l-7 8H35l-8-8H8V36Zm19 0v16m8-25v33m22-33v33m7-24v16" /><path d="M40 34h12m-12 8h12m-12 8h12" /></>
    case 'lug':
      return <><circle cx="54" cy="27" r="15" /><circle cx="54" cy="27" r="6" /><path d="M42 36 28 52H10v17h29l13-27M10 58h29m-20 0v11m12-11v11" /></>
    case 'braid':
      return <><path d="M13 16c25 0 29 48 54 48M13 28c25 0 29 36 54 36M13 40c25 0 29 24 54 24M13 64c25 0 29-48 54-48M13 52c25 0 29-36 54-36M13 40c25 0 29-24 54-24" /></>
    case 'switch':
      return <><rect x="13" y="18" width="54" height="45" rx="4" /><path d="M25 29h30M25 52h30M35 29v23m10-23v23" /><circle cx="40" cy="40" r="5" /><path d="M24 11v7m32-7v7M24 63v7m32-7v7" /></>
    case 'shield':
      return <><path d="M40 8 64 18v20c0 17-11 28-24 34C27 66 16 55 16 38V18L40 8Z" /><path d="M40 17v46M24 25h32M24 36h32M27 47h26M31 57h18" /></>
    case 'bolt':
      return <><path d="m45 7-27 37h20l-5 29 29-40H41l4-26Z" /><path d="M14 20h12M57 59h11M9 61h13" /></>
  }
}

export function AmbientWiring() {
  return <div className="ambient-wiring" aria-hidden="true">
    {motifs.map((motif) => <svg className={`ambient-icon ambient-icon--${motif}`} key={motif} viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" focusable="false"><WiringIcon motif={motif} /></svg>)}
  </div>
}
