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

// ★以前はここに fetch ハンドラ（全ての通信をService Workerが中継する処理）が
//   あったが、これがPWAモード（ホーム画面に追加した状態）のSafariで、
//   window.print() による印刷処理と干渉し、「自動印刷は禁止」の警告が出て
//   印刷プレビューが白紙になる原因になっていた。
//   このハンドラは「キャッシュを使わず常に最新版を取得する」ために
//   置いていたが、fetchハンドラを持たないService Workerは、そもそも通信に
//   一切介入しない（＝ブラウザが元々ネットワークから取得する）ため、
//   削除しても「常に最新版を取得する」という動作は全く変わらない。
//   印刷への干渉だけがなくなる。
