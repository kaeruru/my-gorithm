// scripts/build_articles_en.mjs
// 맘고리즘 69개 전체 콘텐츠 카드의 고품질 영문 번역 맵 생성기
import fs from 'fs';
import { CONTENT_DATA } from '../data.js';

// 카테고리별 공통 키워드 번역 사전
const SOURCE_MAP = {
  '토스 테크 · Toss Tech': 'Toss Tech',
  '하버드 비즈니스 리뷰 · 뇌과학 아카이브': 'Harvard Business Review · Neuroscience Archive',
  '씨네21 · 독립·예술 기획': 'Cine21 · Independent & Art Cinema',
  '스포츠의학 저널 · 운동생리학 아카이브': 'Journal of Sports Medicine · Exercise Physiology',
  '대한민국 정책브리핑': 'Korea Policy Briefing',
  '한국어 위키백과 · 비디오 게임 콘솔': 'Wikipedia · Video Game Consoles',
  '한국어 위키백과 · 알고리즘': 'Wikipedia · Algorithms',
  '한국어 위키백과 · 인공지능': 'Wikipedia · Artificial Intelligence',
  '한국어 위키백과 · 로봇': 'Wikipedia · Robotics',
  '한국어 위키백과 · 악성 소프트웨어': 'Wikipedia · Malware Analysis',
  '한국어 위키백과 · 자연어 처리': 'Wikipedia · Natural Language Processing',
  '한국어 위키백과 · 로봇 수술': 'Wikipedia · Robotic Surgery',
  '한국어 위키백과 · 제미나이 (언어 모델)': 'Wikipedia · Gemini (Language Model)',
  '한국어 위키백과 · 2차원 컴퓨터 그래픽스': 'Wikipedia · 2D Computer Graphics',
  '한국어 위키백과 · 컴퓨터 그래픽스': 'Wikipedia · Computer Graphics',
  '한국어 위키백과 · 중화인민공화국의 인공지능 산업': 'Wikipedia · AI Industry in China',
  '한국어 위키백과 · 수중사진': 'Wikipedia · Underwater Photography',
  '한국어 위키백과 · 갈릴레오 갈릴레이': 'Wikipedia · Galileo Galilei',
  '한국어 위키백과 · 기억': 'Wikipedia · Human Memory',
  '한국어 위키백과 · 천문학': 'Wikipedia · Astronomy',
  '한국어 위키백과 · 불쾌한 골짜기': 'Wikipedia · Uncanny Valley',
  '한국어 위키백과 · 퍼즐': 'Wikipedia · Puzzles & Cognition',
  '한국어 위키백과 · 조리 (음식)': 'Wikipedia · Culinary Science',
  '한국어 위키백과 · 한국의 전통문화': 'Wikipedia · Korean Traditional Culture',
  '한국어 위키백과 · 포켓몬스터': 'Wikipedia · Pokémon Franchise',
  '한국어 위키백과 · 텔레비전 드라마': 'Wikipedia · Television Drama',
  '한국어 위키백과 · 청소년': 'Wikipedia · Adolescent Psychology',
  '한국어 위키백과 · 미국의 문화': 'Wikipedia · American Culture',
  '한국어 위키백과 · 숭늉': 'Wikipedia · Sungnyung (Scorched Rice Tea)',
  '한국어 위키백과 · 음식 배달': 'Wikipedia · Food Delivery Platforms',
  '한국어 위키백과 · 태국 요리': 'Wikipedia · Thai Cuisine',
  '한국어 위키백과 · 중국 요리': 'Wikipedia · Chinese Culinary Traditions',
  '한국어 위키백과 · 일본 요리': 'Wikipedia · Japanese Gastronomy',
  '한국어 위키백과 · 로봇의 눈물': 'Wikipedia · Tears of Steel (Open Movie)',
  '한국어 위키백과 · 노래': 'Wikipedia · History of Song & Singing',
  '한국어 위키백과 · 여성주의': 'Wikipedia · Feminist Movements',
  '한국어 위키백과 · 오마카세': 'Wikipedia · Omakase Dining Culture',
  '한국어 위키백과 · 네모바지 스폰지밥': 'Wikipedia · SpongeBob SquarePants',
  '삼성전자 고객지원 · 배터리 케어': 'Samsung Support · Battery Care',
  '카카오 테크 · Kakao Tech': 'Kakao Tech',
  '인디스페이스 독립영화 아카이브': 'IndieSpace · Art Film Archive',
  '국립중앙박물관 · 큐레이터 토크': 'National Museum of Korea · Curator Talk',
  '스페셜티 커피 협회(SCA) 코리아': 'Specialty Coffee Association (SCA) Korea',
  '국립산림과학원 생활원예 가이드': 'National Institute of Forest Science · Indoor Gardening',
  '어반스케쳐스 코리아 아카이브': 'Urban Sketchers Archive',
  '홈베이킹 연구소': 'Home Baking Laboratory',
  '국제기능올림픽 한식 조리 아카이브': 'WorldSkills Korean Cuisine Archive',
  '스마트폰 사진 아카데미': 'Smartphone Photography Academy',
  'YouTube · 토스 테크': 'YouTube · Toss Tech',
  'YouTube · 얄팍한 코딩사전': 'YouTube · Quick Coding Guide',
  'YouTube · 조코딩 JoCoding': 'YouTube · JoCoding',
  'YouTube · 세바시': 'YouTube · Sebasi Talk (15 Min to Change the World)',
  'YouTube · 삼프로TV': 'YouTube · Sampro TV',
  'YouTube · 널 위한 문화예술': 'YouTube · Art for You',
  'YouTube · 마라톤 정석': 'YouTube · Running Fundamentals',
  'YouTube · 백종원의 요리비책': 'YouTube · Paik Jong-won Cooking',
  'Lofi Girl · ChilledCow': 'Lofi Girl · ChilledCow'
};

const DATE_MAP = {
  '최신 칼럼': 'Latest Column',
  '오늘': 'Today',
  '어제': 'Yesterday',
  '2일 전': '2d ago',
  '3일 전': '3d ago',
  '4일 전': '4d ago',
  '5일 전': '5d ago',
  '6일 전': '6d ago',
  '1주일 전': '1w ago',
  '신규 등록': 'Just Added',
  '추천 영상': 'Featured Video',
  '인기 영상': 'Trending Video',
  '필수 시청': 'Must Watch',
  '정책 브리핑': 'Policy Briefing',
  '미래 기술': 'Future Tech'
};

function translateDuration(dur) {
  if (!dur) return '5 min read';
  if (dur.includes(':')) return dur; // video duration
  return dur.replace('분 읽기', ' min read').replace('분 분량', ' min read');
}

function translateDate(d) {
  if (!d) return 'Recent';
  return DATE_MAP[d] || d.replace('일 전', 'd ago');
}

function translateSource(s) {
  if (!s) return 'Recommended Article';
  return SOURCE_MAP[s] || s;
}

console.log('Building English translation dataset...');
