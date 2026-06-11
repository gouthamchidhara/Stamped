import { Case, Post } from './types';

export const STEPS_485 = ['Case Was Received','Biometrics Reused / Completed','Case Actively Being Reviewed','Interview Scheduled','New Card Is Being Produced','Case Approved'];
export const STEPS_765 = ['Case Was Received','Case Actively Being Reviewed','New Card Is Being Produced','Card Was Mailed'];
export const STEPS_130 = ['Case Was Received','Case Actively Being Reviewed','Case Approved'];

export const mockCases: Case[] = [
  { id: '1', form: 'I-485', nick: 'My green card', receipt: 'IOE9119251234', step_idx: 2, steps: STEPS_485, filed_at: '2026-01-20', eta: 'Dec 2026', stamp: 'review', stamp_text: 'In Review', step_dates: ['Jan 22, 2026','Feb 14, 2026','Mar 03, 2026'] },
  { id: '2', form: 'I-765', nick: 'Work permit (EAD)', receipt: 'IOE9119251235', step_idx: 2, steps: STEPS_765, filed_at: '2026-04-10', eta: 'Jun 2026', stamp: 'approved', stamp_text: 'Card Producing', step_dates: ['Apr 12, 2026','Apr 30, 2026','Jun 09, 2026'] },
  { id: '3', form: 'I-130', nick: 'Petition for spouse', receipt: 'SRC2690087741', step_idx: 0, steps: STEPS_130, filed_at: '2026-05-28', eta: 'Jul 2027', stamp: 'received', stamp_text: 'Received', step_dates: ['May 30, 2026'] },
];

export const mockPosts: Post[] = [
  { id: '1', author: 'Priya K.', initials: 'PK', color: '#7C5CBF', created_label: '2h ago', tag: 'I-765', is_news: false, title: 'EAD approved in 28 days at NBC — full timeline inside', body: 'Filed Apr 12 → biometrics reused → card producing Jun 9. No RFE. NBC is genuinely fast right now.', votes: 142, voted: false, comments: [{ author: 'Marco D.', text: 'Congrats! Online or paper filing?' }] },
  { id: '2', author: 'Stamped News', initials: 'SN', color: '#946B00', created_label: '5h ago', tag: 'news', is_news: true, title: 'New USCIS fee schedule takes effect July 1, 2026', body: 'Filing fees change for several forms next month. Filing before June 30 locks in current fees.', votes: 318, voted: false, comments: [] },
  { id: '3', author: 'Marco D.', initials: 'MD', color: '#2E7D52', created_label: '1d ago', tag: 'I-485', is_news: false, title: "Got an RFE for medicals — here's exactly what fixed it", body: 'I-693 was signed >60 days before filing. Re-did exam, sent sealed envelope with RFE cover sheet on top. Approved 3 weeks later.', votes: 96, voted: false, comments: [] },
  { id: '4', author: 'Lena W.', initials: 'LW', color: '#1B6F8C', created_label: '3d ago', tag: 'N-400', is_news: false, title: 'Dallas field office interview tips (passed! 🎉)', body: 'Six civics questions, all from the official 100. Bring every original document. Same-day oath.', votes: 210, voted: false, comments: [] },
];
