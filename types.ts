
export interface Web {
  uri: string;
  title: string;
}

export interface GroundingChunk {
  web: Web;
}

export type AppStatus = 'idle' | 'step1_generating' | 'step2_generating' | 'completed' | 'error';
