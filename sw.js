// ALINCO LOGITIME - Service Worker
// PWA化のための最小構成（オフラインキャッシュなし・常に最新版を取得）
// + プッシュ通知（Firebase Cloud Messaging）のバックグラウンド受信

importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey:"AIzaSyBhTFwABLHnO8e9ukJfBGAbgVW0qkqnPAo",
  authDomain:"logitime-86b56.firebaseapp.com",
  databaseURL:"https://logitime-86b56-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId:"logitime-86b56",
  storageBucket:"logitime-86b56.firebasestorage.app",
  messagingSenderId:"148508185008",
  appId:"1:148508185008:web:bd7a729832528f2fec0675"
});

const messaging=firebase.messaging();

// アプリを閉じている・バックグラウンドの時に通知が来た場合の表示
// ★「notification」項目ではなく「data」項目から読み取る（data-onlyメッセージ）。
//   これにより、ブラウザが自動で表示する処理と競合して2重表示される
//   可能性を排除し、表示は必ずこの処理だけで行われるようにしている。
messaging.onBackgroundMessage((payload)=>{
  const title=(payload.data&&payload.data.title)||'ALINCO LOGITIME';
  const tag=(payload.data&&payload.data.tag)||undefined;
  const options={
    body:(payload.data&&payload.data.body)||'',
    icon:'icons/icon-192.png',
    tag
  };
  self.registration.showNotification(title,options);
});

self.addEventListener('install', (event) => {
  // 新しいService Workerをすぐに有効化する
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  // 既存のキャッシュがあれば全て削除（念のため）
  event.waitUntil(
    caches.keys().then((names) => Promise.all(names.map((n) => caches.delete(n))))
  );
  self.clients.claim();
});

// フェッチは常にネットワークから取得する（キャッシュを一切使わない = 常に最新版）
self.addEventListener('fetch', (event) => {
  event.respondWith(fetch(event.request));
});
