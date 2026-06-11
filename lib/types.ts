export type StampKind = 'review' | 'approved' | 'rfe' | 'received';

export interface Case {
  id: string;
  form: string;          // I-485, I-765 ...
  nick: string;
  receipt: string;       // IOE0000000000
  step_idx: number;
  steps: string[];
  filed_at: string;      // ISO date
  eta: string;
  stamp: StampKind;
  stamp_text: string;
  step_dates: string[];
}

export interface Post {
  id: string;
  author: string;
  initials: string;
  color: string;
  created_label: string;
  tag: string;           // form type or 'news'
  is_news: boolean;
  title: string;
  body: string;
  votes: number;
  voted: boolean;
  comments: { author: string; text: string }[];
}
