// ALINCO LOGITIME - Service Worker
// PWA化のための最小構成（オフラインキャッシュなし・常に最新版を取得）
// + プッシュ通知（Firebase Cloud Messaging）のバックグラウンド受信

// ★Firebase純正の「firebase.messaging().onBackgroundMessage()」は、
//   data専用メッセージだと正しく反応しないことがある既知の癖があるため、
//   ブラウザ標準の「push」イベントを直接受け取る、より確実な方式にしている。
//   （firebase-messaging-compat.js は読み込まない）

self.addEventListener('push',(event)=>{
  if(!event.data)return;
  let payload;
  try{
    payload=event.data.json();
  }catch(e){
    return;
  }
  // FCMのプッシュ内容は payload.data の中に入っている
  const data=payload.data||{};
  const title=data.title||'ALINCO LOGITIME';
  const options={
    body:data.body||'',
    icon:'icons/icon-192.png',
    tag:data.tag||undefined
  };
  event.waitUntil(self.registration.showNotification(title,options));
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
