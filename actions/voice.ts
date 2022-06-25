import { AsyncAction } from './async';

export const VOICE = 'voice';

export type VoiceActionType = typeof VOICE;

export interface VoiceAction extends Omit<AsyncAction, 'type' | 'what'> {
  type: VoiceActionType;
  what: VoiceWhat;
}

export interface AudioWhat {
  message: ReadableStream;
}

export interface ImageWhat {
  message: ReadableStream;
}

export interface TextWhat {
  message: string;
}

export type VoiceWhat = AudioWhat | ImageWhat | TextWhat;
