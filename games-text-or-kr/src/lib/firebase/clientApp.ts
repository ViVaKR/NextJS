// Firebase 앱 초기화 및 데이터베이스 모듈 가져오기
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getDatabase, Database } from 'firebase/database';

// Firebase 설정 객체 (환경 변수에서 값 가져옴)
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY, // Firebase API 키
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN, // 인증 도메인
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL, // Realtime Database URL
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID, // 프로젝트 ID
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET, // 스토리지 버킷
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID, // 메시징 발신자 ID
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID, // 앱 ID
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID // 측정 ID
};

// Firebase 앱 인스턴스 변수 선언
let app: FirebaseApp;
// 이미 초기화된 앱이 없으면 새로 초기화
if (!getApps().length) {
    app = initializeApp(firebaseConfig);
} else {
    // 이미 초기화된 앱 가져오기
    app = getApp();
}

// Firebase Realtime Database 인스턴스 생성
const db: Database = getDatabase(app);

// 클라이언트 컴포넌트에서 사용할 app과 db 객체 내보내기
export { app, db };
