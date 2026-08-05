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
messaging.onBackgroundMessage((payload)=>{
  const title=(payload.notification&&payload.notification.title)||'ALINCO LOGITIME';
  const options={
    body:(payload.notification&&payload.notification.body)||'',
    icon:'icons/icon-192.png'
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

